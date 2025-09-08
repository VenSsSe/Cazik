export class InfoPanel {
    constructor(app) {
        this.container = new PIXI.Container();
        app.stage.addChild(this.container);

        const textStyle = new PIXI.TextStyle({
            fontFamily: 'Cyberpunk',
            fontSize: 42,
            fontWeight: '900',
            fill: '#f7d9a3',
            stroke: '#5c3a0a',
            strokeThickness: 5
        });

        // Balance Text
        this.balanceText = new PIXI.Text('', textStyle);
        this.balanceText.anchor.set(0, 0.5);
        this.balanceText.x = 50;
        this.balanceText.y = app.screen.height - 60;
        this.container.addChild(this.balanceText);

        // Bet Text
        this.betText = new PIXI.Text('', textStyle);
        this.betText.anchor.set(0.5, 0.5);
        this.betText.x = app.screen.width / 2;
        this.betText.y = app.screen.height - 60;
        this.container.addChild(this.betText);

        // Win Text
        this.winText = new PIXI.Text('', textStyle);
        this.winText.anchor.set(1, 0.5);
        this.winText.x = app.screen.width - 50;
        this.winText.y = app.screen.height - 60;
        this.container.addChild(this.winText);
    }

    updateBalance(value) {
        this.balanceText.text = `КРЕДИТ: ${value.toFixed(2)}`;
    }

    updateBet(value) {
        this.betText.text = `СТАВКА: ${value.toFixed(2)}`;
    }

    updateWin(value) {
        this.winText.text = `ВЫИГРЫШ: ${value.toFixed(2)}`;
    }
}
