import * as PIXI from "pixi.js";

// Max is exclusive, min is inclusive
function randomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

export class Game {
  private app: PIXI.Application;

  public constructor() {
    this.app = new PIXI.Application({
      width: 512,
      height: 512,
      antialias: true,
      resolution: 1,
    });

    document.body.appendChild(this.app.view);

    this.app.renderer.view.style.position = "absolute";
    this.app.renderer.view.style.display = "block";
    this.app.renderer.resize(window.innerWidth, window.innerHeight);

    this.app.loader.add("assets/treasureHunter.json");
    this.app.loader.on("complete", this.onLoadComplete.bind(this));
    this.app.loader.load();
  }

  private onLoadComplete(
    _: PIXI.Loader,
    resources: PIXI.IResourceDictionary
  ): void {
    console.log({ resources });
    //There are 3 ways to make sprites from textures atlas frames

    //1. Access the `TextureCache` directly
    const dungeonTexture = PIXI.utils.TextureCache["dungeon.png"];
    const dungeon = new PIXI.Sprite(dungeonTexture);
    this.app.stage.addChild(dungeon);

    //2. Access the texture using throuhg the loader's `resources`:
    const explorer = new PIXI.Sprite(
      resources["assets/treasureHunter.json"].textures["explorer.png"]
    );
    explorer.x = 68;

    //Center the explorer vertically
    explorer.y = this.app.stage.height / 2 - explorer.height / 2;
    this.app.stage.addChild(explorer);

    //3. Create an optional alias called `id` for all the texture atlas
    //frame id textures.
    const id = this.app.loader.resources["assets/treasureHunter.json"].textures;

    //Make the treasure box using the alias
    const treasure = new PIXI.Sprite(id["treasure.png"]);
    this.app.stage.addChild(treasure);

    //Position the treasure next to the right edge of the canvas
    treasure.x = this.app.stage.width - treasure.width - 48;
    treasure.y = this.app.stage.height / 2 - treasure.height / 2;
    this.app.stage.addChild(treasure);

    //Make the exit door
    const door = new PIXI.Sprite(id["door.png"]);
    door.position.set(32, 0);
    this.app.stage.addChild(door);

    //Make the blobs
    const numberOfBlobs = 6,
      spacing = 48,
      xOffset = 150;

    //Make as many blobs as there are `numberOfBlobs`
    for (let i = 0; i < numberOfBlobs; i++) {
      //Make a blob
      const blob = new PIXI.Sprite(id["blob.png"]);

      //Space each blob horizontally according to the `spacing` value.
      //`xOffset` determines the point from the left of the screen
      //at which the first blob should be added.
      const x = spacing * i + xOffset;

      //Give the blob a random y position
      //(`randomInt` is a custom function - see below)
      const y = randomInt(0, this.app.stage.height - blob.height);

      //Set the blob's position
      blob.x = x;
      blob.y = y;

      //Add the blob sprite to the stage
      this.app.stage.addChild(blob);
    }
  }
}
