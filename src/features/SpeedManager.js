export const SpeedModes = {
    NORMAL: 'NORMAL',
    TURBO: 'TURBO',
    QUICK: 'QUICK'
};

export class SpeedManager {
    constructor() {
        this.animationMultiplier = 1.0;
        this.setSpeed(SpeedModes.NORMAL);
    }

    setSpeed(speedMode) {
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

    getDuration(baseDuration) {
        return baseDuration * this.animationMultiplier;
    }
}
