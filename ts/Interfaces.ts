/// <reference path="../node_modules/phaser/typescript/phaser.d.ts"/>
/// <reference path="../node_modules/phaser/typescript/pixi.d.ts"/>

namespace PhaserSpine {
    export interface SpineObjectFactory extends Phaser.GameObjectFactory {
        spine: (x: number, y: number, key: string, premultipliedAlpha?: boolean, scalingVariant?: string, group?: Phaser.Group) => any;
    }

    export interface SpineObjectCreator extends Phaser.GameObjectCreator {
        spine: (x: number, y: number, key: string, premultipliedAlpha?: boolean, scalingVariant?: string, group?: Phaser.Group) => any
    }

    export interface SpineCache extends Phaser.Cache {
        addSpine: (key: string, data: any) => void;
        getSpine: (key: string) => any;
        spine: { [key: string]: SpineCacheData };
    }

    export interface SpineLoader extends Phaser.Loader {
        spine: (key: string, url: string, urlAtlas?: string, urlImages?: string | string[]) => void;
        cache: SpineCache;
    }

    export interface SpineGame extends Phaser.Game {
        add: SpineObjectFactory;
        load: SpineLoader;
        cache: SpineCache;
    }

    export interface SpineCacheData {
        atlas: string;
        basePath: string;
        variants: string[];
    }

    export interface Config {
        debugRendering: boolean;
        triangleRendering: boolean;
    }
}