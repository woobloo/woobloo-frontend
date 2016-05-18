export default class Tile {
  static get SIDE() { return 64 }

  constructor({ type = "grass", pos }){
    this.type = type
    this.pos = pos
  }

}
