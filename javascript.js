/*
SplatCraft V0.4

*/

// Generator settings
var worldRules = {
	width:200,
	height:100,
	mode:"creative",
	fancyGraphics:true,
	assetDir:"assets"
};

// Player Stuff (Don't change this)
var player = {
	gravity:0,
	touchingLeft:false,
	touchingRight:false,
	touchingUp:false,
	touchingDown:false,
	direction:"right"
}

var worldData = "";

// Then all the other variables
var version = "0.4";
var canvas = document.getElementById('canvas');
var c = canvas.getContext("2d");
var world = [];
var px = 0;
var py = 2580;
var speed = 20;
var mouseX = 0;
var mouseY = 0;
var hoverBlock = {};
var currentBlock = "a";
var timer = 0;
var titleY = 0;
var gravity = 0;
var fullscreen = true;
var gameStarted = false;
var startButtonHover = false;
var multiplayerButtonHover = false;
var settingsButtonHover = false;
var paused = false;
var chat = ["&3-= Welcome to SplatCraft =-", "Use the arrow keys/wasd to move.", "Click on blocks to place and break them."];

// Main Game Loop
window.onload = function() {

	// Make assets for drawing
	assets = ["dirt", "stone", "grass", "coal", "gold", "air" , "playerHeadRight", "playerHeadLeft", "titleScreen", "selector", "brick", "torch1", "torch2", "wood", "woodStairsRight", "woodStairsLeft", "sign", "background"];
	var assetDiv = document.createElement('DIV');
	assetDiv.id = "imgs";
	for (var i = 0; i < assets.length; i++) {
		assetDiv.innerHTML += '<img src="' + worldRules.assetDir + "/" + assets[i] + '.png" id="' + assets[i] + '">';
	}
	document.body.appendChild(assetDiv);

	// Fullscreen
	if (document.getElementById('fullscreen').checked) {
		fullscreen = true;
	} else {
		fullscreen = false;
	}

	// Draw the screen over and over
	setInterval(function() {

		// Make fullscreen if specified
		if (fullscreen) {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight - 4;
			canvas.style.border = "transparent";
		} else {
			canvas.width = "500"
			canvas.height = "400";
			canvas.style.border = "1px solid black";
		}

		// Clear the screen and draw again
		c.clearRect(0,0,canvas.width,canvas.height);

		// Draw the title screen or game
		if (!gameStarted) {
			// Title Screen
			titleY = 50 + (10 * (Math.cos((timer - 10) * 500)));
			c.drawImage(titleScreen,canvas.width / 2 - 257 / 2 + .5,titleY);

			// Start Button
			if (startButtonHover) {
				c.strokeStyle = "lightgrey";
			} else {
				c.strokeStyle = "black";
			}
			c.strokeRect(canvas.width / 2 - 150 / 2 + .5,150,150,50);
			c.fillStyle = "black"
			c.font = "25px Arial";
			c.fillText("New Game",canvas.width / 2 - 150 / 2 + .5 + 12,183);

			// Multiplayer Button
			if (multiplayerButtonHover || !navigator.onLine) {
				c.strokeStyle = "lightgrey";
			} else {
				c.strokeStyle = "black";
			}
			c.strokeRect(canvas.width / 2 - 150 / 2 + .5,250,150,50);
			c.fillStyle = "black"
			c.font = "25px Arial";
			c.fillText("Multiplayer",canvas.width / 2 - 150 / 2 + .5 + 12,283);
			if (!navigator.onLine) {
				c.fillStyle = "red";
				c.font = "15px Arial";
				c.fillText("No internet connection!",canvas.width / 2 - 150 / 2 - 1,315);
			}

			// Settings Button
			if (settingsButtonHover) {
				c.strokeStyle = "lightgrey";
			} else {
				c.strokeStyle = "black";
			}
			c.strokeRect(canvas.width / 2 - 150 / 2 + .5,350,150,50);
			c.fillStyle = "black"
			c.font = "25px Arial";
			c.fillText("Settings",canvas.width / 2 - 115 / 2 + .5 + 12,383);

			// Bottom credits
			c.fillStyle = "black";
			c.font = "15px Arial";
			c.fillText("SplatCraft v" + version + " | Created by PetaByte Studios", 10, canvas.height - 10);
		} else {
			draw();

			// Draw the player
			if (worldRules.mode == "survival") {
				// draw player head
				if (player.direction == "right") {
					c.drawImage(playerHeadRight, canvas.width / 2 - 25, canvas.height / 2 - 25);
				} else {
					c.drawImage(playerHeadLeft, canvas.width / 2 - 25 ,canvas.height / 2 - 25);
				}
				if (player.touchingDown) {
					gravity = 0.1;
					py += gravity;
				} else {
					py += gravity;
					gravity -= .07;
				}
			}

			// Chat + color codes
			for (var i = 0; i < chat.length; i++) {
				c.font = "15px Arial";
				var text = chat[i];
				if (text.startsWith("&1")) {
					c.fillStyle = "red";
				} else if (text.startsWith("&2")) {
					c.fillStyle = "orange";
				} else if (text.startsWith("&3")) {
					c.fillStyle = "green";
				} else if (text.startsWith("&4")) {
					c.fillStyle = "grey";
				} else {
					c.fillStyle = "black";
				}
				text = text.replace(/&[0-9]/g,"");
				c.fillText(text, 10, (i + 1) * 20);
			}

			// Background color
			canvas.style.backgroundColor = "rgb(190, 231, 241)";

			if (paused) {
				c.drawImage(background, 0, 0, canvas.width + 100, canvas.height + 100);
				c.strokeStyle = "black";
				c.lineWidth = "5";
				c.strokeRect(canvas.width / 2 - (500 / 2), canvas.height / 2 - (300 / 2), 500, 300);
				c.fillStyle = "white";
				c.fillRect(canvas.width / 2 - (500 / 2), canvas.height / 2 - (300 / 2), 500, 300);
				c.fillStyle = "black";
				c.fillRect(canvas.width / 2 - (500 / 2), canvas.height / 2 - (300 / 2) + 40, 500, 3);
				c.font = "30px Arial";
				c.fillText("Paused", canvas.width / 2 - (500 / 2), canvas.height / 2 - (300 / 2) + 30);
			}
		}

	},1);

	// Timer
	setInterval(function() {
		timer += .1;
	},100);
}

