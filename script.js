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
        const clickedSide = event.target.closest('.card-front, .title-card, .card-back');
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
        card.querySelectorAll('.card-front,.title-card, .card-back').forEach(side => {
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



// for the miro

function saveAsCSV() {
    const features = document.getElementById('features').value;
    const capabilities = document.getElementById('capabilities').value;
    const communication = document.getElementById('communication').value;

    const csvContent = "data:text/csv;charset=utf-8,"
        + "Question,Answer\n"
        + "What features do you think I-space could have?," + features + "\n"
        + "What capabilities do you think Idy could have?," + capabilities + "\n"
        + "How could clients use I-space and Idy to communicate with designers and other project stakeholders?," + communication + "\n";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "i_space_idy_info.csv");
    document.body.appendChild(link);
    link.click();
}

function saveAsDOC() {
    const features = document.getElementById('features').value;
    const capabilities = document.getElementById('capabilities').value;
    const communication = document.getElementById('communication').value;

    const docContent = `
        <html>
            <head><meta charset="utf-8"><title>I-space and Idy Information</title></head>
            <body>
                <h3>What features do you think I-space could have?</h3>
                <p>${features}</p>
                <h3>What capabilities do you think Idy could have?</h3>
                <p>${capabilities}</p>
                <h3>How could clients use I-space and Idy to communicate with designers and other project stakeholders?</h3>
                <p>${communication}</p>
            </body>
        </html>
    `;

    const blob = new Blob(['\ufeff', docContent], {
        type: 'application/msword'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'i_space_idy_info.doc';
    document.body.appendChild(link);
    link.click();
}
