// --- gameLogic.js ---

export function checkForWins(gridSymbolIds) {
    const symbolCounts = {};
    const symbolPositions = {};
    let scatterCount = 0;

    for (let i = 0; i < gridSymbolIds.length; i++) {
        for (let j = 0; j < gridSymbolIds[i].length; j++) {
            const symbolId = gridSymbolIds[i][j];
            if (!symbolId) continue;

            if (symbolId === 'scatter') {
                scatterCount++;
            } else if (symbolId !== 'multiplier') {
                symbolCounts[symbolId] = (symbolCounts[symbolId] || 0) + 1;
                if (!symbolPositions[symbolId]) symbolPositions[symbolId] = [];
                symbolPositions[symbolId].push({ col: i, row: j });
            }
        }
    }

    const wins = [];
    for (const symbolId in symbolCounts) {
        if (symbolCounts[symbolId] >= 8) {
            wins.push({ id: symbolId, count: symbolCounts[symbolId], positions: symbolPositions[symbolId] });
        }
    }
    
    // Возвращаем и выигрыши, и количество скаттеров
    return { wins, scatterCount };
}

export function calculatePayout(wins, bet, symbolsData) {
    let totalPayout = 0;
    wins.forEach(win => {
        const symbolInfo = symbolsData.find(s => s.id === win.id);
        if (symbolInfo && symbolInfo.payouts) {
            let payoutMultiplier = 0;
            const tiers = Object.keys(symbolInfo.payouts);
            for (const tier of tiers) {
                const [min, max] = tier.includes('-') ? tier.split('-').map(Number) : [Number(tier), Number(tier)];
                if (win.count >= min && win.count <= (max || 30)) {
                    payoutMultiplier = symbolInfo.payouts[tier];
                }
            }
            if (win.count >= 12 && symbolInfo.payouts["12-30"]) {
                 payoutMultiplier = symbolInfo.payouts["12-30"];
            }
            totalPayout += bet * payoutMultiplier;
        }
    });
    return totalPayout;
}
