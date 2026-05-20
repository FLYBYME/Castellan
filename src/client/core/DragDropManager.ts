import { IDE } from './IDE';

export interface DragDropEventData {
    type: string;
    payload: unknown;
}

export const DragDropTypes = {
    FILE: 'castellan/file',
    CODE_SELECTION: 'castellan/code-selection',
};

export class DragDropManager {
    private ide: IDE;
    private currentDragData: DragDropEventData | null = null;

    constructor(ide: IDE) {
        this.ide = ide;
        
        // Listen to global drop events to prevent default browser behavior
        // (like opening the file in the browser instead of the IDE)
        window.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        
        window.addEventListener('drop', (e) => {
            e.preventDefault();
        });
    }

    /**
     * Start a drag operation. Call this from the `dragstart` event handler of a draggable element.
     */
    public startDrag(e: DragEvent, type: string, payload: unknown): void {
        this.currentDragData = { type, payload };
        if (e.dataTransfer) {
            e.dataTransfer.setData('application/json', JSON.stringify(this.currentDragData));
            e.dataTransfer.effectAllowed = 'copyMove';
        }
    }

    /**
     * End a drag operation. Call this from the `dragend` event handler.
     */
    public endDrag(): void {
        this.currentDragData = null;
    }

    /**
     * Handle a drop operation. Call this from the `drop` event handler of a drop target.
     * Returns the parsed drag data if successful.
     */
    public handleDrop(e: DragEvent): DragDropEventData | null {
        e.preventDefault();
        if (this.currentDragData) {
            const data = this.currentDragData;
            this.currentDragData = null;
            return data;
        }

        if (e.dataTransfer) {
            try {
                const raw = e.dataTransfer.getData('application/json');
                if (raw) {
                    return JSON.parse(raw) as DragDropEventData;
                }
            } catch (err) {
                console.error('Failed to parse drag data', err);
            }
        }
        return null;
    }

    /**
     * Helper to make an element a drop target for specific types.
     */
    public makeDropTarget(
        element: HTMLElement,
        acceptTypes: string[],
        onDrop: (data: DragDropEventData) => void,
        onDragEnter?: () => void,
        onDragLeave?: () => void
    ): void {
        element.addEventListener('dragover', (e) => {
            e.preventDefault(); // Necessary to allow dropping
            if (e.dataTransfer) {
                e.dataTransfer.dropEffect = 'copy';
            }
        });

        element.addEventListener('dragenter', (e) => {
            e.preventDefault();
            // Optional: check if the type is accepted using currentDragData
            if (onDragEnter) onDragEnter();
        });

        element.addEventListener('dragleave', (e) => {
            e.preventDefault();
            if (onDragLeave) onDragLeave();
        });

        element.addEventListener('drop', (e) => {
            e.preventDefault();
            if (onDragLeave) onDragLeave(); // Reset visual state
            
            const data = this.handleDrop(e);
            if (data && acceptTypes.includes(data.type)) {
                onDrop(data);
            }
        });
    }
}
