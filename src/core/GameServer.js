export default class GameServer{
  constructor(server, playerHash){
    this._server = server;
    this._playerHash = playerHash;
    this.connected = false;
  }
  connect(){
    this._ws = new WebSocket(this._server + "/" + this._playerHash)

    this._ws.onopen = (event) => {
      this.connected = true;
      this._ws.send("Hello Tom");
    }

    this._ws.onmessage = (message) => {
      console.log(message);
    }

    this._ws.onerror = () => {
      console.error("There was an issue connecting to the server.");
    }

    this._ws.onclose = () => {
      this.connected = false;
    }
  }

  send(message){
    this._ws.send(message)
  }

  getProtocolString(protocol_array){
    return protocol_array.reduce((string, int) => (string + String.fromCharCode(int)), "")
  }

  dispatch(action){
    switch (action.type){
      case "GET_EVERYTHING":
        this.send(this.getProtocolString[0, 0, 0, 1])
      break;
      default:
      break;

    }
  }
}