// Keypresses
document.body.onkeydown = function(e) {
	if (paused) {
		if (e.key == "Escape") {
			if (paused) {
				paused = false;
			} else {
				paused = true;
			}
		}
	} else {
		if (e.key == "ArrowRight" || e.key == "d") {
			px -= speed;
			player.direction = "right";
		} else if (e.key == "ArrowLeft" || e.key == "a") {
			px += speed;
			player.direction = "left";
		} else if (e.key == "ArrowUp" || e.key == "w") {
			py += speed;
		} else if (e.key == "ArrowDown" || e.key == "s") {
			py -= speed;
		} else if (e.key == "1" || e.key == "2" || e.key == "3" || e.key == "4" || e.key == "5" || e.key == "6" || e.key == "9"|| e.key == "8" || e.key == "0" || e.key == "7") {
			currentBlock = Number(e.key);
		}
		if (e.key == "Escape") {
			if (paused) {
				paused = false;
			} else {
				paused = true;
			}
		}
	}

}

// Generate the world
function generate() {
	var stone = Math.floor(Math.random() * 30) + 20;
	var dirt = Math.floor(Math.random() * 10) + 5;
	for (var i = 0; i < worldRules.width; i++) {
		world.push("");

		// Stone
		for (var n = 0; n < stone; n++) {
			var a = Math.floor(Math.random() * 20) + 1;
			if (a == 5) {
				world[i] += "4";
			} else {
				world[i] += "3";
			}
		}

		// Dirt
		for (var n = 0; n < dirt; n++) {
			world[i] += "2";
		}

		// Grass
		world[i] += "1";

		// Air
		for (var n = 0; n < worldRules.height - world[i].length; n++) {
			world[i] += "0";
		}

		// Generate smooth hills
		var which = Math.floor(Math.random() * 2) + 1;
		var a = Math.floor(Math.random() * 2) + 1;
		if (which == 1) {
			// Stone
			if (a == 1) {
				stone++
			} else {
				stone--
			}
		}
	}
}

