// --- gameLogic.js ---

export function checkForWins(gridSymbolIds) {
    const symbolCounts = {};
    const symbolPositions = {};

    for (let i = 0; i < gridSymbolIds.length; i++) {
        for (let j = 0; j < gridSymbolIds[i].length; j++) {
            const symbolId = gridSymbolIds[i][j];
            if (symbolId && symbolId !== 'scatter' && symbolId !== 'multiplier') {
                symbolCounts[symbolId] = (symbolCounts[symbolId] || 0) + 1;
                if (!symbolPositions[symbolId]) {
                    symbolPositions[symbolId] = [];
                }
                symbolPositions[symbolId].push({ col: i, row: j });
            }
        }
    }

    const wins = [];
    for (const symbolId in symbolCounts) {
        if (symbolCounts[symbolId] >= 8) {
            wins.push({
                id: symbolId,
                count: symbolCounts[symbolId],
                positions: symbolPositions[symbolId]
            });
        }
    }
    return wins;
}

export function calculatePayout(wins, bet, symbolsData) {
    let totalPayout = 0;
    wins.forEach(win => {
        const symbolInfo = symbolsData.find(s => s.id === win.id);
        if (symbolInfo && symbolInfo.payouts) {
            let payoutMultiplier = 0;
            const payoutTiers = Object.keys(symbolInfo.payouts).sort((a, b) => {
                return parseInt(a.split('-')[0]) - parseInt(b.split('-')[0]);
            });

            for (const tier of payoutTiers) {
                if (tier.includes('-')) {
                    const [min, max] = tier.split('-').map(Number);
                    if (win.count >= min && win.count <= max) {
                        payoutMultiplier = symbolInfo.payouts[tier];
                        break;
                    }
                } else {
                    if (win.count >= Number(tier)) {
                         payoutMultiplier = symbolInfo.payouts[tier];
                    }
                }
            }
            totalPayout += bet * payoutMultiplier;
        }
    });
    return totalPayout;
}