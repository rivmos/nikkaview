import { MediaViewer } from "./mediaViewer";

export class ImageRenderer extends MediaViewer {

    private url: string;
    private imageElement: HTMLImageElement;

    // zoom state
    private scale: number;

    // drag and pan state
    private isDragging: boolean;
    private movedX: number;
    private movedY: number;

    constructor(container: HTMLElement, url: string) {
        super(container)
        this.url = url;
        this.scale = 1; // initial zoom state
        this.isDragging = false; // intial image isDragging state
        this.movedX = 0; // initial image moved along X
        this.movedY = 0; // initial image moved along Y

        this.imageElement = new Image();
        this.imageElement.style.position = 'absolute';
        this.imageElement.style.top = '0';
        this.imageElement.style.left = '0';
        this.imageElement.src = this.url;

        this.imageElement.onload = (e) => {
            this.container.style.height = `${this.imageElement.naturalHeight}px`
        }

        // preventing the image fade dragging while panning and dragging event
        this.imageElement.addEventListener('dragstart', (e) => {
            e.preventDefault()
        })

        this.container.appendChild(this.imageElement)

        this.initEvents();

    }

    private initEvents() {
        let startX = 0;
        let startY = 0;

        this.container.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.zoom(e.deltaY < 0 ? 0.1 : -0.1); // deltaY +ve wheel down, so for wheel down we zoom out by -0.1
        });

        this.container.addEventListener('mousedown', (e) => {
            this.isDragging = true; // Enable dragging state
            startX = e.clientX; // Record initial X position
            startY = e.clientY; // Record initial Y position
        });

        window.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return; // Exit if not dragging
            this.movedX += e.clientX - startX; // Calculate horizontal movement
            this.movedY += e.clientY - startY; // Calculate vertical movement
            startX = e.clientX; // Update start X for next move
            startY = e.clientY; // Update start Y for next move
            // Apply zoom and updated position via transform
            this.updateTransform(); 
        });

        window.addEventListener('mouseup', () => {
            this.isDragging = false; // Disable dragging state
        });
    }

    private zoom(amount: number) {
        this.scale = Math.min(Math.max(0.5, this.scale + amount), 5); // keeping the scale between 0.5 and 5
        this.updateTransform(); // transforming image as per the current state of scale
    }

    private updateTransform() {
        this.imageElement.style.transform = `scale(${this.scale}) translate(${this.movedX}px, ${this.movedY}px)`;
      }    

    destroy(): void {

    }
}