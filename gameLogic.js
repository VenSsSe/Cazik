/**
 * Checks the grid for winning combinations (8+ identical symbols).
 * @param {Array<Array<string>>} gridSymbolIds - A 2D array of symbol IDs.
 * @returns {Array<object>} - An array of winning combinations, e.g., [{ id: 'gem_blue', count: 9, positions: [{col: 0, row: 1}, ...] }].
 */
export function checkForWins(gridSymbolIds) {
    const symbolCounts = {};
    const symbolPositions = {};

    // 1. Iterate through the grid to count symbols and record their positions
    for (let i = 0; i < gridSymbolIds.length; i++) {
        for (let j = 0; j < gridSymbolIds[i].length; j++) {
            const symbolId = gridSymbolIds[i][j];
            if (symbolId) {
                if (symbolId !== 'scatter') { // Scatters are often handled differently
                    symbolCounts[symbolId] = (symbolCounts[symbolId] || 0) + 1;
                    if (!symbolPositions[symbolId]) {
                        symbolPositions[symbolId] = [];
                    }
                    symbolPositions[symbolId].push({ col: i, row: j });
                }
            }
        }
    }

    const wins = [];

    // 2. Check for winning counts (8 or more)
    for (const symbolId in symbolCounts) {
        if (symbolCounts[symbolId] >= 8) {
            wins.push({
                id: symbolId,
                count: symbolCounts[symbolId],
                positions: symbolPositions[symbolId]
            });
        }
    }

    // 3. Handle scatter wins separately
    const scatterPositions = [];
    for (let i = 0; i < gridSymbolIds.length; i++) {
        for (let j = 0; j < gridSymbolIds[i].length; j++) {
            if (gridSymbolIds[i][j] === 'scatter') {
                scatterPositions.push({ col: i, row: j });
            }
        }
    }
    if (scatterPositions.length >= 4) {
        wins.push({
            id: 'scatter',
            count: scatterPositions.length,
            positions: scatterPositions
        });
    }

    return wins;
}

/**
 * Calculates the total payout for a set of wins.
 * @param {Array<object>} wins - The array of winning combinations from checkForWins.
 * @param {number} bet - The current bet amount.
 * @param {Array<object>} symbolsData - The data from symbols.json, including payout tables.
 * @returns {number} - The total payout amount.
 */
export function calculatePayout(wins, bet, symbolsData) {
    let totalPayout = 0;

    wins.forEach(win => {
        const symbolInfo = symbolsData.find(s => s.id === win.id);
        if (symbolInfo && symbolInfo.payouts) {
            let payoutMultiplier = 0;
            // Find the correct payout tier by iterating through the payout keys
            const payoutTiers = Object.keys(symbolInfo.payouts);

            for (const tier of payoutTiers) {
                // Handle ranges like "8-9"
                if (tier.includes('-')) {
                    const [min, max] = tier.split('-').map(Number);
                    if (win.count >= min && win.count <= max) {
                        payoutMultiplier = symbolInfo.payouts[tier];
                        break; // Found the correct tier
                    }
                } else { // Handle single number tiers like "4", "5", "6"
                    if (win.count === Number(tier)) {
                         payoutMultiplier = symbolInfo.payouts[tier];
                         break;
                    }
                }
            }
            totalPayout += bet * payoutMultiplier;
        }
    });

    return totalPayout;
}
