export const Themes: ThemeMap = {
    retro: {
        name: 'Retro Green',
        bg: 'bg-black',
        text: 'text-green-500',
        border: 'border-green-700',
        prompt: 'text-green-300',
        selection: 'selection:bg-green-900 selection:text-green-100',
        button: 'bg-green-500',
        glow: 'shadow-[0_0_20px_rgba(34,197,94,0.2)]',
        colors: { bg: '#000000', text: '#22c55e', border: '#15803d', prompt: '#86efac', button: '#22c55e' }
    },
    cyberpunk: {
        name: 'Neon City',
        bg: 'bg-slate-900',
        text: 'text-pink-400',
        border: 'border-pink-500',
        prompt: 'text-cyan-400',
        selection: 'selection:bg-pink-900 selection:text-white',
        button: 'bg-pink-500',
        glow: 'shadow-[0_0_20px_rgba(244,114,182,0.3)]',
        colors: { bg: '#0f172a', text: '#f472b6', border: '#ec4899', prompt: '#22d3ee', button: '#ec4899' }
    },
    dracula: {
        name: 'Dracula',
        bg: 'bg-[#282a36]',
        text: 'text-[#f8f8f2]',
        border: 'border-[#6272a4]',
        prompt: 'text-[#50fa7b]',
        selection: 'selection:bg-[#44475a]',
        button: 'bg-[#bd93f9]',
        glow: 'shadow-[0_0_20px_rgba(189,147,249,0.2)]',
        colors: { bg: '#282a36', text: '#f8f8f2', border: '#6272a4', prompt: '#50fa7b', button: '#bd93f9' }
    },
    ubuntu: {
        name: 'Ubuntu',
        bg: 'bg-[#300a24]',
        text: 'text-white',
        border: 'border-[#E95420]',
        prompt: 'text-[#E95420]',
        selection: 'selection:bg-[#E95420]',
        button: 'bg-[#E95420]',
        glow: 'shadow-xl',
        colors: { bg: '#300a24', text: '#ffffff', border: '#E95420', prompt: '#E95420', button: '#E95420' }
    },
    gruvbox: {
        name: 'Gruvbox',
        bg: 'bg-[#282828]',                    // Gruvbox dark background
        text: 'text-[#ebdbb2]',                // Gruvbox light text
        border: 'border-[#458588]',            // Gruvbox blue
        prompt: 'text-[#fabd2f]',              // Gruvbox yellow (prompt accent)
        selection: 'selection:bg-[#504945] selection:text-[#fbf1c7]', // Muted selection
        button: 'bg-[#b8bb26]',                // Gruvbox green
        glow: 'shadow-[0_0_20px_rgba(184,187,38,0.2)]', // Gruvbox green glow
        colors: { bg: '#282828', text: '#ebdbb2', border: '#458588', prompt: '#fabd2f', button: '#b8bb26' }
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
    /** Raw hex values, used for the desktop chrome (gradients, CSS variables). */
    colors: ThemeColors;
}

export interface ThemeColors {
    bg: string;
    text: string;
    border: string;
    prompt: string;
    button: string;
}

export interface ThemeMap {
    [key: string]: Theme;
}