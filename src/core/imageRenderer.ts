import { MediaViewer } from "./mediaViewer";

export class ImageRenderer extends MediaViewer {

    private url: string;
    private imageElement: HTMLImageElement;
    private scale: number; // zoom state

    constructor(container: HTMLElement, url: string) {
        super(container)
        this.url = url;
        this.scale = 1; // initial zoom state

        this.imageElement = new Image();
        this.imageElement.style.position = 'absolute';
        this.imageElement.style.top = '0';
        this.imageElement.style.left = '0';
        this.imageElement.src = this.url;

        this.imageElement.onload = (e) => {
            this.container.style.height = `${this.imageElement.naturalHeight}px`
        }

        this.container.appendChild(this.imageElement)

        this.initEvents();

    }

    private initEvents() {
        this.container.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.zoom(e.deltaY < 0 ? 0.1 : -0.1); // deltaY +ve wheel down, so for wheel down we zoom out by -0.1
        });

    }

    private zoom(amount: number){
        this.scale = Math.min(Math.max(0.5, this.scale + amount), 5); // keeping the scale between 0.5 and 5
        this.imageElement.style.transform = `scale(${this.scale})`; // transforming image as per the current state of scale
    }

    destroy(): void {

    }
}