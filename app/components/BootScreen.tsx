'use client'
import { useEffect, useRef, useState } from 'react';
import type { Theme } from '../data/themes';

const BOOT_LINES: { text: string; type?: 'ok' | 'info' | 'head' }[] = [
    { text: 'KARPHI BIOS v2.0.26  (c) 2026 Kapilan Koch', type: 'head' },
    { text: 'CPU: Neural Coffee Engine @ 4.20 GHz' },
    { text: 'Speichertest: 655360K ... OK', type: 'ok' },
    { text: 'Erkenne Laufwerke ... C:\\ D:\\', type: 'ok' },
    { text: 'Lade Kernel karphi-os 6.6.6 ...' },
    { text: 'Mounte /home/kapilan ...', type: 'ok' },
    { text: 'Starte Dienste: network, coffee, motivation ...', type: 'ok' },
    { text: 'Initialisiere System...', type: 'info' },
    { text: 'Lade Benutzerprofil...', type: 'info' },
    { text: 'Lade Desktop: about.txt, skills.txt, Projekte, kontakt.txt', type: 'ok' },
    { text: 'Starte grafische Oberfläche ...', type: 'info' },
];

const TICK_MS = 70;

export default function BootScreen({ theme, onDone }: { theme: Theme; onDone: () => void }) {
    const [progress, setProgress] = useState(0);
    const doneRef = useRef(onDone);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        doneRef.current = onDone;
    }, [onDone]);

    // Advance the progress bar; finish shortly after reaching 100%.
    useEffect(() => {
        let finishTimer: ReturnType<typeof setTimeout> | undefined;
        const interval = setInterval(() => {
            setProgress((p) => {
                const next = Math.min(100, p + 1 + Math.random() * 3.5);
                if (next >= 100 && !finishTimer) {
                    clearInterval(interval);
                    finishTimer = setTimeout(() => doneRef.current(), 700);
                }
                return next;
            });
        }, TICK_MS);
        return () => {
            clearInterval(interval);
            if (finishTimer) clearTimeout(finishTimer);
        };
    }, []);

    // Any key / click skips the boot.
    useEffect(() => {
        const skip = () => doneRef.current();
        window.addEventListener('keydown', skip);
        return () => window.removeEventListener('keydown', skip);
    }, []);

    const visibleLines = Math.min(BOOT_LINES.length, Math.floor((progress / 100) * (BOOT_LINES.length + 1)));

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ block: 'end' });
    }, [visibleLines]);

    const pct = Math.floor(progress);
    const barCells = 30;
    const filled = Math.round((pct / 100) * barCells);

    return (
        <div
            className={`min-h-screen w-full flex items-center justify-center p-4 font-mono ${theme.bg} ${theme.selection} cursor-pointer`}
            onClick={() => doneRef.current()}
        >
            <div
                className={`w-full max-w-[1024px] h-[80vh] md:h-[700px] flex flex-col rounded-lg overflow-hidden border-2 ${theme.border} ${theme.glow}`}
            >
                <div className={`h-8 border-b flex items-center justify-between px-3 ${theme.border} select-none`}>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className={`text-xs opacity-70 font-bold tracking-widest ${theme.text}`}>user@portfolio:~</div>
                    <div className="w-12" />
                </div>

                <div className={`flex-1 overflow-y-auto p-4 md:p-6 text-sm md:text-base ${theme.text} space-y-1 scrollbar-hide`}>
                    {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
                        <div key={i} className="boot-line break-words">
                            {line.type === 'head' && <div className="font-bold mb-3">{line.text}</div>}
                            {line.type === 'ok' && (
                                <div className="opacity-80">
                                    <span className={`font-bold ${theme.prompt}`}>[ OK ]</span> {line.text}
                                </div>
                            )}
                            {line.type === 'info' && <div className="opacity-60 italic">&gt; {line.text}</div>}
                            {!line.type && <div className="opacity-80">{line.text}</div>}
                        </div>
                    ))}
                    {pct < 100 && <span className="animate-pulse bg-current opacity-70 w-2.5 h-5 inline-block align-middle" />}
                    <div ref={bottomRef} />
                </div>

                <div className={`border-t ${theme.border} px-4 md:px-6 py-4 ${theme.text}`}>
                    <div className="flex justify-between text-xs md:text-sm mb-2">
                        <span>{pct < 100 ? 'Lade karphi-os ...' : 'Bereit.'}</span>
                        <span className="font-bold">{pct}%</span>
                    </div>
                    <div className={`h-5 border ${theme.border} p-[2px] flex gap-[2px]`} aria-hidden>
                        {Array.from({ length: barCells }, (_, i) => (
                            <div
                                key={i}
                                className={`flex-1 ${i < filled ? theme.button : ''} ${i < filled ? 'opacity-90' : 'opacity-0'}`}
                            />
                        ))}
                    </div>
                    <div
                        role="progressbar"
                        aria-valuenow={pct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        className="sr-only"
                    />
                    <div className="mt-2 text-[11px] opacity-50">Taste drücken oder klicken zum Überspringen</div>
                </div>
            </div>
        </div>
    );
}
