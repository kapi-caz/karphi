'use client'
import { useCallback, useState, type ReactNode } from 'react';
import { Themes } from '../data/themes';
import { useThemeKey } from '../lib/useTheme';
import BootScreen from './BootScreen';
import Desktop from './Desktop';

export default function Home({ texts, pages }: {
    texts: Record<string, string>;
    pages: Record<string, ReactNode>;
}) {
    const themeKey = useThemeKey();
    const theme = Themes[themeKey];
    const [phase, setPhase] = useState<'boot' | 'desktop'>('boot');
    // Bumping the key remounts the boot screen, so "Neu starten" replays it.
    const [bootId, setBootId] = useState(0);

    const finishBoot = useCallback(() => setPhase('desktop'), []);
    const reboot = useCallback(() => {
        setBootId((n) => n + 1);
        setPhase('boot');
    }, []);

    const c = theme.colors;
    const vars = {
        '--os-bg': c.bg,
        '--os-text': c.text,
        '--os-border': c.border,
        '--os-prompt': c.prompt,
        '--os-button': c.button,
    } as React.CSSProperties;

    return (
        <div style={vars} className={theme.bg}>
            {phase === 'boot' ? (
                <BootScreen key={bootId} theme={theme} onDone={finishBoot} />
            ) : (
                <Desktop themeKey={themeKey} texts={texts} pages={pages} onReboot={reboot} />
            )}
        </div>
    );
}
