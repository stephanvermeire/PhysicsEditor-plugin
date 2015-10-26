# PhysicsEditor-plugin
Plugin for Panda.js + P2 to load physics settings generated with PhysicsEditor (Codeandweb)

This is a small plugin that enables loading a JSON file generated with PhysicsEditor directly in Panda.js+P2 physics engine. The main goal of this project is to facilitate the process and to provide an efficient the workflow to make great games inPanda.js.

Requirements:
* Panda.js framework
* P2 plugin for panda.js
* A working version of PhysicsEditor (https://www.codeandweb.com/physicseditor).

Instructions:
* Firstly you have to import the custom exporter into PhysicsEditor. This enables the program to export the physics settings of your choice in a workable JSON notation. Copy the exporter folder in this repository to your local harddrive and link the program to it (see: https://www.codeandweb.com/physicseditor/documentation, at the bottom of this page). 
* Import your personal images in PhysicsEditor and create all the settings you need in second. (Have a look at some of the great tutorials here: https://www.codeandweb.com/physicseditor/tutorials).
* Export the settings you just generated with the custom exporter Panda-p2 (JSON).
* Import the JSON in Panda like so:

//Load the JSON and image texture in cache memory
game.addAsset('physics.json');  
game.addAsset('myImage.png');

//retrieve the json file so we can use it
var physics =  game.getJSON('physics.json'),

//Now generate an image with all physics settings just in a single command
var mySprite = new game.P2Sprite('myImage.png', physics.myImage, game.system.width/2, game.system.height/2);
mySprite.addTo(game.scene.stage);

Enjoy!
