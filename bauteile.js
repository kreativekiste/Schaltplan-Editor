// www.kreativekiste.de // 08.04.2026 // Version 4.0

if (typeof window.fCounter === 'undefined') window.fCounter = 1;
if (typeof window.qCounter === 'undefined') window.qCounter = 1; // Zähler für Schalter/LSS (BMK: -Q)

window.attachDragListeners = function() {
    const items = document.querySelectorAll('.component-item');
    items.forEach(item => {
        item.removeEventListener('dragstart', handleDragStart); 
        item.addEventListener('dragstart', handleDragStart);
    });
};

function handleDragStart(e) {
    draggedHTML = e.currentTarget.querySelector('svg').outerHTML; 
    draggedType = e.currentTarget.getAttribute('data-type') || 'custom'; 
    e.dataTransfer.setData('text/plain', ''); 
}

window.attachDragListeners();

canvas.addEventListener('dragover', (e) => e.preventDefault());

canvas.addEventListener('drop', (e) => {
    e.preventDefault(); if (!draggedHTML) return;
    
    const zoom = window.currentZoom || 1.0;
    const rect = canvas.getBoundingClientRect(); 
    const x = ((e.clientX - rect.left) / zoom) - 30; 
    const y = ((e.clientY - rect.top) / zoom) - 50;  
    
    const newComp = document.createElement('div'); 
    newComp.className = 'dropped-component'; 
    newComp.style.left = x + 'px'; 
    newComp.style.top = y + 'px'; 
    newComp.innerHTML = draggedHTML;
    const editBtn = newComp.querySelector('.edit-comp-btn'); 
    if (editBtn) editBtn.remove();
    newComp.dataset.id = 'comp_' + Date.now(); 
    newComp.dataset.type = draggedType; 
    newComp.dataset.subtype = 'normal'; 

    if (draggedType === 'hauptkontakt') { newComp.dataset.poles = "3"; newComp.dataset.hubbel = "true"; }
    if (draggedType === 'motor') { newComp.dataset.poles = "3"; }
    if (draggedType === 'klemme') { newComp.dataset.terminals = "1"; }
    if (draggedType === 'lampe') { newComp.dataset.subtype = "bulb"; }
    if (draggedType === 'schuetz') { 
        const labelText = `1K${coilCounter++}`; 
        newComp.dataset.label = labelText; 
        newComp.dataset.baseLabel = labelText; 
        updateLabel(newComp, labelText, 'pos-bottom-left'); 
    }
    if (draggedType === 'schmelzsicherung') {
        newComp.dataset.poles = "1";
        const labelText = `1F${window.fCounter++}`; 
        newComp.dataset.label = labelText; 
        newComp.dataset.baseLabel = labelText; 
        updateLabel(newComp, labelText, 'pos-bottom-left'); 
    }
    if (draggedType === 'leitungsschutzschalter') {
        newComp.dataset.poles = "1";
        const labelText = `1Q${window.qCounter++}`; 
        newComp.dataset.label = labelText; 
        newComp.dataset.baseLabel = labelText; 
        updateLabel(newComp, labelText, 'pos-bottom-left'); 
    }
    if (draggedType === 'fi_schutzschalter') {
        newComp.dataset.poles = "1"; // 1 bedeutet: 1x L + N + PE
        const labelText = `1F${window.fCounter++}`; 
        newComp.dataset.label = labelText; 
        newComp.dataset.baseLabel = labelText; 
        updateLabel(newComp, labelText, 'pos-bottom-left'); 
        updatePowerContactVisuals(newComp); // Layout sofort anwenden
    }

    const ports = newComp.querySelectorAll('.port');
    ports.forEach(port => { 
        port.addEventListener('mousedown', (ev) => ev.stopPropagation()); 
        port.addEventListener('click', handlePortClick); 
    });
    
    newComp.addEventListener('mousedown', startMovingComponent); 
    newComp.addEventListener('click', handleComponentClick);
    newComp.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        if (typeof isAssignMode !== 'undefined' && isAssignMode || (window.crossPageAssign && window.crossPageAssign.active)) return;
        contextMenuTarget = newComp; 
        if (typeof showContextMenu === 'function') showContextMenu(e.clientX, e.clientY);
    });

    canvas.appendChild(newComp); 
    if (typeof addHistory === 'function') addHistory('Bauteil platziert'); 
    draggedHTML = null;
});

