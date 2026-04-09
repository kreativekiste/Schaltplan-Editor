// www.kreativekiste.de // 09.04.2026 // Version 2.0 (D I 1 2 3 Tabs)

const pageTabsContainer = document.getElementById('page-tabs');

function initPages() { 
    // Wir starten standardmäßig auf Seite 1
    if (typeof currentPageId === 'undefined' || !currentPageId) {
        window.currentPageId = 1;
    }
    renderTabs(); 
}

function renderTabs() {
    pageTabsContainer.innerHTML = '';
    
    // TAB: Deckblatt (D)
    const tabD = document.createElement('div');
    tabD.className = `page-tab ${currentPageId === 'D' ? 'active' : ''}`;
    tabD.textContent = 'D';
    tabD.style.fontWeight = 'bold';
    tabD.onclick = () => switchPage('D');
    pageTabsContainer.appendChild(tabD);

    // TAB: Inhaltsverzeichnis (I)
    const tabI = document.createElement('div');
    tabI.className = `page-tab ${currentPageId === 'I' ? 'active' : ''}`;
    tabI.textContent = 'I';
    tabI.style.fontWeight = 'bold';
    tabI.onclick = () => switchPage('I');
    pageTabsContainer.appendChild(tabI);

    // TABS: Die Zeichnungs-Seiten (1, 2, 3...)
    pages.forEach((page, index) => {
        const tab = document.createElement('div');
        tab.className = `page-tab ${page.id === currentPageId ? 'active' : ''}`;
        tab.textContent = (index + 1).toString(); // Es steht nur noch die Zahl dort
        tab.onclick = () => switchPage(page.id);
        pageTabsContainer.appendChild(tab);
    });
}

function renderIHVList() {
    const ihvList = document.getElementById('ihv-list');
    if (!ihvList) return;
    
    ihvList.innerHTML = '';
    
    pages.forEach((page, index) => {
        const row = document.createElement('div');
        row.className = 'ihv-row';
        
        row.innerHTML = `
            <div class="ihv-page-name" style="width: 60px; text-align: center; font-size: 1.2em;">${index + 1}</div>
            <input type="text" class="ihv-input ihv-large" placeholder="Beschreibung / Anlage..." value="${page.desc || ''}">
            <input type="text" class="ihv-input ihv-small" style="width: 150px;" placeholder="TT.MM.JJJJ" value="${page.rev || ''}">
        `;
        
        const inputs = row.querySelectorAll('input');
        inputs[0].addEventListener('input', (e) => { page.desc = e.target.value; });
        inputs[1].addEventListener('input', (e) => { page.rev = e.target.value; });
        
        ihvList.appendChild(row);
    });
}

function switchPage(id) {
    // Nur speichern, wenn wir gerade auf einer echten Zeichen-Seite waren
    if (currentPageId !== 'D' && currentPageId !== 'I') {
        saveCurrentPageState();
    }
    
    currentPageId = id;

    // Alle drei Ansichten (Canvas, D, I) erstmal verstecken
    const area4 = document.getElementById('area-4');
    const deckblattView = document.getElementById('deckblatt-view');
    const ihvView = document.getElementById('ihv-view');
    
    if (area4) area4.classList.add('hidden');
    if (deckblattView) deckblattView.classList.add('hidden');
    if (ihvView) ihvView.classList.add('hidden');

    // Jetzt nur die richtige Ansicht einblenden
    if (id === 'D') {
        if (deckblattView) deckblattView.classList.remove('hidden');
        if(typeof addHistory === 'function') addHistory('Deckblatt geöffnet');
    } else if (id === 'I') {
        if (ihvView) ihvView.classList.remove('hidden');
        renderIHVList();
        if(typeof addHistory === 'function') addHistory('Inhaltsverzeichnis geöffnet');
    } else {
        if (area4) area4.classList.remove('hidden');
        loadPageState(id);
    }

    renderTabs();
}

function addPage() {
    if (currentPageId !== 'D' && currentPageId !== 'I') {
        saveCurrentPageState();
    }
    const newId = pages.length > 0 ? Math.max(...pages.map(p => p.id)) + 1 : 1;
    // Wir speichern die Seite intern. Der Name (1, 2, 3) wird beim Rendern live erzeugt.
    pages.push({ id: newId, name: newId.toString(), desc: "", rev: "", components: [], connections: [] });
    switchPage(newId);
    if(typeof addHistory === 'function') addHistory('Neue Seite erstellt');
}

function deletePage() {
    if (currentPageId === 'D' || currentPageId === 'I') {
        alert("Deckblatt (D) und Inhaltsverzeichnis (I) können nicht gelöscht werden.");
        return;
    }
    if (pages.length <= 1) {
        alert("Du kannst die letzte Zeichen-Seite nicht löschen! Der Schaltplan braucht mindestens eine Arbeitsfläche.");
        return;
    }
    if (!confirm("⚠️ Willst du diese Seite wirklich löschen? Alle Bauteile und Kabel darauf gehen dauerhaft verloren!")) return;

    pages = pages.filter(p => p.id !== currentPageId);
    
    // Nach dem Löschen auf Seite 1 (die erste verbleibende Seite) springen
    currentPageId = pages[0].id;
    switchPage(currentPageId);
    
    if(typeof addHistory === 'function') addHistory('Seite gelöscht');
}

