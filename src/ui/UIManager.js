export function fadeInGameContainer() {
    const gameContainer = document.getElementById('game-container');
    if (gameContainer) {
        gameContainer.style.opacity = '1';
    }
}
