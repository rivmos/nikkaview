export class Modal {
    private modalElement: HTMLDivElement;
    private contentElement: HTMLDivElement;
    private actionElement: HTMLDivElement;

    private rotateButton: HTMLButtonElement;
    private closeButton: HTMLButtonElement;
    private flipHorizontalButton: HTMLButtonElement;
    private flipVerticalButton: HTMLButtonElement;
    private fullScreenButton: HTMLButtonElement;

    // zoom state
    private scale: number;
    private targetScale: number;
    private isZooming: boolean;

    // drag and pan state
    private isDragging: boolean;
    private movedX: number;
    private movedY: number;
    private targetMovedX: number;
    private targetMovedY: number;
    private dragTweening: boolean;
    private rotation: number;

    // orientation state
    private isFlipped: boolean

    constructor() {
        this.scale = 1; // initial zoom state
        this.targetScale = 1; // target scale for smooth zooming
        this.isZooming = false; // flag to indicate zooming state

        this.isDragging = false; // initial image isDragging state
        this.movedX = 0; // initial image moved along X
        this.movedY = 0; // initial image moved along Y
        this.targetMovedX = 0;
        this.targetMovedY = 0;
        this.dragTweening = false;
        this.rotation = 0;
        this.isFlipped = false;

        // Create modal container
        this.modalElement = document.createElement('div');
        this.modalElement.classList.add('modal-element');

        // Create button plates
        this.actionElement = document.createElement('div');
        this.actionElement.classList.add('action-element');
        this.modalElement.appendChild(this.actionElement)

        this.rotateButton = document.createElement('button');
        this.rotateButton.innerText = 'R';;
        this.rotateButton.classList.add('button');
        this.actionElement.appendChild(this.rotateButton);

        this.flipHorizontalButton = document.createElement('button');
        this.flipHorizontalButton.innerText = 'H';
        this.flipHorizontalButton.classList.add('button');
        this.actionElement.appendChild(this.flipHorizontalButton);


        this.flipVerticalButton = document.createElement('button');
        this.flipVerticalButton.innerText = 'V';
        this.flipVerticalButton.classList.add('button');
        this.actionElement.appendChild(this.flipVerticalButton);

        this.fullScreenButton = document.createElement('button');
        this.fullScreenButton.innerText = 'F';;
        this.fullScreenButton.classList.add('button');
        this.actionElement.appendChild(this.fullScreenButton);

        this.rotateButton.addEventListener('click', (event) => {
            if (this.rotation >= 270) this.contentElement.style.transition = 'none';
            this.rotation >= 270 ? this.rotation = 0 : this.rotation += 90
            this.updateTransform();
        });

        this.flipHorizontalButton.addEventListener('click', (event) => {
            this.flip('horizontal');
        });

        this.flipVerticalButton.addEventListener('click', (event) => {
            this.flip('vertical');
        });

        this.fullScreenButton.addEventListener('click', (event) => {
            this.goFullScreen();
        });



        // Create content container
        this.contentElement = document.createElement('div');
        this.contentElement.classList.add('content-element');
        this.modalElement.appendChild(this.contentElement);

        // Create close button
        this.closeButton = document.createElement('button');
        this.closeButton.innerText = '✕';
        this.closeButton.classList.add('close-button');

        this.closeButton.addEventListener('click', () => {
            this.close();
            this.reset();
            this.updateTransform();
        });

        this.modalElement.appendChild(this.closeButton);

        this.modalElement.addEventListener('click', (event) => {
            if (event.target === this.modalElement) {
                this.close();
                this.reset();
                this.updateTransform();
            }
        });

        // Append to body
        document.body.appendChild(this.modalElement);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.close();
            }
        });
        this.initEvents();
    }

    private initEvents() {
        let startX = 0;
        let startY = 0;

        this.contentElement.addEventListener('dragstart', (e) => {
            e.preventDefault(); // Prevent native drag behavior
        });

        // Debounced zoom effect
        this.contentElement.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY < 0 ? 0.1 : -0.1; // zoom direction
            this.debounceZoom(delta);
        });

        this.contentElement.addEventListener('mousedown', (e) => {
            this.isDragging = true; // Enable dragging state
            startX = e.clientX; // Record initial X position
            startY = e.clientY; // Record initial Y position
        });

        window.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return; // Exit if not dragging
            this.targetMovedX += e.clientX - startX; // Calculate horizontal movement
            this.targetMovedY += e.clientY - startY; // Calculate vertical movement
            startX = e.clientX; // Update start X for next move
            startY = e.clientY; // Update start Y for next move
            this.dragTweening = true; // Trigger smooth transition of dragging
            this.updateTransform();
        });

        window.addEventListener('mouseup', () => {
            this.isDragging = false; // Disable dragging state
        });
    }

    // Debounced zoom function
    private debounceZoom(amount: number) {
        if (this.isZooming) return; // Prevent zooming until the previous zoom completes
        this.isZooming = true;
        setTimeout(() => {
            this.zoom(amount);
            this.isZooming = false;
        }, 100); // Adjust debounce delay as needed
    }

    open(content: HTMLElement) {
        // Attach content to the modal
        this.contentElement.innerHTML = '';
        this.contentElement.appendChild(content);

        // Show modal
        this.modalElement.style.opacity = '1';
        this.modalElement.style.pointerEvents = 'all';
    }

    close() {
        this.modalElement.style.opacity = '0';
        this.modalElement.style.pointerEvents = 'none';
    }

    reset() {
        this.scale = 1; // initial zoom state
        this.movedX = 0; // initial image moved along X
        this.movedY = 0; // initial image moved along Y
        this.rotation = 0;
    }
    destroy() {
        // Clean up modal
        this.modalElement.remove();
    }

    private zoom(amount: number) {
        this.targetScale = Math.min(Math.max(0.5, this.targetScale + amount), 5); // keep the scale between 0.5 and 5
        this.updateTransform(); // Apply the updated scale and translation
    }

    private flip(orientation: 'vertical' | 'horizontal') {
        orientation === 'horizontal' ? this.contentElement.style.transform = `scaleX(${this.isFlipped ? 1 : -1})` : orientation === 'vertical' ? this.contentElement.style.transform = `scaleY(${this.isFlipped ? 1 : -1})` : this.contentElement.style.transform = `scaleX(1) scaleY(1)`
        this.isFlipped = !this.isFlipped
    }

    private goFullScreen() {
        if (document.fullscreenElement) {
            // If there is a fullscreen element, exit full screen.
            document.exitFullscreen();
            return;
        }
        this.contentElement.style.width = '100%'
        this.contentElement.style.height = '100%'
        this.contentElement.requestFullscreen()
    }

    private updateTransform() {
        if (this.dragTweening) {
            // Smooth drag effect using interpolation
            this.movedX += (this.targetMovedX - this.movedX) * 0.1; // Apply easing
            this.movedY += (this.targetMovedY - this.movedY) * 0.1; // Apply easing
        }

        this.contentElement.style.transition = 'transform 0.2s ease-out'; // smooth transition
        this.contentElement.style.transform = `scale(${this.targetScale}) translate(${this.movedX}px, ${this.movedY}px) rotate(${this.rotation}deg)`;
    }
    
}