function updateLabel(compEl, text, positionClass) {
    let label = compEl.querySelector('.comp-label');
    if (!label) { label = document.createElement('span'); compEl.appendChild(label); }
    label.className = 'comp-label ' + positionClass; label.textContent = text;
}
function updateTerminalLabel(compEl, text, positionClass) {
    let label = compEl.querySelector('.' + positionClass);
    if (!label) { label = document.createElement('span'); label.className = 'terminal-label ' + positionClass; compEl.appendChild(label); }
    label.textContent = text;
}

window.updateArrowVisuals = function(comp) {
    let label = comp.querySelector('.arrow-link-label');
    if (!label) {
        label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('class', 'arrow-link-label');
        label.setAttribute('font-size', '11');
        label.setAttribute('font-family', 'Arial');
        label.setAttribute('fill', '#2980b9');
        comp.querySelector('svg').appendChild(label);
    }
    if (comp.dataset.linkPage) { label.textContent = `-> S.${comp.dataset.linkPage}`; } else { label.textContent = ''; }
    if (comp.dataset.type === 'pfeil_raus') { label.setAttribute('x', '15'); label.setAttribute('y', '45'); } else { label.setAttribute('x', '5'); label.setAttribute('y', '45'); }
};

function handleComponentClick(e) {
    if (typeof hasMoved !== 'undefined' && hasMoved) return; 
    if (typeof isAssignMode !== 'undefined' && isAssignMode && typeof selectedParent !== 'undefined' && selectedParent) {
        e.stopPropagation(); const clickedComp = e.currentTarget;
        if (clickedComp.dataset.type === 'schliesser' || clickedComp.dataset.type === 'oeffner' || clickedComp.dataset.type === 'hauptkontakt') {
            clickedComp.setAttribute('data-parent-id', selectedParent.dataset.id);
            updateLabel(clickedComp, selectedParent.dataset.label, 'pos-left');
            recalculateTerminals(selectedParent.dataset.id);
            if (typeof updateCoilVisuals === 'function') updateCoilVisuals(selectedParent.dataset.id);
            if (typeof addHistory === 'function') addHistory('Kontakt zugeordnet');
        }
        return;
    }
    if (window.crossPageAssign && window.crossPageAssign.active) {
        e.stopPropagation();
        const clickedComp = e.currentTarget;
        if (clickedComp.dataset.type === 'pfeil_raus' || clickedComp.dataset.type === 'pfeil_rein') {
            const sId = window.crossPageAssign.sourceId;
            const sPageId = window.crossPageAssign.sourcePage;
            const tId = clickedComp.dataset.id;
            const tPageId = typeof currentPageId !== 'undefined' ? currentPageId : 1;
            if (sId === tId) { alert("Ein Pfeil kann nicht mit sich selbst verlinkt werden!"); return; }
            clickedComp.dataset.linkId = sId;
            clickedComp.dataset.linkPage = sPageId;
            updateArrowVisuals(clickedComp);
            if (sPageId === tPageId) {
                const sourceEl = document.querySelector(`[data-id="${sId}"]`);
                if (sourceEl) { sourceEl.dataset.linkId = tId; sourceEl.dataset.linkPage = tPageId; updateArrowVisuals(sourceEl); }
            } else {
                if (typeof pages !== 'undefined') {
                    const sPage = pages.find(p => p.id === sPageId);
                    if (sPage) { const sComp = sPage.components.find(c => c.id === sId); if (sComp) { sComp.linkId = tId; sComp.linkPage = tPageId; } }
                }
            }
            if (typeof addHistory === 'function') addHistory(`Erfolgreich mit Seite ${sPageId} verlinkt!`);
            window.crossPageAssign.active = false;
            canvas.classList.remove('assign-mode');
        }
    }
}

