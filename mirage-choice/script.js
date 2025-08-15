// ===== 演出クラス =====
class DrawEffect {
    constructor(elements) {
        this.elements = elements;
    }

    async execute(option) {
        throw new Error('execute method must be implemented');
    }

    loadCardImage(option, onImageLoad, onImageError) {
        const imagePath = `images/cards/${option}.png`;
        const img = new Image();

        img.onload = () => onImageLoad(imagePath);
        img.onerror = () => onImageError(option);
        img.src = imagePath;
    }
}

class ClassicEffect extends DrawEffect {
    async execute(option) {
        // 全画面オーバーレイを作成
        const overlay = document.createElement('div');
        overlay.className = 'fullscreen-overlay';
        document.body.appendChild(overlay);

        // 最初は「？」の大画面カードを表示
        overlay.innerHTML = `<div class="fullscreen-result-card" id="fullscreenClassicCard">?</div>`;

        const classicCard = overlay.querySelector('#fullscreenClassicCard');

        // 初期状態設定
        classicCard.style.transform = 'scale(1) rotateY(0deg)';

        // 少し待ってから拡大＋めくり演出開始
        await new Promise(resolve => setTimeout(resolve, 100));
        classicCard.style.transform = 'scale(1.1) rotateY(10deg)';
        await new Promise(resolve => setTimeout(resolve, 250));

        // 結果を表示してめくり完了
        this.loadCardImageForFullscreen(option, classicCard);
        classicCard.style.transform = 'scale(1) rotateY(0deg)';

        await new Promise(resolve => setTimeout(resolve, 1000));

        // オーバーレイを削除して元のカードに結果表示
        document.body.removeChild(overlay);
        this.displayCard(option);
    }

    loadCardImageForFullscreen(option, card) {
        this.loadCardImage(
            option,
            (imagePath) => {
                card.classList.remove('flipped');
                card.innerHTML = `<img src="${imagePath}" alt="Card ${option}" class="card-image">`;
            },
            (option) => {
                card.classList.add('flipped');
                card.textContent = option;
            }
        );
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
}

class ShuffleEffect extends DrawEffect {
    async execute(option) {
        const availableOptions = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        const shuffleCount = 8;
        const shuffleDelay = 150;

        // 全画面オーバーレイを作成
        const overlay = document.createElement('div');
        overlay.className = 'fullscreen-overlay';
        document.body.appendChild(overlay);

        // 最初は「？」の大画面カードを表示
        overlay.innerHTML = `<div class="fullscreen-result-card" id="fullscreenShuffleCard">?</div>`;

        const shuffleCard = overlay.querySelector('#fullscreenShuffleCard');

        // シャッフル演出（全画面で）
        for (let i = 0; i < shuffleCount; i++) {
            const randomOption = availableOptions[Math.floor(Math.random() * availableOptions.length)];
            shuffleCard.classList.add('flipped');
            shuffleCard.textContent = randomOption;
            await new Promise(resolve => setTimeout(resolve, shuffleDelay));
        }

        // 最終結果表示（全画面で大きなめくり演出）
        overlay.innerHTML = `<div class="fullscreen-result-card" id="fullscreenShuffleResult">?</div>`;
        
        const resultCard = overlay.querySelector('#fullscreenShuffleResult');
        
        // 初期状態設定
        resultCard.style.transform = 'scale(1) rotateY(0deg)';
        
        // 少し待ってから拡大＋めくり演出開始
        await new Promise(resolve => setTimeout(resolve, 100));
        resultCard.style.transform = 'scale(1.1) rotateY(10deg)';
        await new Promise(resolve => setTimeout(resolve, 250));
        
        // 結果を表示してめくり完了
        this.loadCardImageForFullscreen(option, resultCard);
        resultCard.style.transform = 'scale(1) rotateY(0deg)';

        await new Promise(resolve => setTimeout(resolve, 1000));

        // オーバーレイを削除して元のカードに結果表示
        document.body.removeChild(overlay);
        this.displayCard(option);
    }

