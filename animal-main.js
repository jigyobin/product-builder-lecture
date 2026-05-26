// Theme Toggle Logic
const themeToggleBtn = document.querySelector('#toggle-theme');
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

// the link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/vOFxIhqsg/";

let model, labelContainer, maxPredictions;

// Load the image model
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    labelContainer = document.getElementById("label-container");
}

// Initializing the model
init();

async function predict() {
    const image = document.getElementById("face-image");
    const prediction = await model.predict(image, false);
    
    prediction.sort((a, b) => parseFloat(b.probability) - parseFloat(a.probability));

    let resultTitle, resultExplain;
    switch (prediction[0].className.toLowerCase()) {
        case "dog":
            resultTitle = "귀여운 강아지상";
            resultExplain = "다정다감하고 귀여운 당신은 모든 사람들에게 즐거움을 주는 호감형입니다! 상냥하고 활발한 성격으로 어디서나 인기만점이며, 당신의 애교 섞인 웃음은 주변 사람들을 행복하게 만듭니다.";
            break;
        case "cat":
            resultTitle = "츤데레 고양이상";
            resultExplain = "무뚝뚝해 보이지만 속은 따뜻한 당신은 시크한 매력을 가진 고양이상입니다! 신비로운 분위기와 도도한 매력으로 사람들의 시선을 사로잡으며, 친해지면 누구보다 따뜻하고 세심한 배려를 보여줍니다.";
            break;
        default:
            resultTitle = "알 수 없음";
            resultExplain = "";
    }

    const title = "<div class='" + prediction[0].className + "-animal-title'>" + resultTitle + "</div>";
    const explain = "<div class='animal-explain pt-2'>" + resultExplain + "</div>";
    
    document.querySelector(".result-message").innerHTML = title + explain;

    labelContainer.innerHTML = "";
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i].className;
        const probability = Math.round(prediction[i].probability * 100);
        
        const barContainer = document.createElement("div");
        barContainer.className = "bar-container";
        
        const bar = document.createElement("div");
        bar.className = "bar";
        bar.style.width = probability + "%";
        
        const label = document.createElement("span");
        label.className = "bar-label";
        label.innerText = classPrediction === "dog" ? "강아지상" : "고양이상";
        
        const percent = document.createElement("span");
        percent.className = "bar-percent";
        percent.innerText = probability + "%";
        
        barContainer.appendChild(bar);
        barContainer.appendChild(label);
        barContainer.appendChild(percent);
        labelContainer.appendChild(barContainer);
    }
}

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            document.querySelector('.image-upload-wrap').style.display = 'none';
            document.getElementById('loading').style.display = 'block';
            document.querySelector('.file-upload-image').src = e.target.result;
            document.querySelector('.file-upload-content').style.display = 'block';
            document.querySelector('.image-title-wrap').style.display = 'none';
            
            // Wait for image to load before predicting
            const img = document.getElementById("face-image");
            img.onload = async function() {
                await predict();
                document.getElementById('loading').style.display = 'none';
                document.querySelector('.image-title-wrap').style.display = 'block';
            };
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        removeUpload();
    }
}

function removeUpload() {
    document.querySelector('.file-upload-input').value = "";
    document.querySelector('.file-upload-content').style.display = 'none';
    document.querySelector('.image-upload-wrap').style.display = 'block';
    document.querySelector(".result-message").innerHTML = "";
    labelContainer.innerHTML = "";
}
