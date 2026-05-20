import { BaseComponent } from '../BaseComponent';
import { Theme } from '../theme';

export interface FileTreeNode {
    name: string;
    path: string;
    isDirectory: boolean;
    size?: number;
    children?: FileTreeNode[];
    isOpen?: boolean;
}

export interface FileTreeProps {
    data: FileTreeNode[];
    onFileClick?: (node: FileTreeNode) => void;
    onFolderToggle?: (node: FileTreeNode) => void;
    onDragStart?: (node: FileTreeNode, e: DragEvent) => void;
}

export class FileTree extends BaseComponent<FileTreeProps> {
    private selectedPath: string | null = null;

    constructor(props: FileTreeProps) {
        super('div', props);
        this.render();
    }

    public updateData(data: FileTreeNode[]) {
        this.updateProps({ data });
    }

    public setSelected(path: string | null) {
        this.selectedPath = path;
        this.render();
    }

    private renderNode(node: FileTreeNode, depth: number): HTMLElement {
        const row = document.createElement('div');
        Object.assign(row.style, {
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: `4px 8px 4px ${8 + depth * 16}px`,
            cursor: 'pointer',
            fontSize: '13px',
            userSelect: 'none',
            whiteSpace: 'nowrap',
            color: this.selectedPath === node.path ? Theme.colors.accent : Theme.colors.textMain,
            backgroundColor: this.selectedPath === node.path ? 'rgba(0, 122, 204, 0.2)' : 'transparent',
            transition: 'background-color 0.1s'
        });

        row.onmouseenter = () => {
            if (this.selectedPath !== node.path) {
                row.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            }
        };
        row.onmouseleave = () => {
            if (this.selectedPath !== node.path) {
                row.style.backgroundColor = 'transparent';
            }
        };

        if (this.props.onDragStart) {
            row.draggable = true;
            row.ondragstart = (e) => {
                this.props.onDragStart!(node, e);
            };
        }

        const icon = document.createElement('i');
        if (node.isDirectory) {
            icon.className = node.isOpen ? 'fas fa-chevron-down' : 'fas fa-chevron-right';
            icon.style.width = '12px';
            icon.style.fontSize = '10px';
            icon.style.color = Theme.colors.textMuted;
        } else {
            icon.className = this.getFileIcon(node.name);
            icon.style.width = '14px';
            icon.style.color = this.getFileColor(node.name);
        }

        const name = document.createElement('span');
        name.textContent = node.name;

        row.appendChild(icon);
        row.appendChild(name);

        row.onclick = (e) => {
            e.stopPropagation();
            if (node.isDirectory) {
                if (this.props.onFolderToggle) this.props.onFolderToggle(node);
            } else {
                if (this.props.onFileClick) this.props.onFileClick(node);
            }
        };

        const container = document.createElement('div');
        container.appendChild(row);

        if (node.isDirectory && node.isOpen && node.children) {
            const childrenContainer = document.createElement('div');
            node.children.forEach(child => {
                childrenContainer.appendChild(this.renderNode(child, depth + 1));
            });
            container.appendChild(childrenContainer);
        }

        return container;
    }

    private getFileIcon(filename: string): string {
        const ext = filename.split('.').pop()?.toLowerCase();
        switch (ext) {
            case 'ts':
            case 'tsx': return 'fab fa-js-square'; // Close enough
            case 'js':
            case 'jsx': return 'fab fa-js';
            case 'json': return 'fas fa-code';
            case 'md': return 'fas fa-file-alt';
            case 'css': return 'fab fa-css3';
            case 'html': return 'fab fa-html5';
            default: return 'fas fa-file';
        }
    }

    private getFileColor(filename: string): string {
        const ext = filename.split('.').pop()?.toLowerCase();
        switch (ext) {
            case 'ts':
            case 'tsx': return '#3178c6';
            case 'js':
            case 'jsx': return '#f1e05a';
            case 'json': return '#cbcb41';
            case 'md': return '#083fa1';
            default: return Theme.colors.textMuted;
        }
    }

    public render(): void {
        this.element.innerHTML = '';
        this.applyStyles({
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            overflowX: 'hidden'
        });

        if (this.props.data.length === 0) {
            const empty = document.createElement('div');
            empty.textContent = 'No files';
            Object.assign(empty.style, {
                padding: '12px',
                color: Theme.colors.textMuted,
                fontSize: '12px',
                fontStyle: 'italic'
            });
            this.element.appendChild(empty);
            return;
        }

        this.props.data.forEach(node => {
            this.element.appendChild(this.renderNode(node, 0));
        });
    }
}
