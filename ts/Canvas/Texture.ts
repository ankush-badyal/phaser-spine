/// <reference path="../core/Texture.ts" />
namespace PhaserSpine.canvas {
    export class Texture extends spine.Texture {
        constructor(image: HTMLImageElement) {
            super(image);
        }
        setFilters(minFilter: spine.TextureFilter, magFilter: spine.TextureFilter) { }
        setWraps(uWrap: spine.TextureWrap, vWrap: spine.TextureWrap) { }
        dispose() { }
    }
}