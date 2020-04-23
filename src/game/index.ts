import * as PIXI from "pixi.js";
import { lookup } from "dns";

const { Sprite, Application } = PIXI;
const { TextureCache } = PIXI.utils;

// Max is exclusive, min is inclusive
function randomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

export class Game {
  private app: PIXI.Application;
  private sprites: { [name: string]: PIXI.Sprite };

  public constructor() {
    this.app = new Application({
      width: window.innerWidth,
      height: window.innerHeight,
      antialias: true,
      resolution: 1,
    });

    this.sprites = {};

    this.app.renderer.view.style.position = "absolute";
    this.app.renderer.view.style.display = "block";

    document.body.appendChild(this.app.view);

    // this.app.renderer.resize(window.innerWidth, window.innerHeight);

    this.app.loader.add("assets/treasureHunter.json");
    this.app.loader.on("complete", this.onLoadComplete);
    this.app.loader.load();
  }

  addSpriteFromTextureCache = (name: string): PIXI.Sprite => {
    const sprite = new Sprite(TextureCache[name]);
    this.sprites[name] = sprite;

    return sprite;
  };

  onLoadComplete = (_: PIXI.Loader, resources: PIXI.IResourceDictionary) => {
    //There are 3 ways to make sprites from textures atlas frames

    //1. Access the `TextureCache` directly
    const dungeonTexture = TextureCache["dungeon.png"];
    const dungeon = new Sprite(dungeonTexture);
    this.app.stage.addChild(dungeon);

    const explorer = this.addSpriteFromTextureCache("explorer.png");
    explorer.x = 68;

    //Center the explorer vertically
    explorer.y = this.app.stage.height / 2 - explorer.height / 2;
    this.app.stage.addChild(explorer);

    const treasure = this.addSpriteFromTextureCache("treasure.png");
    this.app.stage.addChild(treasure);

    //Position the treasure next to the right edge of the canvas
    treasure.x = this.app.stage.width - treasure.width - 48;
    treasure.y = this.app.stage.height / 2 - treasure.height / 2;
    this.app.stage.addChild(treasure);

    //Make the exit door
    const door = this.addSpriteFromTextureCache("door.png");
    door.position.set(32, 0);
    this.app.stage.addChild(door);

    //Make the blobs
    const numberOfBlobs = 6,
      spacing = 48,
      xOffset = 150;

    //Make as many blobs as there are `numberOfBlobs`
    for (let i = 0; i < numberOfBlobs; i++) {
      //Make a blob
      const blob = new Sprite(TextureCache["blob.png"]);

      //Space each blob horizontally according to the `spacing` value.
      //`xOffset` determines the point from the left of the screen
      //at which the first blob should be added.
      const x = spacing * i + xOffset;

      //Give the blob a random y position
      //(`randomInt` is a custom function - see below)
      const y = randomInt(blob.height, this.app.stage.height - blob.height);

      //Set the blob's position
      blob.x = x;
      blob.y = y;

      //Add the blob sprite to the stage
      this.app.stage.addChild(blob);
    }

    console.log(this.app.stage);

    this.app.ticker.add(this.gameLoop);
  };

  gameLoop = (_: number) => {
    this.sprites["explorer.png"].x += 1;
  };
}
