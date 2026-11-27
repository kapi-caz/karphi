'use client'
import { useRef, useState } from 'react';

export interface Slide {
    src: string;
    alt: string;
    caption: string;
}

/** Image slider: arrow buttons, dots, ←/→ keys and swiping on touch screens. */
export default function Carousel({ slides }: { slides: Slide[] }) {
    const [index, setIndex] = useState(0);
    const swipe = useRef<number | null>(null);
    if (!slides.length) return null;

    const count = slides.length;
    const go = (i: number) => setIndex((i + count) % count);
    const slide = slides[index];

    return (
        <figure
            className="page-carousel"
            role="group"
            aria-roledescription="Karussell"
            aria-label={`Bild ${index + 1} von ${count}`}
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'ArrowLeft') go(index - 1);
                if (e.key === 'ArrowRight') go(index + 1);
            }}
        >
            <div
                className="page-carousel-stage"
                onPointerDown={(e) => { swipe.current = e.clientX; }}
                onPointerUp={(e) => {
                    if (swipe.current === null) return;
                    const dx = e.clientX - swipe.current;
                    swipe.current = null;
                    if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
                }}
                onPointerCancel={() => { swipe.current = null; }}
            >
                <div className="page-carousel-track" style={{ transform: `translateX(-${index * 100}%)` }}>
                    {slides.map((s, i) => (
                        // eslint-disable-next-line @next/next/no-img-element -- static export
                        <img key={i} src={s.src} alt={s.alt} draggable={false} loading={i === 0 ? undefined : 'lazy'} aria-hidden={i !== index} />
                    ))}
                </div>
                {count > 1 && (
                    <>
                        <button className="page-carousel-arrow is-prev" aria-label="Vorheriges Bild" onClick={() => go(index - 1)}>‹</button>
                        <button className="page-carousel-arrow is-next" aria-label="Nächstes Bild" onClick={() => go(index + 1)}>›</button>
                    </>
                )}
            </div>
            <figcaption>
                <span>{slide.caption}</span>
                {count > 1 && (
                    <span className="page-carousel-dots">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                className={i === index ? 'is-active' : ''}
                                aria-label={`Bild ${i + 1}`}
                                aria-current={i === index}
                                onClick={() => go(i)}
                            />
                        ))}
                    </span>
                )}
            </figcaption>
        </figure>
    );
}
