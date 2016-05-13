import GameServer from "./../core/GameServer.js"
describe("GameServer", () => {
  let gs;
  beforeAll(() => {
     gs = new GameServer('ws://159.203.237.59:8080', "123e4567-e89b-12d3-a456-426655440000");
  })

  describe("getProtocolString", () => {
    it("returns a string that's as long as the parameter number of bytes", () => {
      console.log(gs.getProtocolString([0, 0, 0, 1]));
      expect(encodeURI(gs.getProtocolString([0, 0, 0, 1])).split(/%..|./).length - 1).toEqual(4);
    })

  })

} )
