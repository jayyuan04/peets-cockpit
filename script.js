class SlideManager {
    constructor() {
        this.slides = [];
        this.currentSlideIndex = 0;
        this.slideFrame = document.getElementById('slide-frame');
        this.thumbnailsContainer = document.getElementById('thumbnails');
        this.slideCounter = document.getElementById('slide-counter');
        this.pageIndicator = document.getElementById('page-indicator');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.init();
    }

    async init() {
        try {
            this.loadSlides();
            this.setupEventListeners();
            this.renderThumbnails();
            this.updateUI();
            this.setupIframeMessages();
            setTimeout(() => this.scaleIframe(), 200);
        } catch (error) {
            console.error('初始化失败:', error);
            this.showError('加载幻灯片失败');
        }
    }

    setupIframeMessages() {
        window.addEventListener('message', (e) => {
            if (e.data && typeof e.data === 'string' && e.data.startsWith('goToSlide:')) {
                const idx = parseInt(e.data.split(':')[1]);
                if (!isNaN(idx) && idx >= 1 && idx <= this.slides.length) {
                    this.goToSlide(idx - 1);
                }
            }
        });
    }

    loadSlides() {
        this.slides = [
            { id: 'slide-01', title: '运营驾驶舱', path: 'slides/slide-01.html' },
            { id: 'slide-02', title: '品质问题联动下钻', path: 'slides/slide-02.html' },
            { id: 'slide-03', title: '运营风险预警', path: 'slides/slide-03.html' },
            { id: 'slide-04', title: 'AM效能诊断热力图', path: 'slides/slide-04.html' },
            { id: 'slide-05', title: '门店风险地图&差评关联', path: 'slides/slide-05.html' },
        ];
    }

    setupEventListeners() {
        this.prevBtn.addEventListener('click', () => this.previousSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowLeft': case 'ArrowUp': e.preventDefault(); this.previousSlide(); break;
                case 'ArrowRight': case 'ArrowDown': case ' ': e.preventDefault(); this.nextSlide(); break;
                case 'Home': e.preventDefault(); this.goToSlide(0); break;
                case 'End': e.preventDefault(); this.goToSlide(this.slides.length - 1); break;
            }
        });
        window.addEventListener('resize', () => setTimeout(() => this.scaleIframe(), 100));
    }

    renderThumbnails() {
        this.thumbnailsContainer.innerHTML = '';
        this.slides.forEach((slide, index) => {
            const item = document.createElement('div');
            item.className = 'thumbnail-item';
            item.dataset.index = index;
            const preview = document.createElement('iframe');
            preview.className = 'thumbnail-preview';
            preview.src = slide.path;
            const title = document.createElement('div');
            title.className = 'thumbnail-title';
            title.textContent = slide.title;
            item.appendChild(preview);
            item.appendChild(title);
            item.addEventListener('click', () => this.goToSlide(index));
            this.thumbnailsContainer.appendChild(item);
        });
    }

    goToSlide(index) {
        if (index < 0 || index >= this.slides.length) return;
        this.currentSlideIndex = index;
        const slide = this.slides[index];
        this.slideFrame.src = slide.path;
        this.slideFrame.onload = () => setTimeout(() => this.scaleIframe(), 100);
        this.updateThumbnailStates();
        this.updateUI();
    }

    previousSlide() { if (this.currentSlideIndex > 0) this.goToSlide(this.currentSlideIndex - 1); }
    nextSlide() { if (this.currentSlideIndex < this.slides.length - 1) this.goToSlide(this.currentSlideIndex + 1); }

    updateThumbnailStates() {
        this.thumbnailsContainer.querySelectorAll('.thumbnail-item').forEach((t, i) => t.classList.toggle('active', i === this.currentSlideIndex));
    }

    scaleIframe() {
        try {
            const iframe = this.slideFrame;
            if (!iframe) return;
            const container = iframe.parentElement;
            const rect = container.getBoundingClientRect();
            const scale = Math.min((rect.width - 48) / 1600, (rect.height - 48) / 900, 1);
            iframe.style.transform = `scale(${scale})`;
        } catch (e) { console.error('缩放失败:', e); }
    }

    updateUI() {
        this.slideCounter.textContent = `${this.slides.length} 张幻灯片`;
        this.pageIndicator.textContent = `${this.currentSlideIndex + 1} / ${this.slides.length}`;
        this.prevBtn.disabled = this.currentSlideIndex === 0;
        this.nextBtn.disabled = this.currentSlideIndex === this.slides.length - 1;
        this.updateThumbnailStates();
    }

    showError(msg) { this.thumbnailsContainer.innerHTML = `<div style="padding:1rem;color:var(--accent-red)"><p>${msg}</p></div>`; }
}

document.addEventListener('DOMContentLoaded', () => { window.slideManager = new SlideManager(); });