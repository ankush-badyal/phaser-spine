///<reference path="Spine.ts" />
namespace PhaserSpine {
    (Phaser as any).spine = PhaserSpine;
    export class SpinePlugin extends Phaser.Plugin {
        public static readonly RESOLUTION_REGEXP: RegExp = /@(.+)x/;

        public static readonly SPINE_NAMESPACE: string = 'spine';
        public static readonly ATLAS_PREFIX: string = `atlas_${SpinePlugin.SPINE_NAMESPACE}_`;

        public static DEBUG: boolean = false;

        public static TRIANGLE: boolean = false;

        constructor(game: SpineGame, parent: Phaser.PluginManager) {
            super(game, parent);
        }
        public init(config: Config = <Config>{}): void {
            SpinePlugin.DEBUG = config.debugRendering || false;
            SpinePlugin.TRIANGLE = config.triangleRendering || false;

            this.addSpineCache();
            this.addSpineFactory();
            this.addSpineLoader();
        }
        /**
         *  Extends Phaser Cache to add functionality for spine.
         *
         * @protected
         * @memberof SpinePlugin
         */
        protected addSpineCache(): void {
            //Create the cache space
            (Phaser.Cache.prototype as PhaserSpine.SpineCache).spine = {};
            //Method for adding a spine dict to the cache space
            (Phaser.Cache.prototype as PhaserSpine.SpineCache).addSpine = function (key: string, data: SpineCacheData) {
                this.spine[key] = data;
            };
            //Method for fetching a spine dict from the cache space
            (Phaser.Cache.prototype as PhaserSpine.SpineCache).getSpine = function (key: string): SpineCacheData {
                if (!this.spine.hasOwnProperty(key)) {
                    console.warn('Phaser.Cache.getSpine: Key "' + key + '" not found in Cache.')
                }
                return this.spine[key];
            };
        }
        protected addSpineFactory() {
            (Phaser.GameObjectFactory.prototype as PhaserSpine.SpineObjectFactory).spine = function (x: number, y: number, key: string, premultipliedAlpha: boolean = false, scalingVariant?: string, group?: Phaser.Group): Spine {
                if (group === undefined) {
                    group = this.world;
                }
                let spineObject: Spine = new Spine(this.game, x, y, key, premultipliedAlpha);
                return group.add(spineObject);
            };
            (Phaser.GameObjectCreator.prototype as PhaserSpine.SpineObjectCreator).spine = function (x: number, y: number, key: string, premultipliedAlpha: boolean = false, scalingVariant?: string, group?: Phaser.Group): Spine {
                return new Spine(this.game, x, y, key, premultipliedAlpha);
            };
        }

        protected addSpineLoader() {
            function spineLoadWithSameName(key: string, url: string): void {
                let path: string = url.substr(0, url.lastIndexOf('.'));
                let pathonly: string = url.substr(0, url.lastIndexOf('/'));
                let filenameonly: string = url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
                (this as PhaserSpine.SpineLoader).text(`${SpinePlugin.ATLAS_PREFIX}_${key}`, `${path}.atlas`);
                (this as PhaserSpine.SpineLoader).json(`${SpinePlugin.SPINE_NAMESPACE}_${key}`, `${path}.json`);
                let imageKeys: string[] = [];
                let imagesLoaded: number = 0;
                this.onFileComplete.add((progress: number, name: string) => {
                    if (name.indexOf(SpinePlugin.ATLAS_PREFIX) === 0) {
                        let atlas: string = this.game.cache.getText(name);
                        var firstImageName: string = null;
                        atlas.split(/\r\n|\r|\n/).forEach((line: string, idx: number) => {
                            if (line.length === 0 || line.indexOf(':') !== -1) {
                                return;
                            }
                            if (firstImageName === null) {
                                firstImageName = line.substr(0, line.lastIndexOf('.'));
                            }
                            if (firstImageName !== null && line.indexOf(firstImageName) !== -1 && line.indexOf('.') !== -1) {
                                imageKeys.push(line);
                                this.image(line, `${pathonly}/${line}`);
                            }
                        })
                    } else if (imageKeys.indexOf(name) !== -1) {
                        imagesLoaded++;
                    }
                    if (imageKeys.length && imagesLoaded === imageKeys.length) {
                        imagesLoaded = 0;
                        this.game.cache.addSpine(key, {
                            atlas: `${SpinePlugin.ATLAS_PREFIX}_${key}`,
                            json: `${SpinePlugin.SPINE_NAMESPACE}_${key}`,
                            images: imageKeys
                        });
                    }
                });
            }
            function spineLoad(key: string, url: string, urlAtlas: string, urlImages: string | string[]): void {
                let imageKeys: string[] = [];
                let imagesLoaded: number = 0;
                (this as PhaserSpine.SpineLoader).text(`${SpinePlugin.ATLAS_PREFIX}_${key}`, urlAtlas);
                (this as PhaserSpine.SpineLoader).json(`${SpinePlugin.SPINE_NAMESPACE}_${key}`, url);
                if (Array.isArray(urlImages)) {
                    urlImages.forEach((fileName: string) => {
                        let fileNameOnly: string = fileName.substring(fileName.lastIndexOf('/') + 1);
                        this.image(fileNameOnly, fileName);
                        imageKeys.push(fileNameOnly);
                    });
                } else {
                    imageKeys.push(key);
                    this.image(key, urlImages);
                }

                this.onFileComplete.add((progress: number, name: string) => {
                    if (imageKeys.indexOf(name) !== -1) {
                        imagesLoaded++;
                    }
                    if (imageKeys.length && imagesLoaded === imageKeys.length) {
                        imagesLoaded = 0;
                        this.game.cache.addSpine(key, {
                            atlas: `${SpinePlugin.ATLAS_PREFIX}_${key}`,
                            json: `${SpinePlugin.SPINE_NAMESPACE}_${key}`,
                            images: imageKeys
                        });
                    }
                });
            }
            (Phaser.Loader.prototype as PhaserSpine.SpineLoader).spine = function (key: string, url: string, urlAtlas: string, urlImages: string | string[]) {
                if (!urlAtlas || !urlImages) {
                    spineLoadWithSameName.call(this, key, url);
                } else {
                    if (!urlAtlas || !urlImages) {
                        throw new Error(`Path to atlas or png is not defined!`);
                    }
                    spineLoad(key, url, urlAtlas, urlImages);
                }
            };
        }
    }
}