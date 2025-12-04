/**
 * 宋代点茶斗茶交互增强模块
 * 包含点茶流程模拟、斗茶小游戏、茶具展示等功能
 */

// 点茶流程模拟器
class SongDianChaSimulator {
    constructor() {
        this.steps = [
            { id: 'grind', name: '碾茶', desc: '将茶饼碾成细末', duration: 2000, icon: '⚙️' },
            { id: 'sift', name: '罗茶', desc: '用茶罗筛出细茶末', duration: 1500, icon: '🔄' },
            { id: 'warm', name: '熁盏', desc: '温热茶盏提升温度', duration: 1000, icon: '🔥' },
            { id: 'add', name: '置茶', desc: '取适量茶末入盏', duration: 800, icon: '🍃' },
            { id: 'pour', name: '注汤', desc: '注入少量沸水调膏', duration: 1200, icon: '💧' },
            { id: 'stir', name: '击拂', desc: '用茶筅快速搅动', duration: 3000, icon: '🌀' },
            { id: 'foam', name: '育华', desc: '培育丰富茶沫', duration: 2000, icon: '☁️' }
        ];
        
        this.currentStep = 0;
        this.score = 0;
        this.teaFoamQuality = 0; // 0-100
        this.timer = null;
        this.isAutoMode = false;
        
        this.initElements();
    }
    
    initElements() {
        // 创建点茶控制面板
        this.createControlPanel();
        // 创建茶汤可视化区域
        this.createTeaVisualization();
        // 创建步骤指示器
        this.createStepIndicator();
    }
    
    createControlPanel() {
        const container = document.querySelector('.customs-scene') || document.body;
        
        this.controlPanel = document.createElement('div');
        this.controlPanel.className = 'diancha-control-panel';
        this.controlPanel.innerHTML = `
            <h3>🍵 宋代点茶模拟器</h3>
            <div class="controls">
                <button onclick="dianChaSim.startManual()" id="startBtn">开始点茶</button>
                <button onclick="dianChaSim.toggleAuto()" id="autoBtn">自动点茶</button>
                <button onclick="dianChaSim.resetProcess()" id="resetBtn">重置</button>
                <button onclick="dianChaSim.hint()" id="hintBtn">技巧提示</button>
            </div>
            <div class="status">
                <div class="score">得分: <span id="scoreValue">0</span></div>
                <div class="foam-quality">茶沫品质: 
                    <div class="quality-bar">
                        <div class="quality-fill" id="foamFill"></div>
                    </div>
                    <span id="foamValue">0%</span>
                </div>
                <div class="timer">用时: <span id="timeValue">00:00</span></div>
            </div>
        `;
        
        container.appendChild(this.controlPanel);
        
        // 添加样式
        this.addStyles();
    }
    
    createTeaVisualization() {
        const teaViz = document.createElement('div');
        teaViz.className = 'tea-visualization';
        teaViz.innerHTML = `
            <div class="tea-bowl" id="teaBowl">
                <div class="tea-liquid" id="teaLiquid"></div>
                <div class="tea-foam" id="teaFoam"></div>
                <div class="tea-bubbles" id="teaBubbles"></div>
            </div>
            <div class="tools">
                <div class="tool tea-grinder" id="grinder">碾子</div>
                <div class="tool tea-sieve" id="sieve">茶罗</div>
                <div class="tool tea-whisk" id="whisk">茶筅</div>
                <div class="tool tea-bowl" id="bowl">茶盏</div>
            </div>
        `;
        
        this.controlPanel.appendChild(teaViz);
    }
    
