import type { IconKind } from '../data/files';

/** Small XP-flavoured icons drawn in SVG, tinted with the active theme. */
export function FileIcon({ kind, size = 40 }: { kind: IconKind; size?: number }) {
    switch (kind) {
        case 'display':
            return (
                <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
                    <rect x="5" y="7" width="38" height="27" rx="3" fill="#d9d9d9" stroke="#555" strokeWidth="1.5" />
                    <rect x="9" y="11" width="30" height="19" fill="var(--os-border)" />
                    <circle cx="16" cy="24" r="6" fill="var(--os-button)" opacity=".85" />
                    <rect x="22" y="15" width="13" height="2.5" fill="var(--os-prompt)" />
                    <rect x="22" y="20" width="9" height="2.5" fill="var(--os-text)" opacity=".7" />
                    <rect x="18" y="34" width="12" height="5" fill="#a9a9a9" />
                    <rect x="12" y="39" width="24" height="3" rx="1.5" fill="#888" />
                </svg>
            );
        case 'folder':
            return (
                <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
                    <path d="M4 11a2 2 0 0 1 2-2h12l4 4h20a2 2 0 0 1 2 2v25a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" fill="#d9a521" stroke="#8a6410" strokeWidth="1.2" />
                    <rect x="9" y="15" width="30" height="20" fill="#fdfdfd" stroke="#9a9a9a" strokeWidth=".8" />
                    <rect x="12" y="19" width="16" height="2" fill="var(--os-border)" />
                    <rect x="12" y="24" width="22" height="2" fill="#9a9a9a" />
                    <path d="M4 20a2 2 0 0 1 2-2h36a2 2 0 0 1 2 2v20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" fill="#f5cd4f" stroke="#8a6410" strokeWidth="1.2" />
                    <path d="M5 21h38" stroke="#fff3c4" strokeWidth="1.2" opacity=".8" />
                </svg>
            );
        case 'admin':
            return (
                <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
                    <rect x="4" y="8" width="40" height="32" rx="3" fill="var(--os-bg)" stroke="var(--os-border)" strokeWidth="2" />
                    <rect x="4" y="8" width="40" height="7" rx="3" fill="var(--os-border)" />
                    <path d="M11 22l6 4-6 4" fill="none" stroke="var(--os-prompt)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x="20" y="29" width="10" height="2.5" fill="var(--os-text)" />
                    <circle cx="37" cy="33" r="7" fill="#d93025" stroke="#fff" strokeWidth="1.5" />
                    <path d="M34 30l6 6M40 30l-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                </svg>
            );
        default: {
            const accent = kind === 'readme' ? 'var(--os-prompt)' : kind === 'contact' ? 'var(--os-button)' : 'var(--os-border)';
            return (
                <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
                    <path d="M10 4h20l9 9v31H10z" fill="#fdfdfd" stroke="#6b6b6b" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M30 4v9h9" fill="#e4e4e4" stroke="#6b6b6b" strokeWidth="1.5" strokeLinejoin="round" />
                    <rect x="10.75" y="4.75" width="5" height="38.5" fill={accent} opacity=".9" />
                    {[18, 23, 28, 33, 38].map((y) => (
                        <rect key={y} x="19" y={y} width={y === 38 ? 10 : 16} height="2" fill="#8a8a8a" />
                    ))}
                    {kind === 'contact' && (
                        <g>
                            <circle cx="36" cy="38" r="8" fill="var(--os-button)" stroke="#fff" strokeWidth="1.5" />
                            <path d="M32 36l4 3 4-3M32 36v5h8v-5z" fill="none" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
                        </g>
                    )}
                    {kind === 'readme' && (
                        <g>
                            <circle cx="36" cy="38" r="8" fill="var(--os-prompt)" stroke="#fff" strokeWidth="1.5" />
                            <rect x="35" y="37" width="2.2" height="6" fill="var(--os-bg)" />
                            <circle cx="36.1" cy="34.3" r="1.3" fill="var(--os-bg)" />
                        </g>
                    )}
                </svg>
            );
        }
    }
}

/** Start-button glyph: a terminal prompt, a nod to where this all came from. */
export function StartGlyph() {
    return (
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
            <rect x="1" y="2" width="16" height="14" rx="2.5" fill="rgba(0,0,0,.35)" stroke="#fff" strokeWidth="1.2" />
            <path d="M4.5 6.5l3 2.5-3 2.5" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="9" y="11" width="4.5" height="1.6" fill="#fff" />
        </svg>
    );
}

/** File name with a soft line-break before the extension, so long names wrap as "MuseMachine" / ".txt". */
export function FileLabel({ name }: { name: string }) {
    const dot = name.lastIndexOf('.');
    if (dot <= 0) return <span>{name}</span>;
    return (
        <span>
            {name.slice(0, dot)}
            <wbr />
            {name.slice(dot)}
        </span>
    );
}
