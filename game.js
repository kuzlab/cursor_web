class AnimalGame {
    constructor() {
        this.score = 0;
        this.startTime = 0;
        this.timerInterval = null;
        this.backgroundImages = [
            'https://images.unsplash.com/photo-1511497584788-876760111969?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', // 森
            'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', // 山
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', // 海
            'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', // 草原
            'https://images.unsplash.com/photo-1519125323398-675f4dd2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'  // 湖
        ];
        this.animals = [
            { name: 'ピカチュウ', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png', x: 100, y: 200, size: this.getRandomSize() },
            { name: 'イーブイ', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png', x: 300, y: 150, size: this.getRandomSize() },
            { name: 'ニャース', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/52.png', x: 500, y: 250, size: this.getRandomSize() },
            { name: 'コイキング', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/129.png', x: 200, y: 350, size: this.getRandomSize() },
            { name: 'カビゴン', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png', x: 600, y: 200, size: this.getRandomSize() },
            { name: 'プリン', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/39.png', x: 150, y: 100, size: this.getRandomSize() },
            { name: 'ゼニガメ', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png', x: 250, y: 400, size: this.getRandomSize() },
            { name: 'フシギダネ', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png', x: 450, y: 450, size: this.getRandomSize() },
            { name: 'ヒトカゲ', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png', x: 700, y: 100, size: this.getRandomSize() }
        ];
        this.gameArea = document.querySelector('.game-area');
        this.scoreElement = document.getElementById('score');
        this.timerElement = document.getElementById('timer');
        this.messageElement = document.getElementById('message');
        this.clearTimeElement = document.getElementById('clearTime');
        this.initializeEventListeners();
    }

    getRandomSize() {
        // 30pxから100pxまでのランダムなサイズを生成
        return Math.floor(Math.random() * 70) + 30;
    }

    getRandomBackground() {
        const randomIndex = Math.floor(Math.random() * this.backgroundImages.length);
        return this.backgroundImages[randomIndex];
    }

    createFirework(x, y) {
        const firework = document.createElement('div');
        firework.className = 'firework';
        firework.style.left = `${x}px`;
        firework.style.top = `${y}px`;
        this.gameArea.appendChild(firework);
        setTimeout(() => firework.remove(), 1000);
    }

    createFireworks(x, y) {
        for (let i = 0; i < 20; i++) {
            const angle = (Math.PI * 2 * i) / 20;
            const distance = Math.random() * 100 + 50;
            const fx = x + Math.cos(angle) * distance;
            const fy = y + Math.sin(angle) * distance;
            setTimeout(() => this.createFirework(fx, fy), i * 50);
        }
    }

    initializeEventListeners() {
        document.getElementById('startButton').addEventListener('click', () => {
            hideAllContainers();
            document.getElementById('pokemonGameContainer').style.display = 'block';
            this.startGame();
        });

        document.getElementById('restartButton').addEventListener('click', () => {
            hideAllContainers();
            document.getElementById('pokemonGameContainer').style.display = 'block';
            this.resetGame();
            this.startGame();
        });

        document.getElementById('mathGameButton').addEventListener('click', () => {
            hideAllContainers();
            document.getElementById('mathGameContainer').style.display = 'block';
            startMathGame();
        });
    }

    startGame() {
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            const elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
            this.timerElement.textContent = elapsedTime;
        }, 1000);

        // 背景画像を読み込む
        const backgroundImage = new Image();
        backgroundImage.src = this.getRandomBackground();
        
        backgroundImage.onload = () => {
            this.gameArea.style.backgroundImage = `url(${backgroundImage.src})`;
            this.gameArea.classList.add('loaded');
            
            // 3回に1回の確率でミュウを追加
            if (Math.random() < 0.33) {
                this.animals.push({
                    name: 'ミュウ',
                    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/151.png',
                    x: Math.random() * 700 + 50,
                    y: Math.random() * 400 + 50,
                    size: this.getRandomSize(),
                    isMew: true
                });
            }

            this.initializeGame();
        };
    }

    resetGame() {
        this.score = 0;
        this.scoreElement.textContent = '0';
        this.messageElement.textContent = '';
        this.gameArea.innerHTML = '';
        this.gameArea.classList.remove('loaded');
        clearInterval(this.timerInterval);
        // ミュウを削除
        this.animals = this.animals.filter(animal => !animal.isMew);
    }

    initializeGame() {
        this.animals.forEach(animal => {
            const animalElement = document.createElement('div');
            animalElement.className = 'animal';
            animalElement.style.backgroundImage = `url(${animal.image})`;
            animalElement.style.left = `${animal.x}px`;
            animalElement.style.top = `${animal.y}px`;
            animalElement.style.width = `${animal.size}px`;
            animalElement.style.height = `${animal.size}px`;
            animalElement.dataset.name = animal.name;
            animalElement.dataset.isMew = animal.isMew || false;
            
            animalElement.addEventListener('click', () => this.handleAnimalClick(animalElement));
            this.gameArea.appendChild(animalElement);

            // ポケモンを徐々に表示
            setTimeout(() => {
                animalElement.classList.add('visible');
            }, 100);
        });
    }

    handleAnimalClick(animalElement) {
        if (animalElement.classList.contains('animal-found')) return;

        const animalName = animalElement.dataset.name;
        const isMew = animalElement.dataset.isMew === 'true';
        this.score++;
        this.scoreElement.textContent = this.score;
        animalElement.classList.add('animal-found');
        this.messageElement.textContent = `${animalName}を見つけました！`;

        if (isMew) {
            const rect = animalElement.getBoundingClientRect();
            const gameAreaRect = this.gameArea.getBoundingClientRect();
            const x = rect.left - gameAreaRect.left + rect.width / 2;
            const y = rect.top - gameAreaRect.top + rect.height / 2;
            this.createFireworks(x, y);
            this.messageElement.textContent = 'ミュウを見つけた！花火が上がった！';
        }

        if (this.score === this.animals.length) {
            clearInterval(this.timerInterval);
            const clearTime = Math.floor((Date.now() - this.startTime) / 1000);
            this.clearTimeElement.textContent = clearTime;
            
            setTimeout(() => {
                hideAllContainers();
                document.getElementById('clearScreen').style.display = 'block';
            }, 1000);
        }
    }
}

// ゲームコンテナの表示制御
const containers = {
    start: document.getElementById('startScreen'),
    pokemon: document.getElementById('pokemonGameContainer'),
    math: document.getElementById('mathGameContainer'),
    multiplication: document.getElementById('multiplicationGameContainer'),
    clear: document.getElementById('clearScreen'),
    mathClear: document.getElementById('mathClearScreen'),
    multiplicationClear: document.getElementById('multiplicationClearScreen')
};

// すべてのコンテナを非表示
function hideAllContainers() {
    Object.values(containers).forEach(container => {
        if (container) {
            container.style.display = 'none';
        }
    });
}

// 指定したコンテナを表示
function showContainer(containerId) {
    hideAllContainers();
    if (containers[containerId]) {
        containers[containerId].style.display = 'block';
    }
}

// イベントリスナーの設定
document.getElementById('mathGameButton').addEventListener('click', () => {
    showContainer('math');
    if (typeof startMathGame === 'function') {
        startMathGame();
    }
});

document.getElementById('multiplicationGameButton').addEventListener('click', () => {
    showContainer('multiplication');
    if (typeof startMultiplicationGame === 'function') {
        startMultiplicationGame();
    }
});

// メニューに戻るボタンの設定
document.querySelectorAll('.returnButton').forEach(button => {
    button.addEventListener('click', () => {
        showContainer('start');
    });
});

// 初期表示
window.addEventListener('load', () => {
    showContainer('start');
    new AnimalGame();
}); 