    loadCardImageForFullscreen(option, card) {
        this.loadCardImage(
            option,
            (imagePath) => {
                card.classList.remove('flipped');
                card.innerHTML = `<img src="${imagePath}" alt="Card ${option}" class="card-image">`;
            },
            (option) => {
                card.classList.add('flipped');
                card.textContent = option;
            }
        );
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
}

class SlotEffect extends DrawEffect {
    async execute(option) {
        const options = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        const slotContainer = this.elements.selectedCard;

        // スロット用HTML作成
        slotContainer.innerHTML = `
            <div class="slot-machine">
                <div class="slot-reel" id="slotReel">
                    ${options.map(opt => `<div class="slot-item">${opt}</div>`).join('')}
                    ${options.map(opt => `<div class="slot-item">${opt}</div>`).join('')}
                    ${options.map(opt => `<div class="slot-item">${opt}</div>`).join('')}
                </div>
            </div>
        `;

        const reel = slotContainer.querySelector('#slotReel');
        const targetIndex = options.indexOf(option);
        const totalItems = options.length * 3;
        const finalPosition = -(targetIndex + options.length * 2) * 40; // 40px per item

        // 高速回転
        reel.style.transform = `translateY(-${totalItems * 40 * 2}px)`;
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 減速して停止
        reel.style.transition = 'transform 1s ease-out';
        reel.style.transform = `translateY(${finalPosition}px)`;

        await new Promise(resolve => setTimeout(resolve, 1000));

        // 最終結果表示
        this.displayCard(option);
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
}


class SlideEffect extends DrawEffect {
    async execute(option) {
        const options = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

        // 全画面オーバーレイを作成
        const overlay = document.createElement('div');
        overlay.className = 'fullscreen-overlay';
        document.body.appendChild(overlay);

        // スライド用HTML作成（全画面版、カードは「？」で表示、3列に削減して間隔を広く）
        overlay.innerHTML = `
            <div class="fullscreen-slide-container">
                <div class="fullscreen-slide-track" id="fullscreenSlideTrack">
                    ${options.map(opt => `<div class="fullscreen-slide-item">?</div>`).join('')}
                    ${options.map(opt => `<div class="fullscreen-slide-item">?</div>`).join('')}
                    ${options.map(opt => `<div class="fullscreen-slide-item">?</div>`).join('')}
                </div>
            </div>
        `;

        const track = overlay.querySelector('#fullscreenSlideTrack');

        // 単純な左右移動（カード全体が見えるように調整）
        const itemWidth = 140; // margin込みのアイテム幅
        const startPosition = window.innerWidth;
        // 右端のカードが完全に表示されるよう、カード幅分だけ余裕を持たせる
        const endPosition = -window.innerWidth + itemWidth;

        // 初期位置（画面右側から開始）
        track.style.transition = 'none';
        track.style.transform = `translateX(${startPosition}px)`;

        // requestAnimationFrameによる手動制御（確実な加速）
        const duration = 3000; // 3秒
        const frameRate = 60;
        const totalFrames = (duration / 1000) * frameRate;
        let currentFrame = 0;

        track.style.transition = 'none'; // CSS transitionを完全に無効化

        const slideStartTime = Date.now();

        let animationCompleted = false;

        const animate = () => {
            currentFrame++;
            const progress = currentFrame / totalFrames;

            // 確実な加速カーブ（二次関数）
            const easeProgress = progress * progress;

            const currentPos = startPosition + (endPosition - startPosition) * easeProgress;
            track.style.transform = `translateX(${currentPos}px)`;

            if (currentFrame < totalFrames) {
                requestAnimationFrame(animate);
            } else {
                // 最終位置に正確に配置
                track.style.transform = `translateX(${endPosition}px)`;
                animationCompleted = true;
            }
        };

        requestAnimationFrame(animate);

        // アニメーション完了まで待機
        while (!animationCompleted) {
            await new Promise(resolve => setTimeout(resolve, 50));
        }

        // 即座に大画面表示（中間の待機時間削除）

        // 最初は「？」の大画面カードを表示
        overlay.innerHTML = `<div class="fullscreen-result-card" id="fullscreenResultCard">?</div>`;

        const resultCard = overlay.querySelector('#fullscreenResultCard');

        // 初期状態設定
        resultCard.style.transform = 'scale(1) rotateY(0deg)';

        // 少し待ってから拡大＋めくり演出開始
        await new Promise(resolve => setTimeout(resolve, 50));
        resultCard.style.transform = 'scale(1.1) rotateY(10deg)';
        await new Promise(resolve => setTimeout(resolve, 350));

        // 結果を表示してめくり完了
        this.loadCardImageForFullscreen(option, resultCard);
        resultCard.style.transform = 'scale(1) rotateY(0deg)';

        await new Promise(resolve => setTimeout(resolve, 1000));

        // オーバーレイを削除して元のカードに結果表示
        document.body.removeChild(overlay);
        this.displayCard(option);
    }

