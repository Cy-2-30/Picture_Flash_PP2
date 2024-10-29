document.addEventListener('DOMContentLoaded', () => {
    // ANIMATION SET UP FOR THE FALLING SAD FACE
    // Results game window display variables
    const resultsDiv = document.getElementById('results');
    const popupLose = document.querySelector('.popup_lose');
    const popupWin = document.querySelector('.popup_win');
    const message = document.querySelector('.message');
    const quitGame = document.getElementById('quit');
    const playButton = document.getElementById('continue');
    // Number of sad faces falling
    const iconCount = 1000;
    const delayBetweenIcons = 0.3; 

    function createFallingIcon(index) {
    const icon = document.createElement('i');
    icon.classList.add('fa-regular', 'fa-face-sad-tear', 'icon');

    // Randomize the starting position along the X-axis
    const randomX = Math.random() * window.innerWidth;
    icon.style.left = `${randomX}px`;

    // Add an animation delay to each icon based on its index
    icon.style.animationDelay = `${index * delayBetweenIcons}s`;

    popupLose.appendChild(icon);
    }

    // Create 1000 falling icons with delays
    for (let i = 0; i < iconCount; i++) {
    createFallingIcon(i);
    }


    // ANIMATION SET UP FOR THE FIREWORDKS
});