import Tile from './Tile'

/**
  * A class that represents a Map and includes helper functions
  * and a render and update method.
  */
class Map {

    /**
      * Create a new map object using JSON data that represents a map.
      * Usually in the same format as GameServer provided data.
      * @param {Object} mapData - The Map data (from a server for instance)
      */
    constructor(mapData){
      this._map = mapData;

      /**
        * The map's height in units (tiles)
        * @type {Number}
        */
      this.height = mapData.length;

      /**
        * The map's width in units (tiles)
        * @type {Number}
        */
      this.width = mapData[0].length;

      this._tileset = ["grass","rock"]
    }

    /**
      * Preload all the resources used by a Map object
      * @param {Phaser.Game} game - The Phaser game instance
      */
      preload(game){
        for(let i in this._tileset){
            game.load.image(this._tileset[i], `images/isometric/${this._tileset[i]}.png`);
        }
      }

    /**
      * Render the Map.
      * @param {Phaser.Game} game - The Phaser game instance
      */
      render(game){
        // Create a group for our tiles.
        this._isoGroup = game.add.group();

        for (var xx = 0; xx < this.height; xx ++) {
            for (var yy = 0; yy < this.width; yy ++) {
                // Create a tile using the new game.add.isoSprite factory method at the specified position.
                // The last parameter is the group you want to add it to (just like game.add.sprite)
                let tileData = this._map[xx][yy];
                let tile = game.add.isoSprite(tileData.pos.x*Tile.SIDE, tileData.pos.y*Tile.SIDE, 0, "grass", 0, this._isoGroup);
                tile.anchor.set(0.5, 0);
            }
        }
      }

    /**
      * Update the Map
      * @param {Phaser.Game} game - The Phaser game instance
      * @param {Phaser.Plugin.Isometric.Point3} cursorPos - The cursor position
      */
    update(game, cursorPos){
      // Loop through all tiles and test to see if the 3D position from above intersects with the automatically generated IsoSprite tile bounds.
      this._isoGroup.forEach(function (tile) {
          var inBounds = tile.isoBounds.containsXY(cursorPos.x, cursorPos.y);
          // If it does, do a little animation and tint change.
          if (!tile.selected && inBounds) {
              tile.selected = true;
              // tile.tint = 0x86bfda;
              tile.tint = 0xa2a2a2;
              // console.log(tile);

              tile.infoPanel = game.add.image(tile.x, tile.y, "tile_info_bg")
              tile.infoPanel.anchor = new Phaser.Point(0, 1);
              tile.infoPanel.visible = false
              setTimeout(() => {
                // tile.infoPanel = game.add.image(tile.x, tile.y, "tile_info_bg")
                if(tile.selected)
                  tile.infoPanel.visible = true
              }, 1000);
              // game.add.image();

              // game.add.tween(tile).to({ isoZ: 4 }, 200, Phaser.Easing.Quadratic.InOut, true);
          }
          // If not, revert back to how it was.
          else if (tile.selected && !inBounds) {
              tile.selected = false;
              tile.tint = 0xffffff;

              if(tile.infoPanel)
                tile.infoPanel.kill()

              // game.add.tween(tile).to({ isoZ: 0 }, 200, Phaser.Easing.Quadratic.InOut, true);
          }
      });
    }

    /**
      * Create a new test map object of only grass tiles.
      *
      * @return {Map} the grass map.
      */
    static createGrassMap(){
      let map = [];

      for(var i = 0; i < 50; i++){
        map[i] = [];
          for(var j = 0; j < 50; j++){
            map[i][j] = new Tile(
              {
                type: "grass",
                pos: { x: i,y: j }
              }
            );
          }
      }

      return new Map(map);
    }
}

export default Map