window.updateMotorVisuals = function(comp) { const poles = parseInt(comp.dataset.poles || '3'); const svg = comp.querySelector('svg.symbol'); let html = `<circle cx="45" cy="50" r="25" fill="none" stroke="black" stroke-width="2"/><text x="45" y="55" text-anchor="middle" font-size="20" font-family="Arial">M</text><text x="45" y="68" text-anchor="middle" font-size="10" font-family="Arial">3~</text><line x1="25" y1="10" x2="25" y2="25" stroke="black" stroke-width="2"/><line x1="45" y1="10" x2="45" y2="25" stroke="black" stroke-width="2"/><line x1="65" y1="10" x2="65" y2="25" stroke="black" stroke-width="2"/><circle cx="25" cy="10" r="4" fill="red" class="port"/><circle cx="45" cy="10" r="4" fill="red" class="port"/><circle cx="65" cy="10" r="4" fill="red" class="port"/><text x="30" y="20" font-size="9" font-family="Arial">U1</text><text x="50" y="20" font-size="9" font-family="Arial">V1</text><text x="70" y="20" font-size="9" font-family="Arial">W1</text>`; if (poles === 6) { html += `<line x1="25" y1="75" x2="25" y2="90" stroke="black" stroke-width="2"/><line x1="45" y1="75" x2="45" y2="90" stroke="black" stroke-width="2"/><line x1="65" y1="75" x2="65" y2="90" stroke="black" stroke-width="2"/><circle cx="25" cy="90" r="4" fill="red" class="port"/><circle cx="45" cy="90" r="4" fill="red" class="port"/><circle cx="65" cy="90" r="4" fill="red" class="port"/><text x="30" y="85" font-size="9" font-family="Arial">W2</text><text x="50" y="85" font-size="9" font-family="Arial">U2</text><text x="70" y="85" font-size="9" font-family="Arial">V2</text>`; } svg.innerHTML = html; const ports = comp.querySelectorAll('.port'); ports.forEach(p => { p.addEventListener('mousedown', e => e.stopPropagation()); p.addEventListener('click', handlePortClick); }); };
window.updateTerminalVisuals = function(comp) { const count = parseInt(comp.dataset.terminals || '1'); const svg = comp.querySelector('svg.symbol'); const width = count * 30; svg.setAttribute('viewBox', `0 0 ${width} 100`); svg.setAttribute('width', width); let html = ''; for(let i=0; i<count; i++) { const cx = 15 + (i * 30); html += `<line x1="${cx}" y1="10" x2="${cx}" y2="40" stroke="black" stroke-width="2"/><circle cx="${cx}" cy="10" r="4" fill="red" class="port"/><circle cx="${cx}" cy="50" r="10" fill="none" stroke="black" stroke-width="2"/><line x1="${cx}" y1="60" x2="${cx}" y2="90" stroke="black" stroke-width="2"/><circle cx="${cx}" cy="90" r="4" fill="red" class="port"/><text x="${cx+8}" y="53" font-size="9" font-family="Arial">${i+1}</text>`; } if(count > 1) { html += `<line x1="15" y1="50" x2="${15 + (count-1)*30}" y2="50" stroke="black" stroke-width="1" stroke-dasharray="2,2"/>`; } svg.innerHTML = html; const ports = comp.querySelectorAll('.port'); ports.forEach(p => { p.addEventListener('mousedown', e => e.stopPropagation()); p.addEventListener('click', handlePortClick); }); };
window.updateLampVisuals = function(comp) { const subtype = comp.dataset.subtype || 'bulb'; const svg = comp.querySelector('svg.symbol'); let html = `<line x1="30" y1="10" x2="30" y2="30" stroke="black" stroke-width="2"/><circle cx="30" cy="10" r="4" fill="red" class="port"/><circle cx="30" cy="50" r="20" fill="none" stroke="black" stroke-width="2"/><line x1="16" y1="36" x2="44" y2="64" stroke="black" stroke-width="2"/><line x1="16" y1="64" x2="44" y2="36" stroke="black" stroke-width="2"/><line x1="30" y1="70" x2="30" y2="90" stroke="black" stroke-width="2"/><circle cx="30" cy="90" r="4" fill="red" class="port"/>`; if (subtype === 'led') { html += `<path d="M 50 35 L 60 25 L 60 30 M 60 25 L 55 25" fill="none" stroke="black" stroke-width="1.5"/><path d="M 55 25 L 65 15 L 65 20 M 65 15 L 60 15" fill="none" stroke="black" stroke-width="1.5"/>`; } else if (subtype === 'blink') { html += `<path d="M 15 25 Q 25 15 30 20 T 45 15" fill="none" stroke="black" stroke-width="1.5"/>`; } svg.innerHTML = html; const ports = comp.querySelectorAll('.port'); ports.forEach(p => { p.addEventListener('mousedown', e => e.stopPropagation()); p.addEventListener('click', handlePortClick); }); };
function updateContactVisuals(compEl) { const type = compEl.dataset.type; const subtype = compEl.dataset.subtype || 'normal'; const svg = compEl.querySelector('svg.symbol'); if (!svg) return; let mod = svg.querySelector('.time-modifier'); if (mod) mod.remove(); if (subtype === 'normal') return; mod = document.createElementNS('http://www.w3.org/2000/svg', 'g'); mod.setAttribute('class', 'time-modifier'); const stemX2 = type === 'schliesser' ? 26 : 33; const stem = document.createElementNS('http://www.w3.org/2000/svg', 'line'); stem.setAttribute('x1', '10'); stem.setAttribute('y1', '55'); stem.setAttribute('x2', stemX2.toString()); stem.setAttribute('y2', '55'); stem.setAttribute('stroke', 'black'); stem.setAttribute('stroke-width', '2'); mod.appendChild(stem); const curveB = document.createElementNS('http://www.w3.org/2000/svg', 'path'); curveB.setAttribute('d', 'M 16 48 Q 10 55 16 62'); curveB.setAttribute('fill', 'none'); curveB.setAttribute('stroke', 'black'); curveC = document.createElementNS('http://www.w3.org/2000/svg', 'path'); curveC.setAttribute('d', 'M 12 48 Q 18 55 12 62'); curveC.setAttribute('fill', 'none'); curveC.setAttribute('stroke', 'black'); curveC.setAttribute('stroke-width', '2'); if (subtype === 'timer-on' || subtype === 'timer-onoff') mod.appendChild(curveB.cloneNode()); if (subtype === 'timer-off' || subtype === 'timer-onoff') mod.appendChild(curveC.cloneNode()); svg.appendChild(mod); }