    loadCardImageForFullscreen(option, card) {
        this.loadCardImage(
            option,
            (imagePath) => {
                card.classList.remove('flipped');
                card.innerHTML = `<img src="${imagePath}" alt="Card ${option}" class="card-image">`;
            },
            (option) => {
                card.classList.add('flipped');
                card.textContent = option;
            }
        );
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
}

class CardFlipEffect extends DrawEffect {
    async execute(option) {
        const options = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

        // 全画面オーバーレイを作成
        const overlay = document.createElement('div');
        overlay.className = 'fullscreen-overlay';
        document.body.appendChild(overlay);

        // 全画面カードフリップ用HTML作成
        overlay.innerHTML = `
            <div class="fullscreen-card-flip-container">
                <div class="fullscreen-card-flip-grid">
                    ${options.map((opt, index) => `
                        <div class="fullscreen-flip-card" data-option="${opt}">
                            <div class="fullscreen-flip-card-inner">
                                <div class="fullscreen-flip-card-front">?</div>
                                <div class="fullscreen-flip-card-back">${opt}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        await new Promise(resolve => setTimeout(resolve, 500));

        // ランダムに多くのカードをめくる演出（速度が時間経過で上がる）
        const cards = overlay.querySelectorAll('.fullscreen-flip-card');
        const shuffleCount = 12; // カード数をさらに減らす
        const initialShowTime = 200; // 最初のめくった状態表示時間
        const finalShowTime = 60; // 最終のめくった状態表示時間
        const transitionGap = 40; // アニメーション間の間隔をさらに短縮

        let lastCard = null; // 前回めくったカードを記録

        for (let i = 0; i < shuffleCount; i++) {
            const progress = i / (shuffleCount - 1); // 0から1への進行
            const currentShowTime = initialShowTime - (initialShowTime - finalShowTime) * (progress * progress); // 二次関数で加速

            // アニメーション時間もだんだん早くする（前半で加速、後半は最高速維持）
            const initialAnimTime = 180; // 最初のアニメーション時間
            const finalAnimTime = 30; // 最終のアニメーション時間

            let currentAnimTime;
            if (progress <= 0.4) {
                // 前半：線形で加速（0〜0.3の進行で最高速に到達）
                currentAnimTime = initialAnimTime - (initialAnimTime - finalAnimTime) * (progress * 3);
            } else {
                // 後半：最高速を維持
                currentAnimTime = finalAnimTime;
            }

            // 前にめくったカードをリセット
            cards.forEach(card => card.classList.remove('flipped'));

            // 前回と違うカードを選ぶ
            let randomCard;
            do {
                randomCard = cards[Math.floor(Math.random() * cards.length)];
            } while (randomCard === lastCard && cards.length > 1);

            lastCard = randomCard;

            // 個別にアニメーション時間を設定
            randomCard.querySelector('.fullscreen-flip-card-inner').style.transition = `transform ${currentAnimTime}ms`;
            randomCard.classList.add('flipped');

            // 現在のアニメーション時間 + 表示時間
            await new Promise(resolve => setTimeout(resolve, currentAnimTime + currentShowTime));
            randomCard.classList.remove('flipped');

            // 短い間隔で次へ
            await new Promise(resolve => setTimeout(resolve, transitionGap));
        }

        // 最終カードめくりは削除して、直接大画面演出へ
        await new Promise(resolve => setTimeout(resolve, 300));

        // 最終結果表示（全画面で大きく）
        overlay.innerHTML = `<div class="fullscreen-result-card" id="fullscreenCardFlipResult">?</div>`;

        const resultCard = overlay.querySelector('#fullscreenCardFlipResult');

        // 初期状態設定
        resultCard.style.transform = 'scale(1) rotateY(0deg)';

        // 少し待ってから拡大＋めくり演出開始
        await new Promise(resolve => setTimeout(resolve, 100));
        resultCard.style.transform = 'scale(1.1) rotateY(10deg)';
        await new Promise(resolve => setTimeout(resolve, 250));

        // 結果を表示してめくり完了
        this.loadCardImageForFullscreen(option, resultCard);
        resultCard.style.transform = 'scale(1) rotateY(0deg)';

        await new Promise(resolve => setTimeout(resolve, 1000));

        // オーバーレイを削除して元のカードに結果表示
        document.body.removeChild(overlay);
        this.displayCard(option);
    }

