// Lotto Number Generator
const numbersContainer = document.querySelector('.numbers');
const generateBtn = document.querySelector('#generate');

const generateNumbers = () => {
    const numbers = new Set();
    while (numbers.size < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNumber);
    }
    return Array.from(numbers).sort((a, b) => a - b);
};

const displayNumbers = (numbers) => {
    numbersContainer.innerHTML = '';
    for (const number of numbers) {
        const numberEl = document.createElement('div');
        numberEl.classList.add('number');
        numberEl.textContent = number;
        numbersContainer.appendChild(numberEl);
    }
};

const handleGenerate = () => {
    const newNumbers = generateNumbers();
    displayNumbers(newNumbers);
};

if (generateBtn) {
    generateBtn.addEventListener('click', handleGenerate);
    // Initial generation
    handleGenerate();
}

// Teachable Machine Cat & Dog Classifier
const startModelBtn = document.querySelector('#start-model');

if (startModelBtn) {
    const URL = 'https://teachablemachine.withgoogle.com/models/vOFxIhqsg/';
    let model, webcam, labelContainer, maxPredictions;

    async function init() {
        const modelURL = URL + 'model.json';
        const metadataURL = URL + 'metadata.json';

        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        const flip = true; 
        webcam = new tmImage.Webcam(200, 200, flip); 
        await webcam.setup(); 
        await webcam.play();
        window.requestAnimationFrame(loop);

        const webcamCanvasContainer = document.getElementById('webcam-canvas');
        webcamCanvasContainer.innerHTML = ''; // Clear previous canvas
        webcamCanvasContainer.appendChild(webcam.canvas);
        labelContainer = document.getElementById('label-container');
        labelContainer.innerHTML = ''; // Clear previous labels
        for (let i = 0; i < maxPredictions; i++) { 
            labelContainer.appendChild(document.createElement('div'));
        }

        startModelBtn.textContent = "Camera Started";
        startModelBtn.disabled = true;
    }

    async function loop() {
        webcam.update();
        await predict();
        window.requestAnimationFrame(loop);
    }

    async function predict() {
        const prediction = await model.predict(webcam.canvas);
        for (let i = 0; i < maxPredictions; i++) {
            const classPrediction = 
                prediction[i].className + ': ' + prediction[i].probability.toFixed(2);
            if(labelContainer.childNodes[i]) {
                labelContainer.childNodes[i].innerHTML = classPrediction;
            }
        }
    }

    startModelBtn.addEventListener('click', init);
}
