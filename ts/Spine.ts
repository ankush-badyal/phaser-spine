/// <reference path="./Interfaces.ts" />
/// <reference path="./core/Skeleton.ts" />
/// <reference path="./core/AtlasAttachmentLoader.ts" />
/// <reference path="./core/TextureAtlas.ts" />
/// <reference path="./core/Texture.ts" />
/// <reference path="./core/SkeletonJson.ts" />
/// <reference path="./core/AnimationStateData.ts" />
/// <reference path="./core/AnimationState.ts" />

/// <reference path="./webGL/Texture.ts" />
declare module "phaser-spine" {
    export = PhaserSpine;
}
namespace PhaserSpine {
    export class Spine extends Phaser.Sprite {
        public skeleton: spine.Skeleton;
        protected stateData: spine.AnimationStateData;
        protected state: spine.AnimationState;

        public onEvent: Phaser.Signal;
        public onStart: Phaser.Signal;
        public onInterrupt: Phaser.Signal;
        public onDispose: Phaser.Signal;
        public onComplete: Phaser.Signal;
        public onEnd: Phaser.Signal;
        constructor(public game: Phaser.Game, x: number, y: number, key: string, protected premultipliedAlpha: boolean = false) {
            super(game, x, y, "");
            this.skeleton = this.createSkeleton(key);
            this.skeleton.flipY = (this.game.renderType === Phaser.CANVAS); //In Canvas we always FlipY
            this.skeleton.setToSetupPose(); //Update everything to get correct bounds
            this.skeleton.updateWorldTransform(); //Update everything to get correct bounds

            this.setSpineState();
        }

        protected createSkeleton(key: string): spine.Skeleton {
            const rawAtlasData: string = this.game.cache.getText(`${SpinePlugin.ATLAS_PREFIX}_${key}`);
            const rawJSONData = this.game.cache.getJSON(`${SpinePlugin.SPINE_NAMESPACE}_${key}`);
            const spineAtlas: spine.TextureAtlas = new spine.TextureAtlas(rawAtlasData, (line: string) => {
                console.log("spineAtlas line ", line);
                // if (this.game.renderType === Phaser.CANVAS) {
                //     return new canvas.Texture(this.game.cache.getImage(line));
                // }
                return new webGL.Texture(this.game.cache.getImage(line));
            });

            const atlasLoader: spine.AtlasAttachmentLoader = new spine.AtlasAttachmentLoader(spineAtlas);
            const spineJsonParser: spine.SkeletonJson = new spine.SkeletonJson(atlasLoader);
            const skeletonData = spineJsonParser.readSkeletonData(rawJSONData);
            return new spine.Skeleton(skeletonData);
        }

        protected setSpineState(): void {
            this.stateData = new spine.AnimationStateData(this.skeleton.data);
            this.state = new spine.AnimationState(this.stateData);
        }

        protected bindEvents(): void {
            this.onEvent = new Phaser.Signal();
            this.onComplete = new Phaser.Signal();
            this.onEnd = new Phaser.Signal();
            this.onInterrupt = new Phaser.Signal();
            this.onStart = new Phaser.Signal();
            this.onDispose = new Phaser.Signal();

            this.state.addListener({
                interrupt: this.onInterrupt.dispatch.bind(this.onInterrupt),
                dispose: this.onDispose.dispatch.bind(this.onDispose),
                /** Invoked when the current animation triggers an event. */
                event: this.onEvent.dispatch.bind(this.onEvent),
                /** Invoked when the current animation has completed.
                 * @param loopCount The number of times the animation reached the end. */
                complete: this.onComplete.dispatch.bind(this.onComplete),
                /** Invoked just after the current animation is set. */
                start: this.onStart.dispatch.bind(this.onStart),
                /** Invoked just before the current animation is replaced. */
                end: this.onEnd.dispatch.bind(this.onEnd)
            });
        }

        public update(): void {
            super.update();
            this.state.update(this.game.time.elapsed / 1000);
            this.state.apply(this.skeleton);
        }
    }
}