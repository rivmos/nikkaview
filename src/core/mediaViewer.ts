import { Modal } from "./modal";

export abstract class MediaViewer {
    
    protected container: HTMLElement;
    private modal: Modal  | null = null;
    
    constructor(container: HTMLElement) {
        this.container = container;
        this.container.style.position = 'relative';
        this.container.style.overflow = 'hidden';
        this.container.style.display = 'flex';
        this.container.style.alignItems = 'center';
        this.container.style.justifyContent = 'center';
    }

    abstract destroy(): void 

    openInModal() {
        if (!this.modal) {
          this.modal = new Modal();
        }
        const clonedContainer = this.container.cloneNode(true) as HTMLElement;
        this.modal.open(clonedContainer);
      }
    
      closeModal() {
        if (this.modal) {
          this.modal.close();
        }
      }
}