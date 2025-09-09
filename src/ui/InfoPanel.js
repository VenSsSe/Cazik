export class InfoPanel {
    constructor(context, parentContainer) {
        this.app = context.app;
        this.container = new PIXI.Container();
        parentContainer.addChild(this.container);

        const textStyle = new PIXI.TextStyle({
            fontFamily: 'Cyberpunk',
            fontSize: 38, // Немного уменьшим шрифт для лучшего вида
            fontWeight: '900',
            fill: '#f7d9a3',
            stroke: '#5c3a0a',
            strokeThickness: 5
        });

        // Текст Баланса (слева)
        this.balanceText = new PIXI.Text('', textStyle);
        this.balanceText.anchor.set(0, 0.5);
        this.container.addChild(this.balanceText);

        // Текст Выигрыша (справа)
        this.winText = new PIXI.Text('', textStyle);
        this.winText.anchor.set(1, 0.5);
        this.container.addChild(this.winText);

        // --- Позиционируем элементы внутри этого компонента ---
        this.balanceText.x = 50;
        this.winText.x = this.app.screen.width - 50;
    }

    updateBalance(value) {
        this.balanceText.text = `КРЕДИТ: ${value.toFixed(2)}`;
    }

    // Этот текст теперь будет управляться из BetController, так как он часть контрола
    updateBet(betConfig) {
        // Пустая функция, чтобы избежать ошибок. Управление передано.
    }

    updateWin(value) {
        this.winText.text = `ВЫИГРЫШ: ${value.toFixed(2)}`;
    }
}

