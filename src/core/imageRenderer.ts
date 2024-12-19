import { MediaViewer } from "./mediaViewer";

export class ImageRenderer extends MediaViewer {

    private url: string;
    private imageElement: HTMLImageElement;


    constructor(container: HTMLElement, url: string) {
        super(container)
        this.url = url;

        this.imageElement = new Image();
        this.imageElement.classList.add('image-element');
        this.imageElement.src = this.url;

        this.imageElement.onload = (e) => {
            this.container.style.height = `${this.imageElement.naturalHeight}px`
        }

        this.imageElement.addEventListener('dblclick', this.openInModal.bind(this))

        this.container.appendChild(this.imageElement)

    }
    

    destroy(): void {

    }
}