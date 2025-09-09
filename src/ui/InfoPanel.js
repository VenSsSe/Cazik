export class InfoPanel {
    constructor(app) {
        this.container = new PIXI.Container();
        app.stage.addChild(this.container);

        const textStyle = new PIXI.TextStyle({
            fontFamily: 'Cyberpunk',
            fontSize: 38, // Немного уменьшим шрифт для лучшего вида
            fontWeight: '900',
            fill: '#f7d9a3',
            stroke: '#5c3a0a',
            strokeThickness: 5
        });

        // --- Располагаем тексты на нижней панели ---
        const panelY = app.screen.height - 55; // Общая высота для текста

        // Текст Баланса (слева)
        this.balanceText = new PIXI.Text('', textStyle);
        this.balanceText.anchor.set(0, 0.5); // Привязка к левому краю
        this.balanceText.x = 50;
        this.balanceText.y = panelY;
        this.container.addChild(this.balanceText);

        // Текст Выигрыша (справа)
        this.winText = new PIXI.Text('', textStyle);
        this.winText.anchor.set(1, 0.5); // Привязка к правому краю
        this.winText.x = app.screen.width - 50;
        this.winText.y = panelY;
        this.container.addChild(this.winText);
    }

    updateBalance(value) {
        this.balanceText.text = `КРЕДИТ: ${value.toFixed(2)}`;
    }

    // Этот текст теперь будет управляться из BetController, так как он часть контрола
    updateBet(value) {
        // Пустая функция, чтобы избежать ошибок. Управление передано.
    }

    updateWin(value) {
        this.winText.text = `ВЫИГРЫШ: ${value.toFixed(2)}`;
    }
}
