// 视频播放器增强
const videoPlayer = {
    init() {
        this.video = document.createElement('video');
        this.video.src = 'videos/longjing-brewing.mp4';
        this.video.controls = true;
        this.video.className = 'custom-video-player';
        
        // 自定义控制栏
        this.createCustomControls();
        
        // 播放进度跟踪
        this.video.addEventListener('timeupdate', this.updateProgress.bind(this));
        
        // 快捷键支持
        document.addEventListener('keydown', this.handleKeydown.bind(this));
    },
    
    createCustomControls() {
        const controls = `
            <div class="video-controls">
                <button onclick="videoPlayer.togglePlay()">▶️</button>
                <input type="range" min="0" max="100" value="0" 
                       oninput="videoPlayer.seek(this.value)">
                <span class="time-display">00:00 / 00:00</span>
                <button onclick="videoPlayer.toggleMute()">🔊</button>
                <button onclick="videoPlayer.toggleFullscreen()">⛶</button>
            </div>
        `;
    },
    
    // 播放速度控制
    createSpeedControl() {
        const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
        speeds.forEach(speed => {
            const btn = document.createElement('button');
            btn.textContent = `${speed}x`;
            btn.onclick = () => this.video.playbackRate = speed;
        });
    },
    
    // 截图功能
    captureScreenshot() {
        const canvas = document.createElement('canvas');
        canvas.width = this.video.videoWidth;
        canvas.height = this.video.videoHeight;
        canvas.getContext('2d').drawImage(this.video, 0, 0);
        
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'tea-brewing-screenshot.png';
        link.click();
    },
    
    // 书签功能
    addBookmark() {
        const time = this.video.currentTime;
        const bookmarks = JSON.parse(localStorage.getItem('videoBookmarks') || '[]');
        bookmarks.push({
            time: time,
            label: `书签 ${bookmarks.length + 1}`,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('videoBookmarks', JSON.stringify(bookmarks));
    }
};

// 冲泡步骤交互
class BrewingSteps {
    constructor() {
        this.steps = document.querySelectorAll('.step');
        this.currentStep = 0;
        this.init();
    }
    
    init() {
        this.steps.forEach((step, index) => {
            step.addEventListener('click', () => this.goToStep(index));
            
            // 添加步骤完成标记
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'step-complete';
            checkbox.onclick = (e) => e.stopPropagation();
            step.querySelector('.step-content').appendChild(checkbox);
        });
        
        // 添加导航控制
        this.createNavigation();
    }
    
    createNavigation() {
        const nav = document.createElement('div');
        nav.className = 'steps-navigation';
        nav.innerHTML = `
            <button onclick="brewingSteps.prevStep()">← 上一步</button>
            <span>步骤 <span id="current-step">1</span>/${this.steps.length}</span>
            <button onclick="brewingSteps.nextStep()">下一步 →</button>
            <button onclick="brewingSteps.markAllComplete()">全部完成</button>
        `;
        document.querySelector('.brewing-steps').appendChild(nav);
    }
    
    goToStep(index) {
        this.steps[this.currentStep].classList.remove('active-step');
        this.currentStep = index;
        this.steps[this.currentStep].classList.add('active-step');
        document.getElementById('current-step').textContent = index + 1;
        
        // 滚动到当前步骤
        this.steps[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // 播放步骤音效
        this.playStepSound();
    }
    
    nextStep() {
        if (this.currentStep < this.steps.length - 1) {
            this.goToStep(this.currentStep + 1);
        }
    }
    
    prevStep() {
        if (this.currentStep > 0) {
            this.goToStep(this.currentStep - 1);
        }
    }
    
    markAllComplete() {
        document.querySelectorAll('.step-complete').forEach(checkbox => {
            checkbox.checked = true;
        });
    }
    
    playStepSound() {
        // 简单音效提示
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        oscillator.connect(audioContext.destination);
        oscillator.frequency.value = 600 + (this.currentStep * 50);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
    }
}

// 初始化
const brewingSteps = new BrewingSteps();
videoPlayer.init();

// 添加CSS交互样式
const style = document.createElement('style');
style.textContent = `
    .step.active-step {
        background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
        transform: translateX(10px);
        border-left: 4px solid #4caf50;
    }
    
    .step-complete:checked + .step-content {
        opacity: 0.7;
        text-decoration: line-through;
    }
    
    .steps-navigation {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 30px 0;
        padding: 20px;
        background: #f1f8e9;
        border-radius: 10px;
    }
    
    .custom-video-player {
        width: 100%;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }
    
    .video-controls {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 15px;
        background: rgba(0,0,0,0.8);
        border-radius: 0 0 10px 10px;
    }
`;
document.head.appendChild(style);