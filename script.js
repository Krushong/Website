const cardsContainer = document.getElementById('cardsContainer');

// Создание 5 пустых карточек по умолчанию
for (let i = 0; i < 5; i++) {
    createCard('', '');
}

document.getElementById('createCardBtn').addEventListener('click', () => {
    const term = prompt('Введите термин:');
    const definition = prompt('Введите определение:');
    if (term) {
        createCard(term, definition);
    }
});

function createCard(term, definition) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <div class="card-header">
            <button class="upload-btn" onclick="uploadImage(this)">
                <img src="upload-icon.png" alt="Загрузить изображение" class="upload-icon" />
            </button>
            <button class="delete-btn" onclick="deleteCard(this)">
                <img src="garbage.png" alt="Удалить" />
            </button>
        </div>
        <div class="card-column">
            <textarea class="edit-input" oninput="autoResize(this)" onkeydown="handleMultilineInput(event)">${term || ''}</textarea>
            <label>Термин</label>
        </div>
        <div class="card-column">
            <textarea class="edit-input" oninput="autoResize(this)" onkeydown="handleMultilineInput(event)">${definition || ''}</textarea>
            <label>Определение</label>
        </div>
        <div class="header-image-container">
            <div class="image-container"></div>
            <div class="delete-image-container"></div>
        </div>                  
    `;
    cardsContainer.appendChild(card);
}

function handleMultilineInput(event) {
    // Разрешаем многострочный ввод при нажатии Shift+Enter
    if (event.key === 'Enter' && event.shiftKey) {
        event.preventDefault(); // Предотвращаем стандартное поведение
        const start = event.target.selectionStart;
        const end = event.target.selectionEnd;
        const value = event.target.value;
        
        // Вставляем новую строку
        event.target.value = value.substring(0, start) + '\n' + value.substring(end);
        
        // Перемещаем курсор
        event.target.selectionStart = event.target.selectionEnd = start + 1;
    }
}

function autoResize(textarea) {
    // Автоматическое изменение высоты textarea
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

function deleteCard(button) {
    const card = button.closest('.card');
    cardsContainer.removeChild(card);
}

function uploadImage(button) {
    const card = button.closest('.card');
    const imageContainer = card.querySelector('.image-container');
    const deleteImageContainer = card.querySelector('.delete-image-container');

    const deleteImageButton = document.createElement('img');
    deleteImageButton.src = 'delete-img-icon.png';
    deleteImageButton.alt = 'Удалить изображение';
    deleteImageButton.className = 'delete-image-btn';
    deleteImageButton.style.display = 'none';
    deleteImageButton.onclick = () => deleteImage(deleteImageButton);

    deleteImageContainer.appendChild(deleteImageButton);

    if (imageContainer.querySelector('img')) {
        return; // Прекращаем выполнение функции, если изображение уже есть
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = 'Загруженное изображение';
                img.style.width = '100px'; // Фиксированная ширина
                img.style.height = 'auto'; // Автоматическая высота для сохранения пропорций

                // Добавляем изображение в контейнер
                imageContainer.appendChild(img);
                deleteImageButton.style.display = 'block'; // Показываем кнопку удаления изображения
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

function deleteImage(button) {
    const card = button.closest('.card');
    const imageContainer = card.querySelector('.image-container');
    const deleteImageContainer = card.querySelector('.delete-image-container');
    const img = deleteImageContainer.querySelector('img');
    if (img) {
        deleteImageContainer.removeChild(img); // Удаляем изображение
    }

    const imgUpload = imageContainer.querySelector('img');
    if (imgUpload) {
        imageContainer.removeChild(imgUpload); // Удаляем изображение
    }
    button.style.display = 'none'; // Скрываем кнопку удаления изображения
}