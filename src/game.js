import { STAGE_WIDTH, STAGE_HEIGHT } from './config.js'

import Tile from './Components/Tile.js'

var game = new Phaser.Game(STAGE_WIDTH, STAGE_HEIGHT, Phaser.AUTO, 'test', null, true, false);
var Woobloo = function (game) { };
Woobloo.Boot = function (game) { };

const TILES = [
  "grass",
  "rock"
]

var isoGroup, cursorPos, cursor, arrowKeys, infoPanel, hud;

Woobloo.Boot.prototype =
{
    init: function({Players, Map}){
      this._players = Players;
      this._map = Map;
      this._map_tiles = this._map.length;
      this._map_side = Tile.SIDE * this._map_tiles;
      this._world_width = this._map_side * 1.9;
      this._world_height = this._map_side;
    },

    getRandomInt: function(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },

    preload: function () {

        for(let i in TILES){
            game.load.image(TILES[i], `images/isomorphic/${TILES[i]}.png`);
        }

        game.load.image("tile_info_bg", "images/tile_info.png");

        game.time.advancedTiming = true;


        // Add and enable the plug-in.
        game.plugins.add(new Phaser.Plugin.Isometric(game));

        // This is used to set a game canvas-based offset for the 0, 0, 0 isometric coordinate - by default
        // this point would be at screen coordinates 0, 0 (top left) which is usually undesirable.
        game.iso.anchor.setTo(0.5, 0.04);

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

        // Create a group for our tiles.
        isoGroup = game.add.group();

        // Let's make a load of tiles on a grid.
        this.spawnTiles();

        // Provide a 3D position for the cursor
        cursorPos = new Phaser.Plugin.Isometric.Point3();

        arrowKeys = game.input.keyboard.createCursorKeys();

        this.renderHUD();
    },
    update: function () {
        // Update the cursor position.
        // It's important to understand that screen-to-isometric projection means you have to specify a z position manually, as this cannot be easily
        // determined from the 2D pointer position without extra trickery. By default, the z position is 0 if not set.
        game.iso.unproject(game.input.activePointer.position, cursorPos);

        // Loop through all tiles and test to see if the 3D position from above intersects with the automatically generated IsoSprite tile bounds.
        isoGroup.forEach(function (tile) {
            var inBounds = tile.isoBounds.containsXY(cursorPos.x, cursorPos.y);
            // If it does, do a little animation and tint change.
            if (!tile.selected && inBounds) {
                tile.selected = true;
                tile.tint = 0x86bfda;
                // console.log(tile);

                tile.infoPanel = game.add.image(tile.x, tile.y, "tile_info_bg")
                tile.infoPanel.anchor = new Phaser.Point(0, 1);
                tile.infoPanel.visible = false
                setTimeout(() => {
                  // tile.infoPanel = game.add.image(tile.x, tile.y, "tile_info_bg")
                  if(tile.selected)
                    tile.infoPanel.visible = true
                }, 1000);
                // game.add.image();

                // game.add.tween(tile).to({ isoZ: 4 }, 200, Phaser.Easing.Quadratic.InOut, true);
            }
            // If not, revert back to how it was.
            else if (tile.selected && !inBounds) {
                tile.selected = false;
                tile.tint = 0xffffff;

                if(tile.infoPanel)
                  tile.infoPanel.kill()

                // game.add.tween(tile).to({ isoZ: 0 }, 200, Phaser.Easing.Quadratic.InOut, true);
            }
        });

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
        game.debug.cameraInfo(game.camera, 32, 32);
    },
    spawnTiles: function () {
        var tile;
        for (var xx = 0; xx < this._map_tiles; xx ++) {
            for (var yy = 0; yy < this._map_tiles; yy ++) {
                // Create a tile using the new game.add.isoSprite factory method at the specified position.
                // The last parameter is the group you want to add it to (just like game.add.sprite)
                let tileData = this._map[xx][yy];
                tile = game.add.isoSprite(tileData.X, tileData.Y, 0, "grass", 0, isoGroup);
                tile.anchor.set(0.5, 0);
            }
        }
    }
};

game.state.add('Boot', Woobloo.Boot);

export default game;
