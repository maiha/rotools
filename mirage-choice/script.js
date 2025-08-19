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

// !!!!! ライオンエフェクト最重要制約 !!!!!
// CSS animation, CSS transition, CSS linear は絶対使用禁止
// 全て requestAnimationFrame による JavaScript 手動制御のみ
// この制約を破った場合は逆回転などの重大なバグが発生する
class LionEffect extends DrawEffect {

    // CSS制約を強制適用するヘルパー
    forceNoAnimation(element) {
        element.style.transition = 'none';
        element.style.animation = 'none';
        element.style.animationDuration = '0s';
        element.style.transitionDuration = '0s';
    }

    // 全カードにCSS制約を適用
    applyNoAnimationToCards(cards) {
        cards.forEach(card => this.forceNoAnimation(card));
    }

    async execute(option) {
        const options = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

        // 全画面オーバーレイを作成
        const overlay = document.createElement('div');
        overlay.className = 'fullscreen-overlay lion-overlay';
        document.body.appendChild(overlay);

        // ライオン演出用HTML作成（3枚固定表示）
        overlay.innerHTML = `
            <div class="lion-container-main">
                <div class="card-track">
                    <div class="lion-card" data-option="" data-slot="left">
                        <div class="card-content">?</div>
                    </div>
                    <div class="lion-card" data-option="" data-slot="center">
                        <div class="card-content">?</div>
                    </div>
                    <div class="lion-card" data-option="" data-slot="right">
                        <div class="card-content">?</div>
                    </div>
                </div>
                <div class="lion-container">
                    <div class="lion">🦁</div>
                </div>
            </div>
        `;

        // 環状配列作成
        this.cardSequence = this.createCircularCards(options);
        this.currentStep = 0;

        // カード画像を読み込み
        const cards = overlay.querySelectorAll('.lion-card');
        cards.forEach(card => {
            const opt = card.dataset.option;
            this.loadCardImageForLion(opt, card);
        });

        await new Promise(resolve => setTimeout(resolve, 500));

        // === ライオン演出の3フェーズ実行 ===
        
        // フェーズ1: 顔見せフェーズ
        await this.introductionPhase(overlay, options, option);
        
        // フェーズ2: 間引きフェーズ
        await this.eliminationPhase(overlay, options, option);
        
        // フェーズ3: 最終選択フェーズ
        await this.finalSelectionPhase(overlay, options, option);

        // 大画面結果表示
        overlay.innerHTML = `<div class="fullscreen-result-card" id="fullscreenLionResult">?</div>`;
        
        const resultCard = overlay.querySelector('#fullscreenLionResult');
        
        // 結果表示
        await new Promise(resolve => setTimeout(resolve, 100));
        this.loadCardImageForFullscreen(option, resultCard);

        await new Promise(resolve => setTimeout(resolve, 1000));

        // オーバーレイを削除して元のカードに結果表示
        document.body.removeChild(overlay);
        this.displayCard(option);
    }

    createCircularCards(options) {
        // 環状にするため、十分な数のカードを用意
        const circularCards = [];
        for (let i = 0; i < 20; i++) {
            circularCards.push(options[i % options.length]);
        }
        return circularCards;
    }

