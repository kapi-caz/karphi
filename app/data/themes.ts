export const Themes: ThemeMap = {
    retro: {
        name: 'Retro Green',
        bg: 'bg-black',
        text: 'text-green-500',
        border: 'border-green-700',
        prompt: 'text-green-300',
        selection: 'selection:bg-green-900 selection:text-green-100',
        button: 'bg-green-500',
        glow: 'shadow-[0_0_20px_rgba(34,197,94,0.2)]'
    },
    cyberpunk: {
        name: 'Neon City',
        bg: 'bg-slate-900',
        text: 'text-pink-400',
        border: 'border-pink-500',
        prompt: 'text-cyan-400',
        selection: 'selection:bg-pink-900 selection:text-white',
        button: 'bg-pink-500',
        glow: 'shadow-[0_0_20px_rgba(244,114,182,0.3)]'
    },
    dracula: {
        name: 'Dracula',
        bg: 'bg-[#282a36]',
        text: 'text-[#f8f8f2]',
        border: 'border-[#6272a4]',
        prompt: 'text-[#50fa7b]',
        selection: 'selection:bg-[#44475a]',
        button: 'bg-[#bd93f9]',
        glow: 'shadow-[0_0_20px_rgba(189,147,249,0.2)]'
    },
    ubuntu: {
        name: 'Ubuntu',
        bg: 'bg-[#300a24]',
        text: 'text-white',
        border: 'border-[#E95420]',
        prompt: 'text-[#E95420]',
        selection: 'selection:bg-[#E95420]',
        button: 'bg-[#E95420]',
        glow: 'shadow-xl'
    },
    gruvbox: {
        name: 'Gruvbox',
        bg: 'bg-[#282828]',                    // Gruvbox dark background
        text: 'text-[#ebdbb2]',                // Gruvbox light text
        border: 'border-[#458588]',            // Gruvbox blue
        prompt: 'text-[#fabd2f]',              // Gruvbox yellow (prompt accent)
        selection: 'selection:bg-[#504945] selection:text-[#fbf1c7]', // Muted selection
        button: 'bg-[#b8bb26]',                // Gruvbox green
        glow: 'shadow-[0_0_20px_rgba(184,187,38,0.2)]' // Gruvbox green glow
    }
};

export interface Theme {
    name: string;
    bg: string;
    text: string;
    border: string;
    prompt: string;
    selection: string;
    button: string;
    glow: string;
}

export interface ThemeMap {
    [key: string]: Theme;
}