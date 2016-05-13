import EventEmitter from 'wolfy87-eventemitter'
export default class GameServer extends EventEmitter{

  constructor(server, playerHash){
    super()

    this._server = server;
    this._playerHash = playerHash;
    this.connected = false;

    this.Constants = {
      GET_EVERYTHING : "GET_EVERYTHING"
    }

    this.Actions = {
      getEverything: () => ({type: this.Constants.GET_EVERYTHING})
    }
  }
  connect(){
    this._ws = new WebSocket(this._server + "/" + this._playerHash)
    this._ws.binaryType = "arraybuffer";
    this._ws.onopen = (event) => {
      this.connected = true;
      this.emitEvent("connect");
    }

    this._ws.onmessage = (message) => {
      Promise.resolve(message)
      .then(data => data.json())
      .then(setup_data => this.emitEvent("setup_data", [setup_data])) // TODO: emit message action as event
      .catch(err => this.emitEvent("error"))
    }

    this._ws.onerror = () => {
      this.emitEvent("error");
    }

    this._ws.onclose = () => {
      this.connected = false;
      this.emitEvent("disconnect")
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
      case this.Constants.GET_EVERYTHING:
        this.send(this.getProtocolString[0, 0, 0, 1])
      break;
      default:
      break;

    }
  }
}
