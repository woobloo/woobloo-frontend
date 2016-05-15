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
            map[i][j] = new Tile("grass");
          }
      }

      return new Map(map);
    }
}

export default Map
