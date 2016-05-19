"use strict";
import EventEmitter from 'wolfy87-eventemitter'

/**
 * The GameServer Class is the primary way to communicate with a Game Server.
 * It uses WebSockets to implement bi-directional communication.
 * It extends EventEmitter which means you can subscribe to GameServer events.
 * @extends {EventEmitter}
 */
class GameServer extends EventEmitter{

  /**
    * List of all the possible action types.
    * @const
    * @type {Object}
    */
  static get Constants(){
    return {
      GET_EVERYTHING : "GET_EVERYTHING"
    }
  }

  /**
  * All the possible actions that can be requested of the Game Server.
  *
  * These functions return an action object that should be passed as an
  * argument to {@link dispatch} for the action to be exectued.
  *
  * This resembles the redux architecture.
  * @type {Object}
  * @example
  * GameServer gs = new GameServer(...);
  * gs.connect();
  * gs.dispatch(gs.Actions.getEverything());
  */
  static get Actions(){
    return {
      getEverything: () => ({type: this.Constants.GET_EVERYTHING})
    }
  }

  /**
   * Creates a GameServer
   *
   * @param  {String} server - Hostname/IP (prepended with a "ws://") of game
   * server.
   * @param {String} playerHash - Unique Hash that represents the player.
   */
  constructor(server, playerHash){
    super()
    this._server = server;
    this._playerHash = playerHash;

    /**
      * Flag to check if server is connected
      * @type {Boolean}
      */
    this.connected = false;

  }

  /**
   * Connect to the Game Server
   * @emits {"connect"} - connected to the Game Server
   * @emits {"error"} - error while (or after) connecting to the Game Server
   * @emits {"disconnect"} - disconnected from the Game Server
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
   * @param {String} message - Message to send.
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
   * @return {String} the rotocol prefix string.
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
