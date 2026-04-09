// www.kreativekiste.de // 09.04.2026 // Version 3.2

// Globale Variable für die Zählweise ('din' = nach Position, 'continuous' = fortlaufend)
window.numberingMode = 'din'; 
window.currentWireConn = null; // Speichert das aktuell ausgewählte Kabel für das Menü

// SICHERHEITS-FUNKTIONEN: Wir holen die Menüs live, damit nichts abstürzt, wenn sie kurzfristig fehlen
function getContextMenu() { return document.getElementById('context-menu'); }
function getWireContextMenu() { return document.getElementById('wire-context-menu'); }

// Start-Setup: Verstecke Menüs (mit leichter Verzögerung, damit das HTML sicher geladen ist)
setTimeout(() => {
    const cm = getContextMenu();
    if (cm) cm.style.display = 'none';
    const wcm = getWireContextMenu();
    if (wcm) wcm.style.display = 'none';
}, 100);

const btnClear = document.getElementById('btn-clear');
if (btnClear) btnClear.addEventListener('click', clearCanvas);

// --- ORDNER STEUERUNG & BOMBENFESTER KONTEXT-MENÜ-FIX ---
document.addEventListener('click', (e) => {
    // Ordner auf/zuklappen
    if (e.target.classList.contains('folder-header')) {
        e.target.parentElement.classList.toggle('open');
    }
    
    // Bauteil-Kontextmenü ausblenden
    if (!e.target.closest('#context-menu') && !e.target.closest('.edit-comp-btn')) {
        hideContextMenu();
    } else if (e.target.classList.contains('menu-item') || e.target.closest('.menu-item')) {
        hideContextMenu();
    }

    // Kabel-Kontextmenü ausblenden
    if (!e.target.closest('#wire-context-menu')) {
        hideWireContextMenu();
    } else if (e.target.classList.contains('menu-item') || e.target.closest('.menu-item')) {
        hideWireContextMenu();
    }
});

function showContextMenu(x, y) {
    hideWireContextMenu(); // Sicherstellen, dass das Kabelmenü zu ist
    
    const ctxMenu = getContextMenu();
    if (!ctxMenu) {
        console.error("FEHLER: HTML Element mit id 'context-menu' nicht gefunden!");
        return;
    }

    ctxMenu.style.left = x + 'px';
    ctxMenu.style.top = y + 'px';
    ctxMenu.classList.remove('hidden');
    ctxMenu.style.display = 'block'; // Menü hart einblenden

    const type = window.contextMenuTarget ? window.contextMenuTarget.dataset.type : null;
    
    const elContact = document.querySelector('.contact-only');
    if(elContact) elContact.style.display = (type === 'schliesser' || type === 'oeffner') ? 'block' : 'none';
    
    const elPower = document.querySelector('.power-only');
    if(elPower) elPower.style.display = (type === 'hauptkontakt') ? 'block' : 'none';
    
    const elAssign = document.querySelector('.assign-only');
    if(elAssign) elAssign.style.display = (type === 'schuetz' || type === 'schliesser' || type === 'oeffner') ? 'block' : 'none';
    
    const elMotor = document.querySelector('.motor-only');
    if(elMotor) elMotor.style.display = (type === 'motor') ? 'block' : 'none';
    
    const elTerm = document.querySelector('.terminal-only');
    if(elTerm) elTerm.style.display = (type === 'klemme') ? 'block' : 'none';
    
    const elLamp = document.querySelector('.lamp-only');
    if(elLamp) elLamp.style.display = (type === 'lampe') ? 'block' : 'none';
    
    const elArrow = document.querySelector('.arrow-only');
    if(elArrow) elArrow.style.display = (type === 'pfeil_raus' || type === 'pfeil_rein') ? 'block' : 'none';
    
    const isTasterOrSchalter = (type === 'taster' || type === 'schalter');
    const elTasterOnly = document.querySelector('.taster-only');
    if(elTasterOnly) elTasterOnly.style.display = isTasterOrSchalter ? 'block' : 'none';

    if (isTasterOrSchalter) {
        const prefix = type === 'schalter' ? 'Schalter' : 'Taster';
        const tno = document.getElementById('menu-taster-no'); if(tno) tno.innerHTML = `🔘 ${prefix} Schließer`;
        const tnc = document.getElementById('menu-taster-nc'); if(tnc) tnc.innerHTML = `🔘 ${prefix} Öffner`;
        const tlno = document.getElementById('menu-taster-latch-no'); if(tlno) tlno.innerHTML = `🔒 ${prefix} Schließer rastend`;
        const tlnc = document.getElementById('menu-taster-latch-nc'); if(tlnc) tlnc.innerHTML = `🔒 ${prefix} Öffner rastend`;
    }

    const toggleBtn = document.getElementById('menu-toggle-numbering');
    if (toggleBtn) {
        toggleBtn.innerHTML = window.numberingMode === 'din' ? '🔄 Zählweise: DIN (Position)' : '🔄 Zählweise: Fortlaufend';
    }
}

