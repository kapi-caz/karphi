'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Maximize2, Minimize2, X, Github, Linkedin, Mail } from 'lucide-react';

const themes = {
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
  }
};

const commands = {
  help: "Zeigt alle verfügbaren Befehle an.",
  about: "Erzählt dir etwas über mich.",
  skills: "Zeigt meine technischen Fähigkeiten.",
  projects: "Listet meine aktuellen Projekte auf.",
  contact: "Kontaktinformationen.",
  theme: "Wechselt das Farbschema (Klicken oder 'theme <name>' tippen).",
  clear: "Löscht den Terminal-Verlauf.",
  all: "Führt alle Befehle nacheinander aus (Showcase)."
};

export default function TerminalApp() {
  const [currentTheme, setCurrentTheme] = useState('retro');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState([
    { type: 'info', content: 'Initialisiere System...' },
    { type: 'info', content: 'Lade Benutzerprofil...' },
    { type: 'success', content: 'Willkommen im Interactive Portfolio Terminal v1.0.0' },
    { type: 'info', content: 'Tippe "help" ein, um eine Liste der Befehle zu sehen.' },
  ]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [commandHistory, setCommandHistory] = useState([]);
  
  const inputRef = useRef(null);
  const bottomRef = useRef(null);
  const theme = themes[currentTheme];

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  // Focus input on click anywhere
  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const processCommand = (cmd) => {
    const args = cmd.trim().split(' ');
    const mainCommand = args[0].toLowerCase();
    const newOutput = [...output, { type: 'command', content: cmd }];

    switch (mainCommand) {
      case 'help':
        newOutput.push({ type: 'response', content: 'Verfügbare Befehle:' });
        Object.entries(commands).forEach(([key, desc]) => {
          newOutput.push({ type: 'response', content: `  ${key.padEnd(12)} - ${desc}` });
        });
        break;

      case 'about':
        newOutput.push(
          { type: 'header', content: 'ÜBER MICH' },
          { type: 'response', content: 'Hallo! Hier wird mal mehr stehen...' }
        );
        break;

      case 'skills':
        newOutput.push(
          { type: 'header', content: 'TECH STACK' },
          { type: 'response', content: 'Frontend:  NextJS, Vue, Tailwind CSS, TypeScript' },
          { type: 'response', content: 'Backend:   Rust, NodeJS' },
          { type: 'response', content: 'Tools:     Git, Docker, MacOS, AWS, Azure, OpenTofu, Terraform' }
        );
        break;

      case 'projects':
        newOutput.push(
          { type: 'header', content: 'PROJEKTE' },
          { type: 'response', content: '1. Terminal Portfolio (Dieses Projekt) - React & Tailwind' },
          { type: 'response', content: '2. MuseMachine - Startup rund um bildgenerierende KI' },
          { type: 'response', content: '3. Fitti (in Entwicklung) - Ganz simple Android App um einfach einen Workout zu tracken mit einem Timer' }
        );
        break;

      case 'contact':
        newOutput.push(
          { type: 'header', content: 'KONTAKT' },
          { type: 'link', content: 'GitHub: github.com/kapi-caz', url: 'https://github.com/kapi-caz' },
          { type: 'link', content: 'LinkedIn: linkedin.com/in/kapilankoch', url: 'https://www.linkedin.com/in/kapilankoch/' }
        );
        break;

      case 'theme':
        const themeNames = Object.keys(themes);
        const requestedTheme = args[1]?.toLowerCase();
        
        if (requestedTheme && themeNames.includes(requestedTheme)) {
          setCurrentTheme(requestedTheme);
          newOutput.push({ type: 'success', content: `Theme gewechselt zu: ${themes[requestedTheme].name}` });
        } else {
          // Cycle to next theme if no argument
          const currentIndex = themeNames.indexOf(currentTheme);
          const nextTheme = themeNames[(currentIndex + 1) % themeNames.length];
          setCurrentTheme(nextTheme);
          newOutput.push({ type: 'success', content: `Theme gewechselt zu: ${themes[nextTheme].name}` });
          newOutput.push({ type: 'info', content: `Verfügbare Themes: ${themeNames.join(', ')}` });
        }
        break;

      case 'clear':
        setOutput([]);
        return; // Return early to avoid setting output with 'clear' command log

      case 'sudo':
        newOutput.push({ type: 'error', content: 'Netter Versuch. Du hast hier keine Admin-Rechte.' });
        break;

      case '':
        break;

      default:
        newOutput.push({ type: 'error', content: `Befehl nicht gefunden: ${mainCommand}. Tippe "help" für Hilfe.` });
    }

    setOutput(newOutput);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const command = input;
      setCommandHistory([...commandHistory, command]);
      setHistoryIndex(-1);
      setInput('');
      processCommand(command);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex + 1;
        if (newIndex < commandHistory.length) {
          setHistoryIndex(newIndex);
          setInput(commandHistory[commandHistory.length - 1 - newIndex]);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <div 
      className={`min-h-screen w-full flex items-center justify-center p-4 transition-colors duration-500 font-mono ${theme.bg} ${theme.selection}`}
      onClick={handleContainerClick}
    >
      <div className={`w-full max-w-[1024px] h-[80vh] md:h-[900px] flex flex-col rounded-lg overflow-hidden border-2 transition-colors duration-300 ${theme.border} ${theme.glow} bg-opacity-90 backdrop-blur-sm relative`}>
        
        {/* Window Header */}
        <div className={`h-8 border-b flex items-center justify-between px-3 ${theme.border} bg-opacity-50 select-none`}>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors cursor-pointer`}></div>
            <div className={`w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors cursor-pointer`}></div>
            <div className={`w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors cursor-pointer`}></div>
          </div>
          <div className={`text-xs opacity-70 font-bold tracking-widest ${theme.text}`}>user@portfolio:~</div>
          <div className="flex gap-2 opacity-50">
            <Minimize2 size={14} className={theme.text} />
            <Maximize2 size={14} className={theme.text} />
          </div>
        </div>

        {/* Terminal Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-hide text-sm md:text-base cursor-text" onClick={handleContainerClick}>
          
          {/* Output Log */}
          <div className="space-y-1">
            {output.map((line, i) => (
              <div key={i} className={`${theme.text} break-words`}>
                {line.type === 'command' && (
                  <div className="mt-4 flex">
                    <span className={`mr-2 font-bold ${theme.prompt}`}>➜</span>
                    <span className="opacity-90">{line.content}</span>
                  </div>
                )}
                
                {line.type === 'response' && (
                  <div className="ml-6 opacity-80 whitespace-pre-wrap">{line.content}</div>
                )}

                {line.type === 'header' && (
                  <div className={`mt-4 ml-6 font-bold text-lg underline decoration-2 underline-offset-4 mb-2 opacity-100`}>{line.content}</div>
                )}

                {line.type === 'success' && (
                  <div className="text-green-400 font-bold ml-6">✓ {line.content}</div>
                )}

                {line.type === 'error' && (
                  <div className="text-red-400 font-bold ml-6">✖ {line.content}</div>
                )}

                {line.type === 'info' && (
                  <div className="opacity-60 italic ml-6">&gt; {line.content}</div>
                )}

                {line.type === 'link' && (
                  <div className="ml-6">
                    <a href={line.url} target="_blank" rel="noopener noreferrer" className="underline hover:no-underline cursor-pointer hover:opacity-100 opacity-80 transition-opacity">
                      {line.content}
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Active Input Line */}
          <div className="flex mt-4 items-center">
            <span className={`mr-2 font-bold ${theme.prompt}`}>➜</span>
            <span className={`mr-2 font-bold ${theme.prompt} text-xs md:text-sm`}>~</span>
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className={`w-full bg-transparent outline-none border-none p-0 m-0 ${theme.text} font-mono caret-transparent`}
                autoFocus
                spellCheck="false"
                autoComplete="off"
              />
              {/* Custom blinking cursor to match theme */}
              <div 
                className={`absolute top-0 pointer-events-none ${theme.text}`}
                style={{ left: `${input.length}ch` }}
              >
                <span className="animate-pulse bg-current opacity-70 w-2.5 h-5 inline-block align-middle -mt-1"></span>
              </div>
            </div>
          </div>
          <div ref={bottomRef} />
        </div>

        {/* Footer Status Bar with Dropdown */}
        <div className={`h-6 border-t ${theme.border} bg-opacity-30 flex items-center justify-between px-4 text-xs ${theme.text} opacity-60`}>
          <span>BASH</span>
          <span className="hidden sm:inline">UTF-8</span>
          
          <div className="flex items-center">
             <select
              value={currentTheme}
              onChange={(e) => {
                const newTheme = e.target.value;
                setCurrentTheme(newTheme);
                setOutput(prev => [...prev, { type: 'success', content: `Theme gewechselt zu: ${themes[newTheme].name}` }]);
                // Re-focus input after selection so typing can continue immediately
                setTimeout(() => inputRef.current?.focus(), 10);
              }}
              className={`bg-transparent outline-none border-none cursor-pointer uppercase font-bold ${theme.text} hover:opacity-100 transition-opacity`}
              style={{ textAlignLast: 'right' }}
            >
              {Object.keys(themes).map((t) => (
                <option key={t} value={t} className="bg-gray-900 text-gray-100">
                  {t.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Quick Theme Switcher Hints (Visual Aid) - Keep for mobile users as a fallback */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 md:hidden opacity-50 hover:opacity-100 transition-opacity">
        <button onClick={() => processCommand('theme retro')} className="w-8 h-8 rounded-full bg-green-900 border border-green-500"></button>
        <button onClick={() => processCommand('theme cyberpunk')} className="w-8 h-8 rounded-full bg-purple-900 border border-pink-500"></button>
      </div>

      <style>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-hide {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </div>
  );
}