const numbersContainer = document.querySelector('.numbers');
const generateBtn = document.querySelector('#generate');
const themeToggleBtn = document.querySelector('#toggle-theme');
const soundToggleBtn = document.querySelector('#toggle-sound');
const bgMusic = document.querySelector('#bg-music');

// Sound Toggle Logic
let isPlaying = false;
soundToggleBtn.addEventListener('click', () => {
    if (isPlaying) {
        bgMusic.pause();
        soundToggleBtn.textContent = '🔈 Sound On';
    } else {
        bgMusic.play().catch(e => console.log("Audio play blocked until interaction"));
        soundToggleBtn.textContent = '🔊 Sound Off';
    }
    isPlaying = !isPlaying;
});

// Theme Toggle Logic
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggleBtn.textContent = 'Light Mode';
}

themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggleBtn.textContent = isDark ? 'Light Mode' : 'Dark Mode';
});

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

// Initial generation
handleGenerate();
