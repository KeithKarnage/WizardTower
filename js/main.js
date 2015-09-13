(function(){
    // localStorage.clear();

window.AudioContext = window.AudioContext || window.webkitAudioContext;

// // create a new Web Audio API context
window.actx = new AudioContext();

if(localStorage.WIZARD_TOWER_HIGH_SCORE === undefined)
    localStorage.WIZARD_TOWER_HIGH_SCORE = 0;

// console.log(localStorage.WIZARD_TOWER_HIGH_SCORE)

window.highScore = localStorage.WIZARD_TOWER_HIGH_SCORE;




	var canvas = document.createElement("canvas");    

    // var div = document.getElementById("div");
    // console.log(div)
    // div.appendChild(canvas);



    var h = window.innerHeight,
        w = window.innerWidth,
        hs = h/480,
        ws = w/720;
    // if(hs<ws) {
    //     scl = hs;
    //     canvas.style.marginLeft = w/2+"px";
    // } else {
    //     scl = ws;
    //     canvas.style.marginTop = h/2+"px";
    // }
    scl = hs < ws ? hs : ws;

    canvas.height = 480 * scl;
    canvas.width = 720 * scl;
    window.offX = (w-canvas.width)/2;
    window.offY = (h-canvas.height)/2;
    console.log(offX,offY)

    canvas.style.margin = offY+"px "+offX+"px";


    //     canvas.width  = 960;
    // canvas.height = 640;



    document.body.appendChild(canvas);

    // console.log(document.getElementsByTagName("iframe"));
    var draw = canvas.getContext("2d");

    addEventListener("orientationchange",orientationHandler,false);
    function orientationHandler (event) {
        // setTimeout(function(){
            canvas.height = window.innerHeight;
            canvas.width  = window.innerWidth;
            // window.unitSize = Math.ceil(canvas.height / 16);
        // },100);

        
    console.log(canvas.width,canvas.height,unitSize)

    }
    

    //  IF WE'RE ON MOBILE
    window.mobile = false;
    if(typeof window.orientation !== 'undefined'){
        // console.log("mobile")
        mobile = true;
        // div.syle.height = canvas.height * 2 + "px";
        window.top.scrollTo(0,1);
    }

    //  ANIMATOR
    window.NM8 = new Animate();

    //  BUTTONS
    // window.buttons = [];

    //  UNIT SIZE
    // window.unitSize = 39;
    window.unitSize = Math.floor(Math.ceil(canvas.height / 16));
    // console.log(unitSize)
    window.COLLISION_BUFFER = 0.2;
    window.MOVE_SPEED = 250;
    window.XOFF = (canvas.width - unitSize*23) / 2;
    window.YOFF = Math.floor((canvas.height - unitSize*15) * 0.75);

    window.wallColour;
                    


	
    //  GAME STATES
    var COVER = 0,
        PLAY = 1,
        state = 0;

    window.beginGame = function(style) {
        game = new Game(canvas,style);
        state = PLAY;
        cover = null;

    };

    window.toCover = function() {
        state = COVER;
        game = null;
    };


    var alpha = 0;
    window.fade = function(duration,dir,callback,sprite) {
        var f = 1,
            t = 0,
            s = sprite || this;
        if(dir === "in") 
            f = 0, t = 1;
        // switch(dir) {
            // case "in":
                // this.alpha = 1;
                NM8.animateValue(s,"alpha",f,t,function(X){return X*X*(3-2*X)},duration,function() {
                    if(callback) callback();
                });
                // NM8.easings.push(this);
        //     break;
        //     case "out":
        //         // this.alpha = 0;
        //         NM8.animateValue(this,"alpha",0,1,function(X){return X*X*(3-2*X)},duration,function() {
        //             if(callback) callback();
        //         });
        //         // NM8.easings.push(this);
        //     break;
        // }
    };


	// var maps = new Maps();
 //    var map = maps.makeMap(8);



    var colour = "blue";

    //  KEY CONTROLS
    window.controls = new Controls();
    controls.register("space",32,function(){console.log("space pressed");});

    controls.register("left",37);
    controls.register("up",38);
    controls.register("right",39);
    controls.register("down",40);
    controls.register("space",32);
    controls.register("esc",27);

    
    controls.register("touch",0,function(){},
                                function(){},
                                function(){});
    console.log(controls)

    

    
    var cover = null;
    var game = null;
    window.currentTime = 0;
    var gameTime = new Date().getTime();

    var fps = {
        startTime : 0,
        frameNumber : 0,
        d: 0,
        result: 0,
        getFPS : function(){
            this.frameNumber++;
            d = new Date().getTime();
            currentTime = ( d - this.startTime ) / 1000;
            result = Math.floor( ( this.frameNumber / currentTime ) );

            if( currentTime > 1 ){
                this.startTime = new Date().getTime();
                this.frameNumber = 0;
            }
            return result;

        }   
    };


    window.FPS = 0;

    
    update();
    function update() {
        //  FPS
        FPS = fps.getFPS();
        // FPS = new Date().getTime() - gameTime;

        // console.log(currentTime);


        requestAnimationFrame(update);

        controls.update();
        NM8.processAnimations();
        
        switch(state) {

            case COVER:
                if(cover === null) cover = new Cover(canvas);
                cover.update();
            break;
            case PLAY:
                // if(game === null) game = new Game(canvas);
                game.update();
            break;
        }

        render();
    }

    function render() {
        // draw.clearRect(0,0,canvas.width,canvas.height);
        draw.fillStyle = "black";
        draw.fillRect(0,0,canvas.width,canvas.height)

        switch(state) {

            case COVER:
                cover.render(draw);
            break;
            case PLAY:
                game.render(draw);
            break;
        }
        draw.font = unitSize+"px futura";
        draw.fillStyle = "blue";
        draw.fillText(FPS,0,canvas.height);


        // console.log(mobile)
        if(mobile) {
            // draw.fillStyle = colour;
            // draw.strokeStyle = "black";



            // draw.beginPath();
            // draw.rect(10,10,100,100);
            
            // draw.stroke();
            // draw.fill();
        }
        if(this.alpha > 0) {
            draw.save();
            draw.globalAlpha = this.alpha;
            draw.fillStyle = "black";
            draw.fillRect(0,0,canvas.width,canvas.height);
            draw.restore();
        }
    }

    

})();