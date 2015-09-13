(function(definition) {
    /* global module, define */
    if(typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = definition();
    } else if(typeof define === 'function' && define.amd) {
        define([], definition);
    } else {
        var exports = definition();
        window.Game = exports.Game;
        
    }
})(function() {


	function Game(canvas,playStyle) {

		this.canvas = canvas;
		this.playStyle = playStyle;


		this.score = 0;

		var text = {};
		text.score = new TextObject("SCORE: ",unitSize*0.25,unitSize*0.5);

		text.highScore = new TextObject("HIGH SCORE: "+highScore,unitSize*22.5,unitSize*0.5,"right");

		text.charges = new TextObject("CHARGES: ",unitSize*0.25,unitSize*14.5);

		text.gameOver = new TextObject("GAME OVER!",11.5*unitSize,this.canvas.height/2,"center","rgb(60,60,60)");
		text.gameOver.font = unitSize*2+"px 'avenirnext-bold','droid sans'";
		text.gameOver.visible = false;
		text.gameOver.alpha = 0;
		
		text.congrats = new TextObject("Congratulations!",11.5*unitSize,unitSize*6.5,"center","rgb(60,60,60)");
		text.congrats.font = unitSize*2+"px 'avenirnext-bolditalic','droid sans'";
		text.congrats.visible = false;

		text.congrats2 = new TextObject("You've beat you're high score!",11.5*unitSize,unitSize*8.5,"center","rgb(60,60,60)");
		text.congrats2.font = unitSize+"px 'avenirnext-bold','droid sans'";
		text.congrats2.w = unitSize*16;
		text.congrats2.lh = unitSize;
		text.congrats2.visible = false;
		this.text = text;

		this.init(1);
		var ths = this;
		
		console.log(playStyle)
		this.steps = 0;
		this.READY = playStyle === "P";


		controls.keys.esc.down = function() {
			if(!ths.PAUSED) ths.PAUSED = true;
			else ths.PAUSED = false;
		};
		controls.keys.space.down = function() {
			ths.fireWeapon("laser");
		};
		//  CHECK FOR CONTROLS
		controls.keys.up.down = function() { move("N"); }
		controls.keys.right.down = function() { move("E"); }
		controls.keys.down.down = function() { move("S"); }
		controls.keys.left.down = function() { move("W"); }
		controls.keys.up.held = function() { move("N"); }
		controls.keys.right.held = function() { move("E"); }
		controls.keys.down.held = function() { move("S"); }
		controls.keys.left.held = function() { move("W"); }
		buttons = [];
		if(mobile) {
			buttons.push({x:0,
						  y:0,
						  w:canvas.width* 0.2,
						  h:canvas.height,
						  down:function(){
							  move("W");
							},
						  held:function(){
							  move("W");
							}
						});
			buttons.push({x:canvas.width*0.2,
						  y:0,
						  w:canvas.width*0.6,
						  h:canvas.width*0.2,
						  down:function(){
							  move("N");
							},
						  held:function(){
							  move("N");
							}
						});
			buttons.push({x:canvas.width*0.2,
						  y:canvas.height-canvas.width*0.2,
						  w:canvas.width*0.6,
						  h:canvas.width*0.2,
						  down:function(){
							  move("S");
							},
						  held:function(){
							  move("S");
							}


						});
			buttons.push({x:canvas.width-canvas.width*0.2,
						  y:0,
						  w:canvas.width*0.2,
						  h:canvas.height,
						  down:function(){
							  move("E");
							},
						  held:function(){
							  move("E");
							}


						});

			buttons.push({x:canvas.width*0.2,
						  y:canvas.width*0.2,
						  w:canvas.width*0.6,
						  h:canvas.height-canvas.width*0.4,
						  down:function(){
						  	ths.fireWeapon("laser");}
						});
		}
		function move(dir) {
			// console.log(ths.player.moving);
			if(ths.playStyle === "P"
			// || (ths.playStyle === "R" && ready())) {
			|| (ths.playStyle === "R" && !ths.player.moving)) {

				// console.log("moveHit")
				ths.player.nextDir = dir;
				ths.READY = true;
				ths.steps++;
			}
		};
		// function ready() {
		// 	for(var i=0,iL=ths.ghosts.length; i<iL; i++) {
		// 		if(ths.ghosts[i].moving)
		// 			return false
		// 	}
		// 	if(ths.player.moving)
		// 		return false;
		// 	return true;
		// };

		// console.log(this.canvas.width,this.canvas.height)
	};

	Game.prototype.init = function(level) {
		wallColour = hslToRgb(random(0,1),0.9,0.4,1);

		if(level) seq = level;

		var ths = this;



		// NM8.easings = [];
		// this.text.gameOver.alpha = 0;
		// this.text.gameOver.visible = false;
		this.PAUSED = true;

		this.levelComplete = false;
		this.nextLevel = false;
		this.GAME_OVER = false;
		this.steps = 0;

		this.finishPath = [];

		

		this.sprites = [];

		this.energyPellets = [];
		this.charges = 10;

		// this.weapon = new Weapon();
		// this.weapon.visible = false;

		// this.sprites.push(this.weapon);

		this.heap = new BinaryHeap(function(node){return node.zIndex;});

		


		
		// controls.keys.space.up = function() {ths.init(seq++);};
		this.PAUSED = true;
		
		fade(2000,"out",function(){
			ths.PAUSED = false;
		});
		

		

		this.mapMaker = new Maps();
		//  19,11  is stable
		//  23,13
		//  23,15
		this.Map = this.mapMaker.makeMap(19,13);
		this.map = this.Map.map;
		this.portals = this.Map.portals;
		this.eLocs = this.Map.eLocs;
		// console.log(this.eLocs)
		// this.map = this.mapMaker.makeMap(20,13);
		// this.map = this.mapMaker.makeMap(23,15);
		// debugGrid(map);

		
		this.litTiles = [];


		this.WAIT = 1;
		this.MOVE = 2;
		this.state = 1;

		if(this.buildGrid(this.map)) {
			// this.camera = new Camera(this);
			// this.camera.initCam(0,0);
			this.centreTile = this.grid[6][11].walls;


			this.player = new Actor(this,11,7,"player");
			this.player.nextDir = "W";


			this.lastEnemy = new Date().getTime();
			this.enemyPeriod = 10000;
			this.ghostTypes = [
				// { 
				// 	colour: "orange",
				// 	type: "cutOff"
				// },
				{ 
					colour: "pink",
					type: "dumb"
				},
				{ 
					colour: "blue",
					type: "patrol"
				},
				{ 
					colour: "green",
					type: "follow"
				},
				{ 
					colour: "orange",
					type: "cutOff"
				}
				
			];
			
			this.ghosts = [];
			// this.toRemove = [];
			this.addEnemy();

			//  MAKE ENERGY PELLETS ON LEFT
			for(var i=0,iL=this.eLocs.length; i<iL; i++) {
				var eL = this.eLocs[i];
				var energy = new Actor(this,eL.x,eL.y,"energy");
				energy.zIndex = eL.y*3 + 1;
				this.energyPellets.push(energy);
				this.sprites.push(energy);
				// this.grid[eL.y][eL.x].actors.push(energy);
			}

			//  MAKE ENERGY PELLETS ON THE RIGHT AND TELL eLocs ABOUT THEM
			for(var i=0,iL=this.eLocs.length; i<iL; i++) {
				var eL = this.eLocs[i];
				var energy = new Actor(this,this.grid[0].length-1-eL.x,eL.y,"energy");
				energy.zIndex = eL.y*3 + 1;
				this.eLocs.push({x:this.grid[0].length-1-eL.x,y:eL.y,gx:this.grid[0].length-1-eL.x,gy:eL.y});
				this.sprites.push(energy);
				this.energyPellets.push(energy);
				// this.grid[eL.y][eL.x].actors.push(energy);
			}
			// debugGrid(this.map);

		}
	};

	

	Game.prototype.fireWeapon = function(type) {
		// wallColour = hslToRgb(random(0,1),0.9,0.4,1);
		this.weapon = new Weapon();
		var wpn = this.weapon;

		// this.sprites.push(this.weapon);
		var pl = this.player
		// var wpn = new Weapon();
		this.sprites.push(wpn);

		var deadGhosts = [];

		//  IF WE HAVE ANY CHARGES
		if(this.charges > 0 && !wpn.FIRING) {
			wpn.FIRING = true;

			soundEffect(0,SFX.shootSound);

			wpn.visible = true;
			wpn.type = type;
			wpn.zIndex = pl.zIndex;

			switch(type) {
				case "laser":
					// console.log("weaponFired");
					var cObj = {x:0,y:0,w:0,h:0};
					//  GET THE LINE AHEAD OF US
					switch(pl.lastDir) {
						case "N":

							cObj.x = pl.x;
							cObj.w = unitSize;
							for(var i=1,iL=pl.gy+1; i<iL; i++) {
								if(this.map[pl.gy-i][pl.gx] === 1)
									cObj.h += unitSize;
								else {
									cObj.y = pl.gy - cObj.h;
									wpn.target = {x: pl.gx, y: pl.gy - i}
									// console.log(wpn.target)
									break;
								}
							}
						break;
						case "E":
							cObj.x = pl.x;
							cObj.y = pl.y;
							cObj.h = unitSize;

							for(var i=1,iL=this.map[0].length-pl.gx; i<iL; i++) {
								if(this.map[pl.gy][pl.gx+i] === 1)
									cObj.w += unitSize;
								else {
									wpn.target = {x: pl.gx + i, y: pl.gy}
									break;
								}
							}
						break;
						case "S":
							cObj.x = pl.x;
							cObj.y = pl.y;
							cObj.w = unitSize;
							for(var i=1,iL=this.map.length-pl.gy; i<iL; i++) {

								if(this.map[pl.gy+i][pl.gx] === 1)
									cObj.h += unitSize;
								else {
									
									wpn.zIndex = (pl.gy+i) * 3 - 2;
									// console.log(wpn.zIndex,pl.zIndex)
									wpn.target = {x: pl.gx, y: pl.gy + i}
									break;
								}
							}
						break;
						case "W":
							cObj.y = pl.y;
							cObj.h = unitSize;
							for(var i=1,iL=pl.gx+1; i<iL; i++) {
								if(this.map[pl.gy][pl.gx-i] === 1)
									cObj.w += unitSize;
								else {
									cObj.x = pl.x - cObj.w;
									wpn.target = {x: pl.gx - i, y: pl.gy}
									break;
								}
							}
						break;
						
					}

					
					wpn.x = pl.x + unitSize/2;
					wpn.y = pl.y + unitSize/4;
					// wpn.zIndex = pl.zIndex;
					// console.log(wpn.target)

					for(var i in this.ghosts) {
						if(this.ghosts[i]) {
							// console.log(boxCollide(cObj,this.ghosts[i]));
							if(boxCollide(cObj,this.ghosts[i]))
								// console.log(this.ghosts[i])
								deadGhosts.push(this.ghosts[i]);
						}
					}
					// wpn.target = cellsToRoast[cellsToRoast.length-1];
					fade(300,"out",function() {
							wpn.visible = false;
							wpn.FIRING = false;
							// this.target = null;
						},wpn);
					// NM8.animateValue(wpn,"alpha",1,0, function(X){return X*X*(3-2*X)},300,
					// 	function() {
					// 		wpn.visible = false;
					// 		wpn.FIRING = false;
					// 		// this.target = null;
					// 	});
					// NM8.easings.push(wpn);

				break;

				case "proxy":

					//  CELLS TO ROAST COLLECTION
					// for(var y= -2; y<3; y++) {
					// 	for(var x= -2; x<3; x++) {
					// 		// console.log(this.map[pl.gy+y][pl.gx+x] === 1)
					// 		// console.log(distance(pl,{gx:pl.gy+y,gy:pl.gx+x}))

					// 		if(this.map[pl.gy+y] !== undefined
					// 		&& this.map[pl.gy+y][pl.gx+x] !== undefined
					// 		&& this.map[pl.gy+y][pl.gx+x] === 1)
					// 			deadGhosts.push({x:pl.gx+x,y:pl.gy+y});
					// 	}

					// }

					//  FUCK IT, WE'LL DO BY DISTANCE

					//  ONCE CELL TO ROAST
					// cellsToRoast.push([{actors:[]}]);
					for(var i in this.ghosts) {
						// console.log(distance({x:pl.x,y:pl.y},this.ghosts[i]));
						if(distance({x:pl.x,y:pl.y},this.ghosts[i]) < 2.5*unitSize)
							deadGhosts.push(this.ghosts[i]);
					// 		cellsToRoast[0].actors.push(this.enemies[i]);
					}


					//  WEAPON DRAWING
					wpn.x = pl.x;
					wpn.y = pl.y;
					wpn.zIndex = pl.zIndex;
					NM8.animateValue(wpn,"radius",0.1,2.5, function(X){return X*X*(3-2*X)},300,
						function() {
							// this.target = null;
						});
					fade(300,"out",function() {
							wpn.visible = false;
							wpn.FIRING = false;
							// this.target = null;
						},wpn);
					// NM8.animateValue(wpn,"alpha",1,0, function(X){return X*X*(3-2*X)},300,
					// 	function() {
					// 		wpn.visible = false;
					// 		wpn.FIRING = false;
					// 		// this.target = null;
					// 	});
					// NM8.easings.push(wpn);

				break;
			}

			//  KILL GHOSTS
			for(var i in deadGhosts) {
				this.score += 100;


				var ghost = deadGhosts[i];
				ghost.dead = true;
				
				this.removeEnemy(ghost);
				// ghost.removeFromGrid();
				// console.log(ghost)
				
// console.log(this.grid[cell.y][cell.x].actors.length)
				// for(var j=0,jL=this.grid[cell.y][cell.x].actors.length; j<jL; j++) {
				// 	// console.log(this.grid[cell.y][cell.x].actors[j].type)
				// 		this.removeEnemy(this.grid[cell.y][cell.x].actors[j]);
				// }
			}
			

			//  USE A CHARGE
			this.charges -= 1;


		} else {
			console.log("your wand fizzles")
		}
		
	};

	

	Game.prototype.addEnemy = function() {
		if(this.ghostTypes.length > 0) {
			var ghost = this.ghostTypes.splice(0,1)[0];
			var type = ghost.type;
			var colour = hslToRgb(random(0,1),0.8,0.55,0.85);
			var ghost = new Actor(this,11,5,"ghost");
			ghost.path = this.bestPath(ghost,this.player);
			ghost.aiType = type;
			ghost.colour = colour;
			ghost.alpha = 0;
			var ths = this;
			ghost.speed = MOVE_SPEED * 1.3;
			fade(700,"in",function() {ths.ghosts.push(ghost)},ghost);
			// NM8.animateValue(ghost,"alpha",0,1, function(X){return X*X*(3-2*X)},700,
			// 	function() {ths.ghosts.push(ghost)});
			// NM8.easings.push(ghost);
			// (target, value, from, to, delta, duration, callback, type, times)
			
			// this.ghosts.push(ghost)
		}
	};

	Game.prototype.removeEnemy = function(enemy) {
		// console.log("removeEnemy")

		
		// console.log(this.ghostTypes)
		

		//  TAKE HIM OUT OF this.ghosts IMMEDIATELY TO STOP COLLISION
		for(var i in this.ghosts) {
			var gh = this.ghosts[i];
			if(enemy.aiType === gh.aiType) {
				//  RE QUEUE THE GHOST FOR "BIRTH"
				if(!this.levelComplete)
					this.ghostTypes.push({
						type:enemy.aiType,
						colour:enemy.colour
					});

				//  FADE HIM OUT
				fade(700,"out",function() {
						var act = enemy.game.grid[enemy.gy][enemy.gx].actors;
						act.splice(act.indexOf(enemy),1);
						enemy.visible = false;
					},enemy);
				// NM8.animateValue(enemy,"alpha",1,0, function(X){return X*X*(3-2*X)},700,
				// 	function() {
				// 		var act = enemy.game.grid[enemy.gy][enemy.gx].actors;
				// 		act.splice(act.indexOf(enemy),1);
				// 		enemy.visible = false;
				// 	});
				this.ghosts.splice(this.ghosts.indexOf(enemy),1);
				// this.toRemove.push(this);
				// this.sprites.splice(this.ghosts.indexOf(enemy),1);
			}

		}
		

		
		// NM8.easings.push(enemy);
		
		
	};

	Game.prototype.buildGrid = function(levelGrid) {
		this.grid = [];
		this.floorCells = [];
		for(var y=0,yL=this.map.length; y<yL; y++) {
			this.grid.push([]);
			for(var x=0,xL=this.map[0].length; x<xL; x++) {
				var obj = {
					stairs: null,
					ground: null,
					player: null,
					actors: [],
					walls: null
				};

				//  WALL TILES
				if(this.map[y][x] === 0) {
					//  THE CENTRE TILE GETS STAIRS BENEATH IT
					if(y===6 && x===11) {
						// this.centreTile = obj.walls;
						// this.centreTile.gx = x;
						// this.centreTile.gy = y;
						// this.centreTile.visible = false;
						var S = new Actor(this,x,y,"stairs");
						// obj.stairs.lit = false;
						// obj.stairs.litTime = null;
						S.gx = x;
						S.gy = y;

						S.zIndex = y*3;
						S.visible = false;

						this.stairs = S;
						console.log(this.stairs);
						// this.sprites.push(obj.stairs);
					}
					// this.sprites.push(obj.walls);
					var W = new Actor(this,x,y,"wall");
					if(this.playStyle === "R")
						W.alpha = 0;
					if(this.map[y+1] !== undefined
					&& this.map[y+1][x] === 0)
						W.type = "wall2";
					W.zIndex = y*3;
					obj.walls = W;

					
				}

				//  FLOOR TILES
				if(this.map[y][x] === 1) {
					var G = new Actor(this,x,y,"floor");
					// obj.ground = new Actor(this,x,y,"floor");
					if(this.playStyle === "R")
						G.alpha = 0;
					G.lit = false;
					G.litTime = null;
					// G.colour = hslToRgb(1-1/3,0.03,0.2,1);
					G.gx = x;
					G.gy = y;
					obj.ground = G;
					
					this.floorCells.push(G);
					G.zIndex = y*3;
				}

				this.grid[y].push(obj);

			}

		}
		this.floorTileCount = this.floorCells.length;

		// if(this.playStyle === "P")
		// 	this.levelTime = this.floorCells.length * 400 * 1.5;
		// else this.levelTime = Math.floor(this.floorCells.length*1.5);
		return true;
	};

	Game.prototype.update = function() {
		
		var ths = this;

		
			


		//  FINDS THE PATH TO THE STAIRS AFTER A LEVEL IS COMPLETE
		function finishPath() {
			if(ths.levelComplete) {

				ths.finishPath = ths.bestPath(ths.player,ths.centreTile);
				for(var i=ths.litTiles.length-1; i>=0; i--) {
					var tile = ths.litTiles[i];
					tile.light = false;
				}

				if(ths.finishPath.length > 0) {
					for(var i=0,iL=ths.finishPath.length; i<iL; i++) {
						var node = ths.finishPath[i];
						var tile = ths.grid[node.y][node.x].ground;
						
						if(tile) {
							tile.light = true;
							ths.litTiles.push(tile);
						}


					}
					
				}
				for(var i=ths.litTiles.length-1; i>=0; i--) {
					var tile = ths.litTiles[i];
					if(tile.light && !tile.lit)
						tile.fadeIn();
					else if(!tile.light && tile.lit) {
						
						tile.fadeOut();
					}
					else if(tile.light && tile.lit) {
						if(!tile.fading) {
							tile.H = 0.67;
							tile.S = 0.2;
							tile.L = 0.7;
							tile.lit = true;
						}
					}
					else if(!tile.light && !tile.lit) {
						if(!tile.fading){
							tile.H = 0.33;
							tile.S = 0.03;
							tile.L = 0.2;
							tile.lit = false;
						}
					}

				}

			}
		};

		//  CHECK IF ALL FLOOR TILES ARE LIT
		if(!this.levelComplete 
		&& this.litTiles.length === this.floorTileCount) {
			if(!this.levelComplete) {
				this.score += 10000;
				this.stairs.visible = true;
				this.sprites.push(this.stairs);
				for(var i=this.ghosts.length-1; i>=0; i--) 
					this.removeEnemy(this.ghosts[i]);
				setTimeout(function() {
					for(var i in this.litTiles) {
						var tile = this.litTiles[i];
						tile.fadeOut();
					}
					this.litTiles = [];
				},500);
				

				this.levelComplete = true;
				this.centreTile.visible = false;
				this.grid[this.centreTile.gy][this.centreTile.gx].walls = null;
				this.map[this.centreTile.gy][this.centreTile.gx] = 1;

			}
			// this.init();
		}


			if(this.levelComplete && this.nextLevel) {
				this.levelComplete = false;
				this.nextLevel = false;
			// 	// console.log(this.player.gx,this.player.gy);
			// 	if(this.player.gx === 11 && this.player.gy === 6) {
			// 		// var ths = this;
				this.PAUSED = true;
				setTimeout(function(){
					fade("2000","in",function(){ths.init()});
				},500);
		// 		// this.init();
			}

		if(!this.PAUSED) {
	        // console.log(currentTime);
			//  UPDATE SCORE TEXT OBJECT
			this.text.score.text = "SCORE: " + this.score;
			this.text.charges.text = "CHARGES: " + this.charges;

			//  CHECK COLLISION WITH GHOSTS
			for(var i in this.ghosts) {
// console.log(this.ghosts)
				var gh = this.ghosts[i];
				if(gh) {
					if(boxCollide(this.player,gh,COLLISION_BUFFER)) {
						// console.log("wtf")
						if(this.charges > 0) {

							this.fireWeapon("proxy");
						}
						else this.gameOver();
					}
				}
			}

			//  CHECK COLLISION WITH ENERGY PELLETS
			var toSplice = [];
			for(var i in this.energyPellets) {
				var pellet = this.energyPellets[i];
				if(distance({x:pellet.x,y:pellet.y},this.player) < unitSize) {
					soundEffect(0,SFX.powerUp);
					this.charges += 1;
					toSplice.push(pellet);
					pellet.visible = false;
				}
			}
			for(var i in toSplice)
				this.energyPellets.splice(this.energyPellets.indexOf(toSplice[i]),1);
		
			//  IF IT'S NOT PAUSED
			if(this.READY) {
				if(this.playStyle === "R") {

					// this.steps++;
					this.READY = false;
					// console.log(this.steps);
				}
				
				


				//  IF THE LEVEL IS OVER
			

			// 	// if(this.ghosts.length > 0) {
			// 	// 	for(var i=0,iL=this.ghosts.length; i<iL; i++)
			// 	// 		this.removeEnemy(this.ghosts[i]);
			// 	// }
				
			// };


				// console.log(this.litTiles.length)

				
				//  CHECK IF WE NEED TO ADD ANOTHER GHOST
				if(!this.levelComplete 
				&& (this.ghostTypes.length > 0
				&& ((this.playStyle === "P" && new Date().getTime() > this.lastEnemy + this.enemyPeriod))
					|| (this.playStyle === "R" && this.steps%40 === 39))) {
					// console.log(this.ghostTypes)
					this.lastEnemy = new Date().getTime();
					this.addEnemy();
				}

				//  IF A TILE UNLIGHTS, REMOVE IT FROM LIT TILES
				// if(!this.levelComplete) {
				// 	for(var i=this.litTiles.length-1; i>=0; i-- ) {
				// 		var tile = this.litTiles[i];
				// 		// console.log(new Date().getTime() - tile.litTime)
				// 		if((this.playStyle === "P" && new Date().getTime() - tile.litTime > this.levelTime)
				// 		|| (this.playStyle === "R" && this.steps - this.litTime > this.levelTime)) {
				// 			tile.lit = false;
				// 			tile.fadeOut();
				// 			// tile.H = 0.33;
				// 	  // 		tile.S = 0.03;
				// 	  // 		tile.L = 0.2;
				// 			// tile.colour = hslToRgb(1-1/3,0.03,0.2,1);
				// 			this.litTiles.splice(i,1);
				// 			// console.log("tile unlit")
				// 		}
				// 	}
				// }
				

				
				

				
				//  MOVE PLAYER
				this.player.gridMove(finishPath);


				//  MOVE GHOSTS
				for(var i in this.ghosts) {
					this.ghosts[i].AI();
				}
					


				

				for(var i=this.sprites.length-1; i>=0; i--) {
					if(!this.sprites[i].visible)
						this.sprites.splice(i,1);
				}
			}
		}

	};

	Game.prototype.gameOver = function() {
		soundEffect(0,SFX.death);
		// console.log("wtf");
		this.GAME_OVER = true;
		NM8.easings = [];
		this.ghosts = [];

		if(this.score > localStorage.WIZARD_TOWER_HIGH_SCORE) {
			localStorage.WIZARD_TOWER_HIGH_SCORE = this.score;
			highScore = this.score;
			this.text.highScore.text = "HIGH SCORE: " + highScore;
			
			this.text.congrats.alpha = 0;
			this.text.congrats.visible = true;
			fade(1000,"in",null,this.text.congrats);
			// NM8.animateValue(this.text.congrats,"alpha",0,1,function(X){return X*X*(3-2*X)},1000);
			// NM8.easings.push(this.text.congrats);
			
			this.text.congrats2.alpha = 0;
			this.text.congrats2.visible = true;
			fade(1000,"in",null,this.text.congrats2);
			// NM8.animateValue(this.text.congrats2,"alpha",0,1,function(X){return X*X*(3-2*X)},1000);
			// NM8.easings.push(this.text.congrats2);
			console.log("newHighScore");
		} else {
			//  TURN ON GAME OVER TEXT
			this.text.gameOver.visible = true;
			fade(1000,"in",null,this.text.gameOver);
			// NM8.animateValue(this.text.gameOver,"alpha",0,1,function(X){return X*X*(3-2*X)},1000);
			// NM8.easings.push(this.text.gameOver);
			console.log("game over");
		}
		

		


		// playString("0,,0.1133,,0.59,0.29,,0.12,-0.16,0.6,0.28,0.34,,0.1263,,,,,1,,,,,0.43");
		this.PAUSED = true;
		var ths = this;
		setTimeout(function(){
			fade("2000","in",toCover)
		},2000);
		
	};

	// Game.prototype.isPortal = function(x,y) {
	// 	for(var i=0,iL=this.portals.length; i<iL; i++) {
	// 		var portal = this.portals[i];
	// 		if(x === portal.x
	// 		&& y === portal.y)
	// 			console.log(portal.x)
	// 	}
	// };

	Game.prototype.checkSpace = function(x,y) {
		if(this.grid[y][x] === undefined)
			return true;
		if(this.grid[y] !== undefined 
		&& this.grid[y][x] !== undefined
		&& this.grid[y][x].walls === null)
			return true;
	};

	Game.prototype.bestPath = function(from,to,grid) {
		var map = grid || this.map;
		// console.log(from,to)
		if(from !== undefined && to !== undefined) {
			var options = {
				diagonal:false,
				portals: this.portals
			};
			var graph = new Graph(map,options);
			var start = graph.grid[from.gy][from.gx];
			// console.log(to)
			var end = graph.grid[to.gy][to.gx];

			var path = astar.search(graph,start,end,options);
			return path;
		}
	};


	Game.prototype.isVisible = function(S) {
		var gx = Math.floor(S.x/unitSize),
			gy = Math.floor(S.y/unitSize);

		// if(this.map[gy][gx] === 0)
		// 	return true;

		var l = line(gx, gy,
					this.player.gx,
					this.player.gy);

		for(var i=1,iL=l.length; i<iL; i++) {
			if(this.map[l[i].y][l[i].x] === 0)
				return false;
		}
		// console.log(i,1-(i-1)/10)
		if(S.alpha < 1-(i-2)/10)
			S.alpha = 1-(i-2)/10;
		S.seen = true;
		return true;
	};
	
		
		

	Game.prototype.render = function(draw) {
		draw.save();
		draw.translate(XOFF,YOFF);
		draw.beginPath();
		draw.rect(0,-unitSize,23*unitSize,16*unitSize);
		draw.clip();

		for(i in this.sprites) {
			var S = this.sprites[i];
			if(this.playStyle === "R") {
				
					this.isVisible(S);
				if(S.seen) {
					this.heap.push(S);
				}
			} else this.heap.push(S);
		}
		for(var i=0,iL=this.heap.size(); i<iL; i++) {
			this.heap.pop().render(draw);
		}
		for(var i in this.ghosts)
			this.ghosts[i].seen = false;

		// draw.fillStyle = "blue";
		draw.fontWeight = "bold";
		draw.font = Math.floor(unitSize*0.75)+"px 'arial black'";

		for(var i in this.text)
			this.text[i].render(draw);



		
        
        draw.restore();

		

        if(mobile && !this.GAME_OVER) {
	    	draw.save();

			for(var i=0,iL=buttons.length; i<iL; i++) {
				var b = buttons[i];
				// draw.globalAlpha = 0.007;
				draw.fillStyle = "rgba(255,255,255,0.1)";
				draw.lineWidth = 4;
				draw.strokeStyle = "rgba(255,255,255,0.2)";
				draw.strokeRect(b.x,b.y,b.w,b.h);
				draw.fillRect(b.x,b.y,b.w,b.h);

			}

			draw.restore();
		}

		
	};

		

	



return {
        Game: Game
    };
});
