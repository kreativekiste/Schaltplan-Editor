// www.kreativekiste.de // 08.04.2026 // Modul: Klemmen & Verbindungen

window.ComponentRegistry.register('klemme', {
    folder: 'klemmen', // <-- Das sortiert es in den Ordner "klemmen" ein
    title: 'Klemme',
    defaultData: { terminals: "1" },
    svg: `
        <svg viewBox="0 0 30 100" width="30" height="100" class="symbol">
            <line x1="15" y1="10" x2="15" y2="40" stroke="black" stroke-width="2"/>
            <circle cx="15" cy="10" r="4" fill="red" class="port"/>
            <circle cx="15" cy="50" r="10" fill="none" stroke="black" stroke-width="2"/>
            <line x1="15" y1="60" x2="15" y2="90" stroke="black" stroke-width="2"/>
            <circle cx="15" cy="90" r="4" fill="red" class="port"/>
            <text x="23" y="53" font-size="9" font-family="Arial">1</text>
        </svg>
    `
});

window.ComponentRegistry.register('pfeil_raus', {
    folder: 'klemmen',
    title: 'Pfeil Ausgang',
    defaultData: {},
    svg: `
        <svg viewBox="0 0 60 50" width="60" height="50" class="symbol">
            <line x1="10" y1="20" x2="40" y2="20" stroke="black" stroke-width="2"/>
            <polygon points="40,10 55,20 40,30" fill="none" stroke="black" stroke-width="2"/>
            <circle cx="10" cy="20" r="4" fill="red" class="port"/>
        </svg>
    `
});

window.ComponentRegistry.register('pfeil_rein', {
    folder: 'klemmen',
    title: 'Pfeil Eingang',
    defaultData: {},
    svg: `
        <svg viewBox="0 0 60 50" width="60" height="50" class="symbol">
            <polygon points="5,10 20,20 5,30" fill="none" stroke="black" stroke-width="2"/>
            <line x1="20" y1="20" x2="50" y2="20" stroke="black" stroke-width="2"/>
            <circle cx="50" cy="20" r="4" fill="red" class="port"/>
        </svg>
    `
});