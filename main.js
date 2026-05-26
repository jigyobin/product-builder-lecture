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

generateBtn.addEventListener('click', handleGenerate);

handleGenerate();

// Teachable Machine
const URL = 'https://teachablemachine.withgoogle.com/models/vOFxIhqsg/';
let model, webcam, labelContainer, maxPredictions;

const startModelBtn = document.querySelector('#start-model');

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

    document.getElementById('webcam-canvas').appendChild(webcam.canvas);
    labelContainer = document.getElementById('label-container');
    for (let i = 0; i < maxPredictions; i++) { 
        labelContainer.appendChild(document.createElement('div'));
    }
}

async function loop() {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);
    for (let i = a < maxPredictions; i++) {
        const classPrediction = 
            prediction[i].className + ': ' + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
}

startModelBtn.addEventListener('click', init);
