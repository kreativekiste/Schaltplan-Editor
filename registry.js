// www.kreativekiste.de // 08.04.2026 // Version 1.1 (Registry)

window.ComponentRegistry = {
    // Hier speichern wir die Baupläne für alle bekannten Bauteile
    definitions: {},
    
    // Ordner-Struktur für die Seitenleiste - HIER SIND JETZT DEINE 4 KORREKTEN ORDNER!
    folders: [
        { id: "kontakt", name: "Kontakt", open: true },
        { id: "sicherungen", name: "Sicherungen", open: false },
        { id: "verbraucher", name: "Verbraucher", open: false },
        { id: "klemmen", name: "Klemmen", open: false }
    ],

    /**
     * Ein neues Bauteil anmelden
     * @param {string} id - Eindeutige ID (z.B. 'schmelzsicherung')
     * @param {object} config - Definitionen, SVG-Code und Menü-Logik
     */
    register: function(id, config) {
        this.definitions[id] = config;
        console.log(`Bauteil registriert: ${id}`);
    },

    /**
     * Baut die linke Seitenleiste komplett dynamisch auf!
     */
    buildSidebar: function() {
        const area3 = document.getElementById('area-3');
        if (!area3) return;

        // Bisherigen Inhalt (außer der Überschrift) löschen
        area3.innerHTML = '<h2>3 Bauteile</h2>';

        this.folders.forEach(folder => {
            // Finde alle Bauteile, die in diesen Ordner gehören
            const itemsInFolder = Object.keys(this.definitions)
                .filter(key => this.definitions[key].folder === folder.id)
                .map(key => ({ id: key, ...this.definitions[key] }));

            if (itemsInFolder.length === 0) return; // Leere Ordner nicht zeichnen

            const folderDiv = document.createElement('div');
            folderDiv.className = `folder ${folder.open ? 'open' : ''}`;
            
            const header = document.createElement('div');
            header.className = 'folder-header';
            header.textContent = folder.name;
            folderDiv.appendChild(header);

            const content = document.createElement('div');
            content.className = 'folder-content';

            itemsInFolder.forEach(item => {
                const compDiv = document.createElement('div');
                compDiv.className = 'component-item';
                compDiv.draggable = true;
                compDiv.dataset.type = item.id;
                
                // Initiale Daten-Attribute setzen (z.B. data-poles="1")
                if (item.defaultData) {
                    for (const [key, val] of Object.entries(item.defaultData)) {
                        compDiv.dataset[key] = val;
                    }
                }
                
                if (item.title) compDiv.title = item.title;

                compDiv.innerHTML = `
                    <button class="edit-comp-btn" title="Bauteil bearbeiten">✏️</button>
                    ${item.svg}
                `;
                content.appendChild(compDiv);
            });

            folderDiv.appendChild(content);
            area3.appendChild(folderDiv);
        });

        // Event-Listener für das neue Drag&Drop anhängen (macht normalerweise bauteile.js)
        if (typeof attachDragListeners === 'function') {
            attachDragListeners();
        }
    }
};

// Wenn die Seite geladen ist, Sidebar bauen
document.addEventListener('DOMContentLoaded', () => {
    // Kleiner Timeout, damit erst alle Module geladen sind
    setTimeout(() => {
        window.ComponentRegistry.buildSidebar();
    }, 100);
});