export const SpeedModes = {
    NORMAL: 'NORMAL',
    TURBO: 'TURBO',
    QUICK: 'QUICK'
};

export class SpeedManager {
    constructor() {
        this.animationMultiplier = 1.0;
        this._currentSpeedMode = SpeedModes.NORMAL; // Initialize
        this.setSpeed(SpeedModes.NORMAL);
    }

    setSpeed(speedMode) {
        this._currentSpeedMode = speedMode; // Update current speed mode
        switch (speedMode) {
            case SpeedModes.TURBO:
                this.animationMultiplier = 0.5;
                break;
            case SpeedModes.QUICK:
                this.animationMultiplier = 0.2;
                break;
            case SpeedModes.NORMAL:
            default:
                this.animationMultiplier = 1.0;
                break;
        }
    }

    cycleSpeed() {
        switch (this._currentSpeedMode) {
            case SpeedModes.NORMAL:
                this.setSpeed(SpeedModes.TURBO);
                break;
            case SpeedModes.TURBO:
                this.setSpeed(SpeedModes.QUICK);
                break;
            case SpeedModes.QUICK:
            default:
                this.setSpeed(SpeedModes.NORMAL);
                break;
        }
    }

    get currentSpeedMode() {
        return this._currentSpeedMode;
    }

    getDuration(baseDuration) {
        return baseDuration * this.animationMultiplier;
    }
}
