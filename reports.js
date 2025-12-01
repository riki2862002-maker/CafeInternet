// reports.js
import { UI } from './ui.js';

export const Reports = {
    init() {
        const form = document.getElementById('report-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const type = document.getElementById('report-type').value;

            try {
                const res = await fetch('./backend/generate_report.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type })
                });

                if (!res.ok) throw new Error('Error al generar el reporte');

                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                window.open(url, '_blank');
            } catch (err) {
                UI.showAlert(err.message, 'error');
            }
        });
    }
};
