// --- audio.js ---

export class AudioManager {
    constructor() {
        this._isMuted = false;
    }

    load() {
        // Загружаем звуки, давая им псевдонимы (alias)
        PIXI.sound.add('spin_sound', 'assets/audio/spin.mp3');
        PIXI.sound.add('win_sound', 'assets/audio/win.mp3');
        PIXI.sound.add('bonus_trigger_sound', 'assets/audio/bonus_trigger.mp3');
        PIXI.sound.add('buy_bonus_sound', 'assets/audio/buy_bonus.mp3');
        PIXI.sound.add('multiplier_apply_sound', 'assets/audio/multiplier.mp3');
    }

    play(alias) {
        // Проверяем, существует ли звук, прежде чем проигрывать
        if (PIXI.sound.exists(alias)) {
            PIXI.sound.play(alias);
        }
    }

    toggleMute() {
        this._isMuted = !this._isMuted;
        PIXI.sound.toggleMute();
    }

    get isMuted() {
        return this._isMuted;
    }
}