    loadCardImageForFullscreen(option, card) {
        this.loadCardImage(
            option,
            (imagePath) => {
                card.classList.remove('flipped');
                card.innerHTML = `<img src="${imagePath}" alt="Card ${option}" class="card-image">`;
            },
            (option) => {
                card.classList.add('flipped');
                card.textContent = option;
            }
        );
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
}


// ===== 演出設定DSL =====
class ConstellationEffect extends DrawEffect {
    async execute(option) {
        const options = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

        // 全画面オーバーレイを作成
        const overlay = document.createElement('div');
        overlay.className = 'fullscreen-overlay';
        document.body.appendChild(overlay);

        // 星座演出用HTML作成
        overlay.innerHTML = `
            <div class="constellation-container">
                <div class="star-field">
                    ${options.map((opt, index) => {
                        // 各選択肢ごとに星座パターンを作成
                        const constellations = this.getConstellationPattern(opt, index);
                        return `
                            <div class="constellation" data-option="${opt}">
                                ${constellations.map((star, starIndex) => `
                                    <div class="star" 
                                         style="left: ${star.x}%; top: ${star.y}%; --delay: ${starIndex * 0.3}s"
                                         data-star="${starIndex}">
                                        <div class="star-glow"></div>
                                        <div class="star-core">•</div>
                                    </div>
                                `).join('')}
                                <svg class="constellation-lines">
                                    ${constellations.map((star, i) => {
                                        if (i === constellations.length - 1) return '';
                                        const nextStar = constellations[i + 1];
                                        return `<line x1="${star.x}%" y1="${star.y}%" x2="${nextStar.x}%" y2="${nextStar.y}%" class="star-line" style="--line-delay: ${i * 0.3 + 0.2}s"/>`;
                                    }).join('')}
                                </svg>
                            </div>
                        `;
                    }).join('')}
                </div>
                <div class="shooting-stars"></div>
            </div>
        `;

        await new Promise(resolve => setTimeout(resolve, 800));

        // 星座を順番に光らせる演出
        const constellations = overlay.querySelectorAll('.constellation');
        for (let i = 0; i < 5; i++) {
            const randomConstellation = constellations[Math.floor(Math.random() * constellations.length)];
            randomConstellation.classList.add('activating');
            await new Promise(resolve => setTimeout(resolve, 800));
            randomConstellation.classList.remove('activating');
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        // 答えの星座を完成させる
        const targetConstellation = overlay.querySelector(`[data-option="${option}"]`);
        targetConstellation.classList.add('completing');
        
        // 流れ星演出を同時開始
        this.createShootingStars(overlay);
        
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 他の星座をフェードアウト
        constellations.forEach(constellation => {
            if (constellation !== targetConstellation) {
                constellation.classList.add('fading');
            }
        });

        await new Promise(resolve => setTimeout(resolve, 1500));

        // 大画面結果表示
        overlay.innerHTML = `<div class="fullscreen-result-card" id="fullscreenConstellationResult">?</div>`;
        
        const resultCard = overlay.querySelector('#fullscreenConstellationResult');
        
        // 初期状態設定
        resultCard.style.transform = 'scale(1) rotateY(0deg)';
        
        // 少し待ってから拡大＋めくり演出開始
        await new Promise(resolve => setTimeout(resolve, 100));
        resultCard.style.transform = 'scale(1.1) rotateY(10deg)';
        await new Promise(resolve => setTimeout(resolve, 250));
        
        // 結果を表示してめくり完了
        this.loadCardImageForFullscreen(option, resultCard);
        resultCard.style.transform = 'scale(1) rotateY(0deg)';

        await new Promise(resolve => setTimeout(resolve, 1000));

        // オーバーレイを削除して元のカードに結果表示
        document.body.removeChild(overlay);
        this.displayCard(option);
    }

    getConstellationPattern(option, index) {
        // 神秘的な星座パターンを生成
        const patterns = [
            // 大熊座風
            [{x: 15, y: 25}, {x: 25, y: 20}, {x: 35, y: 25}, {x: 30, y: 35}, {x: 20, y: 40}],
            // オリオン座風
            [{x: 45, y: 15}, {x: 50, y: 25}, {x: 55, y: 35}, {x: 60, y: 20}, {x: 65, y: 30}],
            // カシオペア座風
            [{x: 70, y: 20}, {x: 75, y: 30}, {x: 80, y: 25}, {x: 85, y: 35}, {x: 90, y: 30}],
            // 北斗七星風
            [{x: 10, y: 50}, {x: 20, y: 45}, {x: 30, y: 50}, {x: 35, y: 60}, {x: 25, y: 65}, {x: 15, y: 60}],
            // 白鳥座風
            [{x: 50, y: 45}, {x: 55, y: 55}, {x: 60, y: 65}, {x: 45, y: 60}, {x: 65, y: 55}],
            // 竜座風
            [{x: 75, y: 50}, {x: 80, y: 60}, {x: 85, y: 70}, {x: 90, y: 65}, {x: 85, y: 55}],
            // 琴座風
            [{x: 15, y: 75}, {x: 25, y: 80}, {x: 35, y: 85}, {x: 30, y: 75}],
            // 鷲座風
            [{x: 55, y: 75}, {x: 65, y: 80}, {x: 75, y: 85}, {x: 70, y: 75}, {x: 80, y: 80}]
        ];
        
        return patterns[index] || patterns[0];
    }

    createShootingStars(overlay) {
        const shootingStarsContainer = overlay.querySelector('.shooting-stars');
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const star = document.createElement('div');
                star.className = 'shooting-star';
                star.style.left = (5 + Math.random() * 30) + '%';
                star.style.top = (5 + Math.random() * 30) + '%';
                star.style.animationDelay = Math.random() * 0.2 + 's';
                shootingStarsContainer.appendChild(star);
                
                setTimeout(() => star.remove(), 1500);
            }, i * 100);
        }
    }