function hideContextMenu() {
    const ctxMenu = getContextMenu();
    if (ctxMenu) {
        ctxMenu.classList.add('hidden');
        ctxMenu.style.display = 'none'; 
    }
}

// --- NEU: KABEL KONTEXTMENÜ STEUERUNG ---
window.showWireContextMenu = function(x, y, conn) {
    hideContextMenu(); // Bauteilmenü sicherheitshalber schließen
    window.currentWireConn = conn;
    const wCtxMenu = getWireContextMenu();
    if (wCtxMenu) {
        wCtxMenu.style.left = x + 'px';
        wCtxMenu.style.top = y + 'px';
        wCtxMenu.classList.remove('hidden');
        wCtxMenu.style.display = 'block';
    }
};

function hideWireContextMenu() {
    const wCtxMenu = getWireContextMenu();
    if (wCtxMenu) {
        wCtxMenu.classList.add('hidden');
        wCtxMenu.style.display = 'none';
    }
}

// Event-Listener für das Kabel-Menü anlegen
const wireMenuPoints = document.getElementById('wire-menu-toggle-points');
if (wireMenuPoints) {
    wireMenuPoints.addEventListener('click', (e) => {
        e.stopPropagation(); 
        hideWireContextMenu();
        if (window.currentWireConn) {
            window.currentWireConn.showHandles = !window.currentWireConn.showHandles;
            if (typeof updateCables === 'function') updateCables();
            if (typeof addHistory === 'function') addHistory(window.currentWireConn.showHandles ? 'Kabel-Punkte eingeblendet' : 'Kabel-Punkte ausgeblendet');
        }
    });

    document.getElementById('wire-menu-rename').addEventListener('click', (e) => {
        e.stopPropagation(); 
        hideWireContextMenu();
        if (window.currentWireConn) {
            const newName = prompt('Kabelname eingeben:', window.currentWireConn.name || '');
            if (newName !== null) {
                window.currentWireConn.name = newName;
                if (typeof updateCables === 'function') updateCables();
                if (typeof addHistory === 'function') addHistory('Kabelname geändert');
            }
        }
    });

    ['black', 'blue', 'gray', 'brown'].forEach(color => {
        const colorBtn = document.getElementById(`wire-menu-color-${color}`);
        if (colorBtn) {
            colorBtn.addEventListener('click', (e) => {
                e.stopPropagation(); 
                hideWireContextMenu();
                if (window.currentWireConn) {
                    window.currentWireConn.color = color;
                    if (typeof updateCables === 'function') updateCables();
                    if (typeof addHistory === 'function') addHistory(`Kabelfarbe geändert auf ${color}`);
                }
            });
        }
    });

    document.getElementById('wire-menu-delete').addEventListener('click', (e) => {
        e.stopPropagation(); 
        hideWireContextMenu();
        if (window.currentWireConn) {
            if (window.currentWireConn.pathElem) window.currentWireConn.pathElem.remove();
            if (window.currentWireConn.h1) window.currentWireConn.h1.remove();
            if (window.currentWireConn.h2) window.currentWireConn.h2.remove();
            if (window.currentWireConn.h3) window.currentWireConn.h3.remove();
            if (window.currentWireConn.textElem) window.currentWireConn.textElem.remove();
            
            // Verbindung aus dem Array löschen
            if (typeof connections !== 'undefined') {
                connections = connections.filter(c => c !== window.currentWireConn);
            }
            if (typeof updateCables === 'function') updateCables();
            if (typeof addHistory === 'function') addHistory('Kabel gelöscht');
        }
    });
}

