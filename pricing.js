// pricing.js
// Calculadora de precios REAL con regla opcional B

export const Pricing = {

    PRICES: {
        hour: 10,          // $10 por hora
        blackWhite: 1,     // $1 B/N
        color: 3,          // $3 color
        minimum: 5         // $5 mínimo
    },

    /**
     * Calcula el costo total basado en:
     * - minutos
     * - impresiones B/N y color
     * - regla del mínimo (Opción B)
     */
    calculate(minutes, bwPrints, colorPrints) {
        const r = this.PRICES;

        minutes = Number(minutes) || 0;
        bwPrints = Number(bwPrints) || 0;
        colorPrints = Number(colorPrints) || 0;

        // Costo de impresiones
        const printsCost = bwPrints * r.blackWhite + colorPrints * r.color;

        // ----------------------------
        // REGLA OPCIÓN B
        // ----------------------------
        // Si la sesión dura <= 30 minutos:
        if (minutes <= 30) {

            // Caso 1: NO hubo impresiones → aplicar mínimo
            if (bwPrints === 0 && colorPrints === 0) {
                return {
                    minutes,
                    type: "minimum",
                    machineCost: r.minimum,
                    printsCost: 0,
                    total: r.minimum
                };
            }

            // Caso 2: Hubo impresiones → NO aplicar mínimo
            return {
                minutes,
                type: "prints-only",
                machineCost: 0,
                printsCost,
                total: printsCost
            };
        }

        // ----------------------------
        // SESIONES DE MÁS DE 30 MINUTOS
        // ----------------------------
        const hours = minutes / 60;
        const machineCost = hours * r.hour;

        return {
            minutes,
            type: "normal",
            machineCost,
            printsCost,
            total: machineCost + printsCost
        };
    }
};
