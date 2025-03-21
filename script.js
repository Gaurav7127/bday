
// DOM Elements
const cakeContainer = document.getElementById('cake-container');
const cardContainer = document.getElementById('card-container');
const giftContainer = document.getElementById('gift-container');
const micButton = document.getElementById('mic-button');
const micStatus = document.getElementById('mic-status');
const blowInstruction = document.getElementById('blow-instruction');
const flames = document.querySelectorAll('.flame');
const card = document.querySelector('.card');
const giftButton = document.getElementById('gift-button');
const giftBox = document.getElementById('gift-box');
const photosContainer = document.getElementById('photos-container');
const photoItems = document.querySelectorAll('.photo-item');
const photoModal = document.getElementById('photo-modal');
const modalImage = document.getElementById('modal-image');
const closeButton = document.querySelector('.close-button');

// Audio context and analyser
let audioContext;
let analyser;
let micStream;
let candlesBlown = false;

// Initialize the page
function init() {
    // Set up event listeners
    micButton.addEventListener('click', initAudio);
    card.addEventListener('click', openCard);
    giftButton.addEventListener('click', showGift);
    giftBox.addEventListener('click', openGift);
    
    // Set up photo modal
    photoItems.forEach(item => {
        item.addEventListener('click', () => {
            const imgSrc = item.getAttribute('data-src');
            openPhotoModal(imgSrc);
        });
    });
    
    closeButton.addEventListener('click', closePhotoModal);
    photoModal.addEventListener('click', (e) => {
        if (e.target === photoModal) {
            closePhotoModal();
        }
    });
}

// Initialize audio context and request microphone access
async function initAudio() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStream = stream;
        
        // Create audio context
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioContext();
        
        // Create analyser
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        
        // Connect microphone to analyser
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        
        micStatus.textContent = "Microphone enabled! Blow now!";
        micStatus.style.color = "green";
        micButton.style.display = "none";
        
        detectBlowing();
    } catch (error) {
        console.error("Error accessing microphone:", error);
        micStatus.textContent = "Please allow microphone access to blow out the candles!";
        micStatus.style.color = "red";
    }
}

// Detect blowing into microphone
function detectBlowing() {
    if (!analyser) return;
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const checkAudio = () => {
        if (!analyser || candlesBlown) return;
        
        analyser.getByteFrequencyData(dataArray);
        
        // Calculate average volume
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
        }
        const average = sum / bufferLength;
        
        // Detect blowing (adjust threshold as needed)
        const isBlowing = average > 30;
        
        if (isBlowing) {
            micStatus.textContent = "Keep blowing!";
            micStatus.style.color = "green";
            micStatus.classList.add("fade-in");
        } else {
            micStatus.textContent = "Blow harder!";
            micStatus.classList.remove("fade-in");
        }
        
        // If blowing is strong enough, blow out candles
        if (average > 50 && !candlesBlown) {
            blowOutCandles();
        }
        
        requestAnimationFrame(checkAudio);
    };
    
    checkAudio();
}

// Blow out candles
function blowOutCandles() {
    candlesBlown = true;
    
    // Hide flames
    flames.forEach(flame => {
        flame.style.opacity = "0";
        flame.style.transform = "translateX(-50%) scale(0)";
    });
    
    micStatus.textContent = "Yay! You blew out the candles!";
    micStatus.style.color = "green";
    blowInstruction.style.display = "none";
    
    // Show card after a delay
    setTimeout(() => {
        cakeContainer.classList.add('hidden');
        cardContainer.classList.remove('hidden');
        
        // Clean up audio resources
        if (micStream) {
            micStream.getTracks().forEach(track => track.stop());
        }
        if (audioContext) {
            audioContext.close();
        }
    }, 1500);
}

// Open the birthday card
function openCard() {
    if (!card.classList.contains('open')) {
        card.classList.add('open');
        
        // Show gift button after card is opened
        setTimeout(() => {
            giftButton.classList.remove('hidden');
            giftButton.classList.add('fade-in');
        }, 1000);
    }
}

// Show gift box
function showGift() {
    cardContainer.classList.add('hidden');
    giftContainer.classList.remove('hidden');
}

// Open gift box to reveal photos
function openGift() {
    if (!giftBox.classList.contains('opening') && photosContainer.classList.contains('hidden')) {
        giftBox.classList.add('opening');
        
        // Show photos after gift box animation
        setTimeout(() => {
            giftBox.style.display = 'none';
            photosContainer.classList.remove('hidden');
            photosContainer.classList.add('fade-in');
            
            // Add fade-in animation to each photo with delay
            photoItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('fade-in');
                }, index * 200);
            });
        }, 1000);
    }
}

// Open photo modal
function openPhotoModal(imgSrc) {
    modalImage.src = imgSrc;
    photoModal.style.display = 'flex';
}

// Close photo modal
function closePhotoModal() {
    photoModal.style.display = 'none';
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
document.querySelector("#gift-box p ").style.display = "none"; 
document.querySelector("#gift-container h1 ").style.display = "none";