// --- DAS NEUE HERZSTÜCK FÜR DEN FI (INKL. ERDE) ---
window.updatePowerContactVisuals = function(compEl) { 
    const type = compEl.dataset.type;
    if (type !== 'hauptkontakt' && type !== 'schmelzsicherung' && type !== 'leitungsschutzschalter' && type !== 'fi_schutzschalter') return; 
    
    const basePoles = parseInt(compEl.dataset.poles || '3'); 
    
    // FI zeichnet: Gewählte L-Pole + N (durchgehend) + PE (durchgehend) = basePoles + 2
    const totalLines = (type === 'fi_schutzschalter') ? basePoles + 2 : basePoles;

    const hubbel = compEl.dataset.hubbel !== 'false'; 
    const svg = compEl.querySelector('svg.symbol'); 
    const width = 30 + (totalLines * 30); 
    svg.setAttribute('viewBox', `0 0 ${width + 10} 100`); 
    svg.setAttribute('width', width); 
    
    let newHTML = ''; 
    for (let i = 0; i < totalLines; i++) { 
        const x = 30 + (i * 30); 
        const isN = (type === 'fi_schutzschalter' && i === totalLines - 2);
        const isPE = (type === 'fi_schutzschalter' && i === totalLines - 1);
        
        if (isN) {
            // N-Leiter (durchgehend)
            newHTML += `<line x1="${x}" y1="10" x2="${x}" y2="90" stroke="black" stroke-width="2"/>`;
        } else if (isPE) {
            // PE-Leiter (durchgehend, optisch als Erde hervorgehoben gestrichelt)
            newHTML += `<line x1="${x}" y1="10" x2="${x}" y2="90" stroke="black" stroke-width="2" stroke-dasharray="8,4"/>`;
        } else if (type === 'hauptkontakt') {
            newHTML += `<line x1="${x}" y1="10" x2="${x}" y2="40" stroke="black" stroke-width="2"/>`;
            newHTML += `<line x1="${x}" y1="70" x2="${x}" y2="90" stroke="black" stroke-width="2"/>`;
            newHTML += `<line x1="${x-8}" y1="40" x2="${x}" y2="70" stroke="black" stroke-width="2"/>`;
            if (hubbel) newHTML += `<path d="M ${x-6} 55 A 4 4 0 0 1 ${x-2} 55" fill="none" stroke="black" stroke-width="2"/>`;
        } else if (type === 'schmelzsicherung') {
            newHTML += `<line x1="${x}" y1="10" x2="${x}" y2="30" stroke="black" stroke-width="2"/>`;
            newHTML += `<rect x="${x-8}" y="30" width="16" height="40" fill="none" stroke="black" stroke-width="2"/>`;
            newHTML += `<line x1="${x}" y1="30" x2="${x}" y2="70" stroke="black" stroke-width="2"/>`;
            newHTML += `<line x1="${x}" y1="70" x2="${x}" y2="90" stroke="black" stroke-width="2"/>`;
        } else if (type === 'leitungsschutzschalter') {
            newHTML += `<line x1="${x}" y1="10" x2="${x}" y2="40" stroke="black" stroke-width="2"/>`;
            newHTML += `<line x1="${x-4}" y1="20" x2="${x+4}" y2="28" stroke="black" stroke-width="1.5"/>`;
            newHTML += `<line x1="${x+4}" y1="20" x2="${x-4}" y2="28" stroke="black" stroke-width="1.5"/>`;
            newHTML += `<line x1="${x-8}" y1="40" x2="${x}" y2="70" stroke="black" stroke-width="2"/>`;
            newHTML += `<path d="M ${x-12} 45 L ${x-16} 45 L ${x-16} 55 L ${x-12} 55" fill="none" stroke="black" stroke-width="1.5"/>`;
            newHTML += `<path d="M ${x-12} 60 A 4 4 0 0 1 ${x-12} 68" fill="none" stroke="black" stroke-width="1.5"/>`;
            newHTML += `<line x1="${x}" y1="70" x2="${x}" y2="90" stroke="black" stroke-width="2"/>`;
        } else if (type === 'fi_schutzschalter') {
            // L-Pole vom FI (geschaltet)
            newHTML += `<line x1="${x}" y1="10" x2="${x}" y2="40" stroke="black" stroke-width="2"/>`;
            newHTML += `<line x1="${x-8}" y1="40" x2="${x}" y2="70" stroke="black" stroke-width="2"/>`;
            newHTML += `<line x1="${x}" y1="70" x2="${x}" y2="90" stroke="black" stroke-width="2"/>`;
        }

        newHTML += `<circle cx="${x}" cy="10" r="4" fill="red" class="port"/>`;
        newHTML += `<circle cx="${x}" cy="90" r="4" fill="red" class="port"/>`;
        
        // Beschriftung: N und PE werden fest beschriftet, der Rest zählt normal
        let labelTop = '';
        let labelBottom = '';
        if (isN) {
            labelTop = 'N'; labelBottom = 'N';
        } else if (isPE) {
            labelTop = 'PE'; labelBottom = 'PE';
        } else {
            labelTop = (i*2)+1; labelBottom = (i*2)+2;
        }
        
        newHTML += `<text x="${x + 6}" y="20" font-size="9" font-family="Arial">${labelTop}</text>`;
        newHTML += `<text x="${x + 6}" y="85" font-size="9" font-family="Arial">${labelBottom}</text>`;
    } 
    
    // Zubehör nach den Linien
    if (basePoles > 1 && type === 'hauptkontakt') { 
        newHTML += `<line x1="22" y1="55" x2="${30 + ((basePoles-1)*30) - 8}" y2="55" stroke="black" stroke-width="1" stroke-dasharray="4,4"/>`; 
    } else if (type === 'fi_schutzschalter') {
        // Die Ellipse (Wandler) spannt sich exakt nur über die L-Pole und den N-Leiter!
        // Berechnung: Mitte zwischen L1 und N. 
        const ellipseCx = 30 + (basePoles * 15);
        const ellipseRx = (basePoles * 15) + 5;
        newHTML += `<ellipse cx="${ellipseCx}" cy="60" rx="${ellipseRx}" ry="10" fill="none" stroke="black" stroke-width="2"/>`;
        
        // Mechanische Verbindung nur zwischen den L-Kontakten (wie gewünscht)
        if (basePoles > 1) {
            newHTML += `<line x1="22" y1="50" x2="${30 + ((basePoles-1)*30) - 8}" y2="50" stroke="black" stroke-width="1" stroke-dasharray="4,4"/>`;
        }
    }
    
    svg.innerHTML = newHTML; 
    const ports = compEl.querySelectorAll('.port'); 
    ports.forEach(port => { 
        port.addEventListener('mousedown', (ev) => ev.stopPropagation()); 
        port.addEventListener('click', typeof handlePortClick === 'function' ? handlePortClick : null); 
    }); 
}

