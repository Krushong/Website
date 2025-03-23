document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const blockId = urlParams.get('blockId');
    
    let currentCards = [];
    let currentIndex = 0;
    
    const cardSlide = document.querySelector('.card-slide');
    const cardFront = document.querySelector('.card-front .card-content');
    const cardBack = document.querySelector('.card-back .card-content');
    const frontImage = document.querySelector('.card-front .card-image');
    const backImage = document.querySelector('.card-back .card-image');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const cardCounter = document.querySelector('.card-counter');
    const blockTitle = document.querySelector('#blockTitle');
    
    function loadCards() {
        const blocks = JSON.parse(localStorage.getItem('flashcardBlocks')) || [];
        const block = blocks.find(b => b.id === blockId);
        if (block) {
            blockTitle.textContent = block.name;
            currentCards = block.cards;
            updateCard();
            updateControls();
        }
    }
    
    function updateCard() {
        if (currentCards.length === 0) {
            cardFront.textContent = 'Нет карточек';
            cardBack.textContent = '';
            frontImage.style.display = 'none';
            backImage.style.display = 'none';
            cardCounter.textContent = '0 / 0';
            return;
        }
        
        const card = currentCards[currentIndex];
        cardFront.textContent = card.front;
        cardBack.textContent = card.back;
        
        // Обновляем изображения
        if (card.frontImage) {
            frontImage.src = card.frontImage;
            frontImage.style.display = 'block';
        } else {
            frontImage.style.display = 'none';
        }
        
        if (card.backImage) {
            backImage.src = card.backImage;
            backImage.style.display = 'block';
        } else {
            backImage.style.display = 'none';
        }
        
        cardCounter.textContent = `${currentIndex + 1} / ${currentCards.length}`;
        cardSlide.classList.remove('flipped');
    }
    
    function updateControls() {
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === currentCards.length - 1;
    }
    
    cardSlide.addEventListener('click', () => {
        cardSlide.classList.toggle('flipped');
    });
    
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCard();
            updateControls();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentIndex < currentCards.length - 1) {
            currentIndex++;
            updateCard();
            updateControls();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && !prevBtn.disabled) {
            prevBtn.click();
        } else if (e.key === 'ArrowRight' && !nextBtn.disabled) {
            nextBtn.click();
        } else if (e.key === ' ' || e.key === 'Enter') {
            cardSlide.click();
            e.preventDefault();
        }
    });
    
    loadCards();
}); 