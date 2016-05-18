import Tile from './Tile'

/**
  * A class that represents a Map, and includes helper functions
  * including a render method.
  */
class Map {

    /**
      * Create a new map object using JSON data that represents a map.
      * Usually in the same format as GameServer provided data.
      */
    constructor(mapData){
      this._map = mapData;
      this.height = mapData.length;
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
      * Create a new test map object of only grass tiles.
      *
      * return {Map} the grass map.
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
