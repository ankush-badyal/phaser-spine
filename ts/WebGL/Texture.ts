
namespace PhaserSpine.webGL {
    export enum TextureFilter {
        Nearest = 9728, // WebGLRenderingContext.NEAREST
        Linear = 9729, // WebGLRenderingContext.LINEAR
        MipMap = 9987, // WebGLRenderingContext.LINEAR_MIPMAP_LINEAR
        MipMapNearestNearest = 9984, // WebGLRenderingContext.NEAREST_MIPMAP_NEAREST
        MipMapLinearNearest = 9985, // WebGLRenderingContext.LINEAR_MIPMAP_NEAREST
        MipMapNearestLinear = 9986, // WebGLRenderingContext.NEAREST_MIPMAP_LINEAR
        MipMapLinearLinear = 9987 // WebGLRenderingContext.LINEAR_MIPMAP_LINEAR
    }

    export enum TextureWrap {
        MirroredRepeat = 33648, // WebGLRenderingContext.MIRRORED_REPEAT
        ClampToEdge = 33071, // WebGLRenderingContext.CLAMP_TO_EDGE
        Repeat = 10497 // WebGLRenderingContext.REPEAT
    }
    export class Texture extends PIXI.BaseTexture {
        constructor(protected image: HTMLImageElement, scaleMode: number = 1) {
            super(image, scaleMode);
        }
        public getImage(): HTMLImageElement {
            return this.image;
        }
        public dispose() {

        }
        public setFilters(minFilter: spine.TextureFilter, magFilter: spine.TextureFilter) {
            if (minFilter == TextureFilter.Linear) {
                this.scaleMode = 1; //PIXI.SCALE_MODES.LINEAR;
            } else if (minFilter == TextureFilter.Nearest) {
                this.scaleMode = 0; //PIXI.SCALE_MODES.NEAREST;
            } else {
                this.mipmap = true;
                if (minFilter == TextureFilter.MipMapNearestNearest) {
                    this.scaleMode = 0; //PIXI.SCALE_MODES.NEAREST;
                } else {
                    this.scaleMode = 1; //PIXI.SCALE_MODES.LINEAR;
                }
            }
        }
        public setWraps(uWrap: spine.TextureWrap, vWrap: spine.TextureWrap) {

        }
    }
}