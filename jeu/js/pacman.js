document.addEventListener('DOMContentLoaded', function() {
    const pacman = document.getElementById('pacman');
    const gameContainer = document.getElementById('game-container');

    // Position initiale de Pac-Man
    let pacmanX = 300;
    let pacmanY = 300;

    // Taille du pas de déplacement
    const stepSize = 30;

    // Fonction pour mettre à jour la position de Pac-Man sur l'écran
    function updatePacmanPosition() {
        pacman.style.left = pacmanX + 'px';
        pacman.style.top = pacmanY + 'px';
    }

    // Fonction pour gérer le mouvement de Pac-Man
    function movePacman(direction) {
        switch (direction) {
            case 'ArrowUp':
                pacmanY -= stepSize;
                break;
            case 'ArrowDown':
                pacmanY += stepSize;
                break;
            case 'ArrowLeft':
                pacmanX -= stepSize;
                break;
            case 'ArrowRight':
                pacmanX += stepSize;
                break;
        }
        updatePacmanPosition();
    }

    // Écouter les touches de direction pour déplacer Pac-Man
    document.addEventListener('keydown', function(event) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
            event.preventDefault(); // Empêche le défilement de la page
            movePacman(event.key);
        }
    });

    // Mettre à jour la position initiale de Pac-Man
    updatePacmanPosition();
});
