"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioManager = void 0;
const AudioClip_1 = require("./AudioClip");
class AudioManager {
    constructor(scene) {
        this.audioGroups = [];
        this.scene = scene;
        let audio_manager_id = 'audio-manager';
        if (!document.querySelector(`#${audio_manager_id}`)) {
            let audioRoot = document.createElement('div');
            audioRoot.id = audio_manager_id;
            audioRoot.style.position = 'absolute';
            //create default audio group
            this.CreateAudioGroup('default');
            this.root = audioRoot;
            document.body.appendChild(this.root);
        }
    }
    CreateAudioGroup(groupName) {
        if (this.root) {
            let exists = this.audioGroups.find(x => x.groupName === groupName);
            if (!exists) {
                let new_audio_group = {
                    groupName,
                    audioClips: [],
                    clipIndex: 0
                };
                let group_node = document.createElement('div');
                group_node.id = `audio-group-${groupName.trim().toLowerCase()}`;
                new_audio_group.groupNode = group_node;
                this.root.appendChild(group_node);
                this.audioGroups.push(new_audio_group);
            }
        }
    }
    DeleteAudioGroup(groupName) {
        let target_group = this.audioGroups.find(x => x.groupName === groupName);
        if (target_group) {
            let index = this.audioGroups.indexOf(target_group);
            //destroy all audio clips inside the group
            target_group.audioClips.forEach((clip) => { clip.Destroy(); });
            //remove the group from the array
            this.audioGroups.splice(index, 1);
        }
    }
    CreateAudioClip(groupName, audioName, audioPath, onClipLoad = () => { }) {
        let target_group = this.audioGroups.find(x => x.groupName === groupName);
        if (target_group && target_group.groupNode) {
            let new_clip = new AudioClip_1.AudioClip(audioName, audioPath, target_group.groupNode, onClipLoad);
            target_group.audioClips.push(new_clip);
            new_clip.Initialize();
        }
        else {
            let default_group = this.audioGroups[0];
            if (default_group.groupNode) {
                let new_clip = new AudioClip_1.AudioClip(audioName, audioPath, default_group.groupNode, onClipLoad);
                default_group.audioClips.push(new_clip);
                new_clip.Initialize();
            }
        }
    }
    RemoveAudioClip(group, clipName) {
        let target_group = this.audioGroups.find(x => x.groupName === group);
        if (target_group) {
            let target_clip = target_group.audioClips.find(x => x.name === clipName);
            if (target_clip) {
                let index = target_group.audioClips.indexOf(target_clip);
                target_clip.Destroy();
                target_group.audioClips.splice(index, 1);
            }
        }
    }
    MuteAll() {
        this.audioGroups.forEach((group) => {
            group.audioClips.forEach((clip) => {
                clip.Mute();
            });
        });
    }
    UnMuteAll() {
        this.audioGroups.forEach((group) => {
            group.audioClips.forEach((clip) => {
                clip.UnMute();
            });
        });
    }
    MuteInGroup(groupName) {
        let target_group = this.audioGroups.find(x => x.groupName === groupName);
        if (target_group) {
            target_group.audioClips.forEach((clip) => {
                clip.Mute();
            });
        }
    }
    UnMuteInGroup(groupName) {
        let target_group = this.audioGroups.find(x => x.groupName === groupName);
        if (target_group) {
            target_group.audioClips.forEach((clip) => {
                clip.UnMute();
            });
        }
    }
    PauseAll() {
        this.audioGroups.forEach((group) => {
            group.audioClips.forEach((clip) => {
                clip.Pause();
            });
        });
    }
    UnPauseAll() {
        this.audioGroups.forEach((group) => {
            group.audioClips.forEach((clip) => {
                clip.Play();
            });
        });
    }
    PauseInGroup(groupName) {
        let target_group = this.audioGroups.find(x => x.groupName === groupName);
        if (target_group) {
            target_group.audioClips.forEach((clip) => {
                clip.Pause();
            });
        }
    }
    UnPauseInGroup(groupName) {
        let target_group = this.audioGroups.find(x => x.groupName === groupName);
        if (target_group) {
            target_group.audioClips.forEach((clip) => {
                clip.Play();
            });
        }
    }
    PlayNextInGroup(groupName, loop = false) {
        let target_group = this.audioGroups.find(x => x.groupName === groupName);
        if (target_group) {
            let index = target_group.clipIndex;
            if (index + 1 <= target_group.audioClips.length - 1) {
                index += 1;
            }
            let clip = target_group.audioClips[index];
            if (clip) {
                clip.Play(loop);
            }
        }
    }
    PlayPreviousInGroup(groupName, loop = false) {
        let target_group = this.audioGroups.find(x => x.groupName === groupName);
        if (target_group) {
            let index = target_group.clipIndex;
            if (index - 1 >= 0) {
                index -= 1;
                let clip = target_group.audioClips[index];
                clip.Play(loop);
            }
        }
    }
    PlayRandomInGroup(groupName, loop = false) {
        let target_group = this.audioGroups.find(x => x.groupName === groupName);
        if (target_group) {
            let index = Math.floor(Math.random() * target_group.audioClips.length);
            let clip = target_group.audioClips[index];
            clip.Play(loop);
        }
    }
}
exports.AudioManager = AudioManager;