    createStepIndicator() {
        this.stepIndicator = document.createElement('div');
        this.stepIndicator.className = 'step-indicator';
        
        const stepsHtml = this.steps.map((step, index) => `
            <div class="step-item ${index === 0 ? 'active' : ''}" 
                 data-step="${step.id}" 
                 onclick="dianChaSim.jumpToStep(${index})">
                <span class="step-icon">${step.icon}</span>
                <span class="step-name">${step.name}</span>
                <span class="step-desc">${step.desc}</span>
            </div>
        `).join('');
        
        this.stepIndicator.innerHTML = `
            <h4>点茶七步</h4>
            <div class="steps-container">${stepsHtml}</div>
        `;
        
        this.controlPanel.appendChild(this.stepIndicator);
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .diancha-control-panel {
                background: linear-gradient(135deg, #f9f3e9, #f5e6d3);
                border: 2px solid #d4b483;
                border-radius: 15px;
                padding: 20px;
                margin: 25px 0;
                box-shadow: 0 10px 30px rgba(212, 180, 131, 0.2);
                font-family: "楷体", "STKaiti", serif;
            }
            
            .diancha-control-panel h3 {
                color: #8b4513;
                text-align: center;
                margin-bottom: 20px;
                border-bottom: 2px solid #d4b483;
                padding-bottom: 10px;
            }
            
            .controls {
                display: flex;
                gap: 10px;
                justify-content: center;
                margin-bottom: 20px;
                flex-wrap: wrap;
            }
            
            .controls button {
                padding: 10px 20px;
                background: linear-gradient(to bottom, #8b4513, #a0522d);
                color: white;
                border: none;
                border-radius: 25px;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.3s;
                min-width: 120px;
            }
            
            .controls button:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(139, 69, 19, 0.3);
            }
            
            .status {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 15px;
                margin: 20px 0;
                background: rgba(255, 255, 255, 0.8);
                padding: 15px;
                border-radius: 10px;
            }
            
            .quality-bar {
                width: 100%;
                height: 10px;
                background: #e0e0e0;
                border-radius: 5px;
                margin: 5px 0;
                overflow: hidden;
            }
            
            .quality-fill {
                height: 100%;
                background: linear-gradient(to right, #f4a460, #ffd700);
                width: 0%;
                transition: width 0.5s;
            }
            
            .tea-visualization {
                position: relative;
                height: 200px;
                margin: 20px 0;
            }
            
            .tea-bowl {
                position: absolute;
                width: 180px;
                height: 120px;
                background: radial-gradient(circle at 30% 30%, #fff8dc, #f5deb3);
                border-radius: 50% 50% 45% 45%;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                border: 5px solid #d4b483;
                overflow: hidden;
                box-shadow: inset 0 0 20px rgba(0,0,0,0.1);
            }
            
            .tea-liquid {
                position: absolute;
                bottom: 0;
                width: 100%;
                height: 40%;
                background: linear-gradient(to top, #8b4513, #d2691e);
                border-radius: 50% 50% 0 0;
            }
            
            .tea-foam {
                position: absolute;
                top: 30%;
                width: 100%;
                height: 30%;
                background: linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(255,255,255,0.6));
                border-radius: 50% 50% 40% 40%;
                transition: height 0.5s;
            }
            
            .tea-bubbles {
                position: absolute;
                top: 30%;
                width: 100%;
                height: 30%;
            }
            
            .bubble {
                position: absolute;
                background: white;
                border-radius: 50%;
                opacity: 0.7;
                animation: bubble-rise 3s infinite;
            }
            
            @keyframes bubble-rise {
                0% { transform: translateY(0) scale(0.5); opacity: 0; }
                50% { opacity: 0.7; }
                100% { transform: translateY(-100px) scale(1.2); opacity: 0; }
            }
            
            .tools {
                display: flex;
                justify-content: space-around;
                margin-top: 100px;
            }
            
            .tool {
                padding: 8px 15px;
                background: #d4b483;
                border-radius: 20px;
                cursor: pointer;
                transition: all 0.3s;
                text-align: center;
                min-width: 70px;
            }
            
            .tool.active {
                background: #8b4513;
                color: white;
                transform: scale(1.1);
                box-shadow: 0 5px 15px rgba(139, 69, 19, 0.3);
            }
            
            .step-indicator {
                margin-top: 20px;
            }
            
            .steps-container {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                gap: 10px;
                margin-top: 10px;
            }
            
            .step-item {
                background: white;
                padding: 10px;
                border-radius: 10px;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s;
                border: 2px solid transparent;
            }
            
            .step-item.active {
                border-color: #8b4513;
                background: #fff8dc;
                transform: translateY(-5px);
            }
            
            .step-icon {
                font-size: 1.5em;
                display: block;
                margin-bottom: 5px;
            }
            
            .step-name {
                display: block;
                font-weight: bold;
                color: #8b4513;
            }
            
            .step-desc {
                display: block;
                font-size: 0.8em;
                color: #666;
                margin-top: 3px;
            }
        `;
        document.head.appendChild(style);
    }
    
    // 开始手动点茶
    startManual() {
        this.resetProcess();
        this.isAutoMode = false;
        this.startStep(this.currentStep);
        
        // 更新按钮状态
        document.getElementById('startBtn').disabled = true;
        document.getElementById('startBtn').textContent = '进行中...';
    }
    
    // 切换自动模式
    toggleAuto() {
        this.isAutoMode = !this.isAutoMode;
        const autoBtn = document.getElementById('autoBtn');
        
        if (this.isAutoMode) {
            autoBtn.textContent = '停止自动';
            this.startAutoProcess();
        } else {
            autoBtn.textContent = '自动点茶';
            this.stopAutoProcess();
        }
    }
    
    // 开始自动点茶流程
    startAutoProcess() {
        this.resetProcess();
        this.executeStepAuto(0);
    }
    
    // 自动执行步骤
    executeStepAuto(stepIndex) {
        if (stepIndex >= this.steps.length || !this.isAutoMode) {
            this.isAutoMode = false;
            document.getElementById('autoBtn').textContent = '自动点茶';
            this.showResult();
            return;
        }
        
        this.currentStep = stepIndex;
        this.updateStepIndicator();
        this.animateStep(this.steps[stepIndex]);
        
        // 模拟操作时间
        setTimeout(() => {
            // 随机品质增加
            this.teaFoamQuality += 10 + Math.random() * 15;
            if (this.teaFoamQuality > 100) this.teaFoamQuality = 100;
            this.updateStatus();
            
            // 继续下一步
            this.executeStepAuto(stepIndex + 1);
        }, this.steps[stepIndex].duration);
    }
    
    // 停止自动过程
    stopAutoProcess() {
        this.isAutoMode = false;
    }
    
    // 执行单个步骤
    startStep(stepIndex) {
        if (stepIndex >= this.steps.length) {
            this.showResult();
            return;
        }
        
        this.currentStep = stepIndex;
        this.updateStepIndicator();
        
        const step = this.steps[stepIndex];
        this.animateStep(step);
        
        // 提示用户操作
        this.showStepInstruction(step);
    }
    
    // 动画展示步骤
    animateStep(step) {
        const toolMap = {
            'grind': 'grinder',
            'sift': 'sieve',
            'stir': 'whisk'
        };
        
        // 高亮对应工具
        if (toolMap[step.id]) {
            this.highlightTool(toolMap[step.id]);
        }
        
        // 茶汤变化效果
        switch(step.id) {
            case 'stir':
                this.animateStirring();
                break;
            case 'foam':
                this.generateBubbles();
                break;
        }
        
        // 更新茶沫显示
        if (step.id === 'stir' || step.id === 'foam') {
            this.teaFoamQuality += 15 + Math.random() * 10;
            if (this.teaFoamQuality > 100) this.teaFoamQuality = 100;
            
            const foam = document.getElementById('teaFoam');
            foam.style.height = `${30 + (this.teaFoamQuality / 100 * 30)}%`;
        }
    }
    
    // 动画：搅拌效果
    animateStirring() {
        const whisk = document.getElementById('whisk');
        const bowl = document.getElementById('teaBowl');
        
        // 添加搅拌动画
        whisk.style.animation = 'stir 0.3s linear 10';
        bowl.style.animation = 'shake 0.3s linear 10';
        
        // 动画结束后移除样式
        setTimeout(() => {
            whisk.style.animation = '';
            bowl.style.animation = '';
        }, 3000);
        
        // 添加CSS动画定义
        this.addAnimationStyles();
    }
    
    // 生成气泡效果
    generateBubbles() {
        const bubbles = document.getElementById('teaBubbles');
        bubbles.innerHTML = '';
        
        for (let i = 0; i < 20; i++) {
            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            bubble.style.left = `${Math.random() * 90}%`;
            bubble.style.width = `${5 + Math.random() * 10}px`;
            bubble.style.height = bubble.style.width;
            bubble.style.animationDelay = `${Math.random() * 2}s`;
            
            bubbles.appendChild(bubble);
        }
    }
    
    // 添加动画样式
    addAnimationStyles() {
        if (!document.getElementById('diancha-animations')) {
            const style = document.createElement('style');
            style.id = 'diancha-animations';
            style.textContent = `
                @keyframes stir {
                    0%, 100% { transform: rotate(0deg); }
                    25% { transform: rotate(10deg); }
                    75% { transform: rotate(-10deg); }
                }
                
                @keyframes shake {
                    0%, 100% { transform: translate(-50%, -50%); }
                    25% { transform: translate(-51%, -50%); }
                    75% { transform: translate(-49%, -50%); }
                }
                
                @keyframes tool-highlight {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.2); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // 高亮工具
    highlightTool(toolId) {
        // 移除所有高亮
        document.querySelectorAll('.tool').forEach(tool => {
            tool.classList.remove('active');
        });
        
        // 高亮当前工具
        const tool = document.getElementById(toolId);
        if (tool) {
            tool.classList.add('active');
            tool.style.animation = 'tool-highlight 0.5s 3';
        }
    }
    
    // 显示步骤提示
    showStepInstruction(step) {
        const instruction = document.createElement('div');
        instruction.className = 'step-instruction';
        instruction.innerHTML = `
            <strong>${step.icon} ${step.name}</strong>: ${step.desc}
            <br><small>点击任意位置继续</small>
        `;
        
        instruction.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(139, 69, 19, 0.95);
            color: white;
            padding: 20px 30px;
            border-radius: 15px;
            z-index: 1000;
            text-align: center;
            min-width: 250px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            animation: fadeIn 0.3s;
        `;
        
        document.body.appendChild(instruction);
        
        // 点击继续
        instruction.onclick = () => {
            instruction.remove();
            this.score += 10;
            this.updateStatus();
            
            // 继续下一步
            setTimeout(() => {
                this.startStep(this.currentStep + 1);
            }, 500);
        };
    }
    
    // 跳转到指定步骤
    jumpToStep(stepIndex) {
        if (this.isAutoMode) return;
        
        this.currentStep = stepIndex;
        this.updateStepIndicator();
        this.animateStep(this.steps[stepIndex]);
    }
    
    // 更新步骤指示器
    updateStepIndicator() {
        document.querySelectorAll('.step-item').forEach((item, index) => {
            if (index === this.currentStep) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
    
    // 更新状态显示
    updateStatus() {
        document.getElementById('scoreValue').textContent = this.score;
        document.getElementById('foamValue').textContent = `${Math.round(this.teaFoamQuality)}%`;
        document.getElementById('foamFill').style.width = `${this.teaFoamQuality}%`;
        
        // 更新用时
        if (this.startTime) {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
            const seconds = (elapsed % 60).toString().padStart(2, '0');
            document.getElementById('timeValue').textContent = `${minutes}:${seconds}`;
        }
    }
    
    // 显示结果
    showResult() {
        const result = document.createElement('div');
        result.className = 'diancha-result';
        
        let grade = '学徒';
        let color = '#8b4513';
        
        if (this.teaFoamQuality >= 90) {
            grade = '茶圣';
            color = '#ffd700';
        } else if (this.teaFoamQuality >= 70) {
            grade = '大师';
            color = '#c0c0c0';
        } else if (this.teaFoamQuality >= 50) {
            grade = '熟练';
            color = '#cd7f32';
        }
        
        result.innerHTML = `
            <h3>🍵 点茶完成！</h3>
            <div class="result-grade" style="color: ${color};">${grade}</div>
            <div class="result-details">
                <p>茶沫品质: <strong>${Math.round(this.teaFoamQuality)}%</strong></p>
                <p>操作得分: <strong>${this.score}</strong></p>
                <p>最终评价: ${this.getEvaluation(this.teaFoamQuality)}</p>
            </div>
            <button onclick="this.parentElement.remove(); dianChaSim.resetProcess()">再试一次</button>
        `;
        
        result.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 15px 40px rgba(0,0,0,0.2);
            z-index: 1001;
            text-align: center;
            min-width: 300px;
            border: 3px solid ${color};
            animation: fadeIn 0.5s;
        `;
        
        document.body.appendChild(result);
        
        // 恢复按钮状态
        document.getElementById('startBtn').disabled = false;
        document.getElementById('startBtn').textContent = '开始点茶';
    }
    
    // 获取评价
    getEvaluation(quality) {
        if (quality >= 90) return '「雪沫乳花浮午盏」—— 茶沫如雪，堪称极品！';
        if (quality >= 70) return '「白云满碗花徘徊」—— 茶沫绵密，技艺精湛！';
        if (quality >= 50) return '「银粟翻光眩眼飞」—— 茶沫尚可，还需练习。';
        return '「蟹眼已过鱼眼生」—— 火候未到，多加练习。';
    }
    
    // 重置过程
    resetProcess() {
        this.currentStep = 0;
        this.score = 0;
        this.teaFoamQuality = 0;
        this.startTime = Date.now();
        
        // 重置茶汤显示
        const foam = document.getElementById('teaFoam');
        if (foam) foam.style.height = '30%';
        
        const bubbles = document.getElementById('teaBubbles');
        if (bubbles) bubbles.innerHTML = '';
        
        // 重置工具高亮
        document.querySelectorAll('.tool').forEach(tool => {
            tool.classList.remove('active');
        });
        
        // 重置步骤指示器
        this.updateStepIndicator();
        
        // 更新状态显示
        this.updateStatus();
    }
    
    // 技巧提示
    hint() {
        const hints = [
            '「碾茶要细」：茶末越细，点出的茶沫越绵密。',
            '「熁盏要热」：茶盏温热有助于茶沫形成。',
            '「注汤要缓」：首次注汤要慢，便于调膏。',
            '「击拂要快」：茶筅击拂要快速有力。',
            '「育华要时」：茶沫形成需要时间培育。'
        ];
        
        const randomHint = hints[Math.floor(Math.random() * hints.length)];
        
        alert(`💡 点茶技巧：${randomHint}`);
    }
}

// 斗茶小游戏
class DouChaGame {
    constructor() {
        this.playerScore = 0;
        this.aiScore = 0;
        this.round = 1;
        this.maxRounds = 3;
        this.gameActive = false;
        
        this.initGame();
    }
    
    initGame() {
        // 创建游戏界面
        this.createGameUI();
    }
    
    createGameUI() {
        const container = document.querySelector('.customs-scene') || document.body;
        
        this.gamePanel = document.createElement('div');
        this.gamePanel.className = 'doucha-game-panel';
        this.gamePanel.innerHTML = `
            <h3>⚔️ 宋代斗茶小游戏</h3>
            <div class="game-status">
                <div class="player-area">
                    <h4>你</h4>
                    <div class="score" id="playerScore">0</div>
                    <div class="tea-display" id="playerTea"></div>
                </div>
                <div class="vs">VS</div>
                <div class="ai-area">
                    <h4>宋代文人</h4>
                    <div class="score" id="aiScore">0</div>
                    <div class="tea-display" id="aiTea"></div>
                </div>
            </div>
            <div class="game-controls">
                <button onclick="douChaGame.startGame()" id="startGameBtn">开始斗茶</button>
                <button onclick="douChaGame.playRound('color')" id="colorBtn">比拼汤色</button>
                <button onclick="douChaGame.playRound('foam')" id="foamBtn">比拼汤花</button>
                <button onclick="douChaGame.playRound('aroma')" id="aromaBtn">比拼香气</button>
                <div class="round-info">第 <span id="currentRound">1</span> / ${this.maxRounds} 回合</div>
            </div>
            <div class="game-log" id="gameLog"></div>
        `;
        
        container.appendChild(this.gamePanel);
        
        // 添加游戏样式
        this.addGameStyles();
    }
    
    addGameStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .doucha-game-panel {
                background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
                border: 3px solid #4caf50;
                border-radius: 15px;
                padding: 25px;
                margin: 30px 0;
                box-shadow: 0 10px 30px rgba(76, 175, 80, 0.2);
            }
            
            .doucha-game-panel h3 {
                color: #1b5e20;
                text-align: center;
                margin-bottom: 25px;
                font-size: 1.5em;
            }
            
            .game-status {
                display: grid;
                grid-template-columns: 1fr auto 1fr;
                gap: 30px;
                align-items: center;
                margin-bottom: 25px;
            }
            
            .player-area, .ai-area {
                text-align: center;
                padding: 20px;
                background: white;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            }
            
            .vs {
                font-size: 2em;
                color: #ff5722;
                font-weight: bold;
            }
            
            .tea-display {
                width: 100px;
                height: 100px;
                margin: 15px auto;
                border-radius: 50%;
                border: 3px solid #8b4513;
                overflow: hidden;
                position: relative;
            }
            
            .tea-liquid-display {
                position: absolute;
                bottom: 0;
                width: 100%;
                background: linear-gradient(to top, #8b4513, #d2691e);
                transition: height 0.5s;
            }
            
            .tea-foam-display {
                position: absolute;
                width: 100%;
                background: linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(255,255,255,0.6));
                transition: height 0.5s;
            }
            
            .game-controls {
                display: flex;
                justify-content: center;
                gap: 15px;
                margin: 20px 0;
                flex-wrap: wrap;
            }
            
            .game-controls button {
                padding: 12px 25px;
                background: linear-gradient(to bottom, #4caf50, #2e7d32);
                color: white;
                border: none;
                border-radius: 25px;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.3s;
                min-width: 140px;
            }
            
            .game-controls button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            
            .game-controls button:hover:not(:disabled) {
                transform: translateY(-3px);
                box-shadow: 0 5px 15px rgba(76, 175, 80, 0.3);
            }
            
            .round-info {
                text-align: center;
                padding: 10px;
                background: #f1f8e9;
                border-radius: 20px;
                font-weight: bold;
                color: #1b5e20;
                margin-top: 10px;
            }
            
            .game-log {
                max-height: 200px;
                overflow-y: auto;
                padding: 15px;
                background: white;
                border-radius: 10px;
                margin-top: 20px;
                border: 1px solid #e0e0e0;
            }
            
            .log-entry {
                padding: 8px 12px;
                margin: 5px 0;
                border-radius: 5px;
                animation: fadeIn 0.5s;
            }
            
            .log-player {
                background: #e8f5e9;
                border-left: 4px solid #4caf50;
            }
            
            .log-ai {
                background: #fff3e0;
                border-left: 4px solid #ff9800;
            }
            
            .log-info {
                background: #e3f2fd;
                border-left: 4px solid #2196f3;
            }
            
            @keyframes tea-highlight {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
            
            .winning {
                animation: tea-highlight 0.5s 3;
                box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
            }
        `;
        document.head.appendChild(style);
    }
    
    // 开始游戏
    startGame() {
        this.resetGame();
        this.gameActive = true;
        
        // 更新按钮状态
        document.getElementById('startGameBtn').disabled = true;
        document.getElementById('startGameBtn').textContent = '游戏中...';
        
        this.addLog('🎮 斗茶开始！三局两胜，比拼汤色、汤花和香气。', 'info');
        this.addLog('请选择比拼项目开始第一回合。', 'info');
    }
    
    // 进行一回合
    playRound(type) {
        if (!this.gameActive || this.round > this.maxRounds) return;
        
        const types = {
            'color': { name: '汤色', playerWeight: 0.6, aiWeight: 0.4 },
            'foam': { name: '汤花', playerWeight: 0.5, aiWeight: 0.5 },
            'aroma': { name: '香气', playerWeight: 0.4, aiWeight: 0.6 }
        };
        
        const config = types[type];
        if (!config) return;
        
        // 计算得分
        const playerPoints = Math.floor(Math.random() * 30 + 70 * config.playerWeight);
        const aiPoints = Math.floor(Math.random() * 30 + 70 * config.aiWeight);
        
        // 更新茶汤显示
        this.updateTeaDisplay('player', playerPoints);
        this.updateTeaDisplay('ai', aiPoints);
        
        // 判断胜负
        let roundWinner = '';
        if (playerPoints > aiPoints) {
            roundWinner = 'player';
            this.playerScore++;
            this.addLog(`🎉 你赢得了「${config.name}」比拼！得分: ${playerPoints} vs ${aiPoints}`, 'player');
        } else if (aiPoints > playerPoints) {
            roundWinner = 'ai';
            this.aiScore++;
            this.addLog(`😔 文人赢得了「${config.name}」比拼。得分: ${playerPoints} vs ${aiPoints}`, 'ai');
        } else {
            this.addLog(`🤝 「${config.name}」比拼平局！得分: ${playerPoints}`, 'info');
        }
        
        // 高亮获胜方
        this.highlightWinner(roundWinner);
        
        // 更新分数显示
        document.getElementById('playerScore').textContent = this.playerScore;
        document.getElementById('aiScore').textContent = this.aiScore;
        
        // 更新回合
        this.round++;
        document.getElementById('currentRound').textContent = this.round;
        
        // 检查游戏是否结束
        if (this.round > this.maxRounds) {
            setTimeout(() => this.endGame(), 1000);
        }
    }
    
    // 更新茶汤显示
    updateTeaDisplay(side, points) {
        const teaDisplay = document.getElementById(`${side}Tea`);
        teaDisplay.innerHTML = '';
        
        // 茶液层
        const liquid = document.createElement('div');
        liquid.className = 'tea-liquid-display';
        liquid.style.height = `${40 + (points / 100 * 30)}%`;
        teaDisplay.appendChild(liquid);
        
        // 茶沫层
        const foam = document.createElement('div');
        foam.className = 'tea-foam-display';
        foam.style.height = `${30 + (points / 100 * 40)}%`;
        foam.style.bottom = liquid.style.height;
        teaDisplay.appendChild(foam);
        
        // 分数标签
        const scoreLabel = document.createElement('div');
        scoreLabel.textContent = points;
        scoreLabel.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 5px 10px;
            border-radius: 10px;
            font-weight: bold;
        `;
        teaDisplay.appendChild(scoreLabel);
    }
    
    // 高亮获胜方
    highlightWinner(winner) {
        // 移除所有高亮
        document.querySelectorAll('.tea-display').forEach(display => {
            display.classList.remove('winning');
        });
        
        if (winner) {
            const winnerDisplay = document.getElementById(`${winner}Tea`);
            if (winnerDisplay) {
                winnerDisplay.classList.add('winning');
            }
        }
    }
    
    // 添加日志
    addLog(message, type = 'info') {
        const log = document.getElementById('gameLog');
        const entry = document.createElement('div');
        entry.className = `log-entry log-${type}`;
        entry.textContent = `[${new Date().toLocaleTimeString().slice(0,8)}] ${message}`;
        
        log.appendChild(entry);
        log.scrollTop = log.scrollHeight;
    }
    
    // 结束游戏
    endGame() {
        this.gameActive = false;
        
        let resultMessage = '';
        if (this.playerScore > this.aiScore) {
            resultMessage = '🎊 恭喜！你赢得了斗茶比赛！';
        } else if (this.aiScore > this.playerScore) {
            resultMessage = '📚 文人技艺高超，还需多加练习。';
        } else {
            resultMessage = '🤝 平局！茶逢对手，不分伯仲。';
        }
        
        this.addLog(`🏁 比赛结束！最终比分: ${this.playerScore} - ${this.aiScore}`, 'info');
        this.addLog(resultMessage, 'info');
        
        // 恢复按钮状态
        document.getElementById('startGameBtn').disabled = false;
        document.getElementById('startGameBtn').textContent = '重新开始';
        
        // 禁用比拼按钮
        ['colorBtn', 'foamBtn', 'aromaBtn'].forEach(id => {
            document.getElementById(id).disabled = true;
        });
    }
    
    // 重置游戏
    resetGame() {
        this.playerScore = 0;
        this.aiScore = 0;
        this.round = 1;
        this.gameActive = false;
        
        // 重置显示
        document.getElementById('playerScore').textContent = '0';
        document.getElementById('aiScore').textContent = '0';
        document.getElementById('currentRound').textContent = '1';
        
        // 清空茶汤显示
        ['playerTea', 'aiTea'].forEach(id => {
            const display = document.getElementById(id);
            display.innerHTML = '';
            display.classList.remove('winning');
        });
        
        // 清空日志
        document.getElementById('gameLog').innerHTML = '';
        
        // 启用按钮
        ['colorBtn', 'foamBtn', 'aromaBtn'].forEach(id => {
            document.getElementById(id).disabled = false;
        });
    }
}

// 茶具3D展示（简化版）
class TeaWareDisplay {
    constructor() {
        this.currentWare = 0;
        this.wares = [
            { name: '建盏', desc: '宋代斗茶专用茶盏，色黑衬茶', color: '#1a1a1a' },
            { name: '茶筅', desc: '竹制击拂工具，用于点茶', color: '#8b4513' },
            { name: '汤瓶', desc: '注汤用执壶，控制水流', color: '#d4b483' },
            { name: '茶罗', desc: '筛茶工具，确保茶末均匀', color: '#a0522d' }
        ];
        
        this.initDisplay();
    }
    
    initDisplay() {
        const container = document.querySelector('.customs-scene') || document.body;
        
        this.displayPanel = document.createElement('div');
        this.displayPanel.className = 'teaware-display-panel';
        this.displayPanel.innerHTML = `
            <h3>🏺 宋代茶具鉴赏</h3>
            <div class="teaware-3d" id="teaware3D"></div>
            <div class="teaware-info">
                <h4 id="wareName">建盏</h4>
                <p id="wareDesc">宋代斗茶专用茶盏，色黑衬茶</p>
            </div>
            <div class="teaware-controls">
                <button onclick="teaWareDisplay.prevWare()">← 上一个</button>
                <button onclick="teaWareDisplay.nextWare()">下一个 →</button>
                <button onclick="teaWareDisplay.rotateWare()">旋转查看</button>
            </div>
        `;
        
        container.appendChild(this.displayPanel);
        this.updateDisplay();
        this.addDisplayStyles();
    }
    
    updateDisplay() {
        const ware = this.wares[this.currentWare];
        const display = document.getElementById('teaware3D');
        
        // 创建3D效果（简化）
        display.innerHTML = `
            <div class="teaware-3d-model" style="
                width: 150px;
                height: 150px;
                margin: 0 auto;
                background: radial-gradient(circle at 30% 30%, 
                    ${this.lightenColor(ware.color, 20)}, 
                    ${ware.color}, 
                    ${this.darkenColor(ware.color, 30)}
                );
                border-radius: ${ware.name === '建盏' ? '50% 50% 40% 40%' : 
                              ware.name === '茶筅' ? '0 0 50% 50%' : '50%'};
                transform: rotateX(20deg) rotateY(${this.rotationAngle}deg);
                transition: transform 0.5s;
                box-shadow: 5px 5px 15px rgba(0,0,0,0.3);
                position: relative;
            ">
                <div class="teaware-highlight" style="
                    position: absolute;
                    top: 20%;
                    left: 20%;
                    width: 30%;
                    height: 20%;
                    background: rgba(255,255,255,0.3);
                    border-radius: 50%;
                    filter: blur(5px);
                "></div>
            </div>
        `;
        
        document.getElementById('wareName').textContent = ware.name;
        document.getElementById('wareDesc').textContent = ware.desc;
    }
    
    lightenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return `#${(
            0x1000000 +
            (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
            (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
            (B < 255 ? (B < 1 ? 0 : B) : 255)
        ).toString(16).slice(1)}`;
    }
    
    darkenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return `#${(
            0x1000000 +
            (R > 0 ? (R > 255 ? 255 : R) : 0) * 0x10000 +
            (G > 0 ? (G > 255 ? 255 : G) : 0) * 0x100 +
            (B > 0 ? (B > 255 ? 255 : B) : 0)
        ).toString(16).slice(1)}`;
    }
    
    nextWare() {
        this.currentWare = (this.currentWare + 1) % this.wares.length;
        this.rotationAngle = 0;
        this.updateDisplay();
    }
    
    prevWare() {
        this.currentWare = (this.currentWare - 1 + this.wares.length) % this.wares.length;
        this.rotationAngle = 0;
        this.updateDisplay();
    }
    
    rotateWare() {
        this.rotationAngle = (this.rotationAngle || 0) + 45;
        this.updateDisplay();
    }
    
    addDisplayStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .teaware-display-panel {
                background: linear-gradient(135deg, #fff3e0, #ffecb3);
                border: 3px solid #ff9800;
                border-radius: 15px;
                padding: 25px;
                margin: 30px 0;
                text-align: center;
            }
            
            .teaware-display-panel h3 {
                color: #5d4037;
                margin-bottom: 20px;
            }
            
            .teaware-info {
                margin: 20px 0;
                padding: 15px;
                background: rgba(255, 255, 255, 0.8);
                border-radius: 10px;
            }
            
            .teaware-info h4 {
                color: #5d4037;
                margin-bottom: 10px;
            }
            
            .teaware-controls {
                display: flex;
                justify-content: center;
                gap: 10px;
                margin-top: 20px;
            }
            
            .teaware-controls button {
                padding: 10px 20px;
                background: linear-gradient(to bottom, #ff9800, #f57c00);
                color: white;
                border: none;
                border-radius: 20px;
                cursor: pointer;
                transition: all 0.3s;
            }
            
            .teaware-controls button:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(255, 152, 0, 0.3);
            }
        `;
        document.head.appendChild(style);
    }
}

// 全局变量声明（用于HTML调用）
let dianChaSim, douChaGame, teaWareDisplay;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化点茶模拟器
    dianChaSim = new SongDianChaSimulator();
    
    // 初始化斗茶游戏
    douChaGame = new DouChaGame();
    
    // 初始化茶具展示
    teaWareDisplay = new TeaWareDisplay();
    
    // 添加键盘快捷键
    document.addEventListener('keydown', function(e) {
        // 点茶控制：空格键继续下一步
        if (e.code === 'Space' && dianChaSim) {
            e.preventDefault();
            if (dianChaSim.currentStep < dianChaSim.steps.length - 1) {
                dianChaSim.startStep(dianChaSim.currentStep + 1);
            }
        }
        
        // 游戏控制：1-3选择比拼项目
        if (e.code === 'Digit1' && douChaGame && douChaGame.gameActive) {
            douChaGame.playRound('color');
        }
        if (e.code === 'Digit2' && douChaGame && douChaGame.gameActive) {
            douChaGame.playRound('foam');
        }
        if (e.code === 'Digit3' && douChaGame && douChaGame.gameActive) {
            douChaGame.playRound('aroma');
        }
        
        // 茶具控制：左右箭头切换
        if (e.code === 'ArrowRight' && teaWareDisplay) {
            teaWareDisplay.nextWare();
        }
        if (e.code === 'ArrowLeft' && teaWareDisplay) {
            teaWareDisplay.prevWare();
        }
    });
    
    console.log('宋代点茶斗茶交互模块加载完成！');
});