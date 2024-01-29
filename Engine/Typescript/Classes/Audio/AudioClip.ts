export class AudioClip {
    name: string;
    audioPath: string;
    audio: Blob | undefined;
    audioTime: number = 0;
    isPlaying: boolean = false;
    isPaused: boolean = false;
    isMuted: boolean = false;
    volume: number = 1;
    groupNode: HTMLElement | undefined;
    audioNode: HTMLAudioElement | undefined;
    onAudioNodeLoad: () => any;
    constructor(name: string, audioPath: string, groupNode: HTMLElement, onload: () => any = () => { }) {
        this.name = name;
        this.audioPath = audioPath;
        this.groupNode = groupNode;
        this.onAudioNodeLoad = onload;
        this.Initialize();
    }

    Play(loopAudio: boolean = false) {
        if (this.audioNode) {
            if (loopAudio) this.audioNode.loop = true;
            this.audioNode.play()
            this.isPaused = false;
            this.isPlaying = true;
        }
    }

    Pause() {
        if (this.audioNode) {
            this.audioNode.pause()
            this.isPaused = true;
            this.isPlaying = false;
        }
    }

    SetVolume(volume: number) {
        if (this.audioNode) {
            if (volume > 1) volume = 1
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
        if (this.groupNode) {
            // Fetch the HTML file
            let audioElement = document.createElement('audio') as HTMLAudioElement;
            audioElement.id = 'audio-clip-' + this.name;
            audioElement.src = this.audioPath;
            this.audioNode = audioElement;
            this.groupNode?.appendChild(this.audioNode)
            if (this.onAudioNodeLoad) this.onAudioNodeLoad()
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