// www.kreativekiste.de // 08.04.2026 // Modul: Schutzorgane & Sicherungen

// 1. Schmelzsicherung
window.ComponentRegistry.register('schmelzsicherung', {
    folder: 'sicherungen', // <-- Zuweisung zum HTML-Ordner
    title: 'Schmelzsicherung',
    defaultData: { poles: "1" },
    svg: `
        <svg viewBox="0 0 60 100" width="60" height="100" class="symbol">
            <line x1="30" y1="10" x2="30" y2="30" stroke="black" stroke-width="2"/>
            <rect x="22" y="30" width="16" height="40" fill="none" stroke="black" stroke-width="2"/>
            <line x1="30" y1="30" x2="30" y2="70" stroke="black" stroke-width="2"/>
            <line x1="30" y1="70" x2="30" y2="90" stroke="black" stroke-width="2"/>
            <circle cx="30" cy="10" r="4" fill="red" class="port"/>
            <circle cx="30" cy="90" r="4" fill="red" class="port"/>
            <text x="36" y="20" font-size="9" font-family="Arial">1</text>
            <text x="36" y="85" font-size="9" font-family="Arial">2</text>
        </svg>
    `
});

// 2. Leitungsschutzschalter (LSS)
window.ComponentRegistry.register('leitungsschutzschalter', {
    folder: 'sicherungen', // <-- Zuweisung zum HTML-Ordner
    title: 'Leitungsschutzschalter',
    defaultData: { poles: "1" },
    svg: `
        <svg viewBox="0 0 60 100" width="60" height="100" class="symbol">
            <line x1="30" y1="10" x2="30" y2="40" stroke="black" stroke-width="2"/>
            <line x1="26" y1="20" x2="34" y2="28" stroke="black" stroke-width="1.5"/>
            <line x1="34" y1="20" x2="26" y2="28" stroke="black" stroke-width="1.5"/>
            <line x1="22" y1="40" x2="30" y2="70" stroke="black" stroke-width="2"/>
            <path d="M 18 45 L 14 45 L 14 55 L 18 55" fill="none" stroke="black" stroke-width="1.5"/>
            <path d="M 18 60 A 4 4 0 0 1 18 68" fill="none" stroke="black" stroke-width="1.5"/>
            <line x1="30" y1="70" x2="30" y2="90" stroke="black" stroke-width="2"/>
            <circle cx="30" cy="10" r="4" fill="red" class="port"/>
            <circle cx="30" cy="90" r="4" fill="red" class="port"/>
            <text x="36" y="20" font-size="9" font-family="Arial">1</text>
            <text x="36" y="85" font-size="9" font-family="Arial">2</text>
        </svg>
    `
});

// 3. FI-Schutzschalter (inkl. L, N und PE Logik)
window.ComponentRegistry.register('fi_schutzschalter', {
    folder: 'sicherungen', // <-- Zuweisung zum HTML-Ordner
    title: 'FI-Schutzschalter (RCD)',
    defaultData: { poles: "1" }, 
    svg: `
        <svg viewBox="0 0 120 100" width="120" height="100" class="symbol">
            <line x1="30" y1="10" x2="30" y2="40" stroke="black" stroke-width="2"/>
            <line x1="22" y1="40" x2="30" y2="70" stroke="black" stroke-width="2"/>
            <line x1="30" y1="70" x2="30" y2="90" stroke="black" stroke-width="2"/>
            <circle cx="30" cy="10" r="4" fill="red" class="port"/>
            <circle cx="30" cy="90" r="4" fill="red" class="port"/>
            <text x="36" y="20" font-size="9" font-family="Arial">1</text>
            <text x="36" y="85" font-size="9" font-family="Arial">2</text>
            
            <line x1="60" y1="10" x2="60" y2="90" stroke="black" stroke-width="2"/>
            <circle cx="60" cy="10" r="4" fill="red" class="port"/>
            <circle cx="60" cy="90" r="4" fill="red" class="port"/>
            <text x="66" y="20" font-size="9" font-family="Arial">N</text>
            <text x="66" y="85" font-size="9" font-family="Arial">N</text>

            <line x1="90" y1="10" x2="90" y2="90" stroke="black" stroke-width="2" stroke-dasharray="8,4"/>
            <circle cx="90" cy="10" r="4" fill="red" class="port"/>
            <circle cx="90" cy="90" r="4" fill="red" class="port"/>
            <text x="96" y="20" font-size="9" font-family="Arial">PE</text>
            <text x="96" y="85" font-size="9" font-family="Arial">PE</text>

            <ellipse cx="45" cy="60" rx="20" ry="10" fill="none" stroke="black" stroke-width="2"/>
        </svg>
    `
});