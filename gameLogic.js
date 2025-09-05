/**
 * Checks the grid for winning combinations (8+ identical symbols).
 * Scatter symbols are handled separately.
 * @param {Array<Array<object>>} grid - A 2D array representing the grid, where each element is a symbol object { id: 'symbol_name' }.
 * @returns {Array<object>} - An array of winning combinations, e.g., [{ id: 'gem_blue', count: 9 }].
 */
export function checkForWins(grid) {
    const symbolCounts = {};
    const wins = [];

    // Flatten the grid and count symbol occurrences
    grid.flat().forEach(symbol => {
        if (symbol && symbol.id) {
            // Don't count scatters for the main win condition
            if (symbol.id !== 'scatter') {
                symbolCounts[symbol.id] = (symbolCounts[symbol.id] || 0) + 1;
            }
        }
    });

    // Check for winning counts (8 or more)
    for (const symbolId in symbolCounts) {
        if (symbolCounts[symbolId] >= 8) {
            wins.push({ id: symbolId, count: symbolCounts[symbolId] });
        }
    }
    
    // Handle scatter wins separately
    const scatterCount = grid.flat().filter(s => s && s.id === 'scatter').length;
    if (scatterCount >= 4) {
        wins.push({ id: 'scatter', count: scatterCount });
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
