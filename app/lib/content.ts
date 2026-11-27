// Server-only: reads the Markdown content of every Notepad file at build time.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { Files } from '../data/files';

const CONTENT_DIR = path.join(process.cwd(), 'content');

/** Map of file id → its text from /content. A missing file fails the build with a clear message. */
export function loadContents(): Record<string, string> {
    const contents: Record<string, string> = {};
    for (const file of Files) {
        if (!file.content) continue;
        const fullPath = path.join(CONTENT_DIR, file.content);
        try {
            contents[file.id] = readFileSync(fullPath, 'utf8').replace(/\r\n/g, '\n').replace(/\n+$/, '');
        } catch {
            throw new Error(`Content for "${file.name}" not found: content/${file.content}`);
        }
    }
    return contents;
}