    loadCardImageForFullscreen(option, card) {
        this.loadCardImage(
            option,
            (imagePath) => {
                card.classList.remove('flipped');
                card.innerHTML = `<img src="${imagePath}" alt="Card ${option}" class="card-image">`;
            },
            (option) => {
                card.classList.add('flipped');
                card.textContent = option;
            }
        );
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
}

const EFFECT_DEFINITIONS = {
    // 利用可能な全演出定義
    classic: { class: ClassicEffect, title: '通常' },
    shuffle: { class: ShuffleEffect, title: 'シャッフル' },
    slot: { class: SlotEffect, title: 'スロット' },
    slide: { class: SlideEffect, title: 'スライド' },
    cardflip: { class: CardFlipEffect, title: 'カードフリップ' },
    constellation: { class: ConstellationEffect, title: '星座' }
};

// 共通設定
const COMMON_CONFIG = {
    buttonText: '蜃気楼の扉を開く'
};

class OptionSelector {
    constructor() {
        this.options = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        this.selectedOptions = new Set();
        this.elements = {
            resetBtn: document.getElementById('reset'),
            optionsGrid: document.getElementById('optionsGrid'),
            carouselTrack: document.getElementById('carouselTrack'),
            carouselPrev: document.getElementById('carouselPrev'),
            carouselNext: document.getElementById('carouselNext')
        };

        // HTML側のdata-effects属性から演出設定を読み込み
        this.effectConfigs = this.parseEffectConfig();
        this.effectList = this.effectConfigs.map(effect => effect.id);
        this.currentEffectIndex = 0;
        this.currentEffect = this.effectList[0];

        // 演出インスタンス設定（後で初期化）
        this.effects = {};

        this.init();
        this.updateCarousel(); // 初期状態設定
    }

