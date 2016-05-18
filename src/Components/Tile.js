/**
  * A class that represents a Tile and includes helper functions
  * and a render and update method.
  */
export default class Tile {

  /**
    * The side of a tile in pixels
    * @type {Number}
    */
  static get SIDE() { return 64 }

  /**
    * Make a new tile
    * @param {Object} props - Tile properties
    * @param {String} [props.type="grass"] - Type of tile
    * @param {Object} props.pos - position of tile
    * @param {Number} props.pos.x - X offset in units (tiles)
    * @param {Number} props.pos.y - Y offset in units (tiles)
    */
  constructor({ type = "grass", pos }){

    /**
      * Type of tile.
      *
      * This is also used as the name of the image file to use.
      * @type {String}
      */
    this.type = type

    /**
      * Position of tile.
      *
      * @type {Object}
      * @property {Number} pos.x - The X coordinate
      * @property {Number} pos.y - The Y coordinate
      */
    this.pos = pos
  }

}
