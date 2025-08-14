class OptionSelector {
    constructor() {
        this.options = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        this.selectedOptions = new Set();
        this.elements = {
            selectedCard: document.getElementById('selectedCard'),
            generateBtn: document.getElementById('generate'),
            resetBtn: document.getElementById('reset'),
            optionsGrid: document.getElementById('optionsGrid')
        };
        
        this.init();
    }

    init() {
        this.createOptionButtons();
        this.bindEvents();
    }

    createOptionButtons() {
        this.elements.optionsGrid.innerHTML = this.options
            .map((option, index) => {
                const extraClass = option === 'E' ? ' margin-left' : '';
                return `<button class="option-btn${extraClass}" data-option="${option}">${option}</button>`;
            })
            .join('');
    }

    bindEvents() {
        // ランダム生成ボタン
        this.elements.generateBtn.addEventListener('click', () => this.generateRandom());
        
        // リセットボタン
        this.elements.resetBtn.addEventListener('click', () => this.reset());
        
        // 選択肢ボタン
        this.elements.optionsGrid.addEventListener('click', (e) => {
            // ボタン要素を見つける（クリックされた要素の親も含めて）
            const button = e.target.closest('.option-btn');
            if (button) {
                const option = button.dataset.option;
                if (!this.selectedOptions.has(option)) {
                    this.markAsSelected(option);
                } else {
                    // 選択済みの場合は未選択に戻す（部分リセット）
                    this.unmarkSelected(option);
                }
            }
        });
    }

    selectOption(option) {
        this.showResult(option);
        this.markAsSelected(option);
    }

    showResult(option) {
        // 画像が存在するかチェックして表示方法を決定
        this.displayCard(option);
        this.elements.selectedCard.style.transform = 'scale(1.1) rotateY(10deg)';
        setTimeout(() => {
            this.elements.selectedCard.style.transform = 'scale(1) rotateY(0deg)';
        }, 500);
    }

    loadCardImage(option, onImageLoad, onImageError) {
        const imagePath = `images/cards/${option}.png`;
        const img = new Image();
        
        img.onload = () => onImageLoad(imagePath);
        img.onerror = () => onImageError(option);
        img.src = imagePath;
    }

    displayCard(option) {
        this.loadCardImage(
            option,
            (imagePath) => {
                this.elements.selectedCard.classList.remove('flipped');
                this.elements.selectedCard.innerHTML = `<img src="${imagePath}" alt="Card ${option}" class="card-image">`;
            },
            (option) => {
                this.elements.selectedCard.classList.add('flipped');
                this.elements.selectedCard.textContent = option;
            }
        );
    }

    markAsSelected(option) {
        this.selectedOptions.add(option);
        const button = this.elements.optionsGrid.querySelector(`[data-option="${option}"]`);
        if (button) {
            this.showMiniCardImage(button, option);
            button.classList.add('selected');
        }
    }

    showMiniCardImage(button, option) {
        this.loadCardImage(
            option,
            (imagePath) => {
                button.innerHTML = `<img src="${imagePath}" alt="Card ${option}" class="card-mini-image">`;
            },
            (option) => {
                button.innerHTML = `<div class="card-mini-text">${option}</div>`;
            }
        );
    }

    generateRandom() {
        const availableOptions = this.getAvailableOptions();
        if (availableOptions.length > 0) {
            const randomOption = availableOptions[Math.floor(Math.random() * availableOptions.length)];
            this.selectOption(randomOption);
        }
    }

    resetButtonState(button) {
        button.classList.remove('selected');
        button.disabled = false;
        button.textContent = button.dataset.option;
    }

    unmarkSelected(option) {
        this.selectedOptions.delete(option);
        const button = this.elements.optionsGrid.querySelector(`[data-option="${option}"]`);
        if (button) {
            this.resetButtonState(button);
        }
        
        this.elements.selectedCard.innerHTML = '?';
        this.elements.selectedCard.classList.remove('flipped');
    }

    getAvailableOptions() {
        return this.options.filter(option => !this.selectedOptions.has(option));
    }

    reset() {
        this.selectedOptions.clear();
        this.elements.selectedCard.innerHTML = '?';
        this.elements.selectedCard.classList.remove('flipped');
        
        this.elements.optionsGrid.querySelectorAll('.option-btn').forEach(btn => {
            this.resetButtonState(btn);
        });
    }
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    new OptionSelector();
});