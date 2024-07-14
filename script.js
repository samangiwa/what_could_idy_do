document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('canvas');

    // Function to show clue overlay
    const showClue = (clueText) => {
        const clueOverlay = document.createElement('div');
        clueOverlay.classList.add('clue-overlay');
        const clueParagraph = document.createElement('p');
        clueParagraph.innerText = clueText;
        const closeButton = document.createElement('button');
        closeButton.classList.add('close-btn');
        closeButton.innerText = 'Close';
        closeButton.addEventListener('click', (event) => {
            event.stopPropagation();
            document.body.removeChild(clueOverlay);
            document.removeEventListener('click', handleOutsideClick);
        });
        clueOverlay.appendChild(clueParagraph);
        clueOverlay.appendChild(closeButton);
        document.body.appendChild(clueOverlay);
        clueOverlay.style.display = 'block';

        // Add event listener to close clue overlay when clicking outside
        const handleOutsideClick = (event) => {
            if (!clueOverlay.contains(event.target)) {
                document.body.removeChild(clueOverlay);
                document.removeEventListener('click', handleOutsideClick);
            }
        };

        setTimeout(() => {
            document.addEventListener('click', handleOutsideClick);
        }, 0);
    };

    // Handle zoom-in effect
    const zoomBackdrop = document.createElement('div');
    zoomBackdrop.classList.add('zoom-backdrop');
    document.body.appendChild(zoomBackdrop);

    let zoomedCard = null;
    let zoomedSide = null;

    const handleZoom = (event) => {
        const clickedSide = event.target.closest('.card-front, .card-back');
        if (!clickedSide) return;

        if (zoomedCard) {
            zoomedCard.classList.remove('zoom-card');
            zoomedSide.classList.remove('zoom-side');
            hideBackdrop();
            zoomedCard = null;
            zoomedSide = null;
        } else {
            zoomedCard = event.currentTarget;
            zoomedSide = clickedSide;
            zoomedCard.classList.add('zoom-card');
            zoomedSide.classList.add('zoom-side');
            showBackdrop();
        }
    };

    zoomBackdrop.addEventListener('click', () => {
        if (zoomedCard) {
            zoomedCard.classList.remove('zoom-card');
            zoomedSide.classList.remove('zoom-side');
            hideBackdrop();
            zoomedCard = null;
            zoomedSide = null;
        }
    });

    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', handleZoom);

        // Handle flipping the card in zoomed mode
        card.querySelectorAll('.card-front, .card-back').forEach(side => {
            side.addEventListener('click', (event) => {
                if (zoomedCard && !event.target.classList.contains('clue-btn')) {
                    event.stopPropagation();
                    zoomedCard.classList.toggle('flipped');
                }
            });
        });

        // Handle clue button
        const clueButton = card.querySelector('.clue-btn');
        if (clueButton) {
            clueButton.addEventListener('click', (event) => {
                event.stopPropagation();
                const clueText = card.querySelector('.clue-text').innerText;
                showClue(clueText);
            });
        }
    });

    // Show backdrop
    const showBackdrop = () => {
        zoomBackdrop.style.display = 'flex';
    };

    // Hide backdrop
    const hideBackdrop = () => {
        zoomBackdrop.style.display = 'none';
    };
});
