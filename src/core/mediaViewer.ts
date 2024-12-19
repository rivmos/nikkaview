import { Modal } from "./modal";

export abstract class MediaViewer {
    
    protected container: HTMLElement;
    private modal: Modal  | null = null;
    
    constructor(container: HTMLElement) {
        this.container = container;
        this.container.classList.add('container');
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