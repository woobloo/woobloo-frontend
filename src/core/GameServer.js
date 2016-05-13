// import WebSocket from 'ws';
import EventEmitter from 'wolfy87-eventemitter'
// import binaryjs from 'binaryjs/'
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
    // console.log()

    this._ws = new WebSocket(this._server + "/" + this._playerHash)
    this._ws.binaryType = "arraybuffer";
    this._ws.onopen = (event) => {
      this.connected = true;
      console.log("server connected");
      this._ws.send("aa");
      // this._ws.send("Hello Tom", {binary: true});
      var buffer = new ArrayBuffer(128);
      // this._ws.send(buffer);
    }

    this._ws.onmessage = (message) => {
      console.log("received message");
      if(message.data instanceof ArrayBuffer) {
        console.log(message.data);
        // processArrayBuffer(msg.data);

      } else {
        console.log(message.data);
        // processText(msg.data);
      }

      emitEvent("newMessage", [message]); // TODO: emit message action as event
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
      case this.Constants.GET_EVERYTHING:
        this.send(this.getProtocolString[0, 0, 0, 1])
      break;
      default:
      break;

    }
  }
}
