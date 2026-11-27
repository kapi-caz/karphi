// Desktop "files" — the former terminal commands, now opened in Notepad.
// The text of each file lives in /content as Markdown and is read at build time
// (see app/lib/content.tsx). `.txt` files open in Notepad (plain text),
// `.htm` files open in the browser window as a styled page with pictures.

export type IconKind = 'text' | 'contact' | 'display' | 'admin' | 'readme' | 'folder' | 'web';

export type AppKind = 'notepad' | 'display' | 'error' | 'explorer' | 'browser';

export interface DesktopFile {
    id: string;
    /** Label under the desktop icon and in the window title. */
    name: string;
    icon: IconKind;
    /** Optional custom icon from /public (e.g. '/my_icon.svg'); replaces the drawn icon. */
    image?: string;
    /** Optional glow colour; makes the icon softly pulse with a glow (e.g. '#0FFEC5'). */
    glow?: string;
    app: AppKind;
    /**
     * Path of a Markdown file inside /content (e.g. 'projects/fitti.md').
     * - app 'notepad': shown as plain text; [label](https://…) links become clickable.
     * - app 'browser': a page with frontmatter (layout, header, footer) and a Markdown body
     *   with images and :::carousel blocks — see content/README.md.
     */
    content?: string;
    /** Id of the folder this file lives in. Files without a parent sit on the desktop. */
    parent?: string;
    width?: number;
    height?: number;
}

export const Files: DesktopFile[] = [
    {
        id: 'readme',
        name: 'Liesmich.txt',
        icon: 'readme',
        app: 'notepad',
        content: 'liesmich.md',
    },
    {
        id: 'about',
        name: 'about.txt',
        icon: 'text',
        app: 'notepad',
        content: 'about.md',
    },
    {
        id: 'skills',
        name: 'skills.txt',
        icon: 'text',
        app: 'notepad',
        content: 'skills.md',
    },
    {
        id: 'projects',
        name: 'Projekte',
        icon: 'folder',
        app: 'explorer',
        width: 560,
        height: 360,
    },
    {
        id: 'project-terminal-portfolio',
        name: 'Terminal-Portfolio.txt',
        icon: 'text',
        app: 'notepad',
        parent: 'projects',
        content: 'projects/terminal-portfolio.md',
    },
    {
        id: 'project-musemachine',
        name: 'MuseMachine.htm',
        icon: 'web',
        image: '/musemachine_logo.svg',
        glow: '#0FFEC5',
        app: 'browser',
        width: 720,
        height: 520,
        parent: 'projects',
        content: 'projects/musemachine.md',
    },
    {
        id: 'project-fitti',
        name: 'Fitti.txt',
        icon: 'text',
        app: 'notepad',
        parent: 'projects',
        content: 'projects/fitti.md',
    },
    {
        id: 'project-coming-soon',
        name: 'Coming soon.txt',
        icon: 'text',
        image: '/coming_soon.svg',
        app: 'notepad',
        parent: 'projects',
        content: 'projects/coming-soon.md',
    },
    {
        id: 'contact',
        name: 'kontakt.txt',
        icon: 'contact',
        app: 'notepad',
        content: 'kontakt.md',
    },
    {
        id: 'display',
        name: 'Anzeige',
        icon: 'display',
        app: 'display',
        width: 380,
        height: 500,
    },
    {
        id: 'sudo',
        name: 'sudo.exe',
        icon: 'admin',
        app: 'error',
        width: 340,
        height: 150,
    },
];

/** Files placed directly on the desktop. */
export const DesktopFiles = Files.filter((f) => !f.parent);

export const childrenOf = (folderId: string) => Files.filter((f) => f.parent === folderId);

export const FileById: Record<string, DesktopFile> = Object.fromEntries(Files.map((f) => [f.id, f]));

/** Windows-style path of a file, e.g. C:\Benutzer\Kapilan\Desktop\Projekte\Fitti.txt */
export function pathOf(file: DesktopFile): string {
    const parts = [file.name];
    for (let p = file.parent; p; p = FileById[p]?.parent) parts.unshift(FileById[p]?.name ?? p);
    return ['C:', 'Benutzer', 'Kapilan', 'Desktop', ...parts].join('\\');
}