window.updateCoilVisuals = function(coilId) { if (!coilId) return; const coil = canvas.querySelector(`.dropped-component[data-id="${coilId}"]`); if (!coil || coil.dataset.type !== 'schuetz') return; const children = canvas.querySelectorAll(`.dropped-component[data-parent-id="${coilId}"]`); let hasOnDelay = false; let hasOffDelay = false; children.forEach(c => { if (c.dataset.subtype === 'timer-on' || c.dataset.subtype === 'timer-onoff') hasOnDelay = true; if (c.dataset.subtype === 'timer-off' || c.dataset.subtype === 'timer-onoff') hasOffDelay = true; }); const isTimer = hasOnDelay || hasOffDelay; let base = coil.dataset.baseLabel; if (!base) { base = coil.dataset.label; coil.dataset.baseLabel = base; } const newLabel = isTimer ? base + 'T' : base; coil.dataset.label = newLabel; if (typeof updateLabel === 'function') updateLabel(coil, newLabel, 'pos-bottom-left'); const svg = coil.querySelector('svg.symbol'); if (!svg) return; let mod = svg.querySelector('.coil-timer-mod'); if (mod) mod.remove(); if (isTimer) { mod = document.createElementNS('http://www.w3.org/2000/svg', 'g'); mod.setAttribute('class', 'coil-timer-mod'); const subRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect'); subRect.setAttribute('x', '50'); subRect.setAttribute('y', '37'); subRect.setAttribute('width', '8'); subRect.setAttribute('height', '26'); subRect.setAttribute('stroke', 'black'); subRect.setAttribute('stroke-width', '2'); if (hasOnDelay) { subRect.setAttribute('fill', 'black'); mod.appendChild(subRect); } else if (hasOffDelay) { subRect.setAttribute('fill', 'none'); const l1 = document.createElementNS('http://www.w3.org/2000/svg', 'line'); l1.setAttribute('x1', '50'); l1.setAttribute('y1', '37'); l1.setAttribute('x2', '58'); l1.setAttribute('y2', '63'); l1.setAttribute('stroke', 'black'); l1.setAttribute('stroke-width', '2'); const l2 = document.createElementNS('http://www.w3.org/2000/svg', 'line'); l2.setAttribute('x1', '58'); l2.setAttribute('y1', '37'); l2.setAttribute('x2', '50'); l2.setAttribute('y2', '63'); l2.setAttribute('stroke', 'black'); l2.setAttribute('stroke-width', '2'); mod.appendChild(subRect); mod.appendChild(l1); mod.appendChild(l2); } svg.appendChild(mod); } };

function recalculateTerminals(parentId) { 
    if (typeof saveCurrentPageState === 'function') saveCurrentPageState();

    let countSchliesserNormal = 1;
    let countSchliesserSpezial = 1;
    let countOeffnerNormal = 1;
    let countOeffnerSpezial = 1;
    let positionCounter = 1; 
    let spiegelTexte = []; 

    if (typeof pages !== 'undefined') {
        pages.forEach(page => {
            page.components.forEach(compData => { 
                if (compData.parentId === parentId && compData.type !== 'hauptkontakt') {
                    const type = compData.type;
                    const subtype = compData.subtype || 'normal'; 
                    let topNum = ''; 
                    let bottomNum = ''; 

                    if (window.numberingMode === 'continuous') {
                        let position = 1;
                        if (type === 'schliesser') { 
                            if (subtype !== 'normal') { 
                                position = countSchliesserSpezial++; topNum = position + '7'; bottomNum = position + '8'; 
                            } else { 
                                position = countSchliesserNormal++; topNum = position + '3'; bottomNum = position + '4'; 
                            } 
                        } else if (type === 'oeffner') { 
                            if (subtype !== 'normal') { 
                                position = countOeffnerSpezial++; topNum = position + '5'; bottomNum = position + '6'; 
                            } else { 
                                position = countOeffnerNormal++; topNum = position + '1'; bottomNum = position + '2'; 
                            } 
                        }
                    } else {
                        if (type === 'schliesser') { 
                            if (subtype === 'timer-on' || subtype === 'timer-off' || subtype === 'timer-onoff') {
                                topNum = positionCounter + '7'; bottomNum = positionCounter + '8';
                            } else { 
                                topNum = positionCounter + '3'; bottomNum = positionCounter + '4'; 
                            } 
                        } else if (type === 'oeffner') { 
                            if (subtype === 'timer-on' || subtype === 'timer-off' || subtype === 'timer-onoff') {
                                topNum = positionCounter + '5'; bottomNum = positionCounter + '6';
                            } else { 
                                topNum = positionCounter + '1'; bottomNum = positionCounter + '2'; 
                            } 
                        } 
                        positionCounter++;
                    }
                    
                    spiegelTexte.push(`${topNum}/${bottomNum} - ${page.id}`);

                    if (page.id === (typeof currentPageId !== 'undefined' ? currentPageId : 1)) {
                        const domEl = canvas.querySelector(`.dropped-component[data-id="${compData.id}"]`);
                        if (domEl) {
                            updateTerminalLabel(domEl, topNum, 'pos-term-top'); 
                            updateTerminalLabel(domEl, bottomNum, 'pos-term-bottom'); 
                        }
                    }

                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = compData.html;
                    
                    let labelTop = tempDiv.querySelector('.pos-term-top');
                    if (!labelTop) { 
                        labelTop = document.createElement('span'); 
                        labelTop.className = 'terminal-label pos-term-top'; 
                        tempDiv.appendChild(labelTop); 
                    }
                    labelTop.textContent = topNum;

                    let labelBottom = tempDiv.querySelector('.pos-term-bottom');
                    if (!labelBottom) { 
                        labelBottom = document.createElement('span'); 
                        labelBottom.className = 'terminal-label pos-term-bottom'; 
                        tempDiv.appendChild(labelBottom); 
                    }
                    labelBottom.textContent = bottomNum;

                    compData.html = tempDiv.innerHTML;
                }
            });
        });

        const spiegelInhalt = spiegelTexte.join('<br>'); 

        pages.forEach(page => {
            const coilData = page.components.find(c => c.id === parentId);
            if (coilData) {
                if (page.id === (typeof currentPageId !== 'undefined' ? currentPageId : 1)) {
                    const coilDom = canvas.querySelector(`.dropped-component[data-id="${parentId}"]`);
                    if (coilDom) {
                        let spiegelEl = coilDom.querySelector('.kontaktspiegel');
                        if (!spiegelEl) {
                            spiegelEl = document.createElement('div');
                            spiegelEl.className = 'kontaktspiegel';
                            spiegelEl.style.position = 'absolute';
                            spiegelEl.style.top = '105px';
                            spiegelEl.style.left = '50%';
                            spiegelEl.style.transform = 'translateX(-50%)';
                            spiegelEl.style.fontSize = '11px';
                            spiegelEl.style.fontFamily = 'Arial, sans-serif';
                            spiegelEl.style.color = '#2c3e50';
                            spiegelEl.style.textAlign = 'center';
                            spiegelEl.style.lineHeight = '1.3';
                            spiegelEl.style.pointerEvents = 'none';
                            spiegelEl.style.whiteSpace = 'nowrap';
                            coilDom.appendChild(spiegelEl);
                        }
                        spiegelEl.innerHTML = spiegelInhalt;
                    }
                }

                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = coilData.html;
                
                let sEl = tempDiv.querySelector('.kontaktspiegel');
                if (!sEl) {
                    sEl = document.createElement('div');
                    sEl.className = 'kontaktspiegel';
                    sEl.style.position = 'absolute';
                    sEl.style.top = '105px';
                    sEl.style.left = '50%';
                    sEl.style.transform = 'translateX(-50%)';
                    sEl.style.fontSize = '11px';
                    sEl.style.fontFamily = 'Arial, sans-serif';
                    sEl.style.color = '#2c3e50';
                    sEl.style.textAlign = 'center';
                    sEl.style.lineHeight = '1.3';
                    sEl.style.pointerEvents = 'none';
                    sEl.style.whiteSpace = 'nowrap';
                    tempDiv.appendChild(sEl);
                }
                sEl.innerHTML = spiegelInhalt;
                coilData.html = tempDiv.innerHTML;
            }
        });
    }
}

function unassignContact(contactEl) { const parentId = contactEl.getAttribute('data-parent-id'); if (!parentId) return; contactEl.removeAttribute('data-parent-id'); const compLabel = contactEl.querySelector('.comp-label'); if (compLabel) compLabel.remove(); if (contactEl.dataset.type !== 'hauptkontakt') { const termTop = contactEl.querySelector('.pos-term-top'); if (termTop) termTop.remove(); const termBottom = contactEl.querySelector('.pos-term-bottom'); if (termBottom) termBottom.remove(); } recalculateTerminals(parentId); if (typeof updateCoilVisuals === 'function') updateCoilVisuals(parentId); if(typeof addHistory === 'function') addHistory('Zuordnung getrennt'); }

function startMovingComponent(e) { 
    if (typeof isAssignMode !== 'undefined' && isAssignMode) return; 
    isDraggingComponent = true; 
    hasMoved = false; 
    currentMovedElement = e.currentTarget; 
    const rect = currentMovedElement.getBoundingClientRect(); 
    const zoom = window.currentZoom || 1.0;
    moveOffsetX = (e.clientX - rect.left) / zoom; 
    moveOffsetY = (e.clientY - rect.top) / zoom; 
}

canvas.addEventListener('mousemove', (e) => { 
    if (typeof isDraggingComponent !== 'undefined' && isDraggingComponent && currentMovedElement) { 
        hasMoved = true; 
        const canvasRect = canvas.getBoundingClientRect(); 
        const zoom = window.currentZoom || 1.0;
        let newX = ((e.clientX - canvasRect.left) / zoom) - moveOffsetX; 
        let newY = ((e.clientY - canvasRect.top) / zoom) - moveOffsetY; 
        currentMovedElement.style.left = newX + 'px'; 
        currentMovedElement.style.top = newY + 'px'; 
        if (typeof updateCables === 'function') updateCables(); 
    } 
});

document.addEventListener('mouseup', () => { if (typeof isDraggingComponent !== 'undefined' && isDraggingComponent && typeof hasMoved !== 'undefined' && hasMoved) { if(typeof addHistory === 'function') addHistory('Bauteil verschoben'); } isDraggingComponent = false; currentMovedElement = null; });

setTimeout(() => {
    if (typeof window.showContextMenu === 'function') {
        const originalShowContextMenu = window.showContextMenu;
        window.showContextMenu = function(x, y) {
            originalShowContextMenu(x, y);
            
            if (typeof contextMenuTarget !== 'undefined' && contextMenuTarget) {
                const type = contextMenuTarget.dataset.type;
                const hubbelBtn = document.getElementById('menu-power-hubbel');
                
                if (type === 'schmelzsicherung' || type === 'leitungsschutzschalter' || type === 'fi_schutzschalter') {
                    const powerMenu = document.querySelector('.power-only');
                    if (powerMenu) powerMenu.style.display = 'block';
                    if (hubbelBtn) hubbelBtn.style.display = 'none';
                } else if (type === 'hauptkontakt') {
                    if (hubbelBtn) hubbelBtn.style.display = 'block';
                }
            }
        };
    }
}, 500);