const menuEditBtn = document.getElementById('menu-edit');
if (menuEditBtn) {
    menuEditBtn.addEventListener('click', (e) => {
        e.stopPropagation(); hideContextMenu();
        if (window.contextMenuTarget && typeof openEditorForInstance === 'function') {
            openEditorForInstance(window.contextMenuTarget);
        }
    });
}

// --- Speichern und Laden (inklusive numberingMode) ---
const btnSaveProject = document.getElementById('btn-save-project');
if (btnSaveProject) {
    btnSaveProject.onclick = () => {
        if(typeof saveCurrentPageState === 'function') saveCurrentPageState();
        const data = { 
            pages: typeof pages !== 'undefined' ? pages : [], 
            coilCounter: typeof coilCounter !== 'undefined' ? coilCounter : 1, 
            numberingMode: window.numberingMode 
        };
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
        const downloadAnchor = document.createElement('a'); downloadAnchor.setAttribute("href", dataStr); downloadAnchor.setAttribute("download", "schaltplan_projekt.json"); downloadAnchor.click();
        if (typeof addHistory === 'function') addHistory('Projekt gespeichert');
    };
}

const fileInput = document.getElementById('file-input');
const btnLoadProject = document.getElementById('btn-load-project');
if (btnLoadProject && fileInput) {
    btnLoadProject.onclick = () => fileInput.click();

    fileInput.onchange = (e) => {
        const file = e.target.files[0]; if (!file) return; const reader = new FileReader();
        reader.onload = (event) => {
            const data = JSON.parse(event.target.result); 
            if (typeof pages !== 'undefined') pages = data.pages; 
            if (typeof coilCounter !== 'undefined') coilCounter = data.coilCounter || 1; 
            if (typeof currentPageId !== 'undefined' && data.pages.length > 0) currentPageId = data.pages[0].id;
            window.numberingMode = data.numberingMode || 'din';
            if(typeof loadPageState === 'function' && typeof currentPageId !== 'undefined') loadPageState(currentPageId); 
            if(typeof renderTabs === 'function') renderTabs();
            if (typeof addHistory === 'function') addHistory('Projekt geladen');
        };
        reader.readAsText(file);
    };
}

function clearCanvas() {
    const canvas = document.getElementById('area-4');
    if (canvas) canvas.querySelectorAll('.dropped-component').forEach(c => c.remove());
    const wiringLayer = document.getElementById('wiring-layer');
    if (wiringLayer) wiringLayer.innerHTML = ''; 
    if (typeof connections !== 'undefined') connections.length = 0; 
    if (typeof startPort !== 'undefined') startPort = null; 
    if (typeof coilCounter !== 'undefined') coilCounter = 1; 
    if (typeof isAssignMode !== 'undefined') isAssignMode = false; 
    if (typeof crossPageAssign !== 'undefined') crossPageAssign.active = false; 
    if (canvas) canvas.classList.remove('assign-mode'); 
    if (typeof selectedParent !== 'undefined') selectedParent = null; 
    hideContextMenu(); hideWireContextMenu();
    window.currentWireConn = null;
    if(typeof pages !== 'undefined') { pages = [{ id: 1, name: "Seite 1", components: [], connections: [] }]; if (typeof currentPageId !== 'undefined') currentPageId = 1; if(typeof renderTabs === 'function') renderTabs(); }
    if (typeof addHistory === 'function') addHistory('Arbeitsfläche komplett geleert');
}

