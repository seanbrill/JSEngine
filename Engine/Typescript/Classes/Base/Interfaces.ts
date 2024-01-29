import { GameObject } from "./GameObject";

export interface scale {
    x: number;
    y: number;
    z: number;
}

export interface scale2D {
    x: number;
    y: number;
}

export interface position {
    x: number;
    y: number;
    z: number;
}

export interface rotation {
    x: number;
    y: number;
    z: number;
}

export interface TextureRepeat {
    x: number,
    y: number
}

export interface primitiveLightOptions {
    name: string,
    color: string;
    intensity: number;
    distance?: number;
    decay?: number;
    angle?: number,
    penumbra?: number;
    position?: position;
    target?: position;
}

export interface primitive3DOptions {
    name: string,
    scale: scale,
    position: position,
    rotation: rotation,
    color: string,
    texturePath: string | null,
    textureRepeat?: TextureRepeat
}

export interface SkyboxOptions {
    name: string,
    scale: scale,
    color: string,
    texturePath?: string | null,
    textureRepeat?: TextureRepeat
}

export interface ObjectLoaderOptions {
    name: string,
    modelPath: string,
    scale: scale,
    position: position,
    rotation: rotation,
    color: string,
    texturePath: string | null,
    textureRepeat?: TextureRepeat
    onLoad?: (model: GameObject) => any
    onProgress?: (progress: ProgressEvent<EventTarget>) => any
    onError: (error: any) => void
}