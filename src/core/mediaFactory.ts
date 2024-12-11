import { MediaViewer } from './mediaViewer';
import { ImageRenderer } from './imageRenderer';

export class MediaFactory {
  static createMediaViewer(container: HTMLElement, type: 'image' | 'video' | 'pdf', url: string): MediaViewer {
    switch (type) {
      case 'image':
        return new ImageRenderer(container, url);
      // Placeholder for other renderers
      case 'video':
        throw new Error('Video rendering is not yet implemented.');
      case 'pdf':
        throw new Error('PDF rendering is not yet implemented.');
      default:
        throw new Error(`Unsupported media type: ${type}`);
    }
  }
}
