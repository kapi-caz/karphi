// Desktop "files" — the former terminal commands, now opened in Notepad.

export type Line = string | { text: string; url: string };

export type IconKind = 'text' | 'contact' | 'display' | 'admin' | 'readme';

export type AppKind = 'notepad' | 'display' | 'error';

export interface DesktopFile {
    id: string;
    /** Label under the desktop icon and in the window title. */
    name: string;
    icon: IconKind;
    app: AppKind;
    lines?: Line[];
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
            '  projects.txt   - Listet meine aktuellen Projekte auf.',
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
        name: 'projects.txt',
        icon: 'text',
        app: 'notepad',
        lines: [
            'PROJEKTE',
            '========',
            '',
            '1. Terminal Portfolio (Dieses Projekt) - React & Tailwind',
            '2. MuseMachine - Startup rund um bildgenerierende KI',
            '3. Fitti (in Entwicklung) - Ganz simple Android App um einfach einen Workout zu tracken mit einem Timer',
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

export const FileById: Record<string, DesktopFile> = Object.fromEntries(Files.map((f) => [f.id, f]));
