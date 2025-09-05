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
            
            // Преобразуем тиры в объекты { min, value } и сортируем по min в убывающем порядке
            const parsedTiers = Object.entries(symbolInfo.payouts).map(([key, value]) => {
                const parts = key.split('-').map(Number);
                return { min: parts[0], value: value };
            }).sort((a, b) => b.min - a.min); // Сортируем от большего к меньшему

            // Находим первый (и самый большой) подходящий тир
            for (const tier of parsedTiers) {
                if (win.count >= tier.min) {
                    payoutMultiplier = tier.value;
                    break; // Нашли максимальный выигрыш, выходим
                }
            }
            totalPayout += bet * payoutMultiplier;
        }
    });
    return totalPayout;
}