function saveCurrentPageState() {
    // Deckblatt und IHV haben keine Bauteile, also nichts zu speichern
    if (currentPageId === 'D' || currentPageId === 'I') return; 

    const currentPage = pages.find(p => p.id === currentPageId);
    if (!currentPage) return;

    const comps = [];
    if (typeof canvas !== 'undefined' && canvas) {
        canvas.querySelectorAll('.dropped-component').forEach(el => {
            comps.push({
                id: el.dataset.id, type: el.dataset.type, label: el.dataset.label,
                baseLabel: el.dataset.baseLabel, subtype: el.dataset.subtype,
                poles: el.dataset.poles, hubbel: el.dataset.hubbel, 
                terminals: el.dataset.terminals, parentId: el.dataset.parentId, 
                linkId: el.dataset.linkId, linkPage: el.dataset.linkPage, 
                html: el.innerHTML, left: el.style.left, top: el.style.top,
                rotation: el.dataset.rotation, flipX: el.dataset.flipX
            });
        });
    }
    currentPage.components = comps;
    
    if (typeof connections !== 'undefined') {
        const conns = connections.map(c => ({
            port1Id: c.port1.closest('.dropped-component').dataset.id,
            port1Index: Array.from(c.port1.closest('.dropped-component').querySelectorAll('.port')).indexOf(c.port1),
            port2Id: c.port2.closest('.dropped-component').dataset.id,
            port2Index: Array.from(c.port2.closest('.dropped-component').querySelectorAll('.port')).indexOf(c.port2),
            customX1: c.customX1, customY: c.customY, customX2: c.customX2
        }));
        currentPage.connections = conns;
    }
}

function loadPageState(id) {
    const page = pages.find(p => p.id === id);
    if (!page) return;

    if (typeof canvas !== 'undefined' && canvas) {
        canvas.querySelectorAll('.dropped-component').forEach(c => c.remove());
    }
    if (typeof wiringLayer !== 'undefined' && wiringLayer) wiringLayer.innerHTML = ''; 
    if (typeof connections !== 'undefined') connections = [];

    page.components.forEach(c => {
        const div = document.createElement('div');
        div.className = 'dropped-component'; div.style.left = c.left; div.style.top = c.top;
        div.dataset.id = c.id; div.dataset.type = c.type;
        if(c.label) div.dataset.label = c.label;
        if(c.baseLabel) div.dataset.baseLabel = c.baseLabel;
        if(c.subtype) div.dataset.subtype = c.subtype;
        if(c.poles) div.dataset.poles = c.poles;
        if(c.hubbel) div.dataset.hubbel = c.hubbel;
        if(c.terminals) div.dataset.terminals = c.terminals;
        if(c.parentId) div.dataset.parentId = c.parentId;
        if(c.linkId) div.dataset.linkId = c.linkId;
        if(c.linkPage) div.dataset.linkPage = c.linkPage;
        if(c.rotation) div.dataset.rotation = c.rotation;
        if(c.flipX) div.dataset.flipX = c.flipX;
        div.innerHTML = c.html;

        if (c.type === 'pfeil_raus' || c.type === 'pfeil_rein') {
            if (typeof updateArrowVisuals === 'function') updateArrowVisuals(div);
        }

        div.addEventListener('mousedown', typeof startMovingComponent === 'function' ? startMovingComponent : null);
        div.addEventListener('click', typeof handleComponentClick === 'function' ? handleComponentClick : null);
        div.addEventListener('dblclick', (e) => {
            if ((typeof isAssignMode !== 'undefined' && isAssignMode) || (window.crossPageAssign && window.crossPageAssign.active)) return;
            window.contextMenuTarget = div;
            if(typeof showContextMenu === 'function') showContextMenu(e.clientX, e.clientY);
        });
        div.querySelectorAll('.port').forEach(p => p.onclick = typeof handlePortClick === 'function' ? handlePortClick : null);
        
        if (typeof canvas !== 'undefined' && canvas) canvas.appendChild(div);
    });

    page.connections.forEach(conn => {
        if (typeof canvas !== 'undefined' && canvas) {
            const comp1 = canvas.querySelector(`[data-id="${conn.port1Id}"]`);
            const comp2 = canvas.querySelector(`[data-id="${conn.port2Id}"]`);
            if (comp1 && comp2) {
                const port1 = comp1.querySelectorAll('.port')[conn.port1Index];
                const port2 = comp2.querySelectorAll('.port')[conn.port2Index];
                if(typeof window.addConnection === 'function') {
                    window.addConnection(port1, port2, { customX1: conn.customX1, customY: conn.customY, customX2: conn.customX2 });
                }
            }
        }
    });

    if(typeof updateCables === 'function') updateCables();

    if (window.crossPageAssign && window.crossPageAssign.active) {
        if (typeof canvas !== 'undefined' && canvas) canvas.classList.add('assign-mode');
    }
}

const btnAddPage = document.getElementById('btn-add-page');
if (btnAddPage) btnAddPage.onclick = addPage;

const btnDeletePage = document.getElementById('btn-delete-page');
if (btnDeletePage) btnDeletePage.onclick = deletePage;

initPages();