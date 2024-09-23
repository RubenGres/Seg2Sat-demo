const socket = io('http://localhost:5000/');  // Connect to the server

// Function to update the image in the grid
function updateImage(index, prompt, imageUrl) {
    const imageContainer = document.getElementById(`image-${index}`);
    if (imageContainer) {
        const imgTag = imageContainer.querySelector("img");
        const promptTitle = imageContainer.querySelector(".prompt-title");
        promptTitle.innerText = prompt;
        imgTag.src = imageUrl;
        imageContainer.classList.remove('generating');
    }
}

// Listen for 'newGeneration' event to update the prompt (you can keep this as is)
socket.on('newGeneration', (data) => {
    const { id, prompt } = data;

    console.log(`New image is being generated for prompt: ${prompt}`);
    
    const imageContainer = document.getElementById(`image-${id}`);
    if (imageContainer) {
        const promptTitle = imageContainer.querySelector(".prompt-title");
        promptTitle.innerText = `${prompt}`;
        imageContainer.classList.add('generating');
    }
});

// Listen for 'generationDone' event to update the image once it's ready
socket.on('generationDone', (data) => {
    const { id, prompt, image_b64 } = data;

    const imageUrl = `data:image/png;base64,${image_b64}`;
    updateImage(id, prompt, imageUrl);
});