'use client'
import { useState } from 'react';
import { Themes, type ThemeColors } from '../data/themes';
import type { DesktopFile } from '../data/files';
import { FileIcon, FileLabel } from './Icons';

export function Explorer({ folder, items, onOpen }: {
    folder: DesktopFile;
    items: DesktopFile[];
    onOpen: (file: DesktopFile) => void;
}) {
    const [selected, setSelected] = useState<string | null>(null);
    const current = items.find((f) => f.id === selected);
    return (
        <div className="flex flex-col h-full">
            <div className="xp-menubar">
                {['Datei', 'Bearbeiten', 'Ansicht', 'Favoriten', 'Extras', '?'].map((m) => (
                    <span key={m}>{m}</span>
                ))}
            </div>
            <div className="explorer-address">
                <span className="opacity-70">Adresse</span>
                <div className="explorer-address-field">
                    <FileIcon kind="folder" size={16} />
                    <span>C:\Benutzer\Kapilan\Desktop\{folder.name}</span>
                </div>
            </div>
            <div className="flex flex-1 min-h-0">
                <aside className="explorer-sidebar">
                    <div className="explorer-sidebar-box">
                        <div className="explorer-sidebar-title">Details</div>
                        <div className="p-2 space-y-1">
                            <div className="font-bold">{current?.name ?? folder.name}</div>
                            <div className="opacity-70">{current ? 'Textdokument' : 'Dateiordner'}</div>
                        </div>
                    </div>
                </aside>
                <div className="explorer-grid" onPointerDown={() => setSelected(null)}>
                    {items.map((file) => (
                        <button
                            key={file.id}
                            className={`os-icon ${selected === file.id ? 'is-selected' : ''}`}
                            onPointerDown={(e) => {
                                e.stopPropagation();
                                setSelected(file.id);
                            }}
                            onPointerUp={(e) => e.pointerType === 'touch' && onOpen(file)}
                            onDoubleClick={() => onOpen(file)}
                            onKeyDown={(e) => e.key === 'Enter' && onOpen(file)}
                        >
                            <FileIcon kind={file.icon} image={file.image} glow={file.glow} size={42} />
                            <FileLabel name={file.name} />
                        </button>
                    ))}
                </div>
            </div>
            <div className="xp-statusbar">
                <span>{items.length} Objekt{items.length === 1 ? '' : 'e'}</span>
            </div>
        </div>
    );
}

// Markdown links: [label](https://…)
const LINK = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;

/** One line of text with Markdown links turned into anchors; everything else stays as written. */
function renderLine(line: string) {
    const parts: React.ReactNode[] = [];
    let last = 0;
    for (const m of line.matchAll(LINK)) {
        if (m.index > last) parts.push(line.slice(last, m.index));
        parts.push(
            <a key={m.index} href={m[2]} target="_blank" rel="noopener noreferrer">{m[1]}</a>,
        );
        last = m.index + m[0].length;
    }
    if (last < line.length) parts.push(line.slice(last));
    return parts.length ? parts : '\u00a0';
}

export function Notepad({ text }: { text: string }) {
    const lines = text.split('\n');
    // Column count is based on what's shown, i.e. link labels without the Markdown syntax.
    const longest = Math.max(0, ...lines.map((l) => l.replace(LINK, '$1').length));
    return (
        <div className="flex flex-col h-full">
            <div className="xp-menubar">
                {['Datei', 'Bearbeiten', 'Format', 'Ansicht', '?'].map((m) => (
                    <span key={m}>{m}</span>
                ))}
            </div>
            <div className="notepad-text" tabIndex={0}>
                {lines.map((line, i) => (
                    <div key={i}>{renderLine(line)}</div>
                ))}
            </div>
            <div className="xp-statusbar">
                <span>Zeile {lines.length}, Spalte {longest + 1}</span>
            </div>
        </div>
    );
}

function MiniDesktop({ c }: { c: ThemeColors }) {
    return (
        <div className="relative w-[180px] h-[120px] mx-auto">
            <div className="absolute inset-0 rounded-md bg-[#cfcfcf] border border-[#777] p-2 shadow-inner">
                <div
                    className="relative w-full h-full overflow-hidden"
                    style={{
                        background: `radial-gradient(120% 60% at 30% 110%, ${c.button} 0 45%, transparent 46%),
                                     radial-gradient(120% 70% at 90% 120%, ${c.border} 0 50%, transparent 51%),
                                     linear-gradient(${c.bg}, ${c.border})`,
                    }}
                >
                    <div className="absolute left-2 top-2 w-6 h-7 bg-white/90" />
                    <div className="absolute left-[30%] top-[18%] w-[55%] h-[45%] border-2" style={{ borderColor: c.border, background: c.bg }}>
                        <div className="h-2" style={{ background: c.border }} />
                        <div className="m-1 h-1 w-10" style={{ background: c.text }} />
                        <div className="mx-1 h-1 w-6" style={{ background: c.prompt }} />
                    </div>
                    <div className="absolute bottom-0 inset-x-0 h-2.5" style={{ background: c.border }}>
                        <div className="h-full w-6" style={{ background: c.button }} />
                    </div>
                </div>
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-16 h-3 bg-[#a9a9a9] rounded-b" />
        </div>
    );
}

export function DisplayProperties({ current, onApply, onClose }: {
    current: string;
    onApply: (key: string) => void;
    onClose: () => void;
}) {
    const [selected, setSelected] = useState(current);
    return (
        <div className="xp-dialog flex flex-col h-full">
            <div className="xp-tabs">
                <span className="is-active">Farbschema</span>
            </div>
            <div className="xp-panel flex-1 min-h-0 overflow-y-auto flex flex-col gap-5">
                <div className="pt-2 pb-3">
                    <MiniDesktop c={Themes[selected].colors} />
                </div>
                <fieldset className="xp-fieldset">
                    <legend>Farbschema</legend>
                    <div className="grid grid-cols-1 gap-1">
                        {Object.entries(Themes).map(([key, t]) => (
                            <label key={key} className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="theme" checked={selected === key} onChange={() => setSelected(key)} />
                                <span className="flex gap-[2px]">
                                    {[t.colors.bg, t.colors.border, t.colors.text, t.colors.prompt].map((col, i) => (
                                        <span key={i} className="w-3 h-3 border border-black/40" style={{ background: col }} />
                                    ))}
                                </span>
                                <span>{t.name}</span>
                            </label>
                        ))}
                    </div>
                </fieldset>
            </div>
            <div className="flex shrink-0 justify-end gap-2 p-3">
                <button className="xp-btn" onClick={() => { onApply(selected); onClose(); }}>OK</button>
                <button className="xp-btn" onClick={onClose}>Abbrechen</button>
                <button className="xp-btn" disabled={selected === current} onClick={() => onApply(selected)}>Übernehmen</button>
            </div>
        </div>
    );
}

export function ErrorDialog({ onClose }: { onClose: () => void }) {
    return (
        <div className="xp-dialog flex flex-col h-full">
            <div className="flex items-center gap-4 p-4 flex-1">
                <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden className="shrink-0">
                    <circle cx="16" cy="16" r="14" fill="#d93025" stroke="#fff" strokeWidth="2" />
                    <path d="M11 11l10 10M21 11L11 21" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                </svg>
                <p>Netter Versuch. Du hast hier keine Admin-Rechte.</p>
            </div>
            <div className="flex justify-center pb-3">
                <button className="xp-btn" autoFocus onClick={onClose}>OK</button>
            </div>
        </div>
    );
}
