"use strict";
import EventEmitter from 'wolfy87-eventemitter'

/**
 * The GameServer Class is the primary way to communicate with a Game Server.
 * It uses WebSockets to implement bi-directional communication.
 * It extends EventEmitter which means you can subscribe to GameServer events.
 * @extends EventEmitter
 */
class GameServer extends EventEmitter{
  /**
   * Creates a GameServer
   *
   * @param  {string} server - Hostname/IP (prepended with a "ws://") of game
   * server.
   * @param {string} playerHash - Unique Hash that represents the player.
   */
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

  /**
   * Connect to the Game Server
   */
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

  /**
   * Send a plain text message to the Game Server.
   * You should almost certainly never have to use this publically.
   *
   * @param {string} message - Message to send.
   */
  send(message){
    this._ws.send(message)
  }

  /**
   * Generate protocol prefix from protocol Array.
   *
   * Convert array of ASCII indices to a string with the respective ASCII values.
   *
   * @param {Array} protocol - ASCII table indices.
   * @return {string} the rotocol prefix string.
   */
  getProtocolString(protocol){
    return protocol.reduce((string, int) => (string + String.fromCharCode(int)), "")
  }

  /**
   * Dispatch an action to the GameServer
   *
   * @param {Object} action - Server to commit; Obtain this by using one of the GameServer's Action methods.
   */
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

export default GameServer
