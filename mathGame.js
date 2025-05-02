class MathGame {
    constructor() {
        this.currentQuestion = 0;
        this.totalQuestions = 10;
        this.startTime = 0;
        this.timerInterval = null;
        this.gameArea = document.querySelector('.math-game-area');
        this.questionElement = document.getElementById('mathQuestion');
        this.timerElement = document.getElementById('mathTimer');
        this.messageElement = document.getElementById('mathMessage');
        this.clearTimeElement = document.getElementById('mathClearTime');
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.getElementById('mathRestartButton').addEventListener('click', () => {
            hideAllContainers();
            document.getElementById('mathGameContainer').style.display = 'block';
            this.resetGame();
            this.startGame();
        });

        document.getElementById('mathBackToTitle').addEventListener('click', () => {
            hideAllContainers();
            document.getElementById('startScreen').style.display = 'block';
        });
    }

    generateProblem() {
        // 答えが2桁（10-99）になるように問題を生成
        const answer = Math.floor(Math.random() * 90) + 10; // 10-99
        const num1 = Math.floor(Math.random() * (answer - 1)) + 1; // 1からanswer-1まで
        const num2 = answer - num1;
        
        return {
            num1,
            num2,
            answer
        };
    }

    getRandomPosition(containerWidth, containerHeight, panelSize, existingPositions) {
        const maxAttempts = 100;
        let attempts = 0;
        
        // パネルが完全に表示されるように余白を設定（パネルサイズを考慮）
        const margin = 20;
        const maxX = containerWidth - panelSize - margin;
        const maxY = containerHeight - panelSize - margin;
        
        while (attempts < maxAttempts) {
            const x = Math.floor(Math.random() * maxX) + margin;
            const y = Math.floor(Math.random() * maxY) + margin;
            
            // 他のパネルとの重なりをチェック
            const hasOverlap = existingPositions.some(pos => {
                const distance = Math.sqrt(
                    Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2)
                );
                return distance < panelSize * 1.5;
            });
            
            if (!hasOverlap) {
                return { x, y };
            }
            
            attempts++;
        }
        
        // 最大試行回数に達した場合は、重なりを許容する位置を返す
        return {
            x: Math.floor(Math.random() * maxX) + margin,
            y: Math.floor(Math.random() * maxY) + margin
        };
    }

    createNumberPanels(problem) {
        // 問題エリアをクリア
        const panelsContainer = document.createElement('div');
        panelsContainer.className = 'panels-container';
        this.gameArea.innerHTML = '';
        
        // 問題文を表示
        const problemText = document.createElement('div');
        problemText.className = 'problem-text';
        problemText.innerHTML = `
            <div class="problem-numbers">
                <span class="number">${problem.num1}</span>
                <span class="operator">+</span>
                <span class="number">${problem.num2}</span>
                <span class="operator">=</span>
                <span class="question-mark">?</span>
            </div>
        `;
        this.gameArea.appendChild(problemText);
        this.gameArea.appendChild(panelsContainer);

        // 答えの選択肢を生成
        const numbers = new Set([problem.answer]);
        while (numbers.size < 9) {
            const randomNum = Math.floor(Math.random() * 90) + 10;
            if (randomNum !== problem.answer) {
                numbers.add(randomNum);
            }
        }

        const shuffledNumbers = Array.from(numbers).sort(() => Math.random() - 0.5);
        const containerWidth = panelsContainer.offsetWidth;
        const containerHeight = panelsContainer.offsetHeight;
        const panelSize = 80;
        const existingPositions = [];

        shuffledNumbers.forEach(num => {
            const panel = document.createElement('div');
            panel.className = 'number-panel';
            panel.textContent = num;
            panel.dataset.value = num;
            
            const position = this.getRandomPosition(containerWidth, containerHeight, panelSize, existingPositions);
            existingPositions.push(position);
            
            panel.style.left = `${position.x}px`;
            panel.style.top = `${position.y}px`;
            
            panel.addEventListener('click', () => this.handleNumberClick(panel, problem.answer));
            panelsContainer.appendChild(panel);
        });
    }

    handleNumberClick(panel, correctAnswer) {
        if (panel.classList.contains('correct') || panel.classList.contains('wrong')) return;

        const selectedValue = parseInt(panel.dataset.value);
        if (selectedValue === correctAnswer) {
            panel.classList.add('correct');
            this.currentQuestion++;
            this.questionElement.textContent = this.currentQuestion;
            
            // 正解時の派手なフィードバック
            const feedback = document.createElement('div');
            feedback.className = 'correct-feedback';
            feedback.textContent = '正解！';
            this.gameArea.appendChild(feedback);
            
            // 1秒後にフィードバックを消す
            setTimeout(() => {
                feedback.remove();
                this.messageElement.textContent = '';
                
                if (this.currentQuestion === this.totalQuestions) {
                    this.endGame();
                } else {
                    const newProblem = this.generateProblem();
                    this.createNumberPanels(newProblem);
                }
            }, 1000);
        } else {
            panel.classList.add('wrong');
            this.messageElement.textContent = '不正解！もう一度挑戦してください。';
        }
    }

    startGame() {
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            const elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
            this.timerElement.textContent = `時間: ${elapsedTime}秒`;
        }, 1000);

        this.currentQuestion = 0;
        this.questionElement.textContent = '0';
        this.messageElement.textContent = '';
        
        const problem = this.generateProblem();
        this.createNumberPanels(problem);
    }

    resetGame() {
        this.gameArea.innerHTML = '';
        this.messageElement.textContent = '';
        this.questionElement.textContent = '0';
        this.timerElement.textContent = '時間: 0秒';
        clearInterval(this.timerInterval);
    }

    endGame() {
        clearInterval(this.timerInterval);
        const clearTime = Math.floor((Date.now() - this.startTime) / 1000);
        this.clearTimeElement.textContent = clearTime;
        
        setTimeout(() => {
            hideAllContainers();
            document.getElementById('mathClearScreen').style.display = 'block';
        }, 1000);
    }
}

// グローバル関数として定義
function startMathGame() {
    const game = new MathGame();
    game.startGame();
}

// ゲームを開始
window.onload = () => {
    startMathGame();
}; 