from diffusers import StableDiffusionControlNetPipeline, ControlNetModel
from typing import  Dict, List, Any
from io import BytesIO
from PIL import Image
import base64
import torch

from flask import Flask, request
from flask_socketio import SocketIO, send, emit

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
    "Aerial view of Marseille",
    "Aerial view of Paris, oil on canvas",
    "Aerial view of Toulouse, motherboard, circuit, electronics",
    "Aerial view of Marseille, pencil sketch"
]

images = []

hint_image = Image.open("handdrawn.png")

app = Flask(__name__)
socketio = SocketIO(app)
    
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

@app.get("/changePrompt")
def changePrompt():
    index = request.args.get('index', 0)
    prompt = request.args.get('prompt', 0)
    
    prompts[index] = prompt
    
@app.get("/image/<id>")
def getImage(id):
    return image[id]

@app.get("/newHint")
def submitSegmentation():
    hint_b64 = request.args.get('hint')
    hint_image = decode_base64_image(hint_b64)


import time
if __name__ == '__main__':
    socketio.run(app)

    while True:
        for i, prompt in enumerate(prompts):
            seed = int(time.time())
            emit("newGeneration", (i, prompt), broadcast=True)
            
            image = generate_image(prompt=prompt, image=hint_image, seed=seed)
            image.save(f"out_{i}.png")
            
            # broadcast to all that there is a change
            emit("generationDone", (i, prompt, image), broadcast=True)
