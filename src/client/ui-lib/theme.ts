// ui-lib/theme.ts — High-Fidelity Enterprise Theme

export const Theme = {
    colors: {
        // Core surfaces
        accent: 'var(--accent, #007acc)',
        bgPrimary: 'var(--bg-primary, #0a0a0c)',
        bgPanel: 'var(--bg-panel, #1e1e1e)',
        bgSecondary: 'var(--bg-sidebar, #252526)',
        bgTertiary: 'var(--bg-input, #2d2d30)',
        border: 'var(--border, #3e3e42)',
        
        // Glassmorphism
        glassBg: 'rgba(20, 22, 30, 0.4)',
        glassBorder: 'rgba(255, 255, 255, 0.1)',
        glassShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        blur: 'blur(12px) saturate(180%)',

        // Text
        textMain: 'var(--text-main, #cccccc)',
        textMuted: 'var(--text-muted, #888888)',
        textHeading: 'var(--text-heading, #ffffff)',

        // Semantic
        success: 'var(--success, #4caf50)',
        warning: 'var(--warning, #ff9800)',
        error: 'var(--error, #f44336)',
        info: 'var(--info, #007acc)',

        // Status indicators
        statusOk: '#4caf50',
        statusWarn: '#ff9800',
        statusCrit: '#f44336',
    },
    spacing: {
        none: '0',
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '20px',
        xl: '32px',
    },
    radius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        full: '9999px',
    },
    font: {
        family: 'var(--font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif)',
        mono: 'var(--font-mono, "JetBrains Mono", "Fira Code", "Cascadia Code", monospace)',
        sizeBase: '13px',
        sizeSm: '11px',
        sizeXs: '9px',
    },
    transitions: {
        default: 'all 0.2s ease',
        smooth: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    }
};

// Legacy compatibility
Object.defineProperty(Theme.colors, 'bgPrimary', { get: () => Theme.colors.bgPanel });