    init() {
        this.createOptionButtons();
        this.createCarouselSections();
        this.bindEvents();
    }

    parseEffectConfig() {
        // HTML側のdata-effects属性を解析
        const dataEffects = this.elements.carouselTrack.dataset.effects;
        const effects = [];

        dataEffects.split(',').forEach(effectId => {
            const id = effectId.trim();
            const definition = EFFECT_DEFINITIONS[id];
            if (definition) {
                effects.push({
                    id: id,
                    title: definition.title,
                    button: COMMON_CONFIG.buttonText
                });
            }
        });

        return effects;
    }

    createCarouselSections() {
        // HTML設定に基づいてカルーセルセクションを動的生成
        const trackElement = this.elements.carouselTrack;
        trackElement.innerHTML = '';

        this.effectConfigs.forEach(effectConfig => {
            const section = document.createElement('section');
            section.className = 'card-section';
            section.dataset.effect = effectConfig.id;

            section.innerHTML = `
                <h1 class="effect-title">${effectConfig.title}</h1>
                <div class="card-container">
                    <div class="selected-card" id="selectedCard${effectConfig.id.charAt(0).toUpperCase() + effectConfig.id.slice(1)}">?</div>
                </div>
                <button class="generate-btn" data-effect="${effectConfig.id}">${effectConfig.button}</button>
            `;

            trackElement.appendChild(section);
        });

        // 要素参照を再取得してエフェクトインスタンスを作成
        this.effectConfigs.forEach(effectConfig => {
            const elementKey = 'selectedCard' + effectConfig.id.charAt(0).toUpperCase() + effectConfig.id.slice(1);
            this.elements[elementKey] = document.getElementById(elementKey);

            // 演出インスタンスを作成
            const definition = EFFECT_DEFINITIONS[effectConfig.id];
            if (definition) {
                this.effects[effectConfig.id] = new definition.class({
                    selectedCard: this.elements[elementKey]
                });
            }
        });
    }

    createOptionButtons() {
        this.elements.optionsGrid.innerHTML = this.options
            .map((option) => {
                const extraClass = option === 'E' ? ' margin-left' : '';
                return `<button class="option-btn${extraClass}" data-option="${option}">${option}</button>`;
            })
            .join('');
    }

