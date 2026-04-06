// www.kreativekiste.de // 05.04.2026 // Version 1.4

let isDraggingWire = false;
let draggedWireTarget = null; 

document.addEventListener('mousemove', (e) => {
    if (isDraggingWire && draggedWireTarget) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        if (draggedWireTarget.type === 'X1') draggedWireTarget.conn.customX1 = mouseX;
        if (draggedWireTarget.type === 'Y')  draggedWireTarget.conn.customY = mouseY;
        if (draggedWireTarget.type === 'X2') draggedWireTarget.conn.customX2 = mouseX;

        updateCables();
    }
});

document.addEventListener('mouseup', () => {
    if (isDraggingWire) {
        isDraggingWire = false;
        draggedWireTarget = null;
        addHistory('Kabelverlauf angepasst');
    }
});

window.addConnection = function(port1, port2, savedData = {}) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('stroke', 'black');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('fill', 'none'); 
    wiringLayer.appendChild(path);

    const h1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    const h2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    const h3 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

    [h1, h2, h3].forEach(h => {
        h.setAttribute('class', 'wire-handle hidden');
        wiringLayer.appendChild(h);
    });

    const connObj = {
        pathElem: path, port1: port1, port2: port2, h1: h1, h2: h2, h3: h3,
        showHandles: false, customX1: savedData.customX1, customY: savedData.customY, customX2: savedData.customX2
    };

    path.addEventListener('dblclick', (e) => {
        e.preventDefault(); e.stopPropagation();
        connObj.showHandles = !connObj.showHandles;
        updateCables();
        addHistory(connObj.showHandles ? 'Kabel-Punkte eingeblendet' : 'Kabel-Punkte ausgeblendet');
    });

    h1.addEventListener('mousedown', (e) => { e.preventDefault(); e.stopPropagation(); isDraggingWire = true; draggedWireTarget = {conn: connObj, type: 'X1'}; });
    h2.addEventListener('mousedown', (e) => { e.preventDefault(); e.stopPropagation(); isDraggingWire = true; draggedWireTarget = {conn: connObj, type: 'Y'}; });
    h3.addEventListener('mousedown', (e) => { e.preventDefault(); e.stopPropagation(); isDraggingWire = true; draggedWireTarget = {conn: connObj, type: 'X2'}; });

    connections.push(connObj);
    updateCables();
};

function handlePortClick(e) {
    const port = e.target;
    const rect = canvas.getBoundingClientRect();
    const portRect = port.getBoundingClientRect();
    
    const x = portRect.left - rect.left + (portRect.width / 2);
    const y = portRect.top - rect.top + (portRect.height / 2);

    if (!startPort) {
        startPort = { x, y, element: port };
        port.setAttribute('fill', 'blue'); 
        addHistory('Kabel gestartet');
    } else {
        if (startPort.element !== port) {
            window.addConnection(startPort.element, port, {}); 
            addHistory('Bauteile verbunden');
        }
        startPort.element.setAttribute('fill', 'red');
        startPort = null;
    }
}

