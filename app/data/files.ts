// Desktop "files" — the former terminal commands, now opened in Notepad.

export type Line = string | { text: string; url: string };

export type IconKind = 'text' | 'contact' | 'display' | 'admin' | 'readme' | 'folder';

export type AppKind = 'notepad' | 'display' | 'error' | 'explorer';

export interface DesktopFile {
    id: string;
    /** Label under the desktop icon and in the window title. */
    name: string;
    icon: IconKind;
    app: AppKind;
    lines?: Line[];
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
        lines: [
            'WILLKOMMEN BEI KARPHI OS',
            '========================',
            '',
            'Doppelklick auf eine Datei öffnet sie.',
            '',
            '  about.txt      - Erzählt dir etwas über mich.',
            '  skills.txt     - Zeigt meine technischen Fähigkeiten.',
            '  Projekte       - Ordner mit meinen aktuellen Projekten.',
            '  kontakt.txt    - Kontaktinformationen.',
            '  Anzeige        - Wechselt das Farbschema.',
            '',
            'Über "Start" kannst du das System auch neu starten.',
        ],
    },
    {
        id: 'about',
        name: 'about.txt',
        icon: 'text',
        app: 'notepad',
        lines: ['ÜBER MICH', '=========', '', 'Hallo! Hier wird mal mehr stehen...'],
    },
    {
        id: 'skills',
        name: 'skills.txt',
        icon: 'text',
        app: 'notepad',
        lines: [
            'TECH STACK',
            '==========',
            '',
            'Frontend:  NextJS, VueJS, Tailwind CSS, TypeScript',
            'Backend:   Rust, NodeJS, Golang',
            'Tools:     Git, Docker, MacOS, AWS, Azure, OpenTofu, Terraform',
        ],
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
        lines: [
            'TERMINAL PORTFOLIO',
            '==================',
            '',
            'Dieses Projekt.',
            '',
            'Stack: React & Tailwind',
        ],
    },
    {
        id: 'project-musemachine',
        name: 'MuseMachine.txt',
        icon: 'text',
        app: 'notepad',
        parent: 'projects',
        lines: [
            'MUSEMACHINE',
            '===========',
            '',
            'Startup rund um bildgenerierende KI.',
        ],
    },
    {
        id: 'project-fitti',
        name: 'Fitti.txt',
        icon: 'text',
        app: 'notepad',
        parent: 'projects',
        lines: [
            'FITTI',
            '=====',
            '',
            'Status: in Entwicklung',
            '',
            'Ganz simple Android App um einfach einen Workout zu tracken mit einem Timer.',
        ],
    },
    {
        id: 'contact',
        name: 'kontakt.txt',
        icon: 'contact',
        app: 'notepad',
        lines: [
            'KONTAKT',
            '=======',
            '',
            { text: 'GitHub:   github.com/kapi-caz', url: 'https://github.com/kapi-caz' },
            { text: 'LinkedIn: linkedin.com/in/kapilankoch', url: 'https://www.linkedin.com/in/kapilankoch/' },
        ],
    },
    {
        id: 'display',
        name: 'Anzeige',
        icon: 'display',
        app: 'display',
        width: 380,
        height: 430,
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
