import Markdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import { visit } from 'unist-util-visit';
import { asset } from '../lib/asset';
import Carousel, { type Slide } from './Carousel';

// Renders a browser page (an .htm file) from its frontmatter + Markdown body.
// Used on the server at build time only; the carousel is the one interactive (client) part.

export const LAYOUTS = ['hero', 'split', 'gallery'] as const;
export type Layout = (typeof LAYOUTS)[number];

export interface PageMeta {
    layout?: Layout;
    header?: { image?: string; title?: string; subtitle?: string };
    footer?: { links?: { label: string; url: string }[] };
}

// Minimal shapes of the Markdown syntax tree nodes we touch.
interface MdNode {
    type: string;
    name?: string;
    url?: string;
    alt?: string | null;
    title?: string | null;
    value?: string;
    children?: MdNode[];
    data?: Record<string, unknown>;
}

/**
 * Turns `:::carousel … :::` blocks into a <carousel> element holding its images.
 * Any other `:name` that remark-directive picked up (e.g. "Hinweis:text") is put back as plain text.
 */
function remarkCarousel() {
    return (tree: MdNode) => {
        visit(tree as never, (node: MdNode) => {
            if (node.type === 'containerDirective' && node.name === 'carousel') {
                const slides: Slide[] = [];
                visit(node as never, 'image', (img: MdNode) => {
                    slides.push({ src: asset(img.url ?? ''), alt: img.alt ?? '', caption: img.title ?? '' });
                });
                node.data = { hName: 'carousel', hProperties: { dataSlides: JSON.stringify(slides) } };
                node.children = [];
            } else if (node.type === 'leafDirective' || node.type === 'containerDirective') {
                throw new Error(`Unknown block "${node.type === 'leafDirective' ? '::' : ':::'}${node.name}" in a page (supported: :::carousel)`);
            } else if (node.type === 'textDirective') {
                const label = (node.children ?? []).map((c) => c.value ?? '').join('');
                node.type = 'text';
                node.value = `:${node.name}${label ? `[${label}]` : ''}`;
                delete node.children;
            }
        });
    };
}

type Props = Record<string, unknown> & { node?: { children?: { type: string; tagName?: string; value?: string }[] } };

const components = {
    // A paragraph that only holds pictures becomes a plain block, so figures aren't nested in <p>.
    p: ({ node, children }: Props) => {
        const kids = node?.children ?? [];
        const onlyImages = kids.length > 0 && kids.every((k) =>
            (k.type === 'element' && k.tagName === 'img') || (k.type === 'text' && !k.value?.trim()));
        return onlyImages ? <>{children as React.ReactNode}</> : <p>{children as React.ReactNode}</p>;
    },
    img: ({ src, alt, title }: Props) => (
        <figure className="page-figure">
            {/* eslint-disable-next-line @next/next/no-img-element -- static export */}
            <img src={asset(String(src ?? ''))} alt={String(alt ?? '')} loading="lazy" />
            {title ? <figcaption>{String(title)}</figcaption> : null}
        </figure>
    ),
    a: ({ href, children }: Props) => (
        <a href={String(href ?? '')} target="_blank" rel="noopener noreferrer">{children as React.ReactNode}</a>
    ),
    carousel: (props: Props) => <Carousel slides={JSON.parse(String(props['data-slides'] ?? '[]'))} />,
} as unknown as Components;

export default function PageView({ meta, body }: { meta: PageMeta; body: string }) {
    const layout = meta.layout ?? 'hero';
    const { header, footer } = meta;
    return (
        <article className={`page layout-${layout}`}>
            {header && (header.title || header.image) && (
                <header className={`page-header ${header.image ? 'has-image' : ''}`}>
                    {header.image && (
                        // eslint-disable-next-line @next/next/no-img-element -- static export
                        <img className="page-header-image" src={asset(header.image)} alt="" />
                    )}
                    <div className="page-header-text">
                        {header.title && <h1>{header.title}</h1>}
                        {header.subtitle && <p>{header.subtitle}</p>}
                    </div>
                </header>
            )}
            <div className="page-body">
                <Markdown remarkPlugins={[remarkGfm, remarkDirective, remarkCarousel]} components={components}>
                    {body}
                </Markdown>
            </div>
            {footer?.links?.length ? (
                <footer className="page-footer">
                    {footer.links.map((link) => (
                        <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="page-link">
                            {link.label} <span aria-hidden>↗</span>
                        </a>
                    ))}
                </footer>
            ) : null}
        </article>
    );
}
