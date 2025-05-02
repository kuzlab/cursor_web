class MultiplicationGame {
    constructor() {
        this.currentQuestion = 0;
        this.totalQuestions = 10;
        this.startTime = 0;
        this.timerInterval = null;
        this.mistakes = 0;
        this.maxMistakes = 3;
        this.gameArea = document.querySelector('#multiplicationGameContainer .math-game-area');
        this.questionElement = document.getElementById('multiplicationQuestion');
        this.timerElement = document.getElementById('multiplicationTimer');
        this.messageElement = document.getElementById('multiplicationMessage');
        this.clearTimeElement = document.getElementById('multiplicationClearTime');
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.getElementById('multiplicationGameButton').addEventListener('click', () => {
            document.getElementById('startScreen').style.display = 'none';
            document.getElementById('multiplicationGameContainer').style.display = 'block';
            this.startGame();
        });

        document.getElementById('multiplicationRestartButton').addEventListener('click', () => {
            document.getElementById('multiplicationClearScreen').style.display = 'none';
            document.getElementById('multiplicationGameContainer').style.display = 'block';
            this.resetGame();
            this.startGame();
        });
    }

    generateProblem() {
        // 九九の問題を生成（1-9の範囲）
        const num1 = Math.floor(Math.random() * 9) + 1;
        const num2 = Math.floor(Math.random() * 9) + 1;
        const answer = num1 * num2;
        
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
        const margin = 40; // 余白を大きくする
        const maxX = containerWidth - panelSize - margin;
        const maxY = containerHeight - panelSize - margin;
        
        // 中央寄せの範囲を設定
        const centerX = containerWidth / 2;
        const centerY = containerHeight / 2;
        const centerRange = Math.min(containerWidth, containerHeight) / 3; // 中央からの最大距離
        
        while (attempts < maxAttempts) {
            // 中央寄せの範囲内でランダムな位置を生成
            const x = centerX + (Math.random() * 2 - 1) * centerRange - panelSize / 2;
            const y = centerY + (Math.random() * 2 - 1) * centerRange - panelSize / 2;
            
            // 画面端からはみ出ないように制限
            const boundedX = Math.max(margin, Math.min(maxX, x));
            const boundedY = Math.max(margin, Math.min(maxY, y));
            
            const hasOverlap = existingPositions.some(pos => {
                const distance = Math.sqrt(
                    Math.pow(boundedX - pos.x, 2) + Math.pow(boundedY - pos.y, 2)
                );
                return distance < panelSize * 1.5;
            });
            
            if (!hasOverlap) {
                return { x: boundedX, y: boundedY };
            }
            
            attempts++;
        }
        
        // 最大試行回数に達した場合は、中央寄せの位置を返す
        return {
            x: centerX - panelSize / 2,
            y: centerY - panelSize / 2
        };
    }

    createNumberPanels(problem) {
        this.gameArea.innerHTML = '';
        
        // 問題文用のコンテナを作成
        const problemContainer = document.createElement('div');
        problemContainer.className = 'problem-container';
        problemContainer.style.textAlign = 'center';
        problemContainer.style.marginBottom = '30px';
        
        const problemText = document.createElement('div');
        problemText.className = 'problem-text';
        problemText.innerHTML = `
            <div class="problem-numbers">
                <span class="number">${problem.num1}</span>
                <span class="operator">×</span>
                <span class="number">${problem.num2}</span>
                <span class="operator">=</span>
                <span class="question-mark">?</span>
            </div>
        `;
        problemContainer.appendChild(problemText);
        this.gameArea.appendChild(problemContainer);

        const panelsContainer = document.createElement('div');
        panelsContainer.className = 'panels-container';
        this.gameArea.appendChild(panelsContainer);
        
        // コンテナのサイズを取得
        const containerWidth = this.gameArea.offsetWidth;
        const containerHeight = this.gameArea.offsetHeight - problemContainer.offsetHeight - 40;
        const panelSize = 80;

        // パネルを配置するエリアのスタイルを設定
        panelsContainer.style.width = `${containerWidth}px`;
        panelsContainer.style.height = `${containerHeight}px`;
        panelsContainer.style.position = 'relative';
        panelsContainer.style.margin = '0 auto';

        // 選択肢の生成
        const numbers = new Set([problem.answer]);
        while (numbers.size < 9) {
            const randomNum = Math.floor(Math.random() * 81) + 1;
            numbers.add(randomNum);
        }
        const shuffledNumbers = Array.from(numbers).sort(() => Math.random() - 0.5);

        // パネルの配置エリアの設定
        const margin = 20;
        const usableWidth = containerWidth - panelSize - margin * 2;
        const usableHeight = Math.min(300, containerHeight - panelSize - margin * 2); // 上部に制限

        // グリッドベースの位置を計算（3x3グリッド）
        const gridCellWidth = usableWidth / 3;
        const gridCellHeight = usableHeight / 3;

        shuffledNumbers.forEach((num, index) => {
            const panel = document.createElement('div');
            panel.className = 'number-panel';
            panel.textContent = num;
            panel.dataset.value = num;
            
            panel.style.width = `${panelSize}px`;
            panel.style.height = `${panelSize}px`;
            
            // グリッドベースの位置を計算
            const gridRow = Math.floor(index / 3);
            const gridCol = index % 3;
            
            // ベース位置を計算
            const baseX = margin + gridCol * gridCellWidth;
            const baseY = margin + gridRow * gridCellHeight;
            
            // ランダムなオフセットを追加（グリッドセルの30%まで）
            const randomOffsetX = (Math.random() - 0.5) * gridCellWidth * 0.3;
            const randomOffsetY = (Math.random() - 0.5) * gridCellHeight * 0.3;
            
            // 最終位置を設定（画面端に出ないように制限）
            const x = Math.max(margin, Math.min(usableWidth, baseX + randomOffsetX));
            const y = Math.max(margin, Math.min(usableHeight, baseY + randomOffsetY));
            
            panel.style.left = `${x}px`;
            panel.style.top = `${y}px`;
            
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
            
            const feedback = document.createElement('div');
            feedback.className = 'correct-feedback';
            feedback.textContent = '正解！';
            this.gameArea.appendChild(feedback);
            
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
            this.mistakes++;
            
            if (this.mistakes >= this.maxMistakes) {
                // ゲームオーバー演出を追加
                const container = document.getElementById('multiplicationGameContainer');
                container.classList.add('game-over');
                
                const gameOverMessage = document.createElement('div');
                gameOverMessage.className = 'game-over-message';
                gameOverMessage.textContent = 'ゲームオーバー';
                document.body.appendChild(gameOverMessage);
                
                setTimeout(() => {
                    container.classList.remove('game-over');
                    gameOverMessage.remove();
                    this.resetGame();
                    document.getElementById('multiplicationGameContainer').style.display = 'none';
                    document.getElementById('startScreen').style.display = 'block';
                }, 2000);
            } else {
                this.messageElement.textContent = `不正解！あと${this.maxMistakes - this.mistakes}回間違えられます。`;
            }
        }
    }

    startGame() {
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            const elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
            this.timerElement.textContent = elapsedTime;
        }, 1000);

        this.currentQuestion = 0;
        this.mistakes = 0;
        this.questionElement.textContent = '0';
        this.messageElement.textContent = '';
        const problem = this.generateProblem();
        this.createNumberPanels(problem);
    }

    resetGame() {
        this.gameArea.innerHTML = '';
        this.messageElement.textContent = '';
        clearInterval(this.timerInterval);
        this.mistakes = 0;
    }

    endGame() {
        clearInterval(this.timerInterval);
        const clearTime = Math.floor((Date.now() - this.startTime) / 1000);
        this.clearTimeElement.textContent = clearTime;
        
        setTimeout(() => {
            document.getElementById('multiplicationGameContainer').style.display = 'none';
            document.getElementById('multiplicationClearScreen').style.display = 'block';
        }, 1000);
    }
}

// ゲームを開始
window.onload = () => {
    new MultiplicationGame();
}; 