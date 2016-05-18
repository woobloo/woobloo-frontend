import { STAGE_WIDTH, STAGE_HEIGHT } from './config.js'

import Tile from './Components/Tile.js'
import Map from './Components/Map.js'

var game = new Phaser.Game(STAGE_WIDTH, STAGE_HEIGHT, Phaser.AUTO, 'test', null, true, false);
var Woobloo = function (game) { };
Woobloo.Boot = function (game) { };

var cursorPos, cursor, arrowKeys, infoPanel, hud;

Woobloo.Boot.prototype =
{
    init: function(setup_data){

      if(setup_data == undefined){
        this._players = [];
        this._map = Map.createGrassMap();
      } else {
        const {Players, Map} = setup_data;
        this._players = Players;
        this._map = Map;
      }

      this._world_width = this._map.width * Tile.SIDE * 1.9;
      this._world_height = this._map.height * Tile.SIDE;
    },

    getRandomInt: function(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },

    preload: function () {
        // Add and enable the isometric plug-in.
        game.plugins.add(new Phaser.Plugin.Isometric(game));
        // This is used to set a game canvas-based offset for the 0, 0, 0 isometric coordinate - by default
        // this point would be at screen coordinates 0, 0 (top left) which is usually undesirable.
        game.iso.anchor.setTo(0.5, 0.04);

        game.time.advancedTiming = true;

        game.load.image("tile_info_bg", "images/tile_info.png");
        this._map.preload(game);
    },

    renderHUD: function() {
      hud = game.add.group();
      infoPanel = game.add.text(STAGE_WIDTH - 200, STAGE_HEIGHT - 50, "Test HUD");
      // hud.addChild(game.add.rectangle(STAGE_WIDTH - 100, STAGE_HEIGHT - 200, 100, 200));
      hud.addChild(infoPanel);

      hud.fixedToCamera = true;

      // game.add.image(0, 0, "grass")
    },
    create: function () {

        game.world.setBounds(0, 0, this._world_width, this._world_height);
        game.camera.x = (this._world_width)/2 - STAGE_WIDTH/2;
        game.camera.y = (this._world_height)/2 - STAGE_HEIGHT/2;

        this._map.render(game);

        // Provide a 3D position for the cursor
        cursorPos = new Phaser.Plugin.Isometric.Point3();

        arrowKeys = game.input.keyboard.createCursorKeys();

        this.renderHUD();
    },
    update: function () {
        // Update the cursor position.
        game.iso.unproject(game.input.activePointer.position, cursorPos);
        this._map.update(game, cursorPos)

        if (arrowKeys.up.isDown)
         {
             game.camera.y -= 4;
         }
         else if (arrowKeys.down.isDown)
         {
             game.camera.y += 4;
         }

         if (arrowKeys.left.isDown)
         {
             game.camera.x -= 4;
         }
         else if (arrowKeys.right.isDown)
         {
             game.camera.x += 4;
         }

         if(game.input.mousePointer.x <= STAGE_WIDTH*0.02 ){
            game.camera.x -= 8;
         } else if (game.input.mousePointer.x >= STAGE_WIDTH*0.98) {
            game.camera.x += 8;
         }

         if(game.input.mousePointer.y <= STAGE_HEIGHT*0.02 ){
            game.camera.y -= 8;
         } else if (game.input.mousePointer.y >= STAGE_HEIGHT*0.98) {
            game.camera.y += 8;
         }
    },
    render: function () {
        game.debug.text(`FPS: ${game.time.fps}` || '--', 4, 20, "#bbb");
        // game.debug.cameraInfo(game.camera, 32, 32);
    }
};

game.state.add('Boot', Woobloo.Boot);

export default game;
