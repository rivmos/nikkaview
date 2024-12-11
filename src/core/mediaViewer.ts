export abstract class MediaViewer {
    
    protected container: HTMLElement;
    
    constructor(container: HTMLElement) {
        this.container = container;
        this.container.style.position = 'relative';
        this.container.style.overflow = 'hidden';
        this.container.style.backgroundColor = '#ff000050'
    }

    abstract destroy(): void 
}