// --- Menü-Aktionen (Zuordnung Normal) ---
const menuAssignBtn = document.getElementById('menu-assign');
if (menuAssignBtn) {
    menuAssignBtn.addEventListener('click', (e) => {
        e.stopPropagation(); hideContextMenu();
        if (!window.contextMenuTarget || window.contextMenuTarget.dataset.type !== 'schuetz') { alert("Bitte eine Spule (Schütz) auswählen!"); return; }
        if (typeof isAssignMode !== 'undefined') isAssignMode = true; 
        if (typeof selectedParent !== 'undefined') selectedParent = window.contextMenuTarget; 
        const canvas = document.getElementById('area-4');
        if (canvas) canvas.classList.add('assign-mode');
        document.querySelectorAll('.dropped-component').forEach(c => c.classList.remove('parent-selected'));
        if (typeof selectedParent !== 'undefined' && selectedParent) selectedParent.classList.add('parent-selected'); 
        if (typeof addHistory === 'function') addHistory('Zuordnungsmodus aktiv');
    });
}

// NEUER SCHALTER FÜR DIE ZÄHLWEISE
const menuToggleNumBtn = document.getElementById('menu-toggle-numbering');
if (menuToggleNumBtn) {
    menuToggleNumBtn.addEventListener('click', (e) => {
        e.stopPropagation(); hideContextMenu();
        
        window.numberingMode = window.numberingMode === 'din' ? 'continuous' : 'din';
        if (typeof addHistory === 'function') addHistory('Zählweise geändert auf: ' + (window.numberingMode === 'din' ? 'DIN (Position)' : 'Fortlaufend'));
        
        if (typeof pages !== 'undefined') {
            pages.forEach(p => {
                p.components.forEach(c => {
                    if (c.type === 'schuetz') {
                        if (typeof recalculateTerminals === 'function') recalculateTerminals(c.id);
                    }
                });
            });
        }
        const canvas = document.getElementById('area-4');
        if (canvas) {
            canvas.querySelectorAll('.dropped-component[data-type="schuetz"]').forEach(coil => {
                if (typeof recalculateTerminals === 'function') recalculateTerminals(coil.dataset.id);
            });
        }
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (typeof isAssignMode !== 'undefined') isAssignMode = false; 
        if (typeof crossPageAssign !== 'undefined') crossPageAssign.active = false; 
        if (typeof selectedParent !== 'undefined') selectedParent = null; 
        const canvas = document.getElementById('area-4');
        if (canvas) canvas.classList.remove('assign-mode');
        document.querySelectorAll('.dropped-component').forEach(c => c.classList.remove('parent-selected'));
    }
});

const menuUnassignBtn = document.getElementById('menu-unassign');
if (menuUnassignBtn) {
    menuUnassignBtn.addEventListener('click', (e) => {
        e.stopPropagation(); hideContextMenu();
        if(window.contextMenuTarget && typeof unassignContact === 'function') unassignContact(window.contextMenuTarget);
    });
}

// --- PFEIL / ABBRUCHSTELLEN STEUERUNG ---
const menuLinkArrowBtn = document.getElementById('menu-link-arrow');
if (menuLinkArrowBtn) {
    menuLinkArrowBtn.addEventListener('click', (e) => {
        e.stopPropagation(); hideContextMenu();
        window.crossPageAssign = { active: true, sourceId: window.contextMenuTarget.dataset.id, sourcePage: (typeof currentPageId !== 'undefined' ? currentPageId : 1) };
        const canvas = document.getElementById('area-4');
        if (canvas) canvas.classList.add('assign-mode');
        if (typeof addHistory === 'function') addHistory('Pfeil verlinken: Ziel anklicken (auch auf anderer Seite möglich)');
    });
}

const menuUnlinkArrowBtn = document.getElementById('menu-unlink-arrow');
if (menuUnlinkArrowBtn) {
    menuUnlinkArrowBtn.addEventListener('click', (e) => {
        e.stopPropagation(); hideContextMenu();
        if(window.contextMenuTarget) {
            window.contextMenuTarget.removeAttribute('data-link-id'); window.contextMenuTarget.removeAttribute('data-link-page');
            if(typeof updateArrowVisuals === 'function') updateArrowVisuals(window.contextMenuTarget);
            if (typeof addHistory === 'function') addHistory('Pfeil-Verlinkung gelöst');
        }
    });
}

