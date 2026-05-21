import { ViewProvider } from '@castellan/client/extensions/ViewProvider.js';
import { ExtensionContext } from '@castellan/client/extensions/Extension.js';
import * as ui from '@ui-lib';

type GenesisPhase = 'idle' | 'genesis' | 'bootstrap' | 'reset' | 'complete' | 'error';

interface GenesisLogEntry {
    type: 'system' | 'thinking' | 'content' | 'question' | 'answer' | 'error' | 'tool';
    text: string;
    timestamp: Date;
}

export class GenesisDashboardView implements ViewProvider {
    public readonly id = 'genesis-dashboard';
    public readonly name = 'Genesis';
    private container: HTMLElement | null = null;
    private logContainer: HTMLElement | null = null;
    private phaseLabel: HTMLElement | null = null;
    private progressBar: HTMLElement | null = null;
    private actionArea: HTMLElement | null = null;
    private phase: GenesisPhase = 'idle';
    private logs: GenesisLogEntry[] = [];

    constructor(private context: ExtensionContext) {}

    public async resolveView(container: HTMLElement, disposables: { dispose: () => void }[]): Promise<void> {
        this.container = container;
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.height = '100%';
        container.style.overflow = 'hidden';
        container.style.backgroundColor = 'var(--bg-primary)';

        // ── Header ──
        const header = document.createElement('div');
        Object.assign(header.style, {
            padding: '12px 16px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
        });

        const icon = document.createElement('i');
        icon.className = 'fas fa-magic';
        icon.style.color = '#c678dd';
        icon.style.fontSize = '16px';
        header.appendChild(icon);

        const title = new ui.Text({ text: 'System Genesis', weight: 'bold', size: 'sm' });
        header.appendChild(title.getElement());

        this.phaseLabel = document.createElement('span');
        Object.assign(this.phaseLabel.style, {
            marginLeft: 'auto',
            fontSize: '10px',
            padding: '2px 8px',
            borderRadius: '10px',
            background: 'rgba(255,255,255,0.08)',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
        });
        this.phaseLabel.textContent = 'IDLE';
        header.appendChild(this.phaseLabel);

        container.appendChild(header);

        // ── Progress Bar ──
        this.progressBar = document.createElement('div');
        Object.assign(this.progressBar.style, {
            height: '2px',
            background: 'var(--border)',
            position: 'relative',
            overflow: 'hidden',
        });
        const progressFill = document.createElement('div');
        progressFill.id = 'genesis-progress-fill';
        Object.assign(progressFill.style, {
            position: 'absolute',
            top: '0',
            left: '0',
            height: '100%',
            width: '0%',
            background: 'linear-gradient(90deg, #c678dd, #61afef)',
            transition: 'width 0.5s ease',
        });
        this.progressBar.appendChild(progressFill);
        container.appendChild(this.progressBar);

        // ── Log Area ──
        this.logContainer = document.createElement('div');
        Object.assign(this.logContainer.style, {
            flex: '1',
            overflow: 'auto',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            fontSize: '12px',
            fontFamily: 'monospace',
        });
        container.appendChild(this.logContainer);
        this.renderEmptyState();

        // ── Action Area ──
        this.actionArea = document.createElement('div');
        Object.assign(this.actionArea.style, {
            padding: '12px 16px',
            borderTop: '1px solid var(--border)',
            background: 'var(--bg-secondary)',
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
        });
        container.appendChild(this.actionArea);
        this.renderActionButtons();

        // ── Event Listener ──
        const unsub = this.context.ide.commands.on('data:updated', (_payload: unknown) => {
             // Mocking stream logic for now as it's being refactored
        });
        disposables.push({ dispose: () => this.context.ide.commands.off(unsub) });
    }

    private renderEmptyState(): void {
        if (!this.logContainer) return;
        this.logContainer.innerHTML = '';
        const empty = new ui.EmptyStateView({
            icon: 'fas fa-dna',
            title: 'Genesis Ready',
            description: 'Run Genesis to define your system soul and generate agent personas. Bootstrap to assign tools.',
        });
        this.logContainer.appendChild(empty.getElement());
    }

    private renderActionButtons(): void {
        if (!this.actionArea) return;
        this.actionArea.innerHTML = '';

        const isRunning = this.phase !== 'idle' && this.phase !== 'complete' && this.phase !== 'error';

        const genesisBtn = new ui.Button({
            label: 'Genesis',
            icon: 'fas fa-magic',
            variant: 'primary',
            size: 'small',
            onClick: () => this.runGenesis(),
        });
        genesisBtn.getElement().toggleAttribute('disabled', isRunning);
        this.actionArea.appendChild(genesisBtn.getElement());

        const bootstrapBtn = new ui.Button({
            label: 'Bootstrap',
            icon: 'fas fa-wrench',
            variant: 'secondary',
            size: 'small',
            onClick: () => this.runBootstrap(),
        });
        bootstrapBtn.getElement().toggleAttribute('disabled', isRunning);
        this.actionArea.appendChild(bootstrapBtn.getElement());

        if (isRunning) {
            const spinner = document.createElement('div');
            Object.assign(spinner.style, {
                marginLeft: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--text-muted)',
                fontSize: '11px',
            });
            spinner.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Running...';
            this.actionArea.appendChild(spinner);
        }
    }

    private async runGenesis() {
        this.setPhase('genesis');
        this.addLog({ type: 'system', text: 'Initiating System Genesis...', timestamp: new Date() });
        // Execution logic would go here
    }

    private async runBootstrap() {
        this.setPhase('bootstrap');
        this.addLog({ type: 'system', text: 'Starting tool provisioning...', timestamp: new Date() });
        // Execution logic would go here
    }

    private setPhase(phase: GenesisPhase): void {
        this.phase = phase;
        if (this.phaseLabel) {
            this.phaseLabel.textContent = phase.toUpperCase();
        }
        this.renderActionButtons();
    }

    private addLog(entry: GenesisLogEntry): void {
        if (this.logs.length === 0 && this.logContainer) this.logContainer.innerHTML = '';
        this.logs.push(entry);
        
        const row = document.createElement('div');
        row.style.padding = '4px 8px';
        row.style.borderRadius = '4px';
        row.style.fontSize = '11px';
        row.style.background = 'rgba(255,255,255,0.03)';
        row.textContent = `[${entry.timestamp.toLocaleTimeString()}] ${entry.text}`;
        
        this.logContainer?.appendChild(row);
        this.logContainer?.scrollTo(0, this.logContainer.scrollHeight);
    }
}
