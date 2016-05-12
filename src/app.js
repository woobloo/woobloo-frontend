import Tile from './Components/Tile.js'

const gs = new WebSocket('ws://echo.websocket.org');
gs.onopen = (event) => {
  gs.send("Hello Tom");
}
gs.onmessage = (message) => {
  console.log(message);
}


window.PIXI = require('phaser/build/custom/pixi')
window.p2 = require('phaser/build/custom/p2')
window.Phaser = require('phaser/build/custom/phaser-split')
require("./plugins/phaser-plugin-isometric.js")

var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'test', null, true, false);


var BasicGame = function (game) { };

BasicGame.Boot = function (game) { };

const TILE_SIDE = Tile.SIDE;
const MAP_TILES = 50;
const MAP_SIDE = TILE_SIDE * MAP_TILES;
const WORLD_WIDTH = MAP_SIDE*1.9;
const WORLD_HEIGHT = MAP_SIDE;
const TILES = [
  new Tile('grass', 'images/isometric/grass.png'),
  new Tile('rock', 'images/isometric/rock.png'),
]



var isoGroup, cursorPos, cursor, arrowKeys;

BasicGame.Boot.prototype =
{
    getRandomInt: function(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },

    preload: function () {

        for(let i in TILES){
            game.load.image(TILES[i].name, TILES[i].imageFile);
        }

        game.time.advancedTiming = true;


        // Add and enable the plug-in.
        game.plugins.add(new Phaser.Plugin.Isometric(game));

        // This is used to set a game canvas-based offset for the 0, 0, 0 isometric coordinate - by default
        // this point would be at screen coordinates 0, 0 (top left) which is usually undesirable.
        game.iso.anchor.setTo(0.5, 0.04);


    },
    create: function () {

        game.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
        game.camera.x = (WORLD_WIDTH)/2 - window.innerWidth/2;
        game.camera.y = (WORLD_HEIGHT)/2 - window.innerHeight/2;

        // Create a group for our tiles.
        isoGroup = game.add.group();

        // Let's make a load of tiles on a grid.
        this.spawnTiles();

        // Provide a 3D position for the cursor
        cursorPos = new Phaser.Plugin.Isometric.Point3();

        arrowKeys = game.input.keyboard.createCursorKeys();
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
                // game.add.tween(tile).to({ isoZ: 4 }, 200, Phaser.Easing.Quadratic.InOut, true);
            }
            // If not, revert back to how it was.
            else if (tile.selected && !inBounds) {
                tile.selected = false;
                tile.tint = 0xffffff;
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

         if(game.input.mousePointer.x <= window.innerWidth*0.02 ){
            game.camera.x -= 8;
         } else if (game.input.mousePointer.x >= window.innerWidth*0.98) {
            game.camera.x += 8;
         }

         if(game.input.mousePointer.y <= window.innerHeight*0.02 ){
            game.camera.y -= 8;
         } else if (game.input.mousePointer.y >= window.innerHeight*0.98) {
            game.camera.y += 8;
         }
    },
    render: function () {
        game.debug.text(`FPS: ${game.time.fps}` || '--', 4, 20, "#bbb");
        game.debug.cameraInfo(game.camera, 32, 32);
    },
    spawnTiles: function () {
        var tile;
        for (var xx = 0; xx < MAP_SIDE; xx += TILE_SIDE) {
            for (var yy = 0; yy < MAP_SIDE; yy += TILE_SIDE) {
                // Create a tile using the new game.add.isoSprite factory method at the specified position.
                // The last parameter is the group you want to add it to (just like game.add.sprite)
                tile = game.add.isoSprite(xx, yy, 0, TILES[this.getRandomInt(0, TILES.length)].name, 0, isoGroup);
                tile.anchor.set(0.5, 0);
            }
        }
    }
};

game.state.add('Boot', BasicGame.Boot);
game.state.start('Boot');
