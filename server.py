from diffusers import StableDiffusionControlNetPipeline, ControlNetModel
from typing import  Dict, List, Any
from io import BytesIO
from PIL import Image
import base64
import torch
import time
import threading

from flask import Flask, request, jsonify
from flask_socketio import SocketIO, send, emit
from flask_cors import CORS, cross_origin

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
if device.type != 'cuda':
    raise ValueError("need to run on GPU")

dtype = torch.bfloat16 if torch.cuda.get_device_capability()[0] == 8 else torch.float16

stable_diffusion_id = "stabilityai/stable-diffusion-2-1-base"
controlnet = ControlNetModel.from_pretrained("rgres/Seg2Sat-sd-controlnet", torch_dtype=dtype)

n_threads = 1

pipes = []
for i in range(n_threads):
    pipe = StableDiffusionControlNetPipeline.from_pretrained(
        stable_diffusion_id, controlnet=controlnet, torch_dtype=dtype, safety_checker=None
    ).to(device)
    
    pipes.append(pipe)

prompts = [
    "Aerial view of Paris",
    "Aerial view of Toulouse",
    "Aerial view of Beaune",
    "Aerial view of Saint Malo",
    "Aerial view of Paris, oil on canvas",
    "Aerial view of Toulouse, carbon pencil sketch",
    "Aerial view of Beaune, watercolor",
    "Aerial view of Saint Malo, flat color, poster, vector art"
]

images = []

hint_image = Image.open("handdrawn.png")

app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
socketio = SocketIO(app, cors_allowed_origins="*")


def decode_base64_image(image_string):
    base64_image = base64.b64decode(image_string)
    buffer = BytesIO(base64_image)
    image = Image.open(buffer)
    return image


def generate_image(prompt=None, image=None, steps=None, seed=None, pipe=None):
    steps = 30
    
    generator = torch.Generator(device="cpu")
    
    if seed:
        generator.manual_seed(seed)
    
    if prompt is None and image is None:
        return {"error": "Please provide a prompt and base64 encoded image."}
    
    if type(image) is str:
        image = decode_base64_image(image)
    
    # run inference pipeline
    image_out = pipe(
        prompt=prompt, 
        image=image,
        num_inference_steps=steps, 
        generator=generator
    ).images[0]
    
    return image_out

def generate_and_emit_image(index, prompt, seed, pipe=pipe):
    socketio.emit("newGeneration", {"id": index, "prompt": prompt})

    image = generate_image(prompt=prompt, image=hint_image, seed=seed, pipe=pipe)

    buffered = BytesIO()
    image.save(buffered, format="PNG")
    image_b64 = base64.b64encode(buffered.getvalue()).decode('utf-8')

    socketio.emit("generationDone", {"id": index, "prompt": prompt, "image_b64": image_b64})


def background_image_generation():
    """Background task to generate images for each prompt."""
    while True:
        for i in range(0, len(prompts), n_threads):            
            seed = int(time.time())
            threads = []
            
            for j in range(n_threads):
                index = (i + j) % len(prompts)
                prompt = prompts[index]

                pipe = pipes[j]
                thread = threading.Thread(target=generate_and_emit_image, args=(index, prompt, seed, pipe))
                threads.append(thread)
                
                thread.start()

            for thread in threads:
                thread.join()
        
@app.get("/changePrompt")
def changePrompt():
    index = request.args.get('index', 0)
    prompt = request.args.get('prompt', 0)
    
    prompts[index] = prompt
    
@app.get("/image/<id>")
def getImage(id):
    return images[id]

@app.route("/newHint", methods=['POST'])
@cross_origin()
def submitSegmentation():
    global hint_image
    
    data = request.get_json()
    hint_b64 = data.get('hint')
    
    hint_image = decode_base64_image(hint_b64)
    
    hint_image.save("hint.png")

    return jsonify({'message': 'Hint received'}), 200

if __name__ == '__main__':
    socketio.start_background_task(background_image_generation, )
    socketio.run(app)
