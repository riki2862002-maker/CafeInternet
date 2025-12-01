// main.js
import { UI } from './ui.js';
import { Sessions } from './sessions.js';
import { Machines } from './machines.js';
import { Pricing } from './pricing.js';
import { Reports } from './reports.js';
Reports.init();

const REFRESH_INTERVAL = 1000;
let state = { machines: [], activeSessions: [], history: [] };

async function refreshAll() {
    try {
        const machines = await Machines.getAll();
        const sessions = await Sessions.getAll();

        state.machines = machines;
        state.activeSessions = sessions.active;
        state.history = sessions.history;

        // --- Sesiones activas: costo en tiempo real ---
        const activeWithCost = state.activeSessions.map(s => {
            const minutes = Sessions.calculateMinutes(Number(s.inicio));
            const costData = Pricing.calculate(minutes, s.impresiones_bn || 0, s.impresiones_color || 0);

            return {
                id: s.id,
                clientName: s.cliente,
                machineId: s.machine_id,
                startTime: Number(s.inicio),
                duration: minutes * 60 * 1000,
                printsBW: s.impresiones_bn || 0,
                printsColor: s.impresiones_color || 0,
                currentCost: costData.total
            };
        });

        // --- Renderizar máquinas ---
        UI.renderMachines(state.machines.map(m => {
            const session = state.activeSessions.find(s => s.machine_id === m.id);
            return {
                ...m,
                status: session ? 'ocupada' : 'libre',
                clientName: session ? session.cliente : null
            };
        }));

        UI.renderActiveSessions(activeWithCost);

        // --- Historial: usar total guardado, NO recalcular ---
        const historyForUI = state.history.map(s => ({
            id: s.id,
            machineId: s.machine_id,
            clientName: s.cliente,
            startTime: Number(s.inicio),
            endTime: Number(s.fin),
            duration: Number(s.fin) - Number(s.inicio),
            printsBW: s.impresiones_bn || 0,
            printsColor: s.impresiones_color || 0,
            total: Number(s.total) // total ya guardado
        }));

        UI.renderHistory(historyForUI);

        // --- Dashboard ---
        const totalIncome = historyForUI.reduce((sum, s) => sum + s.total, 0);
        const freeMachines = state.machines.filter(m => !activeWithCost.some(s => s.machineId === m.id)).length;
        const totalPrints = historyForUI.reduce((sum, s) => sum + s.printsBW + s.printsColor, 0);

        UI.renderDashboard({
            activeSessions: activeWithCost.length,
            dailyIncome: totalIncome,
            freeMachines: freeMachines,
            totalMachines: state.machines.length,
            totalPrints: totalPrints
        });

        // --- Selects ---
        UI.fillAvailableMachines(state.machines.map(m => ({
            id: m.id,
            status: Machines.isAvailable(m.id, state.activeSessions) ? 'libre' : 'ocupada'
        })));
        UI.fillActiveSessions(activeWithCost);

    } catch (error) {
        console.error("Error al refrescar:", error);
        UI.showAlert("Error al actualizar datos", "error");
    }
}

// --- Iniciar sesión ---
function bindStartSession() {
    const form = document.getElementById("session-form");
    if (!form) return;

    form.addEventListener("submit", async e => {
        e.preventDefault();

        const cliente = document.getElementById("client-name").value.trim();
        const machine_id = Number(document.getElementById("machine-select").value);

        if (!cliente || !machine_id) {
            UI.showAlert("Completa todos los campos", "error");
            return;
        }

        const ok = await Sessions.start({
            cliente,
            machine_id,
            inicio: Date.now()
        });

        if (ok) {
            UI.showAlert("Sesión iniciada", "success");
            form.reset();
            refreshAll();
        } else {
            UI.showAlert("Error al iniciar sesión", "error");
        }
    });
}

// --- Finalizar sesión ---
function bindEndSession() {
    const form = document.getElementById("end-session-form");
    if (!form) return;

    form.addEventListener("submit", async e => {
        e.preventDefault();

        const sessionId = Number(document.getElementById("session-select").value);
        const bw = Math.max(Number(document.getElementById("bw-prints").value), 0);
        const color = Math.max(Number(document.getElementById("color-prints").value), 0);

        if (!sessionId) {
            UI.showAlert("Selecciona una sesión", "error");
            return;
        }

        const session = state.activeSessions.find(s => s.id === sessionId);
        if (!session) return;

        const minutes = Sessions.calculateMinutes(Number(session.inicio));
        const totalCost = Pricing.calculate(minutes, bw, color).total;

        const ok = await Sessions.end({
            id: sessionId,
            fin: Date.now(),
            prints_bw: bw,
            prints_color: color,
            total: totalCost
        });

        if (ok) {
            UI.showAlert("Sesión finalizada correctamente", "success");
            form.reset();
            refreshAll();
        } else {
            UI.showAlert("Error al finalizar sesión", "error");
        }
    });
}

// --------------------------------
// Delegar evento de Finalizar sesión
// --------------------------------
function bindFinishSessionButtons() {
    const tbody = document.querySelector('#active-sessions-table tbody');
    if (!tbody) return;

    tbody.addEventListener('click', async (e) => {
        if (!e.target.classList.contains('finish-session-btn')) return;

        const sessionId = Number(e.target.dataset.id);
        const session = state.activeSessions.find(s => s.id === sessionId);
        if (!session) {
            UI.showAlert("Sesión no encontrada", "error");
            return;
        }

        // Pedir cantidad de impresiones
        const bw = Number(prompt("Impresiones BN:", session.printsBW)) || 0;
        const color = Number(prompt("Impresiones Color:", session.printsColor)) || 0;

        // Calcular total
        const minutes = Sessions.calculateMinutes(Number(session.inicio));
        const totalCost = Pricing.calculate(minutes, bw, color).total;

        const ok = await Sessions.end({
            id: sessionId,
            fin: Date.now(),
            prints_bw: bw,
            prints_color: color,
            total: totalCost
        });

        if (ok) {
            UI.showAlert("Sesión finalizada correctamente", "success");
            refreshAll();
        } else {
            UI.showAlert("Error al finalizar sesión", "error");
        }
    });
}

// --- Inicialización ---
function startRealTimeUpdater() {
    refreshAll();
    setInterval(refreshAll, REFRESH_INTERVAL);
}

function initApp() {
    UI.initTabs();
    bindStartSession();
    bindEndSession();
    startRealTimeUpdater();
    bindFinishSessionButtons();
}

document.addEventListener("DOMContentLoaded", initApp);
