// www.kreativekiste.de // 05.04.2026 // Version 1.6
const canvas = document.getElementById('area-4');
const wiringLayer = document.getElementById('wiring-layer');

let draggedHTML = null; let draggedType = null; 

let startPort = null;
let connections = []; 

let isDraggingComponent = false;
let currentMovedElement = null;
let moveOffsetX = 0; let moveOffsetY = 0;
let hasMoved = false; 

// Variablen für Schütz -> Kontakt Zuordnung (Selbe Seite)
let isAssignMode = false;
let selectedParent = null;

// NEU: Variablen für Seitenübergreifende Verlinkungen (Pfeile)
window.crossPageAssign = { active: false, sourceId: null, sourcePage: null };

let coilCounter = 1; 
let contextMenuTarget = null; 

let pages = [ { id: 1, name: "Seite 1", components: [], connections: [] } ];
let currentPageId = 1;

function addHistory(text) {
    const historyArea = document.getElementById('area-1');
    const item = document.createElement('div');
    item.className = 'history-item';
    item.textContent = '▶ ' + text;
    historyArea.appendChild(item);
    historyArea.scrollTop = historyArea.scrollHeight; 
}
