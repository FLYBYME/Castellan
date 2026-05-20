import { BaseComponent } from '../BaseComponent';
import { SplitView } from './SplitView';
import { Tab } from '../navigation/Tab';
import { Stack } from './Stack';
import { Theme } from '../theme';

export interface DockingArea {
    id: string;
    tabs: { label: string; icon?: string; content: BaseComponent<unknown> | HTMLElement }[];
    activeTabIndex: number;
}

export interface DockingSystemProps {
    layout: 'horizontal' | 'vertical';
    areas: DockingArea[];
}

export class DockingSystem extends BaseComponent<DockingSystemProps> {
    private areaMap: Map<string, {
        tabs: Tab[];
        contentStack: Stack;
    }> = new Map();

    constructor(props: DockingSystemProps) {
        super('div', props);
        this.render();
    }

    public render(): void {
        this.element.innerHTML = '';
        this.areaMap.clear();
        const { layout, areas } = this.props;

        const panes = areas.map(area => this.createDockingArea(area));

        const mainSplit = new SplitView({
            orientation: layout,
            panes: panes,
            initialSizes: areas.map(() => 100 / areas.length)
        });

        this.applyStyles({ width: '100%', height: '100%' });
        this.appendChildren(mainSplit);
    }

    private createDockingArea(area: DockingArea): HTMLElement {
        const container = new Stack({ fill: true, direction: 'column' });
        const tabs: Tab[] = [];

        // Tab Header
        const header = new Stack({
            direction: 'row',
            height: '35px',
            width: '100%',
            align: 'center',
            padding: 'none',
        });

        Object.assign(header.getElement().style, {
            backgroundColor: Theme.colors.bgSecondary
        });

        const contentStack = new Stack({ fill: true, scrollable: true });

        area.tabs.forEach((t, i) => {
            const tab = new Tab({
                label: t.label,
                icon: t.icon,
                active: i === area.activeTabIndex,
                onClick: () => {
                    // Update internal state
                    area.activeTabIndex = i;
                    
                    // Update tab components
                    tabs.forEach((tabComp, idx) => {
                        tabComp.updateProps({ active: idx === i });
                    });

                    // Update content area
                    contentStack.getElement().innerHTML = '';
                    const newContent = area.tabs[i].content;
                    contentStack.appendChildren(newContent);
                }
            });
            tabs.push(tab);
            header.appendChildren(tab);
        });

        this.areaMap.set(area.id, { tabs, contentStack });

        // Content Area
        const activeContent = area.tabs[area.activeTabIndex].content;
        contentStack.appendChildren(activeContent);

        container.appendChildren(header, contentStack);
        return container.getElement();
    }
}