function updateCables() {
    const canvasRect = canvas.getBoundingClientRect();
    
    connections = connections.filter(conn => {
        if (!document.body.contains(conn.port1) || !document.body.contains(conn.port2)) {
            conn.pathElem.remove();
            conn.h1.remove(); conn.h2.remove(); conn.h3.remove();
            return false;
        }
        return true;
    });
    
    connections.forEach(conn => {
        const rect1 = conn.port1.getBoundingClientRect();
        const rect2 = conn.port2.getBoundingClientRect();
        
        const x1 = rect1.left - canvasRect.left + (rect1.width / 2);
        const y1 = rect1.top - canvasRect.top + (rect1.height / 2);
        const x2 = rect2.left - canvasRect.left + (rect2.width / 2);
        const y2 = rect2.top - canvasRect.top + (rect2.height / 2);

        const cy1 = parseFloat(conn.port1.getAttribute('cy') || '50');
        const cy2 = parseFloat(conn.port2.getAttribute('cy') || '50');
        const isTop1 = cy1 < 50;
        const isTop2 = cy2 < 50;

        const y1_off = y1 + (isTop1 ? -20 : 20);
        const y2_off = y2 + (isTop2 ? -20 : 20);

        let defaultYMid;
        if (isTop1 && isTop2) defaultYMid = Math.min(y1, y2) - 40;
        else if (!isTop1 && !isTop2) defaultYMid = Math.max(y1, y2) + 40;
        else defaultYMid = y1_off + (y2_off - y1_off) / 2;

        const X1 = conn.customX1 !== undefined ? conn.customX1 : x1;
        const Y_mid = conn.customY !== undefined ? conn.customY : defaultYMid;
        const X2 = conn.customX2 !== undefined ? conn.customX2 : x2;

        const d = `M ${x1} ${y1} L ${x1} ${y1_off} L ${X1} ${y1_off} L ${X1} ${Y_mid} L ${X2} ${Y_mid} L ${X2} ${y2_off} L ${x2} ${y2_off} L ${x2} ${y2}`;
        conn.pathElem.setAttribute('d', d);

        // Eckpunkte abspeichern für den T-Knoten-Check
        conn.points = [
            {x: x1, y: y1}, {x: x1, y: y1_off}, {x: X1, y: y1_off},
            {x: X1, y: Y_mid}, {x: X2, y: Y_mid}, {x: X2, y: y2_off},
            {x: x2, y: y2_off}, {x: x2, y: y2}
        ];

        if (conn.showHandles) {
            conn.h1.classList.remove('hidden'); conn.h2.classList.remove('hidden'); conn.h3.classList.remove('hidden');
            conn.h1.setAttribute('cx', X1); conn.h1.setAttribute('cy', y1_off + (Y_mid - y1_off) / 2);
            conn.h1.setAttribute('class', 'wire-handle v-handle');
            conn.h2.setAttribute('cx', X1 + (X2 - X1) / 2); conn.h2.setAttribute('cy', Y_mid);
            conn.h2.setAttribute('class', 'wire-handle h-handle');
            conn.h3.setAttribute('cx', X2); conn.h3.setAttribute('cy', Y_mid + (y2_off - Y_mid) / 2);
            conn.h3.setAttribute('class', 'wire-handle v-handle');
        } else {
            conn.h1.classList.add('hidden'); conn.h2.classList.add('hidden'); conn.h3.classList.add('hidden');
        }
    });

    // --- NEU: HOCHPRÄZISE KNOTEN-LOGIK (V1.4) ---
    document.querySelectorAll('.junction-dot').forEach(el => el.remove());

    const allPorts = Array.from(document.querySelectorAll('.port')).map(p => {
        const r = p.getBoundingClientRect();
        return { x: r.left - canvasRect.left + r.width/2, y: r.top - canvasRect.top + r.height/2 };
    });

    function sharePort(c1, c2) {
        return c1.port1 === c2.port1 || c1.port1 === c2.port2 || c1.port2 === c2.port1 || c1.port2 === c2.port2;
    }

    const nets = [];
    const visitedConns = new Set();
    connections.forEach(c => {
        if (visitedConns.has(c)) return;
        const net = [];
        const queue = [c];
        visitedConns.add(c);
        while(queue.length > 0) {
            const curr = queue.shift();
            net.push(curr);
            connections.forEach(other => {
                if (!visitedConns.has(other) && sharePort(curr, other)) {
                    visitedConns.add(other);
                    queue.push(other);
                }
            });
        }
        nets.push(net);
    });

    const validJunctions = [];

    nets.forEach(net => {
        const segments = [];
        net.forEach(c => {
            for (let k = 0; k < c.points.length - 1; k++) {
                segments.push({a: c.points[k], b: c.points[k+1]});
            }
        });

        const candidatePoints = [];
        const addCandidate = (x, y) => {
            if (!candidatePoints.some(p => Math.abs(p.x - x) < 1 && Math.abs(p.y - y) < 1)) {
                candidatePoints.push({x, y});
            }
        };

        segments.forEach(seg => { addCandidate(seg.a.x, seg.a.y); addCandidate(seg.b.x, seg.b.y); });

        // Schnittpunkte finden
        segments.forEach(seg1 => {
            segments.forEach(seg2 => {
                const isHoriz1 = Math.abs(seg1.a.y - seg1.b.y) < 1;
                const isHoriz2 = Math.abs(seg2.a.y - seg2.b.y) < 1;
                if (isHoriz1 && !isHoriz2) {
                    const x = seg2.a.x; const y = seg1.a.y;
                    if (x >= Math.min(seg1.a.x, seg1.b.x) - 1 && x <= Math.max(seg1.a.x, seg1.b.x) + 1 &&
                        y >= Math.min(seg2.a.y, seg2.b.y) - 1 && y <= Math.max(seg2.a.y, seg2.b.y) + 1) {
                        addCandidate(x, y);
                    }
                }
            });
        });

        // Abgangs-Richtungen zählen (Die magische Fehlerkorrektur!)
        candidatePoints.forEach(p => {
            let hasUp = false, hasDown = false, hasLeft = false, hasRight = false;
            const tol = 1;

            segments.forEach(seg => {
                const isHoriz = Math.abs(seg.a.y - seg.b.y) < tol;
                const isVert = Math.abs(seg.a.x - seg.b.x) < tol;

                if (isHoriz && Math.abs(p.y - seg.a.y) < tol) {
                    const minX = Math.min(seg.a.x, seg.b.x); const maxX = Math.max(seg.a.x, seg.b.x);
                    if (p.x >= minX - tol && p.x <= maxX + tol) {
                        if (p.x > minX + tol) hasLeft = true;
                        if (p.x < maxX - tol) hasRight = true;
                    }
                }
                if (isVert && Math.abs(p.x - seg.a.x) < tol) {
                    const minY = Math.min(seg.a.y, seg.b.y); const maxY = Math.max(seg.a.y, seg.b.y);
                    if (p.y >= minY - tol && p.y <= maxY + tol) {
                        if (p.y > minY + tol) hasUp = true;
                        if (p.y < maxY - tol) hasDown = true;
                    }
                }
            });

            // Gibt es mindestens 3 Richtungen? (T-Stück oder Kreuzung)
            const dirCount = (hasUp ? 1 : 0) + (hasDown ? 1 : 0) + (hasLeft ? 1 : 0) + (hasRight ? 1 : 0);

            if (dirCount >= 3) {
                let isPort = allPorts.some(pt => Math.hypot(p.x - pt.x, p.y - pt.y) < 5);
                if (!isPort) {
                    let exists = validJunctions.some(vj => Math.hypot(vj.x - p.x, vj.y - p.y) < 2);
                    if (!exists) validJunctions.push({x: p.x, y: p.y});
                }
            }
        });
    });

    validJunctions.forEach(jp => {
        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('cx', jp.x); dot.setAttribute('cy', jp.y);
        dot.setAttribute('r', '4'); dot.setAttribute('fill', 'black');
        dot.setAttribute('class', 'junction-dot');
        dot.style.pointerEvents = 'none'; 
        wiringLayer.appendChild(dot);
    });
}
