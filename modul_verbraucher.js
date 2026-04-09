// www.kreativekiste.de // 08.04.2026 // Version 1.2

window.ComponentRegistry.register('motor', {
    folder: 'verbraucher',
    title: 'Drehstrommotor',
    defaultData: { poles: "3" },
    svg: `
        <svg viewBox="0 0 90 100" width="90" height="100" class="symbol">
            <circle cx="45" cy="50" r="25" fill="none" stroke="black" stroke-width="2"/>
            <text x="45" y="55" text-anchor="middle" font-size="20" font-family="Arial">M</text>
            <text x="45" y="68" text-anchor="middle" font-size="10" font-family="Arial">3~</text>
            <line x1="25" y1="10" x2="25" y2="25" stroke="black" stroke-width="2"/>
            <line x1="45" y1="10" x2="45" y2="25" stroke="black" stroke-width="2"/>
            <line x1="65" y1="10" x2="65" y2="25" stroke="black" stroke-width="2"/>
            <circle cx="25" cy="10" r="4" fill="red" class="port"/>
            <circle cx="45" cy="10" r="4" fill="red" class="port"/>
            <circle cx="65" cy="10" r="4" fill="red" class="port"/>
            <text x="30" y="20" font-size="9" font-family="Arial">U1</text><text x="50" y="20" font-size="9" font-family="Arial">V1</text><text x="70" y="20" font-size="9" font-family="Arial">W1</text>
        </svg>
    `
});

window.ComponentRegistry.register('lampe', {
    folder: 'verbraucher',
    title: 'Meldeleuchte',
    defaultData: { subtype: "bulb" },
    svg: `
        <svg viewBox="0 0 60 100" width="60" height="100" class="symbol">
            <line x1="30" y1="10" x2="30" y2="30" stroke="black" stroke-width="2"/>
            <circle cx="30" cy="10" r="4" fill="red" class="port"/>
            <circle cx="30" cy="50" r="20" fill="none" stroke="black" stroke-width="2"/>
            <line x1="16" y1="36" x2="44" y2="64" stroke="black" stroke-width="2"/>
            <line x1="16" y1="64" x2="44" y2="36" stroke="black" stroke-width="2"/>
            <line x1="30" y1="70" x2="30" y2="90" stroke="black" stroke-width="2"/>
            <circle cx="30" cy="90" r="4" fill="red" class="port"/>
        </svg>
    `
});