from diffusers import StableDiffusionControlNetPipeline, ControlNetModel
from typing import  Dict, List, Any
from io import BytesIO
from PIL import Image
import base64
import torch
import time

from flask import Flask, request
from flask_socketio import SocketIO, send, emit
from flask_cors import CORS


device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
if device.type != 'cuda':
    raise ValueError("need to run on GPU")

dtype = torch.bfloat16 if torch.cuda.get_device_capability()[0] == 8 else torch.float16

stable_diffusion_id = "stabilityai/stable-diffusion-2-1-base"
controlnet = ControlNetModel.from_pretrained("rgres/Seg2Sat-sd-controlnet", torch_dtype=dtype)

pipe = StableDiffusionControlNetPipeline.from_pretrained(
 stable_diffusion_id, controlnet=controlnet, torch_dtype=dtype, safety_checker=None
).to(device)

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
socketio = SocketIO(app, cors_allowed_origins="*")


def decode_base64_image(image_string):
    base64_image = base64.b64decode(image_string)
    buffer = BytesIO(base64_image)
    image = Image.open(buffer)
    return image


def generate_image(prompt=None, image=None, steps=None, seed=None):
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


def background_image_generation():
    """Background task to generate images for each prompt."""
    while True:
        for i, prompt in enumerate(prompts):
            seed = int(time.time())
            
            # Emit 'newGeneration' to all clients, explicitly avoid using the request context
            socketio.emit("newGeneration", {"id": i, "prompt": prompt})
            
            # Generate image
            image = generate_image(prompt=prompt, image=hint_image, seed=seed)
            
            # Convert image to base64 string
            buffered = BytesIO()
            image.save(buffered, format="PNG")
            image_b64 = base64.b64encode(buffered.getvalue()).decode('utf-8')

            # Emit 'generationDone' to all clients
            socketio.emit("generationDone", {"id": i, "prompt": prompt, "image_b64": image_b64})

@app.get("/changePrompt")
def changePrompt():
    index = request.args.get('index', 0)
    prompt = request.args.get('prompt', 0)
    
    prompts[index] = prompt
    
@app.get("/image/<id>")
def getImage(id):
    return images[id]

@app.get("/newHint")
def submitSegmentation():
    hint_b64 = request.args.get('hint')
    hint_image = decode_base64_image(hint_b64)

if __name__ == '__main__':
    socketio.start_background_task(background_image_generation, )
    socketio.run(app)
