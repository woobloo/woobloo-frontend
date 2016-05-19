import { STAGE_WIDTH, STAGE_HEIGHT } from './config.js'

import Game from './GameStates/Game.js'

var game = new Phaser.Game(STAGE_WIDTH, STAGE_HEIGHT, Phaser.AUTO, 'test', null, true, false);

game.state.add('Game', Game(game));
export default game;