// Draw the world on the screen
function draw() {
	var x = px;
	var y = py;
	for (var i = 0; i < worldRules.width; i++) {
		for (var n = 0; n < worldRules.height; n++) {
			var split = world[i].split("");

			// Draw the specified block
			if (i * 50 + 50 > Math.abs(px) && i * 50 + 50 + canvas.width > Math.abs(px)) {
				if (worldRules.fancyGraphics) {
					c.drawImage(document.getElementById(getBlockInfo(split[n])), x, y, 50, 50);
				} else {
					if (split[n] == "0") {
						c.fillStyle = "lightblue";
					} else if (split[n] == "1") {
						c.fillStyle = "green";
					} else if (split[n] == "2") {
						c.fillStyle = "brown";
					} else if (split[n] == "3") {
						c.fillStyle = "grey";
					} else if (split[n] == "4") {
						c.fillStyle = "black";
					} else if (split[n] == "5") {
						c.fillStyle = "darkgrey";
					} else if (split[n] == "6") {
						c.fillStyle = "yellow";
					} else {
						
					}
					c.fillRect(x,y,50,50);
				}
			}

			// Check if the mouse is over the current block
			if (mouseX >= x && mouseX <= x + 50 && mouseY >= y && mouseY <= y + 50) {

				// Set block x and y
				hoverBlock = {
					id:split[n],
					xPos:Math.abs((x - px) / 50),
					yPos:Math.abs((y - py) / 50)
				};

				// Make the selector box
				c.drawImage(selector, x, y, 50, 50)
			}

			// Check if touching player
			if (canvas.width / 2 - 25 > x && canvas.width / 2 - 100 <= x && canvas.height / 2 - 25 <= y && canvas.height / 2 - -50 >= y) {
				if (split[n] == "0" || split[n] == undefined) {
					player.touchingDown = false;
				} else {
					//c.drawImage(selector, x, y, 50, 50);
					player.touchingDown = true;
				}
			}

			y -= 50;
		}
		x += 50;
		y = py;
	}
}

// Function to get a block's info
function getBlockInfo(id) {
	if (id == "3") {
		return "stone"
	} else if (id == "2") {
		return "dirt"
	} else if (id == "1") {
		return "grass"
	} else if (id == "0") {
		return "air"
	} else if (id == "4") {
		return "coal"
	} else if (id == "5") {
		return "brick"
	} else if (id == "6") {
		var random = Math.floor(Math.random() * 2) + 1;
		if (random == 1) {
			return "torch1"
		} else {
			return "torch2"
		}
	} else if (id == "7") {
		return "wood"
	} else if (id == "8") {
		return "woodStairsRight"
	} else if (id == "9") {
		return "woodStairsLeft"
	} else if (id == "a") {
		return "sign"
	} else {
		return "air"
	}
}

// Get mouse position
function getMouse(event) {
	// Set mouseX and mouseY vars
	mouseX = event.clientX;
	mouseY = event.clientY;

	// Hover menu button
	if (mouseX >= canvas.width / 2 - 150 / 2 + 10 && mouseX <= canvas.width / 2 - 150 / 2 + 10 + 150 && mouseY >= 159 && mouseY <= 211) {
		startButtonHover = true;
	} else {
		startButtonHover = false;
	}

	// Multiplayer button hover
	if (mouseX >= canvas.width / 2 - 150 / 2 + 10 && mouseX <= canvas.width / 2 - 150 / 2 + 10 + 150 && mouseY >= 259 && mouseY <= 311) {
		multiplayerButtonHover = true;
	} else {
		multiplayerButtonHover = false;
	}

	// Settings button hover
	if (mouseX >= canvas.width / 2 - 150 / 2 + 10 && mouseX <= canvas.width / 2 - 150 / 2 + 10 + 150 && mouseY >= 359 && mouseY <= 411) {
		settingsButtonHover = true;
	} else {
		settingsButtonHover = false;
	}

}

// Handle click events (like breaking blocks)
function clicked() {
	console.log(mouseY);
	if (gameStarted) {
		var split = world[hoverBlock.xPos].split("");
		if (hoverBlock.id == "0") {
			split[hoverBlock.yPos] = currentBlock;
		} else {
			split[hoverBlock.yPos] = "0";
		}
		world[hoverBlock.xPos] = split.join("");
	} else {
		if (startButtonHover) {
			// Generate the world
			generate();

			// Start drawing the game on the screen
			gameStarted = true;
		} else if (multiplayerButtonHover) {

			// Servers!
			if (!navigator.onLine) {
				
			} else {
				var id = prompt("Enter the server ID you wish to connect to.");
				var head = document.getElementsByTagName('HEAD').item(0);
				var script = document.createElement("script");
				script.type = "text/javascript";
				script.src = "http://petabytestudios.usa.cc/SplatCraftServers/" + id + ".js";
				head.appendChild(script);

				// Start connecting.
				script.onload = function() {
					world = server.world;
					chat = server.welcomeMessage;
					gameStarted = true;
				}
			}
		} else if (settingsButtonHover) {
			// Change this when finished
			// document.getElementById('settings').style.display = "block";
		}
	}
}