const menuJumpArrowBtn = document.getElementById('menu-jump-arrow');
if (menuJumpArrowBtn) {
    menuJumpArrowBtn.addEventListener('click', (e) => {
        e.stopPropagation(); hideContextMenu();
        const targetPage = parseInt(window.contextMenuTarget.dataset.linkPage);
        if (targetPage && typeof currentPageId !== 'undefined' && targetPage !== currentPageId && typeof switchPage === 'function') {
            switchPage(targetPage);
            if (typeof addHistory === 'function') addHistory('Zur Ziel-Seite gesprungen');
        } else if (!targetPage) {
            alert("Dieser Pfeil ist noch mit keinem Ziel verlinkt!");
        }
    });
}

// --- Menü-Aktionen (Umbenennen & Löschen & Transform) ---
const menuRenameBtn = document.getElementById('menu-rename');
if (menuRenameBtn) {
    menuRenameBtn.addEventListener('click', (e) => {
        e.stopPropagation(); hideContextMenu(); if (!window.contextMenuTarget) return;
        let newName = prompt("Bauteil umbenennen:", window.contextMenuTarget.dataset.label || "");
        if (newName !== null) {
            window.contextMenuTarget.dataset.label = newName; window.contextMenuTarget.dataset.baseLabel = newName; 
            if(typeof updateLabel === 'function') updateLabel(window.contextMenuTarget, newName, window.contextMenuTarget.dataset.type === 'schuetz' ? 'pos-bottom-left' : 'pos-left'); 
            if (typeof addHistory === 'function') addHistory('Bauteil umbenannt');
        }
    });
}

const menuDeleteBtn = document.getElementById('menu-delete');
if (menuDeleteBtn) {
    menuDeleteBtn.addEventListener('click', (e) => {
        e.stopPropagation(); hideContextMenu(); if (!window.contextMenuTarget) return;
        const id = window.contextMenuTarget.dataset.id;
        if (typeof connections !== 'undefined') {
            connections = connections.filter(conn => {
                if (conn.port1.closest('.dropped-component') === window.contextMenuTarget || conn.port2.closest('.dropped-component') === window.contextMenuTarget) {
                    if (conn.pathElem) conn.pathElem.remove(); if(conn.h1) conn.h1.remove(); if(conn.h2) conn.h2.remove(); if(conn.h3) conn.h3.remove(); 
                    if (conn.textElem) conn.textElem.remove(); return false;
                } return true;
            });
        }
        if (window.contextMenuTarget.dataset.type === 'schuetz') { 
            const canvas = document.getElementById('area-4');
            if (canvas) canvas.querySelectorAll(`.dropped-component[data-parent-id="${id}"]`).forEach(c => { if(typeof unassignContact === 'function') unassignContact(c); }); 
        } 
        else { if(typeof unassignContact === 'function') unassignContact(window.contextMenuTarget); }
        window.contextMenuTarget.remove(); window.contextMenuTarget = null; 
        if (typeof addHistory === 'function') addHistory('Bauteil gelöscht');
    });
}

const menuRotateBtn = document.getElementById('menu-rotate');
if (menuRotateBtn) {
    menuRotateBtn.addEventListener('click', (e) => {
        e.stopPropagation(); hideContextMenu();
        if (window.contextMenuTarget) { 
            let rot = parseInt(window.contextMenuTarget.dataset.rotation || '0') + 90; if (rot >= 360) rot = 0; 
            window.contextMenuTarget.dataset.rotation = rot; applyTransform(window.contextMenuTarget); 
            if(typeof updateCables === 'function') updateCables(); 
            if (typeof addHistory === 'function') addHistory('Bauteil gedreht'); 
        }
    });
}
const menuFlipBtn = document.getElementById('menu-flip');
if (menuFlipBtn) {
    menuFlipBtn.addEventListener('click', (e) => {
        e.stopPropagation(); hideContextMenu();
        if (window.contextMenuTarget) { 
            window.contextMenuTarget.dataset.flipX = window.contextMenuTarget.dataset.flipX === 'true' ? 'false' : 'true'; 
            applyTransform(window.contextMenuTarget); 
            if(typeof updateCables === 'function') updateCables(); 
            if (typeof addHistory === 'function') addHistory('Bauteil gespiegelt'); 
        }
    });
}

