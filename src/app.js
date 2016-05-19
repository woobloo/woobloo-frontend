import SetupPhaser from './core/SetupPhaser.js'
import Game from './game.js'
import GameServer from './core/GameServer.js'

const gs = new GameServer('ws://159.203.237.59:8080', "123e4567-e89b-12d3-a456-426655440000");
// gs.connect();

gs.on('connected', () => {
  gs.dispatch(gs.Actions.getEverything());
})

gs.on('error', () => {
  console.error("There was an error connecting to the server");
})

gs.on('disconnect', () => {
  console.log("Server Disconnected");
})

// gs.on('setup_data', setup_data => {
  Game.state.start('Game', true, false);
// });