    bindEvents() {
        // リセットボタン
        this.elements.resetBtn.addEventListener('click', () => this.reset());

        // カルーセルナビゲーション
        this.elements.carouselPrev.addEventListener('click', () => {
            this.previousEffect();
        });

        this.elements.carouselNext.addEventListener('click', () => {
            this.nextEffect();
        });

        // 生成ボタン（正面の演出用のみ）
        document.querySelectorAll('.generate-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // 正面の演出のみ動作
                const section = e.target.closest('.card-section');
                if (section && section.classList.contains('active')) {
                    const effectType = e.target.dataset.effect;
                    this.setEffect(effectType);
                    this.generateRandomWithEffect();
                }
            });
        });

        // 選択肢ボタン
        this.elements.optionsGrid.addEventListener('click', (e) => {
            // ボタン要素を見つける（クリックされた要素の親も含めて）
            const button = e.target.closest('.option-btn');
            if (button) {
                const option = button.dataset.option;
                if (!this.selectedOptions.has(option)) {
                    this.selectOption(option);
                } else {
                    // 選択済みの場合は未選択に戻す（部分リセット）
                    this.unmarkSelected(option);
                }
            }
        });
    }

    selectOption(option) {
        this.showResultDirect(option);
        this.markAsSelected(option);
    }

    async showResult(option) {
        // 演出開始時にtop-areaの該当ボタンを非表示にして、ドキドキ感を演出
        const button = this.elements.optionsGrid.querySelector(`[data-option="${option}"]`);
        if (button && button.classList.contains('selected')) {
            button.style.opacity = '0.3';
            button.innerHTML = option; // 一時的に元の状態に戻す
            button.classList.remove('selected');
        }

        const effect = this.effects[this.currentEffect];
        await effect.execute(option);

        // 演出完了後にtop-areaのカードを表示
        if (button) {
            this.showMiniCardImage(button, option);
            button.classList.add('selected');
            button.style.opacity = '1';
        }
    }

    async showResultDirect(option) {
        // 上部選択時は演出なしで直接表示（通常の選択と同じエフェクト）
        const button = this.elements.optionsGrid.querySelector(`[data-option="${option}"]`);

        // 現在の演出カードに直接結果表示（演出なし）
        const effect = this.effects[this.currentEffect];
        effect.displayCard(option);

        // top-areaのカードを表示
        if (button) {
            this.showMiniCardImage(button, option);
            button.classList.add('selected');
            button.style.opacity = '1';
        }
    }

    setEffect(effectName) {
        if (this.effects[effectName]) {
            this.currentEffect = effectName;
            this.currentEffectIndex = this.effectList.indexOf(effectName);
            this.updateCarousel();
        }
    }

    nextEffect() {
        this.currentEffectIndex = (this.currentEffectIndex + 1) % this.effectList.length;
        this.currentEffect = this.effectList[this.currentEffectIndex];
        this.updateCarousel();
    }

    previousEffect() {
        this.currentEffectIndex = (this.currentEffectIndex - 1 + this.effectList.length) % this.effectList.length;
        this.currentEffect = this.effectList[this.currentEffectIndex];
        this.updateCarousel();
    }