function applyTransform(el) { const svg = el.querySelector('svg.symbol'); if (!svg) return; const rot = el.dataset.rotation || '0'; const flip = el.dataset.flipX === 'true' ? -1 : 1; svg.style.transform = `rotate(${rot}deg) scaleX(${flip})`; }


// --- TASTER & SCHALTER DYNAMIK FUNKTION ---
function updateTasterVisuals(el) {
    const subtype = el.dataset.subtype || 'no';
    const type = el.dataset.type; 
    const svg = el.querySelector('svg.symbol');
    if (!svg) return;

    let contactHTML = '';
    let actuatorHTML = '';

    if (type === 'schalter') {
        actuatorHTML = '<path d="M 14 50 L 10 50 L 10 60 L 6 60" fill="none" stroke="black" stroke-width="2" />';
    } else {
        actuatorHTML = '<path d="M 15 50 L 10 50 L 10 60 L 15 60" fill="none" stroke="black" stroke-width="2" />';
    }
    
    if (subtype.includes('latch')) {
        actuatorHTML += '<polyline points="20,55 22,59 24,55" fill="none" stroke="black" stroke-width="1.5"/>';
    }

    if (subtype.includes('no')) { 
        contactHTML = `
            <line x1="30" y1="10" x2="30" y2="40" stroke="black" stroke-width="2"/>
            <line x1="22" y1="40" x2="30" y2="70" stroke="black" stroke-width="2"/>
            <line x1="30" y1="70" x2="30" y2="90" stroke="black" stroke-width="2"/>
            <line x1="10" y1="55" x2="26" y2="55" stroke="black" stroke-width="1" stroke-dasharray="2,2"/>
        `;
    } else { 
        contactHTML = `
            <line x1="30" y1="10" x2="30" y2="40" stroke="black" stroke-width="2"/>
            <line x1="30" y1="40" x2="39" y2="40" stroke="black" stroke-width="2"/>
            <line x1="36" y1="40" x2="30" y2="70" stroke="black" stroke-width="2"/>
            <line x1="30" y1="70" x2="30" y2="90" stroke="black" stroke-width="2"/>
            <line x1="12" y1="55" x2="33" y2="55" stroke="black" stroke-width="1" stroke-dasharray="2,2"/>
        `;
    }

    svg.innerHTML = `
        ${contactHTML}
        ${actuatorHTML}
        <circle cx="30" cy="10" r="4" fill="red" class="port"/>
        <circle cx="30" cy="90" r="4" fill="red" class="port"/>
    `;
    
    svg.querySelectorAll('.port').forEach(p => p.onclick = typeof handlePortClick === 'function' ? handlePortClick : null);
}

// --- Spezial-Kontext-Aktionen ---
['no', 'nc', 'latch-no', 'latch-nc'].forEach(subtype => { 
    const btn = document.getElementById(`menu-taster-${subtype}`);
    if(btn) {
        btn.addEventListener('click', (e) => { 
            e.stopPropagation(); hideContextMenu(); 
            if (window.contextMenuTarget) { 
                window.contextMenuTarget.dataset.subtype = subtype; 
                updateTasterVisuals(window.contextMenuTarget);
                if (typeof addHistory === 'function') addHistory(window.contextMenuTarget.dataset.type === 'schalter' ? 'Schalter-Typ geändert' : 'Taster-Typ geändert');
            } 
        }); 
    }
});

[3, 6].forEach(poles => { 
    const btn = document.getElementById(`menu-motor-${poles}`);
    if (btn) {
        btn.addEventListener('click', (e) => { 
            e.stopPropagation(); hideContextMenu(); 
            if (window.contextMenuTarget) { window.contextMenuTarget.dataset.poles = poles; if(typeof updateMotorVisuals === 'function') updateMotorVisuals(window.contextMenuTarget); } 
        }); 
    }
});

