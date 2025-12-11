// ui.js
// Capa de interfaz de usuario

export const UI = {

    // --------------------------------------
    // PESTAÑAS
    // --------------------------------------
    initTabs() {
        const links = document.querySelectorAll('.nav-link');
        const tabs = document.querySelectorAll('.tab-content');

        links.forEach(link => {
            link.addEventListener('click', () => {
                const target = link.dataset.tab;
                links.forEach(l => l.classList.remove('active'));
                tabs.forEach(t => t.classList.remove('active'));

                link.classList.add('active');
                document.getElementById(target).classList.add('active');
            });
        });
    },

    // --------------------------------------
    // RENDER: MÁQUINAS
    // --------------------------------------
    renderMachines(machineList) {
        const grid = document.getElementById('machines-grid');
        grid.innerHTML = "";

        machineList.forEach(machine => {
            const div = document.createElement('div');
            div.className = `machine-card ${machine.status}`;

            div.innerHTML = `
                <h3>Máquina ${machine.id}</h3>
                <p>Estado: <strong>${machine.status}</strong></p>
                ${machine.status === 'ocupada' ? `<p>Cliente: ${machine.clientName}</p>` : ``}
            `;

            grid.appendChild(div);
        });
    },

    // --------------------------------------
    // RENDER: SESIONES ACTIVAS
    // --------------------------------------
    renderActiveSessions(list) {
        const tbody = document.querySelector('#active-sessions-table tbody');
        tbody.innerHTML = "";

        list.forEach(s => {
            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${s.clientName}</td>
                <td>${s.machineId}</td>
                <td>${this.formatTime(s.startTime)}</td>
                <td>${this.formatDuration(s.duration)}</td>
                <td>$${s.currentCost.toFixed(2)}</td>
                <td>
                    <button class="finish-session-btn" data-id="${s.id}">
                        Finalizar
                    </button>
                </td>
            `;

            tbody.appendChild(tr);
        });
    },

    // --------------------------------------
    // RENDER: HISTORIAL
    // --------------------------------------
    renderHistory(list) {
        const tbody = document.querySelector('#sessions-history tbody');
        tbody.innerHTML = "";

        list.forEach(s => {
            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${s.clientName}</td>
                <td>${s.machineId}</td>
                <td>${this.formatTime(s.startTime)}</td>
                <td>${s.endTime ? this.formatTime(s.endTime) : '-'}</td>
                <td>${s.printsBW}</td>
                <td>${s.printsColor}</td>
                <td>$${s.total.toFixed(2)}</td>
            `;

            tbody.appendChild(tr);
        });
    },

    // --------------------------------------
    // SELECTS
    // --------------------------------------
    fillAvailableMachines(list) {
        const select = document.getElementById('machine-select');
        select.innerHTML = "";

        list.filter(m => m.status === 'libre').forEach(m => {
            const op = document.createElement('option');
            op.value = m.id;
            op.textContent = `Máquina ${m.id}`;
            select.appendChild(op);
        });
    },

    fillActiveSessions(list) {
        const select = document.getElementById('session-select');
        select.innerHTML = "";

        list.forEach(s => {
            const op = document.createElement('option');
            op.value = s.id;
            op.textContent = `${s.clientName} - Máquina ${s.machineId}`;
            select.appendChild(op);
        });
    },

    // --------------------------------------
    // DASHBOARD
    // --------------------------------------
    renderDashboard(stats) {
        document.getElementById('active-sessions').textContent = stats.activeSessions;
        document.getElementById('daily-income').textContent = `$${stats.dailyIncome.toFixed(2)}`;
        document.getElementById('available-machines').textContent = `${stats.freeMachines}/${stats.totalMachines}`;
        document.getElementById('today-prints').textContent = stats.totalPrints;
    },

    // --------------------------------------
    // REPORTES
    // --------------------------------------
    toggleCustomDate(show) {
        const range = document.getElementById('custom-date-range');
        range.style.display = show ? 'block' : 'none';
    },

    // --------------------------------------
    // UTILIDADES
    // --------------------------------------
    formatTime(timestamp) {
        if (!timestamp) return "-";
        const d = new Date(Number(timestamp));
        return d.toLocaleString('es-MX', { hour12: false });
    },

    formatDuration(ms) {
        const totalMin = Math.floor(ms / 60000);
        const hrs = Math.floor(totalMin / 60);
        const min = totalMin % 60;
        return `${hrs}h ${min}m`;
    },

    showAlert(msg, type = "info") {
        const container = document.getElementById('alert-container');
        const div = document.createElement('div');

        div.className = `alert ${type}`;
        div.textContent = msg;

        container.appendChild(div);
        setTimeout(() => div.remove(), 3500);
    }
};