    async introductionPhase(overlay, options, targetOption) {
        const track = overlay.querySelector('.card-track');
        
        // ライオンの食べるパターンを考慮したターゲット配置
        // パターン：中央→(2つスキップ移動して)中央→(1つスキップ移動して)中央 で食べるため、ターゲットがこれらの位置に来ないように調整
        
        const targetIndex = options.indexOf(targetOption);
        let stopOption;
        
        // ターゲットが安全な位置に来るような停止カードを選択
        // ライオンが食べる位置: 停止位置, 停止位置+2, 停止位置+3 を避ける
        const safeOptions = options.filter((opt, index) => {
            if (opt === targetOption) return false; // ターゲット自体は除外
            
            // この位置で停止した場合、ターゲットが食べられる位置に来るかチェック
            const stopIndex = index;
            const targetRelativePos = (targetIndex - stopIndex + options.length) % options.length;
            
            // ライオンが食べる相対位置: 
            // 1回目: 0(中央)
            // 2回目: 2(2カードスキップ後の中央) 
            // 3回目: 3(1カードスキップ後の中央)
            const dangerousPositions = [0, 2, 3];
            return !dangerousPositions.includes(targetRelativePos);
        });
        
        stopOption = safeOptions.length > 0 
            ? safeOptions[Math.floor(Math.random() * safeOptions.length)]
            : options.filter(opt => opt !== targetOption)[0]; // フォールバック
            
            
        
        // 定数（クラスプロパティに保存）- pixelベースに変更
        const screenWidth = window.innerWidth;
        
        // テンポラリカードを作成して実際のCSS幅を取得
        const tempCard = document.createElement('div');
        tempCard.className = 'lion-card';
        tempCard.style.position = 'absolute';
        tempCard.style.visibility = 'hidden';
        track.appendChild(tempCard);
        
        // 実際のカード幅を取得（CSS制約込み）
        const actualCardRect = tempCard.getBoundingClientRect();
        this.cardWidthPx = actualCardRect.width;
        tempCard.remove();
        
        this.cardGapPx = screenWidth * 0.02; // 2vw相当をpixelに変換（CSS gapと一致）
        this.cardSpacingPx = this.cardWidthPx + this.cardGapPx; // 実際のカード幅 + ギャップ
        const centerPositionPx = screenWidth * 0.5; // 50vw相当をpixelに変換
        const oneLoopDistance = options.length * this.cardSpacingPx; // 1周分の距離（ギャップ込み）
        
        // 停止カードが中央（50vw）に来るように逆算
        const stopOptionIndex = options.indexOf(stopOption);
        
        // 中央に停止させたいカードのインデックス（3周目に設定、5周分の配列の真ん中あたり）
        this.stopCardIndex = options.length * 3 + stopOptionIndex; // 4周目の該当位置
        
        // 停止カードの中央が画面中央に来る最終位置を計算（pixel）
        const cardCenterOffsetPx = this.cardWidthPx / 2; // 実際のカード幅の半分
        const stopCardLeftPositionPx = centerPositionPx - cardCenterOffsetPx;
        
        // 停止カードが中央に来るような配列全体の位置を計算
        const finalArrayPositionPx = stopCardLeftPositionPx - (this.stopCardIndex * this.cardSpacingPx);
        
        // 1周分移動するための開始位置を計算
        const initialArrayPositionPx = finalArrayPositionPx + oneLoopDistance;
        
        // 循環用のカード配列を作成（5周分、Hの右側も確実に表示されるよう）
        const cycleCards = [];
        for (let loop = 0; loop < 5; loop++) {
            for (let i = 0; i < options.length; i++) {
                cycleCards.push(options[i]);
            }
        }
        
        // カードトラックのスタイルを更新
        track.style.position = 'relative';
        track.style.width = '100%';
        track.style.height = `${screenWidth * 0.40}px`;
        track.style.overflow = 'hidden';
        
        // カードトラックに配置（absolute positioning）
        track.innerHTML = cycleCards.map((opt, index) => {
            const leftPositionPx = initialArrayPositionPx + (index * this.cardSpacingPx);
            return `
                <div class="lion-card" data-option="${opt}" data-index="${index}" style="
                    position: absolute;
                    left: ${leftPositionPx}px;
                    top: 50%;
                    transform: translateY(-50%);
                    opacity: 1;
                    transition: none;
                ">
                    ${opt}
                </div>
            `;
        }).join('');
        
        // 全カードに画像読み込み
        const cards = track.querySelectorAll('.lion-card');
        
        // CSS制約を強制適用
        this.applyNoAnimationToCards(cards);
        
        cards.forEach(card => {
            const opt = card.dataset.option;
            if (opt !== '?') {
                this.loadCardImageForLion(opt, card);
            }
        });
        
        // レンダリング完了を待つ
        await new Promise(resolve => requestAnimationFrame(resolve));
        
        // 1.5秒で1周分移動（右から左へ）
        
        // JavaScript手動アニメーション（2秒で右から左へ移動）
        const duration = 2000; // 2秒
        const frameRate = 60;
        const totalFrames = (duration / 1000) * frameRate;
        
        let currentFrame = 0;
        
        // 各カードの開始位置を記録（pixel）
        const cardStartPositions = [];
        cards.forEach((card) => {
            cardStartPositions.push(parseFloat(card.style.left.replace('px', '')));
            this.forceNoAnimation(card); // CSS制約強制適用
        });
        
        const animate = () => {
            currentFrame++;
            const progress = currentFrame / totalFrames;
            
            // 線形進行（等速移動）
            const currentMoveDistance = oneLoopDistance * progress;
            
            cards.forEach((card, index) => {
                const startPos = cardStartPositions[index];
                const currentPos = startPos - currentMoveDistance; // 左に移動
                card.style.left = `${currentPos}px`;
            });
            
            if (currentFrame < totalFrames) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
        await new Promise(resolve => setTimeout(resolve, duration));
        
        // アニメーション完了後の実際の位置を確認
        const finalCards = track.querySelectorAll('.lion-card');
        const actualScreenCenter = screenWidth / 2;
        
        finalCards.forEach((card, index) => {
            const rect = card.getBoundingClientRect();
            const cardCenter = rect.left + rect.width / 2;
            const distanceFromCenter = Math.abs(cardCenter - actualScreenCenter);
            const styleLeft = parseFloat(card.style.left);
        });
        
        
        await new Promise(resolve => setTimeout(resolve, 200)); // 500ms → 200ms に短縮
    }

    async eliminationPhase(overlay, options, targetOption) {
        const track = overlay.querySelector('.card-track');
        const lion = overlay.querySelector('.lion');
        
        // 食べられたカードを記録する配列
        this.eatenCards = [];
        
        // 現在中央にあるカードを特定してデバッグ
        const cards = track.querySelectorAll('.lion-card');
        const screenCenter = window.innerWidth / 2;
        
        let centerCard = null;
        let minDistance = Infinity;
        
        cards.forEach((card, index) => {
            const cardRect = card.getBoundingClientRect();
            const cardCenter = cardRect.left + cardRect.width / 2;
            const distance = Math.abs(cardCenter - screenCenter);
            
            if (distance < minDistance) {
                minDistance = distance;
                centerCard = card;
            }
            
        });
        
        if (centerCard && centerCard.dataset.option !== targetOption) {
            this.eatenCards.push(centerCard.dataset.option);
        }
        
        // === 1回目：中央のカードを食べる ===
        await new Promise(resolve => setTimeout(resolve, 0)); // 100ms → 0ms に即座
        
        // ライオン出現
        lion.classList.add('appearing');
        await new Promise(resolve => setTimeout(resolve, 0)); // 150ms → 0ms に即座
        
        // 食べる演出
        lion.classList.add('eating');
        
        // 食べられるカードに食べられる演出を適用（ターゲットカードは絶対に食べない）
        if (centerCard && centerCard.dataset.option !== targetOption) {
            centerCard.classList.add('being-eaten');
            // 食べた瞬間に非表示
            setTimeout(() => {
                if (centerCard.parentNode) {
                    centerCard.style.display = 'none';
                }
            }, 400); // 食べるアニメーションの途中で非表示
        } else if (centerCard && centerCard.dataset.option === targetOption) {
            // ターゲットカードの場合は食べずに次へ
            centerCard = null; // 食べない
        }
        
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // カードを完全に削除（ターゲットカードでない場合のみ）
        if (centerCard && centerCard.parentNode) {
            centerCard.remove();
        }
        
        // ライオン退場
        lion.classList.remove('appearing', 'eating');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // === 2回目：2つ右のカードを食べる（1個おき） ===
        {
            // 残りのカードを取得
            const remainingCards = track.querySelectorAll('.lion-card');
            
            // 2つスキップする距離を計算（2カード分）
            const skipDistance = this.cardSpacingPx * 2; // pixel (1個おき、ギャップ込み)
            
            // JavaScript手動アニメーション（0.8秒で2つスキップ移動）
            const moveDuration = 800; // 0.8秒
            const moveFrameRate = 60;
            const moveTotalFrames = (moveDuration / 1000) * moveFrameRate;
            
            let moveCurrentFrame = 0;
            
            // 各カードの開始位置を記録（pixel）
            const moveCardStartPositions = [];
            remainingCards.forEach((card) => {
                moveCardStartPositions.push(parseFloat(card.style.left.replace('px', '')));
                this.forceNoAnimation(card);
            });
            
            const moveAnimate = () => {
                moveCurrentFrame++;
                const moveProgress = moveCurrentFrame / moveTotalFrames;
                
                const currentSkipDistance = skipDistance * moveProgress;
                
                remainingCards.forEach((card, index) => {
                    const moveStartPos = moveCardStartPositions[index];
                    const moveCurrentPos = moveStartPos - currentSkipDistance; // 左に移動
                    card.style.left = `${moveCurrentPos}px`;
                });
                
                if (moveCurrentFrame < moveTotalFrames) {
                    requestAnimationFrame(moveAnimate);
                }
            };
            
            requestAnimationFrame(moveAnimate);
            await new Promise(resolve => setTimeout(resolve, moveDuration));
            
            // 新しい中央のカードを特定
            const updatedCards = track.querySelectorAll('.lion-card');
            
            let newCenterCard = null;
            let minDistance = Infinity;
            
            updatedCards.forEach((card) => {
                const cardRect = card.getBoundingClientRect();
                const cardCenter = cardRect.left + cardRect.width / 2;
                const distance = Math.abs(cardCenter - screenCenter);
                
                if (distance < minDistance) {
                    minDistance = distance;
                    newCenterCard = card;
                }
            });
            
            // ターゲットカードが中央の場合、代替カードを探す
            let cardToEat = newCenterCard;
            if (newCenterCard && newCenterCard.dataset.option === targetOption) {
                // 中央以外で最も近いカードを探す
                let alternativeCard = null;
                let minAltDistance = Infinity;
                
                updatedCards.forEach((card) => {
                    if (card !== newCenterCard && card.dataset.option !== targetOption) {
                        const cardRect = card.getBoundingClientRect();
                        const cardCenter = cardRect.left + cardRect.width / 2;
                        const distance = Math.abs(cardCenter - screenCenter);
                        
                        if (distance < minAltDistance) {
                            minAltDistance = distance;
                            alternativeCard = card;
                        }
                    }
                });
                cardToEat = alternativeCard;
            }
            
            if (cardToEat && cardToEat.dataset.option !== targetOption) {
                this.eatenCards.push(cardToEat.dataset.option);
                
                // ライオン再出現
                await new Promise(resolve => setTimeout(resolve, 0));
                lion.classList.add('appearing');
                await new Promise(resolve => setTimeout(resolve, 0));
                
                // 2回目の食べる演出（ターゲットカードは絶対に食べない）
                lion.classList.add('eating');
                cardToEat.classList.add('being-eaten');
                
                // 食べた瞬間に非表示
                setTimeout(() => {
                    if (cardToEat.parentNode) {
                        cardToEat.style.display = 'none';
                    }
                }, 400);
                
                await new Promise(resolve => setTimeout(resolve, 800));
                
                // 2枚目のカードを削除（ターゲットカードでない場合のみ）
                if (cardToEat && cardToEat.parentNode) {
                    cardToEat.remove();
                }
                
                // ライオン退場
                lion.classList.remove('appearing', 'eating');
                await new Promise(resolve => setTimeout(resolve, 0));
            }
        }
        
        // === 3回目：さらに2つ右のカードを食べる（1個おき） ===
        {
            // 残りのカードを取得
            const remainingCards = track.querySelectorAll('.lion-card');
            
            // 2つスキップする距離を計算（2カード分）
            const skipDistance = this.cardSpacingPx * 2; // pixel (1個おき、ギャップ込み)
            
            // JavaScript手動アニメーション（0.8秒で2つスキップ移動）
            const moveDuration = 800; // 0.8秒
            const moveFrameRate = 60;
            const moveTotalFrames = (moveDuration / 1000) * moveFrameRate;
            
            let moveCurrentFrame = 0;
            
            // 各カードの開始位置を記録（pixel）
            const moveCardStartPositions = [];
            remainingCards.forEach((card) => {
                moveCardStartPositions.push(parseFloat(card.style.left.replace('px', '')));
                this.forceNoAnimation(card);
            });
            
            const moveAnimate = () => {
                moveCurrentFrame++;
                const moveProgress = moveCurrentFrame / moveTotalFrames;
                
                const currentSkipDistance = skipDistance * moveProgress;
                
                remainingCards.forEach((card, index) => {
                    const moveStartPos = moveCardStartPositions[index];
                    const moveCurrentPos = moveStartPos - currentSkipDistance; // 左に移動
                    card.style.left = `${moveCurrentPos}px`;
                });
                
                if (moveCurrentFrame < moveTotalFrames) {
                    requestAnimationFrame(moveAnimate);
                }
            };
            
            requestAnimationFrame(moveAnimate);
            await new Promise(resolve => setTimeout(resolve, moveDuration));
            
            // 新しい中央のカードを特定
            const finalCards = track.querySelectorAll('.lion-card');
            
            let finalCenterCard = null;
            let minDistance = Infinity;
            
            finalCards.forEach((card) => {
                const cardRect = card.getBoundingClientRect();
                const cardCenter = cardRect.left + cardRect.width / 2;
                const distance = Math.abs(cardCenter - screenCenter);
                
                if (distance < minDistance) {
                    minDistance = distance;
                    finalCenterCard = card;
                }
            });
            
            // ターゲットカードは絶対に食べない（中央でなくても）
            let finalCardToEat = null;
            
            // 中央のカードがターゲットでない場合は中央のカードを選ぶ
            if (finalCenterCard && finalCenterCard.dataset.option !== targetOption) {
                finalCardToEat = finalCenterCard;
            } else {
                // ターゲットでないカードの中で最も中央に近いものを探す
                let minAltDistance = Infinity;
                
                finalCards.forEach((card) => {
                    if (card.dataset.option !== targetOption) {
                        const cardRect = card.getBoundingClientRect();
                        const cardCenter = cardRect.left + cardRect.width / 2;
                        const distance = Math.abs(cardCenter - screenCenter);
                        
                        if (distance < minAltDistance) {
                            minAltDistance = distance;
                            finalCardToEat = card;
                        }
                    }
                });
            }
            
            // 最終安全チェック：ターゲットカードは絶対に食べない
            if (finalCardToEat && finalCardToEat.dataset.option !== targetOption) {
                this.eatenCards.push(finalCardToEat.dataset.option);
            } else if (finalCardToEat && finalCardToEat.dataset.option === targetOption) {
                finalCardToEat = null; // ターゲットカードは食べない
            } else {
                finalCardToEat = null;
            }
            
            if (finalCardToEat) {
                
                // ライオン最後の出現
                await new Promise(resolve => setTimeout(resolve, 0));
                lion.classList.add('appearing');
                await new Promise(resolve => setTimeout(resolve, 0));
                
                // 3回目の食べる演出（ターゲットカードは絶対に食べない）
                lion.classList.add('eating');
                finalCardToEat.classList.add('being-eaten');
                
                // 食べた瞬間に非表示
                setTimeout(() => {
                    if (finalCardToEat.parentNode) {
                        finalCardToEat.style.display = 'none';
                    }
                }, 400);
                
                await new Promise(resolve => setTimeout(resolve, 800));
                
                // 3枚目のカードを削除（ターゲットカードでない場合のみ）
                if (finalCardToEat && finalCardToEat.parentNode) {
                    finalCardToEat.remove();
                }
                
                // ライオン最終退場
                lion.classList.remove('appearing', 'eating');
                await new Promise(resolve => setTimeout(resolve, 0));
                
            }
        }
    }

    positionCards(track, step) {
        const cards = Array.from(track.children);
        
        // 3つの固定スロットに対応するカードを設定
        cards.forEach((card, slotIndex) => {
            const cardIndex = step + slotIndex - 1; // 左(-1), 中央(0), 右(+1)
            const cardOption = this.cardSequence[cardIndex] || '?';
            
            // カード内容更新
            card.dataset.option = cardOption;
            
            // card-content要素の存在確認
            const contentElement = card.querySelector('.card-content');
            if (contentElement) {
                contentElement.textContent = cardOption;
            } else {
                // card-content要素がない場合は直接テキストを設定
                card.textContent = cardOption;
            }
            
            card.style.opacity = '1';
            
            // 画像読み込み
            if (cardOption !== '?') {
                this.loadCardImageForSavanna(cardOption, card);
            }
        });
    }

    getCenterCard(track, step) {
        const cards = Array.from(track.children);
        return cards[1]; // 中央スロット（indexは常に1）
    }

    rebuildCardTrack(track, originalOptions, eliminatedCount) {
        // 現在残っているカードのオプションを取得
        const currentCards = Array.from(track.children);
        const remainingOptions = currentCards.map(card => card.dataset.option);
        
        // 新しい環状配列を作成
        const newCircularCards = [];
        for (let i = 0; i < 20; i++) {
            newCircularCards.push(remainingOptions[i % remainingOptions.length]);
        }
        
        // トラックを再構築
        track.innerHTML = newCircularCards.map(opt => `
            <div class="lion-card" data-option="${opt}">
                <div class="card-content">${opt}</div>
            </div>
        `).join('');
        
        // 新しいカードに画像を読み込み
        const newCards = track.querySelectorAll('.lion-card');
        newCards.forEach(card => {
            const opt = card.dataset.option;
            this.loadCardImageForLion(opt, card);
        });
    }

    async finalSelectionPhase(overlay, options, targetOption) {
        const track = overlay.querySelector('.card-track');
        
        
        // 画面幅を取得（pixel単位での計算用）
        const screenWidth = window.innerWidth;
        
        // 既存のカード列から画面内のもののみ保持、画面外右側は削除
        const allCards = Array.from(track.querySelectorAll('.lion-card'));
        const screenRightEdge = screenWidth; // 100vw以降は画面外とみなす
        
        const existingCards = [];
        const cardsToRemove = [];
        
        allCards.forEach(card => {
            const cardLeft = parseFloat(card.style.left);
            if (cardLeft <= screenRightEdge) {
                // 画面内または画面左端 = 保持
                existingCards.push(card);
            } else {
                // 画面外右側 = 削除
                cardsToRemove.push(card);
            }
        });
        
        // 画面外カードを削除
        cardsToRemove.forEach(card => card.remove());
        
        // 既存カードの位置を記録（凍結状態として保持）
        const existingCardPositions = [];
        existingCards.forEach(card => {
            existingCardPositions.push({
                element: card,
                startLeft: parseFloat(card.style.left)
            });
            this.forceNoAnimation(card);
        });
        
        // 食べられたカードを除外した新しい配列を作成
        const remainingOptions = options.filter(opt => !this.eatenCards.includes(opt));
        
        // 新規列を画面右側に作成（十分な周回分、隙間なし連続配置）
        // 画面幅に対して十分な枚数を計算（最低5周分以上）
        const minLoops = Math.max(5, Math.ceil(screenWidth / (remainingOptions.length * this.cardSpacingPx)) + 2);
        const newCycleCards = [];
        for (let loop = 0; loop < minLoops; loop++) {
            for (let i = 0; i < remainingOptions.length; i++) {
                newCycleCards.push(remainingOptions[i]);
            }
        }
        
        
        // 新規列のターゲットカード位置を計算（2周分移動するため）
        const targetIndex = remainingOptions.indexOf(targetOption);
        // 2周分移動後にターゲットカードが中央に来る位置を計算
        // ターゲットカードは新規配列の適切な位置に配置する
        const newTargetIndex = 2 * remainingOptions.length + targetIndex;
        
        
        // 新規カードのターゲット位置を取得（後で詳細検索）
        
        // 既存カード列の最も右にあるカードの位置を取得
        let lastExistingCardPosition = 0;
        if (existingCards.length > 0) {
            // 全ての既存カードから最も右端にあるものを見つける
            const rightmostCard = existingCards.reduce((rightmost, card) => {
                const cardLeft = parseFloat(card.style.left);
                const rightmostLeft = parseFloat(rightmost.style.left);
                return cardLeft > rightmostLeft ? card : rightmost;
            });
            lastExistingCardPosition = parseFloat(rightmostCard.style.left) + this.cardSpacingPx;
        }
        
        // 新規列の開始位置（既存カード列の直後に強制連続配置）
        const newCardsStartPosition = lastExistingCardPosition || (screenWidth * 1.5); // 既存列の直後、既存カードがなければ画面右外
        
        if (existingCards.length > 0) {
            const lastCard = existingCards[existingCards.length - 1];
        }
        const centerPositionPx = screenWidth * 0.5; // 50vw相当（画面中央）
        const cardCenterOffsetPx = this.cardWidthPx / 2; // 実際のカード幅の半分
        const targetFinalPosition = centerPositionPx - cardCenterOffsetPx; // カード左端位置（中央配置用）
        
        // 新規列をDOMに追加（隙間なし連続配置）
        const newCardsHTML = newCycleCards.map((opt, index) => {
            const leftPosition = newCardsStartPosition + (index * this.cardSpacingPx); // カード間隔（ギャップ込み、pixel）
            return `
                <div class="lion-card new-card" data-option="${opt}" data-index="${index}" style="
                    position: absolute;
                    left: ${leftPosition}px;
                    top: 50%;
                    transform: translateY(-50%);
                    opacity: 1;
                    transition: none;
                ">
                    ${opt}
                </div>
            `;
        }).join('');
        
        track.insertAdjacentHTML('beforeend', newCardsHTML);
        
        // 新規カードの要素を取得
        const newCards = Array.from(track.querySelectorAll('.new-card'));
        
        // 新規カードにCSS制約と画像読み込み
        newCards.forEach(card => {
            this.forceNoAnimation(card);
            const opt = card.dataset.option;
            if (opt && opt !== '?') {
                this.loadCardImageForLion(opt, card);
            }
        });
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        
        // === 2段階アニメーション（高速→低速）完全分離 ===
        const oneLoopDistance = remainingOptions.length * this.cardSpacingPx; // 1周分の距離
        
        // ターゲットカードが最終的に中央に来る正確な移動距離を計算
        const targetCard = newCards.find(card => 
            parseInt(card.dataset.index) === newTargetIndex && 
            card.dataset.option === targetOption
        );
        
        if (!targetCard) {
            return;
        }
        
        const targetStartPosition = parseFloat(targetCard.style.left);
        const totalRequiredDistance = targetStartPosition - targetFinalPosition;
        
        
        // 各カードの開始位置を記録
        const animationCards = [...existingCardPositions.map(info => info.element), ...newCards];
        
        // 移動距離を2段階に分割（高速1周分、低速は残り正確な距離）
        const fastMoveDistance = oneLoopDistance; // 高速：1周分（ネタバレ防止）
        const slowMoveDistance = totalRequiredDistance - fastMoveDistance; // 低速：残りの正確な距離
        
        
        // === 連続2段階アニメーション（停止なし） ===
        const fastDuration = 1500; // 1.5秒
        // 高速の半分の速度になるよう時間を計算
        const fastSpeed = fastMoveDistance / fastDuration; // px/ms
        const slowSpeed = fastSpeed / 2; // 高速の半分
        const slowDuration = slowMoveDistance / slowSpeed; // 残り距離 ÷ 低速スピード
        const totalDuration = fastDuration + slowDuration;
        
        const frameRate = 60;
        const totalFrames = (totalDuration / 1000) * frameRate;
        const fastEndFrame = (fastDuration / 1000) * frameRate;
        
        let currentFrame = 0;
        const animationStartPositions = [];
        
        // 開始位置を記録
        animationCards.forEach(card => {
            const currentLeft = parseFloat(card.style.left);
            animationStartPositions.push({
                element: card,
                startLeft: currentLeft
            });
        });
        
        const continuousAnimate = () => {
            currentFrame++;
            let currentMoveDistance;
            
            if (currentFrame <= fastEndFrame) {
                // === 高速段階 ===
                const fastProgress = currentFrame / fastEndFrame;
                currentMoveDistance = fastMoveDistance * fastProgress;
                
            } else {
                // === 低速段階 ===
                const slowFrame = currentFrame - fastEndFrame;
                const slowTotalFrames = totalFrames - fastEndFrame;
                const slowProgress = slowFrame / slowTotalFrames;
                const slowStartDistance = fastMoveDistance; // 高速段階完了位置
                const currentSlowDistance = slowMoveDistance * slowProgress;
                currentMoveDistance = slowStartDistance + currentSlowDistance;
                
            }
            
            // カードを移動
            animationStartPositions.forEach(cardInfo => {
                const newPos = cardInfo.startLeft - currentMoveDistance;
                cardInfo.element.style.left = `${newPos}px`;
            });
            
            if (currentFrame < totalFrames) {
                requestAnimationFrame(continuousAnimate);
            }
        };
        
        // アニメーション完了を待つ（timeoutではなくPromiseで）
        await new Promise(resolve => {
            const checkCompletion = () => {
                if (currentFrame >= totalFrames) {
                    resolve();
                } else {
                    requestAnimationFrame(checkCompletion);
                }
            };
            requestAnimationFrame(continuousAnimate);
            checkCompletion();
        });
        
        
        // === 最終確認: 中央に停止したカードを確認 ===
        const screenCenter = window.innerWidth / 2;
        let finalCenterCard = null;
        let minDistance = Infinity;
        
        newCards.forEach((card) => {
            const cardRect = card.getBoundingClientRect();
            const cardCenter = cardRect.left + cardRect.width / 2;
            const distance = Math.abs(cardCenter - screenCenter);
            
            if (distance < minDistance) {
                minDistance = distance;
                finalCenterCard = card;
            }
        });
        
        if (finalCenterCard) {
            
            // 最終カードをハイライト
            finalCenterCard.classList.add('selected');
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    loadCardImageForLion(option, card) {
        this.loadCardImage(
            option,
            (imagePath) => {
                card.innerHTML = `<img src="${imagePath}" alt="Card ${option}" class="card-image">`;
            },
            (option) => {
                card.innerHTML = `<div class="card-content">${option}</div>`;
            }
        );
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
    constellation: { class: ConstellationEffect, title: '星座' },
    lion: { class: LionEffect, title: 'ライオン' }
};

// 共通設定
const COMMON_CONFIG = {
    buttonText: '蜃気楼の扉を開く'
};

class OptionSelector {
    constructor() {
        this.options = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        this.selectedOptions = new Set();
        this.cardHistory = []; // 引いた履歴を管理（引いた順）
        this.isHistoryMode = false; // 表示モード（false: 一覧、true: 履歴）
        this.elements = {
            resetBtn: document.getElementById('reset'),
            optionsGrid: document.getElementById('optionsGrid'),
            historyGrid: document.getElementById('historyGrid'),
            historyModeBtn: document.getElementById('historyModeBtn'),
            listModeBtn: document.getElementById('listModeBtn'),
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
        this.updateModeButtons(); // 初期状態のボタン状態設定
    }

    init() {
        this.createOptionButtons();
        this.createHistoryButtons();
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

    createHistoryButtons() {
        // 履歴グリッドを8枚の「？」で初期化
        this.elements.historyGrid.innerHTML = Array(8)
            .fill(null)
            .map((_, index) => {
                const extraClass = index === 4 ? ' margin-left' : '';
                return `<button class="option-btn${extraClass} history-btn" data-history-index="${index}">?</button>`;
            })
            .join('');
    }

    bindEvents() {
        // リセットボタン
        this.elements.resetBtn.addEventListener('click', () => this.reset());
        
        // モード切り替えボタン
        this.elements.historyModeBtn.addEventListener('click', () => this.setDisplayMode(true));
        this.elements.listModeBtn.addEventListener('click', () => this.setDisplayMode(false));

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

        // 履歴ボタン（クリック機能を無効化）
        this.elements.historyGrid.addEventListener('click', (e) => {
            // 履歴表示では何も処理しない（クリック無効化）
            e.preventDefault();
            e.stopPropagation();
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
        
        // 履歴に追加
        this.addToHistory(option);
    }

    async showResultDirect(option) {
        // 上部選択時は演出なしで直接表示（中央カードは？のまま保持）
        const button = this.elements.optionsGrid.querySelector(`[data-option="${option}"]`);

        // 中央のカードは変更せず？のまま保持

        // top-areaのカードを表示
        if (button) {
            this.showMiniCardImage(button, option);
            button.classList.add('selected');
            button.style.opacity = '1';
        }
        
        // 履歴に追加
        this.addToHistory(option);
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
            // 履歴追加は showResult 内で行われるため、ここでは不要
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

        // 履歴からも削除（レアケース対応）
        this.removeFromHistory(option);

        this.elements.selectedCard.innerHTML = '?';
        this.elements.selectedCard.classList.remove('flipped');
    }

    getAvailableOptions() {
        return this.options.filter(option => !this.selectedOptions.has(option));
    }

    updateModeButtons() {
        if (this.isHistoryMode) {
            this.elements.historyModeBtn.classList.add('active');
            this.elements.listModeBtn.classList.remove('active');
        } else {
            this.elements.historyModeBtn.classList.remove('active');
            this.elements.listModeBtn.classList.add('active');
        }
    }

    setDisplayMode(isHistoryMode) {
        this.isHistoryMode = isHistoryMode;
        
        if (this.isHistoryMode) {
            // 履歴表示モードに切り替え
            this.elements.optionsGrid.style.display = 'none';
            this.elements.historyGrid.style.display = 'inline-flex';
        } else {
            // 一覧表示モードに切り替え
            this.elements.optionsGrid.style.display = 'inline-flex';
            this.elements.historyGrid.style.display = 'none';
        }
        
        this.updateModeButtons();
    }

    addToHistory(option) {
        if (this.cardHistory.length < 8) {
            this.cardHistory.push(option);
            this.updateHistoryDisplay();
        }
    }

    removeFromHistory(option) {
        const index = this.cardHistory.indexOf(option);
        if (index !== -1) {
            this.cardHistory.splice(index, 1); // 該当要素を削除、後ろの要素が自動的にshift
            this.updateHistoryDisplay();
        }
    }

    updateHistoryDisplay() {
        const historyButtons = this.elements.historyGrid.querySelectorAll('.history-btn');
        
        // 全てのボタンを初期状態にリセット
        historyButtons.forEach(button => {
            button.textContent = '?';
            button.classList.remove('selected');
            button.style.opacity = '1';
        });
        
        // 履歴配列の内容で更新（shift後の正しい位置に表示）
        this.cardHistory.forEach((option, index) => {
            const button = historyButtons[index];
            if (button) {
                this.showMiniCardImage(button, option);
                button.classList.add('selected');
            }
        });
    }

    reset() {
        this.selectedOptions.clear();
        this.cardHistory = []; // 履歴もクリア

        // 履歴グリッドもリセット
        this.elements.historyGrid.querySelectorAll('.history-btn').forEach(btn => {
            btn.textContent = '?';
            btn.classList.remove('selected');
            btn.style.opacity = '1';
        });

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