const menuTerminalsCount = document.getElementById('menu-terminals-count');
if (menuTerminalsCount) {
    menuTerminalsCount.addEventListener('click', (e) => { 
        e.stopPropagation(); hideContextMenu(); 
        if (window.contextMenuTarget) { let count = prompt("Anzahl Klemmen eingeben (1-10):", window.contextMenuTarget.dataset.terminals || '1'); if (count !== null) { count = Math.max(1, Math.min(10, parseInt(count))); window.contextMenuTarget.dataset.terminals = count; if(typeof updateTerminalVisuals === 'function') updateTerminalVisuals(window.contextMenuTarget); } } 
    });
}

['bulb', 'led', 'blink'].forEach(type => { 
    const btn = document.getElementById(`menu-lamp-${type}`);
    if(btn) {
        btn.addEventListener('click', (e) => { e.stopPropagation(); hideContextMenu(); if (window.contextMenuTarget) { window.contextMenuTarget.dataset.subtype = type; if(typeof updateLampVisuals === 'function') updateLampVisuals(window.contextMenuTarget); } }); 
    }
});
['normal', 'timer-on', 'timer-off', 'timer-onoff'].forEach(subtype => { 
    const btn = document.getElementById(`menu-type-${subtype}`);
    if(btn) {
        btn.addEventListener('click', (e) => { e.stopPropagation(); hideContextMenu(); if (window.contextMenuTarget) { window.contextMenuTarget.dataset.subtype = subtype; if(typeof updateContactVisuals === 'function') updateContactVisuals(window.contextMenuTarget); const parentId = window.contextMenuTarget.getAttribute('data-parent-id'); if (parentId) { if(typeof recalculateTerminals === 'function') recalculateTerminals(parentId); if(typeof updateCoilVisuals === 'function') updateCoilVisuals(parentId); } } }); 
    }
});
[1, 2, 3].forEach(poles => { 
    const btn = document.getElementById(`menu-power-${poles}`);
    if (btn) {
        btn.addEventListener('click', (e) => { e.stopPropagation(); hideContextMenu(); if (window.contextMenuTarget) { window.contextMenuTarget.dataset.poles = poles; if(typeof updatePowerContactVisuals === 'function') updatePowerContactVisuals(window.contextMenuTarget); } }); 
    }
});

// --- NEU: RASTER & ZOOM STEUERUNG ---
let gridVisible = true;
const btnToggleGrid = document.getElementById('btn-toggle-grid');
if (btnToggleGrid) {
    btnToggleGrid.addEventListener('click', () => {
        gridVisible = !gridVisible;
        const canvasArea = document.getElementById('area-4');
        if (canvasArea) canvasArea.style.backgroundImage = gridVisible ? 'radial-gradient(#bdc3c7 1px, transparent 1px)' : 'none';
        if (typeof addHistory === 'function') addHistory('Raster ' + (gridVisible ? 'eingeschaltet' : 'ausgeschaltet'));
    });
}

window.currentZoom = 1.0;

const btnZoomIn = document.getElementById('btn-zoom-in');
if (btnZoomIn) {
    btnZoomIn.addEventListener('click', () => {
        if (window.currentZoom < 2.0) {
            window.currentZoom += 0.1;
            applyZoom();
        }
    });
}

const btnZoomOut = document.getElementById('btn-zoom-out');
if (btnZoomOut) {
    btnZoomOut.addEventListener('click', () => {
        if (window.currentZoom > 0.4) {
            window.currentZoom -= 0.1;
            applyZoom();
        }
    });
}

function applyZoom() {
    const zoomLevelText = document.getElementById('zoom-level');
    const canvasArea = document.getElementById('area-4');
    if (zoomLevelText) zoomLevelText.innerText = Math.round(window.currentZoom * 100) + '%';
    if (canvasArea) canvasArea.style.zoom = window.currentZoom;
    if (typeof addHistory === 'function') addHistory('Zoom auf ' + (zoomLevelText ? zoomLevelText.innerText : window.currentZoom));
}