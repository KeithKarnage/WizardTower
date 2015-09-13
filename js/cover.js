(function(definition) {
    /* global module, define */
    if(typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = definition();
    } else if(typeof define === 'function' && define.amd) {
        define([], definition);
    } else {
        var exports = definition();
        window.Cover = exports.Cover;
        
    }
})(function() {

	function Cover(canvas) {
		var ths = this;
		this.canvas = canvas;

		this.tower = new Actor(null,5.5,3.5,"tower",13);


		this.clouds = [];
		this.backClouds = [];
		var deadClouds = [];

		this.pacman = new Actor(null,2,6,"pacman",5.5);
		console.log(this.pacman)

		for(var i=0,iL=16; i<iL; i++) {

			var rnd = random(1,9,true),
				w = 13 + rnd;
			if(i>8) {
				rnd = random(5,13,true);
				w = 11 + rnd;
			}
			 
			var	cloud = new Actor(null,(i%8)*6-10,6-rnd,"cloud",w);
			rnd = random(5,10);

				NM8.animateValue(cloud,"x",cloud.x,cloud.x+unitSize,function(X){return X*X*(3-2*X);},rnd*1000,undefined,"pingpong");

			if(i<8)
				this.clouds.push(cloud);
			else 
				this.backClouds.push(cloud);

		}


		//  ARE WE SITUATED PROPERLY
		this.oriented = !mobile || window.orientation === 90 ? true : false;

		//  ADD EVENT LISTENER
		if(!this.oriented) {
			addEventListener("orientationchange",reorient,false);
			function reorient() {
				if(window.orientation === 90)
					window.location.reload();
			};
		}


		buttons = [];
		buttons.push({x:canvas.width/10,
					  y:canvas.height/2.5,
					  w:canvas.width/5,
					  h:canvas.width/5,
					  down:function(){
					  	fade(300,"in",function(){
							beginGame("P");
					  	});
					  	
					  }
					});
		buttons.push({x:canvas.width/10 * 7,
					  y:canvas.height/2.5,
					  w:canvas.width/5,
					  h:canvas.width/5,
					  down:function(){
					  	fade(300,"in",function(){
							beginGame("R");
					  	});
					}
					});

		fade(300,"out");

	};

	Cover.prototype.update = function() {
		// var ths = this;
		// for(var i in this.deadClouds) {

		// 	var cloud = this.deadClouds[i];
		// 	cloud.x = -unitSize*10;

		// 	NM8.animateValue(cloud,"x",cloud.x,this.canvas.width + 10*unitSize,function(X){return X},12000,function(){
		// 		ths.deadClouds.push(cloud);
		// 	});
		// 	NM8.easings.push(cloud);

		// 	this.clouds.push(cloud);

		// }
		// this.deadClouds = [];
		if(mobile) {
			// console.log(this.oriented)
		}
		
	};

	Cover.prototype.render = function(draw) {
		draw.save();
		// draw.fillStyle = "midnightblue";
		var grd = draw.createLinearGradient(0,0,0,this.canvas.height*1.1);
		grd.addColorStop(1,"black");
		grd.addColorStop(0,"midnightblue");
		draw.fillStyle = grd;

		draw.fillRect(0,0,this.canvas.width,this.canvas.height);
		

		// console.log(xLoc);
		if(this.oriented) {

			draw.font = unitSize*2.4+"px 'arial black','avenirnext-bold','droid sans'";
			draw.fillStyle = "red"
			var text = "WIZARD  TOWER!",
			xLoc = this.canvas.width/2 - draw.measureText(text).width/2;

			draw.fillText(text, xLoc, this.canvas.height/4);
			draw.lineWidth = unitSize*0.1;
			draw.strokeStyle = "orange";
			draw.strokeText(text, xLoc, this.canvas.height/4);



			//  DRAW CLOUDS IN THE BACK
			for(var i in this.backClouds)
				this.backClouds[i].render(draw);

			//  DRAW @ SYMBOL
			// draw.lineWidth = 4;
			draw.strokeStyle = "steelblue";
			draw.fillStyle = "yellow";
			draw.font = 4*unitSize+"px 'arial black','avenirnext-bold','droid sans'";
			draw.fillText("@",17.5*unitSize,10*unitSize);
			draw.strokeText("@",17.5*unitSize,10*unitSize);


			//  DRAW PACMAN
			this.pacman.render(draw);

			
			//  DRAW THE TWOER
			this.tower.render(draw);

			//  DRAW THE FRONT CLOUDS
			for(var i in this.clouds)
				this.clouds[i].render(draw);

			//  WRITING AT THE BOTTOM

			// text = ,
			// xLoc = this.canvas.width/2 - draw.measureText(text).width/2;

			// draw.fillStyle = "rgba(200,20,50,1)";
			draw.fillStyle = "red";

			draw.font = unitSize+"px 'arial black','avenirnext-bold','droid sans'";
			draw.textAlign = "middle";
			draw.fillText("A Rogue/Pac-like",7*unitSize,13*unitSize);
			draw.font = 0.75*unitSize+"px 'arial black','avenirnext-bold','droid sans'";
			draw.fillText("JS13K 2015, KeithK",7.5*unitSize,14*unitSize);

		} else {
			draw.font = unitSize+"px futura";
			draw.fillStyle = "red"
			draw.textAlign = "center";
			var text = "Please rotate your device",
			xLoc = this.canvas.width/2;

			wrapText(draw,text, xLoc, this.canvas.height/4, this.canvas.width * 0.8, unitSize);
		}

		draw.restore();
	};


return {
        Cover: Cover
    };
});
