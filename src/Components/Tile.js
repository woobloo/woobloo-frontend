export default class Tile {
  static get SIDE() { return 64 }

  constructor(name, imageFile){
    this.name = name
    this.imageFile = imageFile
  }

}
