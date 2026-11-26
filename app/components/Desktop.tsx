'use client'
import { useEffect, useState } from 'react';
import { Files, FileById, type DesktopFile } from '../data/files';
import { Themes } from '../data/themes';
import { setTheme } from '../lib/useTheme';
import Window, { TASKBAR_HEIGHT, type WinState } from './Window';
import { Notepad, DisplayProperties, ErrorDialog } from './Apps';
import { FileIcon, StartGlyph } from './Icons';

const MOBILE_BREAKPOINT = 640;

function useClock() {
    const [now, setNow] = useState<Date | null>(null);
    useEffect(() => {
        const tick = () => setNow(new Date());
        const first = setTimeout(tick, 0);
        const id = setInterval(tick, 15_000);
        return () => {
            clearTimeout(first);
            clearInterval(id);
        };
    }, []);
    return now;
}

export default function Desktop({ themeKey, onReboot }: { themeKey: string; onReboot: () => void }) {
    const [windows, setWindows] = useState<WinState[]>([]);
    const [selected, setSelected] = useState<string | null>(null);
    const [startOpen, setStartOpen] = useState(false);
    const now = useClock();

    const topZ = windows.reduce((m, w) => Math.max(m, w.z), 10);
    const activeId = windows.filter((w) => !w.minimized).sort((a, b) => b.z - a.z)[0]?.id ?? null;

    const update = (id: string, patch: Partial<WinState>) =>
        setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, ...patch } : w)));

    const focus = (id: string) =>
        setWindows((ws) => {
            const max = ws.reduce((m, w) => Math.max(m, w.z), 10);
            return ws.map((w) => (w.id === id && w.z !== max ? { ...w, z: max + 1 } : w));
        });

    const open = (file: DesktopFile) => {
        setStartOpen(false);
        setSelected(file.id);
        const existing = windows.find((w) => w.id === file.id);
        if (existing) {
            update(file.id, { minimized: false, z: topZ + 1 });
            return;
        }
        const vw = window.innerWidth;
        const vh = window.innerHeight - TASKBAR_HEIGHT;
        const mobile = vw < MOBILE_BREAKPOINT;
        const w = Math.min(file.width ?? 560, vw - 16);
        const h = Math.min(file.height ?? 380, vh - 16);
        const n = windows.length;
        const x = Math.max(8, Math.min(vw - w - 8, 140 + n * 28));
        const y = Math.max(8, Math.min(vh - h - 8, 40 + n * 28));
        setWindows((ws) => [
            ...ws,
            { id: file.id, x, y, w, h, z: topZ + 1, minimized: false, maximized: mobile && file.app === 'notepad' },
        ]);
    };

    const close = (id: string) => setWindows((ws) => ws.filter((w) => w.id !== id));

    const onTaskbarClick = (win: WinState) => {
        if (win.id === activeId) update(win.id, { minimized: true });
        else update(win.id, { minimized: false, z: topZ + 1 });
    };

    // Escape closes the start menu.
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setStartOpen(false);
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    const renderApp = (file: DesktopFile) => {
        switch (file.app) {
            case 'notepad':
                return <Notepad lines={file.lines ?? []} />;
            case 'display':
                return <DisplayProperties current={themeKey} onApply={setTheme} onClose={() => close(file.id)} />;
            case 'error':
                return <ErrorDialog onClose={() => close(file.id)} />;
        }
    };

    const titleFor = (file: DesktopFile) =>
        file.app === 'notepad' ? `${file.name} - Editor`
            : file.app === 'display' ? 'Eigenschaften von Anzeige'
                : 'sudo.exe - Zugriff verweigert';

    return (
        <div className="os-root os-boot-in" onPointerDown={() => setStartOpen(false)}>
            {/* Wallpaper */}
            <div className="os-wallpaper" aria-hidden />

            {/* Desktop icons */}
            <div className="os-icons" onPointerDown={() => setSelected(null)}>
                {Files.map((file) => (
                    <button
                        key={file.id}
                        className={`os-icon ${selected === file.id ? 'is-selected' : ''}`}
                        onPointerDown={(e) => {
                            e.stopPropagation();
                            setStartOpen(false);
                            setSelected(file.id);
                        }}
                        onPointerUp={(e) => e.pointerType === 'touch' && open(file)}
                        onDoubleClick={() => open(file)}
                        onKeyDown={(e) => e.key === 'Enter' && open(file)}
                    >
                        <FileIcon kind={file.icon} size={42} />
                        <span>{file.name}</span>
                    </button>
                ))}
            </div>

            {/* Windows */}
            {windows.map((win) => {
                const file = FileById[win.id];
                return (
                    <Window
                        key={win.id}
                        win={win}
                        title={titleFor(file)}
                        icon={file.icon}
                        active={win.id === activeId}
                        canMaximize={file.app === 'notepad'}
                        onFocus={() => focus(win.id)}
                        onMove={(x, y) => update(win.id, { x, y })}
                        onMinimize={() => update(win.id, { minimized: true })}
                        onToggleMaximize={() => update(win.id, { maximized: !win.maximized })}
                        onClose={() => close(win.id)}
                    >
                        {renderApp(file)}
                    </Window>
                );
            })}

            {/* Start menu */}
            {startOpen && (
                <div className="xp-start-menu" onPointerDown={(e) => e.stopPropagation()}>
                    <div className="xp-start-header">
                        <div className="xp-avatar">KK</div>
                        <span>Kapilan Koch</span>
                    </div>
                    <div className="xp-start-body">
                        <ul className="xp-start-left">
                            {Files.filter((f) => f.app === 'notepad').map((file) => (
                                <li key={file.id}>
                                    <button onClick={() => open(file)}>
                                        <FileIcon kind={file.icon} size={28} />
                                        <span>{file.name}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <ul className="xp-start-right">
                            <li className="xp-start-caption">Farbschema</li>
                            {Object.entries(Themes).map(([key, t]) => (
                                <li key={key}>
                                    <button onClick={() => setTheme(key)} className={key === themeKey ? 'is-current' : ''}>
                                        <span className="xp-swatch" style={{ background: t.colors.border, borderColor: t.colors.text }} />
                                        <span>{t.name}</span>
                                        {key === themeKey && <span className="ml-auto">✓</span>}
                                    </button>
                                </li>
                            ))}
                            <li className="xp-start-sep" />
                            <li>
                                <button onClick={() => open(FileById.display)}>
                                    <FileIcon kind="display" size={22} />
                                    <span>Anzeige...</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div className="xp-start-footer">
                        <button onClick={onReboot}>
                            <span className="xp-power" aria-hidden>⏻</span>
                            Neu starten
                        </button>
                    </div>
                </div>
            )}

            {/* Taskbar */}
            <div className="xp-taskbar" style={{ height: TASKBAR_HEIGHT }}>
                <button
                    className={`xp-start ${startOpen ? 'is-open' : ''}`}
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() => setStartOpen((o) => !o)}
                >
                    <StartGlyph />
                    <span>start</span>
                </button>
                <div className="xp-tasks">
                    {windows.map((win) => {
                        const file = FileById[win.id];
                        return (
                            <button
                                key={win.id}
                                className={`xp-task ${win.id === activeId ? 'is-active' : ''}`}
                                onClick={() => onTaskbarClick(win)}
                            >
                                <FileIcon kind={file.icon} size={16} />
                                <span>{file.name}</span>
                            </button>
                        );
                    })}
                </div>
                <div className="xp-tray">
                    <button
                        className="xp-tray-theme"
                        title={`Farbschema: ${Themes[themeKey].name}`}
                        onClick={() => open(FileById.display)}
                    >
                        <span className="xp-swatch" style={{ background: Themes[themeKey].colors.button }} />
                    </button>
                    <span suppressHydrationWarning>
                        {now ? now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                </div>
            </div>
        </div>
    );
}