    updateCarousel() {
        // カルーセル全体の回転は削除し、個別セクション配置のみ

        // 正面・左・右の3つ + 奥に消える2つを表示（全て正面向き）
        const sections = this.elements.carouselTrack.querySelectorAll('.card-section');
        const spacing = 350; // 左右の間隔

        sections.forEach((section, index) => {
            const relativeIndex = (index - this.currentEffectIndex + this.effectList.length) % this.effectList.length;

            // 正面(0)、右(1)、左(-1)、右奥(2)、左奥(-2)の5つを表示
            let isVisible = false;
            let position = '';

            if (relativeIndex === 0) { // 正面
                isVisible = true;
                position = 'translateX(0px) translateZ(0px) scale(1)';
                section.classList.add('active');
                section.style.opacity = '1';
                // 正面のボタンを表示
                const btn = section.querySelector('.generate-btn');
                if (btn) btn.style.display = 'block';
            } else if (relativeIndex === this.effectList.length - 1) { // 右に表示（前の演出）
                isVisible = true;
                position = `translateX(${spacing}px) translateZ(-100px) scale(0.7)`;
                section.classList.remove('active');
                section.style.opacity = '0.4';
                // 右のボタンを非表示
                const btn = section.querySelector('.generate-btn');
                if (btn) btn.style.display = 'none';
            } else if (relativeIndex === 1) { // 左に表示（次の演出）
                isVisible = true;
                position = `translateX(-${spacing}px) translateZ(-100px) scale(0.7)`;
                section.classList.remove('active');
                section.style.opacity = '0.4';
                // 左のボタンを非表示
                const btn = section.querySelector('.generate-btn');
                if (btn) btn.style.display = 'none';
            } else if (relativeIndex === this.effectList.length - 2) { // 右奥に表示（前々の演出）
                isVisible = true;
                position = `translateX(${spacing * 1.5}px) translateZ(-300px) scale(0.4)`;
                section.classList.remove('active');
                section.style.opacity = '0.2';
                // 右奥のボタンを非表示
                const btn = section.querySelector('.generate-btn');
                if (btn) btn.style.display = 'none';
            } else if (relativeIndex === 2) { // 左奥に表示（次々の演出）
                isVisible = true;
                position = `translateX(-${spacing * 1.5}px) translateZ(-300px) scale(0.4)`;
                section.classList.remove('active');
                section.style.opacity = '0.2';
                // 左奥のボタンを非表示
                const btn = section.querySelector('.generate-btn');
                if (btn) btn.style.display = 'none';
            } else {
                section.classList.remove('active');
                section.style.opacity = '0';
                // 非表示セクションのボタンも非表示
                const btn = section.querySelector('.generate-btn');
                if (btn) btn.style.display = 'none';
            }

            if (isVisible) {
                section.classList.add('visible');
                section.style.transform = position;
            } else {
                section.classList.remove('visible');
            }
        });
    }

    markAsSelected(option) {
        this.selectedOptions.add(option);
        // showResultで処理するため、ここでは選択済みセットに追加のみ
    }

    showMiniCardImage(button, option) {
        const imagePath = `images/cards/${option}.png`;
        const img = new Image();

        img.onload = () => {
            button.innerHTML = `<img src="${imagePath}" alt="Card ${option}" class="card-mini-image">`;
        };

        img.onerror = () => {
            button.innerHTML = `<div class="card-mini-text">${option}</div>`;
        };

        img.src = imagePath;
    }

    generateRandom() {
        const availableOptions = this.getAvailableOptions();
        if (availableOptions.length > 0) {
            const randomOption = availableOptions[Math.floor(Math.random() * availableOptions.length)];
            this.selectOption(randomOption);
        }
    }

    generateRandomWithEffect() {
        const availableOptions = this.getAvailableOptions();
        if (availableOptions.length > 0) {
            const randomOption = availableOptions[Math.floor(Math.random() * availableOptions.length)];
            this.showResult(randomOption);
            this.markAsSelected(randomOption);
        }
    }

    resetButtonState(button) {
        button.classList.remove('selected');
        button.disabled = false;
        button.textContent = button.dataset.option;
        button.style.opacity = '1'; // opacity もリセット
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

        // 全ての演出カードをリセット
        Object.values(this.elements).forEach(element => {
            if (element && element.id && element.id.startsWith('selectedCard')) {
                element.innerHTML = '?';
                element.classList.remove('flipped');
            }
        });

        this.elements.optionsGrid.querySelectorAll('.option-btn').forEach(btn => {
            this.resetButtonState(btn);
        });
    }
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    new OptionSelector();
});