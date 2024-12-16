export class Modal {
    // Private properties for encapsulating modal-related elements
    private modalElement: HTMLDivElement; // Main modal container
    private contentElement: HTMLDivElement; // Container for modal content
    private closeButton: HTMLButtonElement; // Close button
    private isOpen: boolean = false; // Tracks if the modal is open
    // zoom state
    private scale: number;

    // drag and pan state
    private isDragging: boolean;
    private movedX: number;
    private movedY: number;

    constructor() {
        this.scale = 1; // initial zoom state
        this.isDragging = false; // intial image isDragging state
        this.movedX = 0; // initial image moved along X
        this.movedY = 0; // initial image moved along Y

        // Create the main modal container (BackDrop) with styling
        this.modalElement = document.createElement('div');
        this.modalElement.style.position = 'fixed';
        this.modalElement.style.top = '0';
        this.modalElement.style.left = '0';
        this.modalElement.style.width = '100vw';
        this.modalElement.style.height = '100vh';
        this.modalElement.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'; // Dimmed background
        this.modalElement.style.display = 'flex';
        this.modalElement.style.alignItems = 'center';
        this.modalElement.style.justifyContent = 'center';
        this.modalElement.style.zIndex = '9999'; // Ensure modal is above all elements
        this.modalElement.style.opacity = '0'; // Hidden initially
        this.modalElement.style.transition = 'opacity 0.3s ease'; // Smooth open/close transition

        // Create content container for displaying dynamic content
        this.contentElement = document.createElement('div');
        this.contentElement.style.position = 'relative';
        this.contentElement.style.maxWidth = '90%';
        this.contentElement.style.maxHeight = '90%';
        this.modalElement.appendChild(this.contentElement);

        // Create close button with minimal UI
        this.closeButton = document.createElement('button');
        this.closeButton.innerText = '✕';
        this.closeButton.style.position = 'absolute';
        this.closeButton.style.top = '10px';
        this.closeButton.style.right = '10px';
        this.closeButton.style.background = 'transparent';
        this.closeButton.style.color = '#fff';
        this.closeButton.style.border = 'none';
        this.closeButton.style.fontSize = '24px';
        this.closeButton.style.cursor = 'pointer';
        this.closeButton.addEventListener('click', this.close.bind(this)); // Close modal on click

        this.modalElement.appendChild(this.closeButton);

        // Close modal when clicking on the backdrop
        this.modalElement.addEventListener('click', (event) => {
            if (event.target === this.modalElement) {
                this.close();
            }
        });

        // Close modal on pressing the Escape key
        document.addEventListener('keydown', this.handleKeyDown.bind(this));

        // Append modal to the DOM
        document.body.appendChild(this.modalElement);
        this.initEvents();
    }

    private initEvents() {
        let startX = 0;
        let startY = 0;

        this.contentElement.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.zoom(e.deltaY < 0 ? 0.1 : -0.1); // deltaY +ve wheel down, so for wheel down we zoom out by -0.1
        });

        this.contentElement.addEventListener('mousedown', (e) => {
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

        // preventing the image fade dragging while panning and dragging event
        this.contentElement.addEventListener('dragstart', (e) => {
            e.preventDefault()
        })
    }

    private zoom(amount: number) {
        this.scale = Math.min(Math.max(0.5, this.scale + amount), 5); // keeping the scale between 0.5 and 5
        this.updateTransform(); // transforming image as per the current state of scale
    }

    private updateTransform() {
        this.contentElement.style.transform = `scale(${this.scale}) translate(${this.movedX}px, ${this.movedY}px)`;
    }

    /**
     * Opens the modal and displays the provided content.
     * @param content HTMLElement to display inside the modal.
     */
    open(content: HTMLElement) {
        if (this.isOpen) return; // Prevent duplicate opens

        // Attach new content to the modal
        this.contentElement.innerHTML = '';
        this.contentElement.appendChild(content);

        // Show modal with styles
        this.modalElement.style.display = 'flex';
        this.modalElement.setAttribute('aria-hidden', 'false'); // Accessibility attribute
        this.modalElement.style.opacity = '1'; // Make modal visible
        this.modalElement.style.pointerEvents = 'all'; // Enable interaction
        this.isOpen = true; // Update modal state
    }

    /**
     * Closes the modal.
     */
    close() {
        if (!this.isOpen) return; // Prevent duplicate closes

        // Hide modal with styles
        this.modalElement.style.opacity = '0'; // Make modal invisible
        this.modalElement.style.pointerEvents = 'none'; // Disable interaction
        this.isOpen = false; // Update modal state
    }

    /**
     * Handles keyboard interactions for accessibility.
     * @param event KeyboardEvent for capturing key presses.
     */
    private handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'Escape' && this.isOpen) {
            this.close(); // Close modal on Escape key
        }
    }
}
