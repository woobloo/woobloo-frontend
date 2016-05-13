// import Zlib from 'zlibjs'
import GameServer from './core/GameServer.js'
import SetupPhaser from './core/SetupPhaser.js'
import Game from './game.js'

const gs = new GameServer('ws://159.203.237.59:8080', "123e4567-e89b-12d3-a456-426655440000");
gs.connect();

Game.state.start('Boot');
