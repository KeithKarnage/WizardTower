(function(definition) {
    /* global module, define */
    if(typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = definition();
    } else if(typeof define === 'function' && define.amd) {
        define([], definition);
    } else {
        var exports = definition();        
        window.Controls = exports.Controls;
        window.Animate = exports.Animate;
        window.TextObject = exports.TextObject;
        window.Actor = exports.Actor;
        window.Weapon = exports.Weapon;

    }
})(function() {

	var Controls = function() {

		this.keys = {};
		this.touch = {};

		// window.addEventListener("keydown",this.down.bind(this),false);
        // window.addEventListener("keyup",this.up.bind(this),false);
        var ths = this;
        // window.onkeydown = this.down;
        // window.onkeyup = this.up;
        document.onkeydown = function(e){ths.down(e);};//ths.down.bind(ths);};
        document.onkeyup = function(e){ths.up(e);};
        // window.onkeyup = function(e){ths.up.bind(ths);};

		window.addEventListener("mousedown",this.tDown.bind(this),false);
        window.addEventListener("mouseup",this.tUp.bind(this),false);
        window.addEventListener("mousemove",this.tMove.bind(this),false);
        
        window.addEventListener("touchstart",this.tDown.bind(this),false);
        window.addEventListener("touchend",this.tUp.bind(this),false);
        window.addEventListener("touchmove",this.tMove.bind(this),false);
    }

    Controls.prototype.register = function(name,ascii,D,U,H) {
		if(name === "touch") {
			window.buttons = [];
			this.touches = [];

			this.touch = {
				touched:false,
				x: null,
				y: null,
				down: D,
				up:   U,
				held: H
			}
		} else {
			this.keys[name] = {
				code: ascii,
				keyDown: false,
				down: D,
				up:   U,
				held: H
			};
		}
	};

	Controls.prototype.update = function() {
		for(i in this.keys) {
			var key = this.keys[i];
			if(key.held 
			&& key.keyDown) 
				key.held();
		}
		// console.log(this.touch.touched)
		if(this.touches.length > 0) {
			console.log(this.touches.length)
			for(var i in this.touches) {
				var touch = this.touches[i];
				if(buttons.length > 0 && touch) {
					for(var i in buttons) {
						var button = buttons[i];
						if(button
						&& button.held
						&& pointCollide(button,touch))
							button.held();
					}
				}
			}
		// && this.touch.touched) {
			// console.log("Held",this.touched)
			// if(buttons.length > 0) {
				
			// }
			// this.touch.held();
		}
	};

	Controls.prototype.down = function(e) {
		e.preventDefault();
		for(i in this.keys) {
			// console.log(e.keyCode);
			var key = this.keys[i];
			if(e.keyCode === key.code
			&& !key.keyDown) {
				// console.log(key.down)
				key.keyDown = true;
				if(key.down)
					key.down();
			}
		}
	};

	Controls.prototype.up = function(e) {
		e.preventDefault();
		for(i in this.keys) {

			var key = this.keys[i];
			if(e.keyCode === key.code) {
				key.keyDown = false;
				if(key.up)
					key.up();
			}
		}
	};

	function getTouches(e) {

		var touches = [],
			T = e.touches;
		if(T.length === 0) T = e.changedTouches;
		for(i in T) {
			if(T[i].identifier !== undefined)
				touches.push({x: T[i].pageX-offX,
							  y: T[i].pageY-offY,
							  id: T[i].identifier});
		}	
		return touches;	
	};

	Controls.prototype.tDown = function(e) {
		var touches = [];		
		if(mobile) {
			e.preventDefault();
			touches = getTouches(e);
		} else {
			this.touches[0] = {
				x: e.clientX-offX,
				y: e.clientY-offY,
				id: 0
			};
			

		}

		//  FOR EACH NEW TOUCH
		if(touches.length > 0) {
			for(var i in touches) {
				var touch = touches[i];
				//  IF IT IS NOT ALREADY IN this.touches
				var valid = true;
				for(var j in this.touches) {
					if(this.touches[j].id === touch.id)
						valid = false;
				}
				//  PUT IT IN
				if(valid) this.touches.push(touch);
				else continue;

				//  CHECK TO SEE IF IT HITS A BUTTON
				if(buttons.length > 0) {
					for(var i in buttons) {
						var button = buttons[i];
						if(button
						&& button.down
						&& pointCollide(button,touch))
							button.down();
					}
				}	
			}			
		}
		// this.touch.down();
		// this.touch.touched = true;


	};

	Controls.prototype.tUp = function(e) {
		if(mobile) {
			if(this.touches.length === 1)
				this.touches = [];
			else {
				var touches = getTouches(e);
				this.touches = touches;
			}
		} else this.touches = [];
		
		
		
		// if(this.touch.up)
		// 	this.touch.up();
		// this.touch.touched = false;
	};

	Controls.prototype.tMove = function(e) {
		e.preventDefault();
		
		// this.touch.x = null;
		// this.touch.y = null;
		
		// if(this.touch.up)
		// 	this.touch.up();
		// this.touch.touched = false;
	};

	function Animate() {
		this.easings = [];
		this.animations = [];

		this.toRemove = [];
	};

	Animate.prototype.processAnimations = function() {
		for(var i=0,iL=this.easings.length; i<iL; i++) {
			var obj = this.easings[i];
			if(obj === undefined
			|| obj.ease === undefined
			|| obj.ease === null)
				continue;
			else if(obj.ease.length === 0) 
				this.easings.splice(this.easings.indexOf(obj));
			else {
				for(var j=0,jL=obj.ease.length; j<jL; j++)
					if(obj.ease[j])	obj.ease[j].animation();
			}
		}
		if(this.toRemove.length > 0) {
			for(var i in this.toRemove)
				this.removeEasing(this.toRemove[i]);
			this.toRemove = [];
		}
	};

	//  - - - - - - - - - EASING ANIMATIONS - - - - - - - - - 
	Animate.prototype.animateValue = function(target, value, from, to, delta, duration, callback, type, times) {
		// console.log(delta(0.1))
		var i = this.easings.indexOf(target);
		if(i !== -1) this.easings.splice(i,1);
		this.easings.push(target);

		this.animate({
			target: target,
			value: value,
			delta: delta,//|| function(X){return X;},
			duration: duration || 1000,
			type: type || "once",
			times: times,
			callback: callback,
			step: function(delta) {
				target[value] = from - ((from - to) * delta);
			}
		});


	};

	Animate.prototype.animate = function(options) {
		var start = new Date().getTime();
		// console.log(new Date().getTime());

		function animation() {
			var timePassed = (new Date().getTime() - start) ;
			var progress = timePassed / (options.duration || 1000);
			var delta = options.delta;// || RL.cubicBezier(0, 0, 1, 1, epsilon);



			//  ONCE
			//  LIKE NORMAL, QUIT AFTER 1

			//  LOOP
			//  AFTER 1, MODULO TO 1

			//  PING PONG
			//  AFTER 1, COUNT BACK DOWN TO 0
			//  THEN IF (int)progress % 2 === 0 COUNT UP, ELSE COUNT DOWN
			switch(options.type) {
				case "once":
					if(progress > 1) progress = 1;
					options.step(delta(progress));
					if(progress === 1) {
						// this.toRemove.push(this);
						removeEasingAnimation(options.target,this);
					}

				break;
				case "loop":
					options.step(delta(progress % 1));
					if(option.times && progress > options.times) 
						removeEasingAnimation(options.target,this);
				break;
				case "pingpong":
					if(progress > 1) {
						if(Math.floor(progress) % 2 === 0)
							options.step(delta(progress % 1));
						else options.step(1 - delta(progress % 1));
					} else options.step(delta(progress));
					if(options.times && progress > options.times * 2) 
						removeEasingAnimation(options.target,this);
				break;
			}
		}

		//  ADD EASING TO OBJECTS ARRAY, CREATING IT IF NECERLARY
		if(options.target.ease && options.target.ease !== null) {
			//  REMOVE ANY OLD EASINGS ON THE SAME VALUE
			if(options.target.ease.indexOf({type:options.value,animation:animation}) !== -1) {
				console.log(options.target.ease[0],options.value,animation)
				options.target.ease.splice(options.target.ease.indexOf({type:options.value,animation:animation}),1);
			}
			//  PUSH EASING TO OBJECT
			options.target.ease.push({type:options.value,animation:animation});
		}
		//  CREATE ARRAY ON OBJECT WITH EASING IN IT
		else options.target.ease = [{type:options.value,animation:animation}];
		var ths = this;
		function removeEasingAnimation(target,easing) {
			target.callback = options.callback;
			target.toRemove = easing;
			ths.toRemove.push(target);
		};
	}

	Animate.prototype.removeEasing = function(target,easing) {
		// console.log(target.ease)
		//  REMOVE FROM OBJECT'S ARRAY
		// if(target)
		// console.log(target.toRemove,target.ease.indexOf(target.toRemove))
		target.ease.splice(target.ease.indexOf(target.toRemove),1);
		target.toRemove = undefined;
		//  REMOVE FROM GAME'S ARRAY IF NECERLARY
		
		if(target.ease.length === 0) {

			this.easings.splice(this.easings.indexOf(target),1);
			// console.log("removing",this.easings)
		}
		//  CALL CALLBACK FUNCTION IF NECERLARY
		if(target.callback !== undefined) {
			// console.log("calling back");
			target.callback(target);
			target.callback = undefined;
		}
	};

	Animate.prototype.movePiece = function(sprite,x,y,duration,type,callback) {
		// console.log("moving piece")
		var count = 0;
		var type = type || function(X){return X*X*(3-2*X)}
		// var duration = duration || 500;
		// var epsilon = (1000/60/duration)/4;
		if(y !== sprite.y) {
			count++;
			this.animateValue(sprite,"y",sprite.y,y,
						type,
						// RL.cubicBezier(0.5,0.5,1,1,epsilon),
						duration,function(){
							count--;
							done();
						});
		}
		if(x !== sprite.x) {
			count++;
			this.animateValue(sprite,"x",sprite.x,x,
						// RL.cubicBezier(0.5,0.5,1,1,epsilon),
						type,
						duration,function(){
							count--;
							done();
						});
		}
		var done = function() {
			// console.log("got a callback")
			if(callback && count === 0)
				callback(sprite);
		}
		// if(RL.easings.indexOf(sprite) !== -1)
			// RL.easings.splice(RL.easings.indexOf(sprite),1);
		// this.easings.push(sprite);

	};

	function TextObject(text,x,y,textAlign,colour) {
		this.text = text;
		this.x = x;
		this.y = y;
		this.colour = colour || "rgb(60,60,60)";
		this.alpha = 1;
		this.textAlign = textAlign || "left";
		this.font = unitSize*0.75+"px 'avenirnext-bold','droid sans'";
		this.visible = true;
		this.w = 0;
		this.lh = 0;
	};

	TextObject.prototype.render = function(draw) {
		if(this.visible) {
			draw.save();

			if(this.alpha < 1)
				draw.globalAlpha = this.alpha;

			draw.font = this.font;
			draw.textAlign = this.textAlign;
			draw.fillStyle = this.colour;
			if(this.w === 0)
				draw.fillText(this.text,this.x,this.y);
			else wrapText(draw,this.text,this.x,this.y,this.w,this.lh)
			
			draw.restore();
		}

	};


	function Actor(game,x,y,type,w) {

		this.game = game;

		this.type = type;
		this.dead = false;
			// console.log(this.type);

		//  POSITION AND SIZE
		this.x = x*unitSize || 0;
		this.y = y*unitSize || 0;
		this.w = w*unitSize || unitSize;
		this.h = w*unitSize || unitSize;

		//  ROTATION, ALPHA, VISIBILITY, AND SCALE
		this.alpha = 1;
		this.visible = true;

		this.H = 0.33;
		this.S = 0.03;
		this.L = 0.2;

		this.colour;
		this.alpha = 1;

		this.moving = false;

		this.gx = x;
		this.gy = y;

		this.vx = 0;
		this.vy = 0;
		this.speed = MOVE_SPEED;

		this.dir = "";
		this.nextDir = "";
		this.lastDir = "E";

		this.portal = "";

		this.zIndex = this.gy*3 + 2;
		if(this.game)
			this.game.sprites.push(this);
	};

	Actor.prototype.render = function(draw) {
		draw.save();
		if(this.visible) {
			if(this.alpha < 1)
				draw.globalAlpha = this.alpha;

			Drawings[this.type](draw,this.x,this.y,this.w,this);
			

			switch(this.portal) {
				case "left":
					Drawings[this.type](draw,this.x-23*unitSize,this.y,this.w,this);
				break;
				case "right":
					Drawings[this.type](draw,this.x+23*unitSize,this.y,this.w,this);
				break;
			}
		}

		draw.restore();

	};

	Actor.prototype.update = function() {
		this.gx = Math.floor(this.x / unitSize);
		this.gy = Math.floor(this.y / unitSize);

	};

	Actor.prototype.Colour = function() {
		return hslToRgb(this.H,this.S,this.L,1);
	};

	Actor.prototype.fadeIn = function() {
		this.fading = true;
		var ths = this;
		NM8.animateValue(this,"H",0.33,0.67,function(X){return Math.pow(Math.sin(X*Math.PI/2),2);},400);
  		NM8.animateValue(this,"S",0.03,0.2,function(X){return Math.pow(Math.sin(X*Math.PI/2),2)},400);
  		NM8.animateValue(this,"L",0.2,0.7,function(X){return Math.pow(Math.sin(X*Math.PI/2),2)},400,function() {
  			ths.fading = false;
  		});
  		this.lit = true;
	};

	Actor.prototype.fadeOut = function() {
		this.fading = true;
		var ths = this;
		NM8.animateValue(this,"H",0.67,0.33,function(X){return Math.pow(Math.sin(X*Math.PI/2),2);},400);
  		NM8.animateValue(this,"S",0.2,0.03,function(X){return Math.pow(Math.sin(X*Math.PI/2),2)},400);
  		NM8.animateValue(this,"L",0.7,0.2,function(X){return Math.pow(Math.sin(X*Math.PI/2),2)},400,function() {
  			ths.fading = false;
  		});
  		this.lit = false;
	};	

	var directions = {
		N: { x:  0, y: -1 },
		E: { x:  1, y:  0 },
		S: { x:  0, y:  1 },
		W: { x: -1, y:  0 }
	};

	Actor.prototype.AI = function() {

		if(!this.moving && (this.path === undefined || this.path.length === 0)) {
			var ply = this.game.player;
			switch(this.aiType) {
				case "follow":
					this.path = this.game.bestPath(this,ply);
				break;
				case "cutOff":
					var grid = copyGrid(this.game.map);
					grid[ply.gy][ply.gx] = 0;

					if(ply.dir !== "" && distance(this,this.game.player) > 4
					&& grid[ply.gy+directions[ply.dir].y] !== undefined
					&& grid[ply.gy+directions[ply.dir].y][ply.gx+directions[ply.dir].x] !== undefined) {
						this.path = this.game.bestPath(this,{gx:ply.gx+directions[ply.dir].x,
															 gy:ply.gy+directions[ply.dir].y},grid);
					}
					else this.path = this.game.bestPath(this,ply);
				break;
				case "patrol":
					if(distance(this,this.game.player) < 5) {
						this.path = this.game.bestPath(this,ply);
					} else {

						if(this.patrolNumber === undefined)
							this.patrolNumber = random(0,3,true);
						// console.log(this.game.eLocs[this.patrolNumber]);
						this.path = this.game.bestPath(this,this.game.eLocs[this.patrolNumber]);

						if(this.path !== undefined
						&& this.path.length < 1)
							this.patrolNumber = (this.patrolNumber + random(0,3,true)) % this.game.eLocs.length;
						this.path = this.game.bestPath(this,this.game.eLocs[this.patrolNumber]);
					}



				break;
				case "dumb":
					if(distance(this,this.game.player) < 4) {
						this.path = this.game.bestPath(this,ply);
					} else {
					// console.log(this.target)
						if(this.target === undefined
						|| (this.path !== undefined && this.path.length === 0)) {
							// var rnd = random(0,this.game.floorCells.length-1,true);
							this.target = this.game.floorCells[Math.floor(Math.random()*this.game.floorCells.length-1)];
							
							
						}
						this.path = this.game.bestPath(this,this.target);

						
						if(this.path !== undefined
						&& this.path.length < 1) {
							this.target = this.game.floorCells[Math.floor(Math.random()*this.game.floorCells.length-1)];
							this.path = this.game.bestPath(this,this.target);
						}
					}

				break;
			}
			function followIf() {

			};
			
			// console.log(this.path[0])
		}
		if(this.path !== undefined) {
			
			var node = this.path[0];
			// console.log(this.gy,node.y);
			if(node) {
				if(node.y < this.gy) this.nextDir = "N";
				if(node.x > this.gx) this.nextDir = "E";
				if(node.y > this.gy) this.nextDir = "S";
				if(node.x < this.gx) this.nextDir = "W";

				
				if(Math.abs(this.gx - node.x) !== 1) {
					if(this.gx === 0) this.nextDir = "W";
					if(this.gx === 22) this.nextDir = "E";
				}

				this.path = undefined;
				this.gridMove();
			}
		}
	};

	// Actor.prototype.removeFromGrid = function() {
	// 	var act = this.game.grid[this.gy][this.gx].actors;
	// 	act.splice(act.indexOf(this),1);
	// };

	Actor.prototype.gridMove = function(callback) {
		
		//  EASING FUNCTION
		var ease = function(x) {return x};
		// var time = 500;
		var time = this.speed;


		//  MAKE SURE WE AREN"T ALREADY MOVING
		if(!this.moving 
		&& (this.dir !== "" || this.nextDir !== "")) {
			// console.log(NM8.easings.length)
			this.moving = true;


			
			//  WE"RE NOT MOVING, BUT ARE READY TOO
			if(this.dir === "") {
				this.dir = this.nextDir;
				this.nextDir = "";				
			}

			//  WE WANT TO TURN
			else if(this.dir !== this.nextDir && this.nextDir !== "") {
				//  CHECK TO SEE IF THAT SPACE IS OPEN
				if(this.game.checkSpace(this.gx+directions[this.nextDir].x,this.gy+directions[this.nextDir].y)) {
					//  IF IT IS, SET IT TO THE DIRECTION WE WANT TO GO

					this.dir = this.nextDir;
				}
				
				
			}
			// this.lastDir = this.dir;
			//  WE"RE MOVING IN THE RIGHT DIRECTION
			// else {
			// 		ease = function(x) {
			// 			return x;
			// 		}
			// }

			//  THE DIRECTION THE ACTOR IS FACING
			// this.dir = n;
			var x = directions[this.dir].x;
			var y = directions[this.dir].y;
// if(this.type === "ghost") console.log(x,y)


			//  IF THE SPACE IT IS GOING TO MOVE ONTO EXISTS AND
			//  ISN"T  A WALL
			if(this.game.checkSpace(this.gx+x,this.gy+y)) {

				this.lastDir = this.dir;


	
				//  THE OLD COORDINATES
				var ogx = this.gx;
				var ogy = this.gy;

				var dx = this.gx + x;
				var dy = this.gy + y;

				//  NEW COORDINATES
				this.gx = this.gx + x;
				this.gy = this.gy + y;




				if(this.gx > 22) {
					// this.sprite.x = 0;
					this.gx = 0;
					this.portal = "left";
				}
				else if(this.gx < 0) {
					// this.sprite.x = 22 * unitSize;
					this.gx = 22;
					this.portal = "right";
				} else this.portal = "";

				// if(this.type === "ghost")
				// 	console.log(this.path)

					

					//  MOVE THE PIECE
					var ths = this;
					NM8.movePiece(this,
								  dx*unitSize,
								  dy*unitSize,
								  time, ease,
								  function() {


								  	//  SET ACTOR TO BEING DONE MOVING
								  	ths.moving = false;
								  	//  SWITCH THE SPRITES IF IT HASN"T ALREADY BEEN DONE
								  	switcheroo();
								  	ths.x = ths.gx *unitSize;
									ths.y = ths.gy *unitSize;
								  	// player.update();
								  	//  TURN ON LIGHT AT SQUARE
								  	if(ths.type === "player") {
								  		// playSequence([
								  		// 	{ sfx:"step" },
								  		// 	{ sfx:"step", time:0.14 }
								  		// ]);



								  		var tile = ths.game.grid[ths.gy][ths.gx].ground;
								  		if(!ths.game.levelComplete && tile) {
									  		// tile.colour = hslToRgb(1-1/3,0.2,0.7);
									  		// tile.S = 0.2;
									  		// tile.L = 0.7;

									  		

											if(!tile.lit) {
									  			soundEffect(0,SFX.lights);
									  			ths.game.score += 10;

									  			tile.fadeIn();
									  			// tile.H = 0.67;
									  			// tile.S = 0.2;
									  			// tile.L = 0.7;

									  			// NM8.animateValue(tile,"H",0.33,0.67,function(X){return Math.pow(Math.sin(X*Math.PI/2),2);},400);
										  		// NM8.animateValue(tile,"S",0.03,0.2,function(X){return Math.pow(Math.sin(X*Math.PI/2),2)},400);
										  		// NM8.animateValue(tile,"L",0.2,0.7,function(X){return Math.pow(Math.sin(X*Math.PI/2),2)},400);
										  		// NM8.easings.push(tile);

									  			tile.lit = true;
												ths.game.litTiles.push(tile);
											}
											if(ths.game.playStyle === "P")
										  		tile.litTime = new Date().getTime();
										  	else tile.litTime = ths.game.steps;

										  	// console.log(tile.litTime)
									  	}
								  		
								  		// console.log("tile lit");
								  		if(ths.game.levelComplete
								  		&& ths.game.player.gx === 11
								  		&& ths.game.player.gy === 6) {
								  			ths.game.nextLevel = true;
												// ths.game.PAUSED = true;
												// setTimeout(function(){
													// fade("2000","out",function(){ths.game.init()});
												// },500);
												// ths.game.init();
											// }

											
										}
								  	}

								  	if(callback) callback();
								  });
					
					//  IF WE ARE GOING DOWN OR RIGHT, SWITCH SPRITES NOW
					// console.log(this.gx !== dx)
					if((x > 0 || y > 0) && this.gx === dx) {
						switcheroo();
					}

					//  SO WE DON"T SWITCH TWICE
					var switched = false;
					function switcheroo() {
						if(!switched) {
							if(ths.type === "player") {
								ths.game.grid[ogy][ogx].player = null;
								ths.game.grid[ths.gy][ths.gx].player = ths;
								ths.zIndex = ths.gy*3+2;

							} else {
								//  OLD SPOT BECOMES NULL
								ths.game.grid[ogy][ogx].actors.splice(ths.game.grid[ogy][ogx].actors.indexOf(ths));
								// ths.game.toRemove.push({ghost:ths,loc:{x:ogx,y:ogy}});
								//  NEW SPOT GETS THE ACTOR
								ths.zIndex = ths.gy*3+2;
								// ths.game.grid[ths.gy][ths.gx].actors.push(ths);
							}
							

						}
						switched = true;
					};
				

			} else {
				this.dir = "";
				this.moving = false;
			}
		} else {
			//  WE"RE MOVING AND WANT TO REVERSE DIRECTIONS
			if((this.dir === "S" && this.nextDir === "N")
			|| (this.dir === "N" && this.nextDir === "S")
			|| (this.dir === "E" && this.nextDir === "W")
			|| (this.dir === "W" && this.nextDir === "E")) {
				this.dir = this.nextDir;

			}
		}
	};


	function Weapon(game) {
		this.game = game;
		this.visible = false;
		this.alpha = 1;
		this.type = "";
		this.x = 0;
		this.y = 0;
		this.target = null;
		this.FIRING = false;
	};

	Weapon.prototype.render = function(draw) {
		draw.save();
		draw.lineWidth = 4;
		if(this.alpha < 1)
			draw.globalAlpha = this.alpha;
		if(this.visible) {
					// console.log(this.type)
			switch(this.type) {
				case "laser":
					if(this.target)
						Drawings[this.type](draw,
											this.x,
											this.y,
											this.target.x*unitSize + unitSize/2,
											this.target.y*unitSize + unitSize/4);
				break;
				case "proxy":
					Drawings[this.type](draw,
										this.x,
										this.y,
										this.radius*unitSize);
				break;
			}
		}
		
		draw.restore();
	};


	// Sprite.prototype.halWidth = function() { return this.width/2; };
	// Sprite.prototype.halfHeight = function() { return this.height/2; };
	// Sprite.prototype.centreX = function() { return this.x + this.halfWidth(); };
	// Sprite.prototype.centreY = function() { return this.y + this.halfHeight(); };

	//  PLAYER AND GHOST SPRITES
	var art = {
		//  CODE DENOTING TYPE OF OPERATION,
		//  THEN ALL THE ENTRIES FOR THAT OPERATION
		//  "b" = beginPath
		//  "c" = closePath
		//  "s" = stroke
		//  "f" = fill

		//  "fs" = fillStyle
		//  "ss" = strokeStyle

		//  "rg" = createRadialGradient
		//  "lg" = createLinearGradient
		//  "cs" = addColorStop

		//  "m" = moveTo
		//  "l" = lineTo
		//  "at" = arcTo
		//  "a" = arc
		//  "q" = quadraticCurveTo
		//  "bt" = bezierTo
		tower:[
			["b"],
			["m",0.2,1],
			["l",0.25,0.3],
			["bt",0.25,0.24,0.7,0.24,0.75,0.3],
			["l",0.8,1]
		],
		crown:[
			["b"],
			["m",0.15,0.28],
			["l",0.16,0.1],

			["q",0.16,0.07,0.24,0.05],

			["l",0.24,0.1],
			["q",0.29,0.08,0.34,0.073],

			["l",0.34,0.03],
			["q",0.39,0.01,0.45,0.015],

			["l",0.45,0.055],
			["q",0.5,0.05,0.55,0.055],

			["l",0.55,0.015],
			["q",0.61,0.01,0.66,0.03],

			["l",0.66,0.073],
			["q",0.71,0.08,0.76,0.1],

			["l",0.76,0.05],
			["q",0.84,0.07,0.84,0.1],

			["l",0.85,0.28],
			["bt",0.85,0.39,0.15,0.39,0.15,0.28]
		],
		ellipse:[
			["b"],
			["m",0.17,0.285],
			["bt",0.17,0.19,0.83,0.19,0.83,0.285],
			["bt",0.83,0.37,0.17,0.37,0.17,0.285]
		],
		cloud: [

			["b"],
			["m",0.3,1],
			["bt",0,0.3,1,0.3,0.7,1]
		],
		ghost:[
			["b"],
			["m",0.05,1],
			["l",0.05,0.25],
			["bt",0.05,-0.3,0.95,-0.3,0.95,0.25],
			["l",0.95,1],
			["l",0.833,0.8],
			["l",0.667,1],
			["l",0.5,0.8],
			["l",0.333,1],
			["l",0.167,0.8]
		],
		// eye1:[
		// 	["b"],
		// 	["m",0.1,0.5],
		// 	["bt",0.1,0.3,0.45,0.35,0.45,0.5],
		// 	["bt",0.4,0.6,0.1,0.6,0.1,0.5]
		// ],
		eye2:[
			["b"],
			["m",0.15,0.5],
			["bt",0.15,0.4,0.4,0.4,0.4,0.5],
			["bt",0.4,0.63,0.15,0.65,0.15,0.5]
		],
		eye3:[
			["b"],
			["m",0.15,0.5],
			["bt",0.15,0.4,0.4,0.4,0.4,0.5],
			["bt",0.4,0.63,0.15,0.65,0.15,0.5]
		],
		eye4:[ //  FOLLOWER - MEDIUM ANGRY EYES
			["b"],
			["m",0.15,0.5],
			["bt",0.2,0.4,0.35,0.45,0.45,0.5],
			["bt",0.35,0.63,0.15,0.65,0.15,0.5]
		],
		eye5:[ //  CUTOFF - MORE ANGRY
			["b"],
			["m",0.15,0.5],
			["bt",0.2,0.4,0.3,0.4,0.4,0.5],
			["bt",0.4,0.66,0.15,0.68,0.15,0.5]
		],
		hatS:[
			["b"],
			["m",0,0.45],
			["l",0.4,0.4],
			["l",0.9,0.1],
			["l",0.85,0.6],
			["l",1,0.9],
			["l",0.3,0.7],
			["l",0.45,0.55],
			["l",0.1,0.6],
			["c"]
		],
		hatD:[
			["b"],
			["m",0,0.6],
			["l",0.25,0.5],
			["l",0.5,0.1],
			["l",0.75,0.5],
			["l",1,0.6],
			["l",0.9,0.7],
			["l",0.65,0.55],
			["l",0.72,0.75],
			["q",0.3,0.8,0,0.6],

			// ["c"]
		],
		hatU:[
			["b"],
			["m",0,0.6],
			["l",0.25,0.45],
			["l",0.5,0.1],
			["l",0.75,0.45],
			["l",1,0.6],
			
			["q",0.5,1,0,0.6],

			// ["c"]
		],
		pacman:[
			["b"],
			["m",0.5,0.5],
			["l",0.8,0.4],
			["bt",0.8,0.1,0.2,0.1,0.2,0.5],
			["bt",0.2,0.9,0.8,0.9,0.8,0.6],
			["c"]
		]
	};

	function drawPath(draw,points,x,y,size,reversed) {
		if(size === undefined) size = 4;
		// size *= unitSize;
		var g;
		draw.save();
		draw.translate(x,y);
		if(reversed) {
			draw.translate(unitSize,0);
			draw.scale(-1,1);
			x *= -1;
		}


		for(var i in points) {
			var point = points[i];
			switch(point[0]) {
				case "b":
					draw.beginPath();
				break;
				case "c":
					draw.closePath();
				break;


				case "m":
					draw.moveTo(point[1]*size,point[2]*size);
				break;
				case "l":
					draw.lineTo(point[1]*size,point[2]*size);
				break;
				case "a":
					draw.arc(point[1]*size,point[2]*size,point[3]*size,point[4],point[5],point[6])
				break;
				case "at":
					draw.arcTo(point[1]*size,point[2]*size,point[3]*size,point[4]*size,point[5]*size);
				break;
				case "q":
					draw.quadraticCurveTo(point[1]*size,
										  point[2]*size,
										  point[3]*size,
										  point[4]*size);
				break;
				case "bt":
					draw.bezierCurveTo(point[1]*size,point[2]*size,point[3]*size,point[4]*size,point[5]*size,point[6]*size);
				break;

			};
		}
		draw.restore();
	};

	var Drawings = {
		player: function(draw,x,y,w,actor) {


			draw.fillStyle = "black";
			// draw.globalAlpha = 1;
			draw.beginPath();
			draw.arc(x+unitSize/2,(y+unitSize/2)-Math.floor(unitSize/4),(w*0.98)/2,0,Math.PI*2);
			draw.fill();

			// var grd = draw.createRadialGradient(x+w/2,y,w/2,x+w/2,y+w,w/2);
			// grd.addColorStop(0,"rgba(0,0,0,0)");
			// grd.addColorStop(1,"rgba(0,0,0,0.2)");
			// draw.fillStyle = grd;

			// draw.beginPath();
			// draw.arc(x+unitSize/2,(y+unitSize/2)-Math.floor(unitSize/4),(w*0.98)/2,0,Math.PI*2);
			// draw.fill();

			Drawings["eye"](draw,x,y,w,actor);

			draw.save();
			draw.fillStyle = "yellow";

			switch(actor.lastDir) {
				case "E":
					drawPath(draw,art['hatS'],x+unitSize/4,y-unitSize*0.8,w*1.5,true);
				break;
				case "W":
					drawPath(draw,art['hatS'],x-unitSize/4,y-unitSize*0.8,w*1.5);
				break;
				case "N":
					drawPath(draw,art['hatU'],x-unitSize*0.28,y-unitSize*0.8,w*1.6);
				break;
				case "S":
					drawPath(draw,art['hatD'],x-unitSize*0.28,y-unitSize*0.95,w*1.6);
				break;
			}
			draw.fill();
			draw.restore();
		},

		ghost: function(draw,x,y,w,actor) {
			// var colour = actor.colour;
				// dir = actor.dir;
			//  DRAW GHOST SHAPE AND FILL IT
			draw.fillStyle = actor.colour;
			drawPath(draw,art['ghost'],x,y,w);
			draw.fill();

			//  DRAW GHOST SHAPE AND GIVE IT A GRADIENT
			drawPath(draw,art['ghost'],x,y,w);
			var grd = draw.createRadialGradient(x+w/2,y,w/2,x+w/2,y+w,w/2);
			grd.addColorStop(0,"rgba(0,0,0,0)");
			grd.addColorStop(1,"rgba(0,0,0,0.2)");
			draw.fillStyle = grd;
			draw.fill();
			Drawings["eye"](draw,x,y,w,actor);
			// console.log(dir);
			// var blink = Math.random() < 0.01 ? true : false;

			

			// draw.fillStyle = "white";
			// drawPath(draw,art['eye1'],x,y-unitSize/4);
			// draw.fill();
			// drawPath(draw,art['eye1'],x,y-unitSize/4,1,true);
			// draw.fill();
			// draw.fillRect(x,y-Math.floor(unitSize/2),w,h);
			// draw.beginPath();
			// draw.moveTo
		},
		eye: function(draw,x,y,w,actor) {

			var eye = "eye";
			switch(actor.aiType) {
				case "dumb":
				case undefined:
					eye += 2;
				break;
				
				
				case "patrol":
					eye += 3;
				break;
				case "follow":
					eye += 4;
				break;
				case "cutOff":
					eye += 5;
				break;
			}
			// var dir = actor.dir || "S"
			
			switch(actor.lastDir) {
				case "N":
				break;
				case "E":
					// if(blink) {
					// 	draw.fillStyle = "black";
					// 	drawPath(draw,art['blink'],x+unitSize/2,y-unitSize/4);
					// 	draw.fill();

					// } else {

						draw.fillStyle = "white";
						drawPath(draw,art[eye],x+unitSize/2,y-unitSize/4,unitSize);
						draw.fill();

						draw.fillStyle = "black";
						draw.beginPath();
						draw.arc(x+4.8*unitSize/6,y+unitSize*0.25,unitSize/15,0,2*Math.PI);
						draw.fill();
					// }


				break;
				case "S":
					draw.fillStyle = "white";
					drawPath(draw,art[eye],x,y-unitSize/4,unitSize);
					draw.fill();
					drawPath(draw,art[eye],x,y-unitSize/4,unitSize,true);
					draw.fill();

					draw.fillStyle = "black";
					draw.beginPath();
					draw.arc(x+4.3*unitSize/6,y+unitSize*0.26,unitSize/15,0,2*Math.PI);
					// draw.fill();

					// draw.beginPath();
					draw.arc(x+1.7*unitSize/6,y+unitSize*0.26,unitSize/15,0,2*Math.PI);
					draw.fill();
				break;
				case "W":
					draw.fillStyle = "white";
					drawPath(draw,art[eye],x-unitSize/2,y-unitSize/4,unitSize,true);
					draw.fill();

					draw.fillStyle = "black";
					draw.beginPath();
					draw.arc(x+1.2*unitSize/6,y+unitSize*0.25,unitSize/15,0,2*Math.PI);
					draw.fill();
				break;
			}
		},
		energy: function(draw,x,y,w,colour) {
			draw.fillStyle = "SeaShell";
			draw.beginPath();
			draw.arc(x+unitSize/2,y+unitSize/2-Math.floor(unitSize/8),w*0.25,0,Math.PI*2);
			draw.fill();
		},
		laser: function(draw,x1,y1,x2,y2) {
			draw.strokeStyle = "red";
			draw.beginPath();
			draw.moveTo(x1,y1);
			draw.lineTo(x2,y2);
			draw.stroke();
		},
		proxy: function(draw,x,y,r) {
			// console.log("drawing proxy")
			draw.strokeStyle = "red";
			draw.beginPath();
			draw.arc(x+unitSize/2,y+unitSize/4,r,0,Math.PI*2);
			draw.stroke();
		},




		wall: function(draw,x,y,w) {
			draw.fillStyle = wallColour;
			// console.log("wtf")
			draw.fillRect(x,y-Math.floor(unitSize/2),w,w+Math.floor(unitSize/2));
			if(mobile)
				draw.fillStyle = "rgba(0,0,0,0.2)";
			else {
				var grd = draw.createLinearGradient(x,y,x,y+w);
				grd.addColorStop(0,"rgba(0,0,0,0.2)");
				grd.addColorStop(1,"rgba(0,0,0,0.6)");
				draw.fillStyle = grd;
			}
			draw.fillRect(x,y,w,w);
		},
		wall2: function(draw,x,y,w) {
			draw.fillStyle = wallColour;
			draw.fillRect(x,y-Math.floor(unitSize/2),w,w);
			
		},
		stairs: function(draw,x,y,w) {
			// console.log("wtf")
			draw.fillStyle = wallColour;
			draw.fillRect(x,y-w/6,w,w+w/6);
			draw.fillStyle = "rgba(0,0,0,0.2)";
			draw.fillRect(x,y+w/6,w,w/6);
			draw.fillRect(x,y+3*(w/6),w,w/6);
			draw.fillRect(x,y+5*(w/6),w,w/6);
			
		},
		
		floor: function(draw,x,y,w,sprite) {
			// draw.fillStyle = colour();
			// draw.save();
			draw.fillStyle = sprite.Colour();//hslToRgb(sprite.H,sprite.S,sprite.L,1);
			draw.fillRect(x,y,w,w);
			if(!mobile) {
				var grd = draw.createRadialGradient(x+w/2,y+w/2,0,x+w/2,y+w/2,w/1.1);

				grd.addColorStop(1,"rgba(0,0,0,0.2)");
				grd.addColorStop(0,"rgba(0,0,0,0)");
				
				draw.fillStyle = grd;

				draw.fillRect(x,y,w,w);
			}

			// draw.restore();

		},
		tower: function(draw,x,y,w,sprite) {
			// w;
			draw.strokeStyle = "rgba(0,0,0,0.7)";
			draw.fillStyle = "darkslategray";
			drawPath(draw,art['crown'],x,y,w);
			draw.fill();
			draw.stroke();

			draw.save()

			draw.globalAlpha = 0.2;
			draw.fillStyle = "black";
			drawPath(draw,art['ellipse'],x,y,w);
			draw.fill();

			draw.restore();
			
			draw.fillStyle = "darkslategray";
			drawPath(draw,art['tower'],x,y,w);
			draw.fill();
			draw.stroke();

			
		},
		cloud: function(draw,x,y,w) {
			// w;

			drawPath(draw,art['cloud'],x,y,w);
			var grd = draw.createRadialGradient(x+w/2,y+w*0.8,0,x+w/2,y+w*0.8,w/4);
			grd.addColorStop(0,"rgba(170,170,170,1)");
			grd.addColorStop(0.7,"rgba(180,180,180,0.7)");
			grd.addColorStop(1,"rgba(255,255,255,0.0)");
			draw.fillStyle = grd;

			// drawPath(draw,art['cloud'],x,y,w);
			// // var grd = draw.createLinearGradient(x+w.2,y+w);
			// grd.addColorStop(0,"rgba(200,200,255,1)");
			// grd.addColorStop(0.8,"rgba(255,255,255,0.7)");
			// grd.addColorStop(1,"rgba(255,255,255,0.0)");
			// draw.fillStyle = grd;

			
			draw.fill();
		},
		pacman: function(draw,x,y,w) {
			draw.beginPath();
			draw.fillStyle = "yellow";
			draw.lineWidth = unitSize * 0.1;
			draw.strokeStyle = "steelblue";
			drawPath(draw,art["pacman"],x,y,w)
			draw.fill();
			draw.stroke();

		}

	};




    return {
        Controls: Controls,
        Animate: Animate,
        TextObject: TextObject,

        Actor: Actor,
        Weapon: Weapon

    };
});
