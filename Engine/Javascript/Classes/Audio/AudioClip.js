"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioClip = void 0;
class AudioClip {
    constructor(name, audioPath, groupNode, onload = () => { }) {
        this.audioTime = 0;
        this.isPlaying = false;
        this.isPaused = false;
        this.isMuted = false;
        this.volume = 1;
        this.name = name;
        this.audioPath = audioPath;
        this.groupNode = groupNode;
        this.onAudioNodeLoad = onload;
        this.Initialize();
    }
    Play(loopAudio = false) {
        if (this.audioNode) {
            if (loopAudio)
                this.audioNode.loop = true;
            this.audioNode.play();
            this.isPaused = false;
            this.isPlaying = true;
        }
    }
    Pause() {
        if (this.audioNode) {
            this.audioNode.pause();
            this.isPaused = true;
            this.isPlaying = false;
        }
    }
    SetVolume(volume) {
        if (this.audioNode) {
            if (volume > 1)
                volume = 1;
            this.audioNode.volume = volume;
        }
    }
    Mute() {
        if (this.audioNode) {
            this.audioNode.muted = true;
        }
    }
    UnMute() {
        if (this.audioNode) {
            this.audioNode.muted = false;
        }
    }
    Initialize() {
        var _a;
        if (this.groupNode) {
            // Fetch the HTML file
            let audioElement = document.createElement('audio');
            audioElement.id = 'audio-clip-' + this.name;
            audioElement.src = this.audioPath;
            this.audioNode = audioElement;
            (_a = this.groupNode) === null || _a === void 0 ? void 0 : _a.appendChild(this.audioNode);
            if (this.onAudioNodeLoad)
                this.onAudioNodeLoad();
        }
    }
    Destroy() {
        if (this.audioNode) {
            this.Mute();
            this.Pause();
            this.audioNode.remove();
        }
    }
}
exports.AudioClip = AudioClip;
