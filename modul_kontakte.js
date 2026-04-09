// www.kreativekiste.de // 08.04.2026 // Modul: Kontakte, Schütze & Taster

// 1. Hauptkontakt
window.ComponentRegistry.register('hauptkontakt', {
    folder: 'kontakt', // <-- Zuweisung zum Ordner "kontakt"
    title: 'Hauptkontakt',
    defaultData: { poles: "3", hubbel: "true" },
    svg: `
        <svg viewBox="0 0 120 100" width="100" height="100" class="symbol">
            <line x1="30" y1="10" x2="30" y2="40" stroke="black" stroke-width="2"/>
            <line x1="30" y1="70" x2="30" y2="90" stroke="black" stroke-width="2"/>
            <line x1="22" y1="40" x2="30" y2="70" stroke="black" stroke-width="2"/>
            <path d="M 24 55 A 4 4 0 0 1 28 55" fill="none" stroke="black" stroke-width="2"/>
            <circle cx="30" cy="10" r="4" fill="red" class="port"/>
            <circle cx="30" cy="90" r="4" fill="red" class="port"/>
            <text x="36" y="20" font-size="9" font-family="Arial">1</text><text x="36" y="85" font-size="9" font-family="Arial">2</text>
            <line x1="60" y1="10" x2="60" y2="40" stroke="black" stroke-width="2"/>
            <line x1="60" y1="70" x2="60" y2="90" stroke="black" stroke-width="2"/>
            <line x1="52" y1="40" x2="60" y2="70" stroke="black" stroke-width="2"/>
            <path d="M 54 55 A 4 4 0 0 1 58 55" fill="none" stroke="black" stroke-width="2"/>
            <circle cx="60" cy="10" r="4" fill="red" class="port"/>
            <circle cx="60" cy="90" r="4" fill="red" class="port"/>
            <text x="66" y="20" font-size="9" font-family="Arial">3</text><text x="66" y="85" font-size="9" font-family="Arial">4</text>
            <line x1="90" y1="10" x2="90" y2="40" stroke="black" stroke-width="2"/>
            <line x1="90" y1="70" x2="90" y2="90" stroke="black" stroke-width="2"/>
            <line x1="82" y1="40" x2="90" y2="70" stroke="black" stroke-width="2"/>
            <path d="M 84 55 A 4 4 0 0 1 88 55" fill="none" stroke="black" stroke-width="2"/>
            <circle cx="90" cy="10" r="4" fill="red" class="port"/>
            <circle cx="90" cy="90" r="4" fill="red" class="port"/>
            <text x="96" y="20" font-size="9" font-family="Arial">5</text><text x="96" y="85" font-size="9" font-family="Arial">6</text>
            <line x1="22" y1="55" x2="82" y2="55" stroke="black" stroke-width="1" stroke-dasharray="4,4"/>
        </svg>
    `
});

// 2. Schütz (Spule)
window.ComponentRegistry.register('schuetz', {
    folder: 'kontakt', // <-- Zuweisung zum Ordner "kontakt"
    title: 'Schütz (Spule)',
    defaultData: {},
    svg: `
        <svg viewBox="0 0 60 100" width="60" height="100" class="symbol">
            <line x1="30" y1="5" x2="30" y2="37" stroke="black" stroke-width="2"/>
            <text x="36" y="25" font-size="10" font-family="Arial">A1</text>
            <circle cx="30" cy="5" r="4" fill="red" class="port"/>
            <rect class="coil-rect" x="10" y="37" width="40" height="26" stroke="black" stroke-width="2" fill="none"/>
            <line x1="30" y1="63" x2="30" y2="95" stroke="black" stroke-width="2"/>
            <text x="36" y="85" font-size="10" font-family="Arial">A2</text>
            <circle cx="30" cy="95" r="4" fill="red" class="port"/>
        </svg>
    `
});

// 3. Taster
window.ComponentRegistry.register('taster', {
    folder: 'kontakt', // <-- Zuweisung zum Ordner "kontakt"
    title: 'Taster',
    defaultData: { subtype: "no" },
    svg: `
        <svg viewBox="0 0 60 100" width="60" height="100" class="symbol">
            <line x1="30" y1="10" x2="30" y2="40" stroke="black" stroke-width="2"/>
            <line x1="22" y1="40" x2="30" y2="70" stroke="black" stroke-width="2"/>
            <line x1="30" y1="70" x2="30" y2="90" stroke="black" stroke-width="2"/>
            <line x1="10" y1="55" x2="26" y2="55" stroke="black" stroke-width="1" stroke-dasharray="2,2"/>
            <path d="M 15 50 L 10 50 L 10 60 L 15 60" fill="none" stroke="black" stroke-width="2" />
            <circle cx="30" cy="10" r="4" fill="red" class="port"/>
            <circle cx="30" cy="90" r="4" fill="red" class="port"/>
        </svg>
    `
});

// 4. Schalter
window.ComponentRegistry.register('schalter', {
    folder: 'kontakt', // <-- Zuweisung zum Ordner "kontakt"
    title: 'Schalter',
    defaultData: { subtype: "no" },
    svg: `
        <svg viewBox="0 0 60 100" width="60" height="100" class="symbol">
            <line x1="30" y1="10" x2="30" y2="40" stroke="black" stroke-width="2"/>
            <line x1="22" y1="40" x2="30" y2="70" stroke="black" stroke-width="2"/>
            <line x1="30" y1="70" x2="30" y2="90" stroke="black" stroke-width="2"/>
            <line x1="10" y1="55" x2="26" y2="55" stroke="black" stroke-width="1" stroke-dasharray="2,2"/>
            <path d="M 14 50 L 10 50 L 10 60 L 6 60" fill="none" stroke="black" stroke-width="2" />
            <circle cx="30" cy="10" r="4" fill="red" class="port"/>
            <circle cx="30" cy="90" r="4" fill="red" class="port"/>
        </svg>
    `
});

// 5. Schließer (Hilfskontakt)
window.ComponentRegistry.register('schliesser', {
    folder: 'kontakt', // <-- Zuweisung zum Ordner "kontakt"
    title: 'Schließer (Hilfskontakt)',
    defaultData: {},
    svg: `
        <svg viewBox="0 0 60 100" width="60" height="100" class="symbol">
            <line x1="30" y1="10" x2="30" y2="40" stroke="black" stroke-width="2"/>
            <circle cx="30" cy="10" r="4" fill="red" class="port"/>
            <line x1="22" y1="40" x2="30" y2="70" stroke="black" stroke-width="2"/>
            <line x1="30" y1="70" x2="30" y2="90" stroke="black" stroke-width="2"/>
            <circle cx="30" cy="90" r="4" fill="red" class="port"/>
        </svg>
    `
});

// 6. Öffner (Hilfskontakt)
window.ComponentRegistry.register('oeffner', {
    folder: 'kontakt', // <-- Zuweisung zum Ordner "kontakt"
    title: 'Öffner (Hilfskontakt)',
    defaultData: {},
    svg: `
        <svg viewBox="0 0 60 100" width="60" height="100" class="symbol">
            <line x1="30" y1="10" x2="30" y2="40" stroke="black" stroke-width="2"/>
            <circle cx="30" cy="10" r="4" fill="red" class="port"/>
            <line x1="30" y1="40" x2="38" y2="40" stroke="black" stroke-width="2"/>
            <line x1="36" y1="40" x2="30" y2="70" stroke="black" stroke-width="2"/>
            <line x1="30" y1="70" x2="30" y2="90" stroke="black" stroke-width="2"/>
            <circle cx="30" cy="90" r="4" fill="red" class="port"/>
        </svg>
    `
});