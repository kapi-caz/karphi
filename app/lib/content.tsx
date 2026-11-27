import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import type { ReactNode } from 'react';
import matter from 'gray-matter';
import { Files, type DesktopFile } from '../data/files';
import PageView, { LAYOUTS, type PageMeta } from '../components/PageView';

// Server-only: runs at build time (static export). Never import this from a client component.

const CONTENT_DIR = path.join(process.cwd(), 'content');
const PUBLIC_DIR = path.join(process.cwd(), 'public');

export interface Contents {
    /** Plain Notepad texts by file id. */
    texts: Record<string, string>;
    /** Rendered browser pages by file id. */
    pages: Record<string, ReactNode>;
}

function read(file: DesktopFile): string {
    const fullPath = path.join(CONTENT_DIR, file.content!);
    try {
        return readFileSync(fullPath, 'utf8').replace(/\r\n/g, '\n');
    } catch {
        throw new Error(`Content for "${file.name}" not found: content/${file.content}`);
    }
}

/** Fails the build when a page points at a picture that isn't in /public. */
function checkImages(file: DesktopFile, meta: PageMeta, body: string) {
    const srcs = [meta.header?.image, ...[...body.matchAll(/!\[[^\]]*\]\(\s*<?([^)\s>]+)/g)].map((m) => m[1])];
    for (const src of srcs) {
        if (!src || !src.startsWith('/') || src.startsWith('//')) continue;
        if (!existsSync(path.join(PUBLIC_DIR, decodeURI(src)))) {
            throw new Error(`Image in content/${file.content} not found: public${src}`);
        }
    }
}

function checkMeta(file: DesktopFile, meta: PageMeta) {
    const where = `content/${file.content}`;
    if (meta.layout && !LAYOUTS.includes(meta.layout)) {
        throw new Error(`${where}: unknown layout "${meta.layout}" (use one of: ${LAYOUTS.join(', ')})`);
    }
    for (const link of meta.footer?.links ?? []) {
        if (!link?.label || !link?.url) throw new Error(`${where}: every footer link needs a label and a url`);
    }
}

export function loadContents(): Contents {
    const texts: Record<string, string> = {};
    const pages: Record<string, ReactNode> = {};
    for (const file of Files) {
        if (!file.content) continue;
        const raw = read(file);
        if (file.app === 'browser') {
            const { data, content: body } = matter(raw);
            const meta = data as PageMeta;
            checkMeta(file, meta);
            checkImages(file, meta, body);
            pages[file.id] = <PageView meta={meta} body={body} />;
        } else {
            texts[file.id] = raw.replace(/\n+$/, '');
        }
    }
    return { texts, pages };
}
