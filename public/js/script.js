document.addEventListener('DOMContentLoaded', () => {
    const cardsContainer = document.getElementById('cardsContainer');
    const createCardBtn = document.getElementById('createCardBtn');
    
    // Структура данных для блоков и карточек
    let blocks = JSON.parse(localStorage.getItem('flashcardBlocks')) || [
        {
            id: 'default',
            name: 'Основной блок',
            cards: JSON.parse(localStorage.getItem('flashcards')) || [] // Поддержка старых карточек
        }
    ];

    // Функция для сохранения блоков
    function saveBlocks() {
        localStorage.setItem('flashcardBlocks', JSON.stringify(blocks));
    }

    // Функция для создания HTML блока
    function createBlockElement(block, blockIndex) {
        const blockDiv = document.createElement('div');
        blockDiv.className = 'block';
        blockDiv.innerHTML = `
            <div class="block-header">
                <h2 class="block-title" id="blockTitle${blockIndex}">${block.name}</h2>
                <div class="block-actions">
                    <button class="block-btn rename-btn" onclick="renameBlock(${blockIndex})">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        Переименовать
                    </button>
                    <button class="block-btn add-card-btn" onclick="createCard(${blockIndex})">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Добавить карточку
                    </button>
                    ${blockIndex !== 0 ? `
                        <button class="block-btn delete-btn" onclick="deleteBlock(${blockIndex})">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                            Удалить блок
                        </button>
                    ` : ''}
                </div>
            </div>
            <div class="cards-grid" id="cardsGrid${blockIndex}"></div>
        `;

        // Добавляем карточки в блок
        const cardsGrid = blockDiv.querySelector(`#cardsGrid${blockIndex}`);
        if (block.cards.length === 0) {
            cardsGrid.innerHTML = `
                <div class="empty-state">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="12" y1="8" x2="12" y2="16"></line>
                        <line x1="8" y1="12" x2="16" y2="12"></line>
                    </svg>
                    <p>В этом блоке пока нет карточек</p>
                    <p>Нажмите "Добавить карточку" чтобы начать</p>
                </div>
            `;
        } else {
            block.cards.forEach((card, cardIndex) => {
                cardsGrid.appendChild(createCardElement(card, blockIndex, cardIndex));
            });
        }

        return blockDiv;
    }

    // Функция для создания HTML карточки
    function createCardElement(card, blockIndex, cardIndex) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        cardDiv.innerHTML = `
            <div class="card-content">
                <div class="card-front">
                    <label class="card-label">Вопрос:</label>
                    <div>${card.front}</div>
                    ${card.frontImage ? `<div class="card-image"><img src="${card.frontImage}" alt="Изображение для вопроса"></div>` : ''}
                </div>
                <div class="card-back" style="display: none;">
                    <label class="card-label">Ответ:</label>
                    <div>${card.back}</div>
                    ${card.backImage ? `<div class="card-image"><img src="${card.backImage}" alt="Изображение для ответа"></div>` : ''}
                </div>
                <div class="card-actions">
                    <button class="card-btn flip-btn" onclick="flipCard(this)">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M17 1l4 4-4 4"></path>
                            <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                            <path d="M7 23l-4-4 4-4"></path>
                            <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
                        </svg>
                        Перевернуть
                    </button>
                    <button class="card-btn edit-btn" onclick="editCard(${blockIndex}, ${cardIndex})">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        Редактировать
                    </button>
                    <button class="card-btn delete-btn" onclick="deleteCard(${blockIndex}, ${cardIndex})">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        Удалить
                    </button>
                </div>
            </div>
        `;
        return cardDiv;
    }

    // Функция для отображения всех блоков и карточек
    function renderBlocks() {
        cardsContainer.innerHTML = '';
        blocks.forEach((block, index) => {
            cardsContainer.appendChild(createBlockElement(block, index));
        });
    }

    // Функция для создания нового блока
    window.createBlock = function() {
        const blockName = prompt('Введите название блока:');
        if (blockName) {
            blocks.push({
                id: Date.now().toString(),
                name: blockName,
                cards: []
            });
            saveBlocks();
            renderBlocks();
        }
    };

    // Функция для переименования блока
    window.renameBlock = function(blockIndex) {
        const newName = prompt('Введите новое название блока:', blocks[blockIndex].name);
        if (newName) {
            blocks[blockIndex].name = newName;
            saveBlocks();
            renderBlocks();
        }
    };

    // Функция для удаления блока
    window.deleteBlock = function(blockIndex) {
        if (blockIndex === 0) {
            alert('Нельзя удалить основной блок');
            return;
        }
        if (confirm('Вы уверены, что хотите удалить этот блок со всеми карточками?')) {
            blocks.splice(blockIndex, 1);
            saveBlocks();
            renderBlocks();
        }
    };

    // Функция для создания новой карточки
    window.createCard = function(blockIndex) {
        const card = {
            front: 'Новый вопрос',
            back: 'Новый ответ',
            frontImage: '',
            backImage: ''
        };
        blocks[blockIndex].cards.push(card);
        saveBlocks();
        renderBlocks();
        // Автоматически открываем режим редактирования для новой карточки
        editCard(blockIndex, blocks[blockIndex].cards.length - 1);
    };

    // Функция для редактирования карточки
    window.editCard = function(blockIndex, cardIndex) {
        const card = blocks[blockIndex].cards[cardIndex];
        const cardElement = document.querySelector(`#cardsGrid${blockIndex}`).children[cardIndex];
        
        cardElement.innerHTML = `
            <div class="card-content">
                <div>
                    <label class="card-label">Вопрос:</label>
                    <textarea class="card-input" id="frontInput${blockIndex}_${cardIndex}">${card.front}</textarea>
                    <div class="image-upload">
                        <label class="card-label">Изображение для вопроса:</label>
                        <input type="file" accept="image/*" id="frontImageInput${blockIndex}_${cardIndex}" class="image-input">
                        ${card.frontImage ? `
                            <div class="current-image">
                                <img src="${card.frontImage}" alt="Текущее изображение">
                                <button onclick="removeImage(${blockIndex}, ${cardIndex}, 'front')" class="remove-image-btn">Удалить</button>
                            </div>
                        ` : ''}
                    </div>
                </div>
                <div>
                    <label class="card-label">Ответ:</label>
                    <textarea class="card-input" id="backInput${blockIndex}_${cardIndex}">${card.back}</textarea>
                    <div class="image-upload">
                        <label class="card-label">Изображение для ответа:</label>
                        <input type="file" accept="image/*" id="backImageInput${blockIndex}_${cardIndex}" class="image-input">
                        ${card.backImage ? `
                            <div class="current-image">
                                <img src="${card.backImage}" alt="Текущее изображение">
                                <button onclick="removeImage(${blockIndex}, ${cardIndex}, 'back')" class="remove-image-btn">Удалить</button>
                            </div>
                        ` : ''}
                    </div>
                </div>
                <div class="card-actions">
                    <button class="card-btn edit-btn" onclick="saveCard(${blockIndex}, ${cardIndex})">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                            <polyline points="17 21 17 13 7 13 7 21"></polyline>
                            <polyline points="7 3 7 8 15 8"></polyline>
                        </svg>
                        Сохранить
                    </button>
                </div>
            </div>
        `;

        // Добавляем обработчики для загрузки изображений
        const frontImageInput = document.getElementById(`frontImageInput${blockIndex}_${cardIndex}`);
        const backImageInput = document.getElementById(`backImageInput${blockIndex}_${cardIndex}`);

        frontImageInput.addEventListener('change', function(e) {
            handleImageUpload(e, blockIndex, cardIndex, 'front');
        });

        backImageInput.addEventListener('change', function(e) {
            handleImageUpload(e, blockIndex, cardIndex, 'back');
        });
    };

    // Функция для обработки загрузки изображения
    function handleImageUpload(event, blockIndex, cardIndex, side) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                blocks[blockIndex].cards[cardIndex][side + 'Image'] = e.target.result;
                saveBlocks();
                renderBlocks();
                editCard(blockIndex, cardIndex);
            };
            reader.readAsDataURL(file);
        }
    }

    // Функция для удаления изображения
    window.removeImage = function(blockIndex, cardIndex, side) {
        blocks[blockIndex].cards[cardIndex][side + 'Image'] = '';
        saveBlocks();
        renderBlocks();
        editCard(blockIndex, cardIndex);
    };

    // Функция для сохранения изменений в карточке
    window.saveCard = function(blockIndex, cardIndex) {
        const frontInput = document.getElementById(`frontInput${blockIndex}_${cardIndex}`);
        const backInput = document.getElementById(`backInput${blockIndex}_${cardIndex}`);
        
        blocks[blockIndex].cards[cardIndex] = {
            ...blocks[blockIndex].cards[cardIndex],
            front: frontInput.value,
            back: backInput.value
        };
        
        saveBlocks();
        renderBlocks();
    };

    // Функция для удаления карточки
    window.deleteCard = function(blockIndex, cardIndex) {
        if (confirm('Вы уверены, что хотите удалить эту карточку?')) {
            blocks[blockIndex].cards.splice(cardIndex, 1);
            saveBlocks();
            renderBlocks();
        }
    };

    // Функция для переворачивания карточки
    window.flipCard = function(button) {
        const cardContent = button.closest('.card-content');
        const frontSide = cardContent.querySelector('.card-front');
        const backSide = cardContent.querySelector('.card-back');
        
        if (frontSide.style.display !== 'none') {
            frontSide.style.display = 'none';
            backSide.style.display = 'block';
            button.innerHTML = `
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 1l4 4-4 4"></path>
                    <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                    <path d="M7 23l-4-4 4-4"></path>
                    <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
                </svg>
                Показать вопрос
            `;
        } else {
            frontSide.style.display = 'block';
            backSide.style.display = 'none';
            button.innerHTML = `
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 1l4 4-4 4"></path>
                    <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                    <path d="M7 23l-4-4 4-4"></path>
                    <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
                </svg>
                Показать ответ
            `;
        }
    };

    // Инициализация
    if (localStorage.getItem('flashcards')) {
        // Если есть старые карточки, переносим их в основной блок и удаляем старое хранилище
        const oldCards = JSON.parse(localStorage.getItem('flashcards'));
        blocks[0].cards = oldCards;
        localStorage.removeItem('flashcards');
        saveBlocks();
    }

    // Добавляем кнопку создания блока в интерфейс
    const blockButton = document.createElement('button');
    blockButton.className = 'create-block-btn';
    blockButton.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
        Создать новый блок
    `;
    blockButton.onclick = createBlock;
    document.querySelector('.controls').appendChild(blockButton);

    renderBlocks();
});