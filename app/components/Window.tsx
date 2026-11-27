'use client'
import { useRef, type ReactNode } from 'react';
import { FileIcon } from './Icons';
import type { IconKind } from '../data/files';

export interface WinState {
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
    z: number;
    minimized: boolean;
    maximized: boolean;
}

interface Props {
    win: WinState;
    title: string;
    icon: IconKind;
    image?: string;
    glow?: string;
    active: boolean;
    canMaximize?: boolean;
    onFocus: () => void;
    onMove: (x: number, y: number) => void;
    onMinimize: () => void;
    onToggleMaximize: () => void;
    onClose: () => void;
    children: ReactNode;
}

export const TASKBAR_HEIGHT = 36;

export default function Window({
    win, title, icon, image, glow, active, canMaximize = true,
    onFocus, onMove, onMinimize, onToggleMaximize, onClose, children,
}: Props) {
    const drag = useRef<{ dx: number; dy: number } | null>(null);

    const onPointerDown = (e: React.PointerEvent) => {
        if (win.maximized || (e.target as HTMLElement).closest('button')) return;
        drag.current = { dx: e.clientX - win.x, dy: e.clientY - win.y };
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: React.PointerEvent) => {
        if (!drag.current) return;
        const maxX = window.innerWidth - 80;
        const maxY = window.innerHeight - TASKBAR_HEIGHT - 30;
        const x = Math.min(maxX, Math.max(80 - win.w, e.clientX - drag.current.dx));
        const y = Math.min(maxY, Math.max(0, e.clientY - drag.current.dy));
        onMove(x, y);
    };

    const endDrag = () => {
        drag.current = null;
    };

    const style: React.CSSProperties = win.maximized
        ? { left: 0, top: 0, width: '100%', height: `calc(100% - ${TASKBAR_HEIGHT}px)`, zIndex: win.z }
        : { left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.z };

    return (
        <div
            role="dialog"
            aria-label={title}
            className={`xp-window ${active ? 'is-active' : ''} ${win.maximized ? 'is-max' : ''}`}
            style={{ ...style, display: win.minimized ? 'none' : undefined }}
            onPointerDown={onFocus}
        >
            <div
                className="xp-titlebar"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                onDoubleClick={canMaximize ? onToggleMaximize : undefined}
            >
                <FileIcon kind={icon} image={image} glow={glow} size={16} />
                <span className="xp-title">{title}</span>
                <div className="xp-controls">
                    <button className="xp-ctrl" aria-label="Minimieren" onClick={onMinimize}>
                        <svg width="9" height="9" viewBox="0 0 9 9"><rect x="1" y="6" width="5" height="2" fill="currentColor" /></svg>
                    </button>
                    {canMaximize && (
                        <button className="xp-ctrl" aria-label={win.maximized ? 'Wiederherstellen' : 'Maximieren'} onClick={onToggleMaximize}>
                            {win.maximized ? (
                                <svg width="9" height="9" viewBox="0 0 9 9"><path d="M2.5 .5h6v6M.5 2.5h6v6h-6z" fill="none" stroke="currentColor" strokeWidth="1.2" /></svg>
                            ) : (
                                <svg width="9" height="9" viewBox="0 0 9 9"><rect x=".75" y=".75" width="7.5" height="7.5" fill="none" stroke="currentColor" strokeWidth="1.5" /><rect x=".75" y=".75" width="7.5" height="2" fill="currentColor" /></svg>
                            )}
                        </button>
                    )}
                    <button className="xp-ctrl xp-close" aria-label="Schließen" onClick={onClose}>
                        <svg width="9" height="9" viewBox="0 0 9 9"><path d="M1 1l7 7M8 1L1 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                    </button>
                </div>
            </div>
            <div className="xp-window-body">{children}</div>
        </div>
    );
}
