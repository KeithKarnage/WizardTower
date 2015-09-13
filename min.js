(function() {

	// function extend(base, sub) {
	//     var origProto = sub.prototype;
	//     sub.prototype = Object.create(base.prototype);
	//     for (var key in origProto)  {
	// 	    sub.prototype[key] = origProto[key];
	// 	}
	// 	sub.prototype.constructor = sub;
	
	// 	Object.defineProperty(sub.prototype, 'constructor', { 
	// 	    enumerable: false, 
	// 	    value: sub 
	// 	});
	// };

	function OpL(o) {
		this.o = o;
		this.uPl = [];
		this.fPl = [];
	};

	OpL.prototype.nX = function() {
		if(this.fPl.length > 0)
			return this.fPl.splice(0,1)[0];
		else return this.nO();
	};

	OpL.prototype.nO = function() {
		var o = new this.o();
		this.uPl.push(o);
		return o;
	};

	OpL.prototype.free = function(o) {
		this.uPl.splice(this.uPl.indexOf(o),1);
		this.fPl.push(o);
	};

	function Fl(V) {
		return Math.floor(V);
	};

	// function copyObject (object) {
	// 	var result = {};
	// 	for(var i in object)
	// 		result[i] = object[i];
	// 	return result;
	// };

	// function debugGrid(Gr) {
	// 	console.log("- - - - - Gr - - - - -");
	// 	for(var y in Gr)
	// 		console.log(Gr[y]);
	// };

	function eG(X,Y) {
		var r = [],
			x,y;
		for(y=0; y<Y; y++) {
            r.push([]);
            for(x=0; x<X; x++)
                r[y].push(0);
        }
        return r
	};

	function Cg(G) {
		var r = [];
		for(var y=0,Y=G.length; y<Y; y++) {
			r.push([]);
			for(var x=0,X=G[0].length; x<X; x++)
				r[y][x] = G[y][x];
		}
		return r;
	};

	//  a = min
	//  b = max
	//  c = int, !c = float
	function random(a,b,c) {
		var r = (Math.random() * (b-a)) + a;
		if(c) return Fl(r);
		else return r;
	};


	function sR(a,b,c) {
		var r = (Sr() * (b-a)) + a;
		if(c) return Fl(r);
		else return r;
	};

	var seed = localStorage.SEED;
	if(seed === undefined) seed = 1;
	else seed = parseInt(seed);
	// console.log(seed)
	var seq = 1;
	function Sr() {
	    var x = Math.sin(seq++) * (10000 + seed);

	    return x - Fl(x);
	};


	function bC(b,c,bf) {
		var B = bf || 0;


		if(c.x < b.x + b.w - b.w*B
		&& c.y < b.y + b.h - b.h*B
		&& c.x + c.w > b.x + b.w*B
		&& c.y + c.h > b.y + b.w*B)
			return true;
		return false;
	};

	function pC(b,p) {
		if(p.x > b.x && p.x < b.x + b.w
		&& p.y > b.y && p.y < b.y + b.h)
			return true;
	};

	function dS(a,b) {
		if(a.gx !== undefined)
			return Math.sqrt((b.gx-a.gx)*(b.gx-a.gx) + (b.gy-a.gy)*(b.gy-a.gy));
		else return Math.sqrt((b.x-a.x)*(b.x-a.x) + (b.y-a.y)*(b.y-a.y));
	};

	function line(x0,y0,x1,y1) {
		var P = [];
		var dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
		var dy = Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1; 
		var err = (dx>dy ? dx : -dy)/2;
		 
		var F = false;
		while(!F) {

			P.push({x:x0,y:y0});
			if (x0 === x1 && y0 === y1) F = true;
			var e2 = err;
			if (e2 > -dx) { err -= dy; x0 += sx; }
			if (e2 < dy) { err += dx; y0 += sy; }
		}
		return P;
	};

	/**
	 * Converts an HSL color value to RGB. Conversion formula
	 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
	 * Assumes h, s, and l are contained in the set [0, 1] and
	 * returns r, g, and b in the set [0, 255].
	 *
	 * @param   Number  h       The hue
	 * @param   Number  s       The saturation
	 * @param   Number  l       The lightness
	 * @return  Array           The RGB representation
	 */
	function hTr(h, s, l, a){
	    var R = "rgb",
		    r, g, b;

	    if(s == 0){
	        r = g = b = l; // achromatic
	    }else{
	        function h2R(p, q, t){
	            if(t < 0) t += 1;
	            if(t > 1) t -= 1;
	            if(t < 1/6) return p + (q - p) * 6 * t;
	            if(t < 1/2) return q;
	            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
	            return p;
	        }

	        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	        var p = 2 * l - q;
	        r = Fl(h2R(p, q, h + 1/3)*255);
	        g = Fl(h2R(p, q, h)*255);
	        b = Fl(h2R(p, q, h - 1/3)*255);
	    }

	    // R = [r * 255, g * 255, b * 255];
	    if(a) R += "a";
	    R += "("+r+","+g+","+b;
	    if(a) R += ","+a;
	    R += ")";

		return R;

	};


	function wT(c, tX, x, y, w, h) {
		var W = tX.split(' ');
		var L = '';
		
		for(var n = 0; n < W.length; n++) {
		  var tL = L + W[n] + ' ',
			  M = c.measureText(tL),
			  tW = M.width;
		  if (tW > w && n > 0) {
		    c.fillText(L, x, y);
		    L = W[n] + ' ';
		    y += h;
		  }
		  else {
		    L = tL;
		  }
		}
		c.fillText(L, x, y);
	};
	

    

	var SFX = {
		// lights: {
	 //        wait: 0,
	 //        A: 0.04,
	 //        sP: 0.1,
	 //        sT: 0.4,
	 //        D: 0.2,
	 //        rR: 100,

	 //        T: 50,
	 //        Ta: 50,

	 //        F: 200,
	 //        bend: 0,
	 //        type: "sine",
	 //        V: 0.3,

	 //        lp: 200,
	 //        lpS: 0,
	 //        hp: 20,
	 //        hpS: 500
	 //    },
	Sn: [0,0.15,0.4,0.55,0.4,,87.5,100,350,,"sine",0.5,15000,,20],
	lv: [,0.2,0.3,0.5,0.4,,7,50,110,350,"square",0.5,6000,-5000,200],
	death:[,0.04,0.7,0.3,0.2,100,10,100,350,-100,"sine",0.5,15000,,20],
	lights: [,0.04,0.1,0.4,0.2,100,50,50,200,,"sine",0.3,200,,20,500],
	powerUp: [,,0.4,0.5,0.1,100,12,80,300,500,"sine",0.7,200,1000,20],
	sS: [,0.01,0.5,0.25,0.1,100,40,40,540,-350,"square",0.3,6000,-6000,20],
	step: [0,,,,0.05,100,,,100,,"square",0.05,3000,,20]

	};


	function pS(S,T) {

		for(var i=0,iL=S.length; i<iL; i++) {

			//  ITEM FROM THE SEQUENCE
			var t = S[i];
			if(t !== undefined) {
				//  THE SFX IT WANTS TO PLAY
				var sfx = SFX[t.sfx];//copyObject(SFX[t.sfx]);
				//  OVERRIDE VALUES INCLUDED IN t
				for(var j in t) {
					if(j !== "time" && j !== "sfx")
						sfx[j] = t[j];

				}

				//  IF A TEMPO IS DEFINED RUN AT THAT
				if(T !== undefined)
					sE(T*i,sfx);

				//  OTHERWISE EACH ITEM NEEDS A time PROPERTY TO TELL WHEN TO PLAY THEM
				else sE(t.time,sfx);
			}
		}
	};

	function sE(W,o) {
		if(Sn !== 0) {

			var W = W + o[0] || 0,
		        A = o[1] || 0,
		        sP = o[2] || 1,
		        sT = o[3] || 0,
		        D = o[4] || 0,
		        rR = o[5] || 0,

		        T = o[6] || 0,
		        Ta = o[7] || 0,

		        F = o[8] || 220,
		        bend = o[9] || 0,
		        type = o[10] || "sine",
		        V = o[11] || 1,

		        lp = o[12] || 20000,
		        lpS = o[13] || 0,
		        hp = o[14] || 0,
		        hpS = o[15] || 0;

			// V *= Sn;

	// function sE(oP,time) {
	// 	var F = oP.F,
	// 		V = oP.V || 1,						//  MASTER VOLUME

	// 		W = oP.W + time || 0,				//  HOW LONG TO WAIT BEFORE PLAYING

	// 		A = oP.A || 0,						//  HOW LONG TO ATTACK FOR

	// 		sP = oP.sP || 0,			//  THE SUSTAIN COMPARED TO INITIAL ATTACK
	// 		sT = oP.sT || 0,				//  HOW LONG IT RAMPS DOWN FROM THERE
	// 		D = oP.D || 0.1,							//  HOW LONG TO KEEP THE CHANNEL OPEN FOR ECHO ETC. (NOT USEFUL FOR MOBILE)
	// 		type = oP.type || "sine",						//  TYPE OF WAVEFORM

	// 		T = oP.T || 0,
	// 		Ta = oP.Ta || 6,
			

	// 		bend = oP.bend ||0,							//  POSITIVE OR NEGATIVE
			
	// 		range = oP.rR || 0,					//  POSITIVE, THE AMOUNT AROUND F TO RANDOM BY
			

	// 		lp = oP.lp || 20000,
	// 		lpS = oP.lpS || 0,

	// 		hp = oP.hp || 0,
	// 		hpS = oP.hpS || 0

			// dissonance = oP.dissonance || 0,				//  ADDITIONAL SAWTOOTHS TO REALLY FUCK THINGS UP
			// dissonantAmount = oP.dissonantAmount || 0,			//  HOW MUCH OF THAT NASTY WE NEED
			// echo = oP.echo || undefined,					//  DON'T USE FOR MOBILE
			// reverb = oP.reverb || undefined;				//  DON'T USE FOR MOBILE
			

		var t = actx.createOscillator(),
			lP = actx.createBiquadFilter(),
			hP = actx.createBiquadFilter();


		//  CONNECT THE LOW PASS FILTER TO THE HIGH PASS FILTER
		lP.connect(hP);
		//  MAKE IT A LOW PASS FILTER
		lP.type = "lowpass";
		//  SET CUTOFF FREQUENCY
		lP.frequency.value = lp;
		//  SWEEP IT
		fade(lP.frequency,lp,lp + lpS, W, A + sT + D);


		//  CONNECT THE HIGH PASS FILTER TO THE HIGH PASS FILTER
		hP.connect(actx.destination);
		//  MAKE IT A HIGH PASS FILTER
		hP.type = "highpass";
		//  SET CUTOFF FREQUENCY
		hP.frequency.value = hp;
		//  SWEEP IT
		fade(hP.frequency,hp,hp + hpS, W, A + sT + D);

		
		
		//  CREATE THE MAIN OSCILLATOR
		osc = new oscillator(type,F);

		//  TURN IT ON (ATTACHED TO lP FILTER)
		osc.play(lP,W,W + A + sT + D,1);
		
		//  IF THERE IS A TREMELO, CREATE A SECOND OSCILLATOR
		if(T > 0) {
			t = new oscillator("sawtooth",T);

			//  TURN IT ON
			t.play(osc.oscillator.frequency,W,W + A + sT + D,Ta);
		}
		
		//  IF THERE IS AN ATTACK PHASE, FADE THE MAIN OSC IN FROM 0
		if(A > 0) {
			osc.gain.gain = 0;
			fade(osc.gain.gain,0,V,W,A);
		//  OTHER WISE PRESET THE VOLUME TO MAX
		} else osc.gain.gain = V;

		//  IF THERE IS A SUSTAIN PHASE, RAMP DOWN TO sP IN sT AMOUNT OF TIME
		//  THEN RAMP TO 0 IN D AMOUNT OF TIME
		if(sT > 0) {
			fade(osc.gain.gain,V,sP,W+A,sT);
			fade(osc.gain.gain,sP,0,W+A+sT,D)

		//  IF THERE IS NO SUSTAIN PHASE BUT IS A DECAY PHASE, JUST RAMP TO 0 IN D AMOUNT OF TIME
		} else if(D > 0) {
			fade(osc.gain.gain,V,0,W+A,D);
		}

		if(bend !== 0) pitchBend(osc.oscillator);
		// if(echo) addEcho(amp);
		// if(reverb) addReverb(amp);
		// if(dissonance > 0) addDissonance();



		// A WRAPPER FOR OSCILLATORS
		function oscillator(type, F){
			var T = this;
		    T.type = type;
		    T.frequency = F;

		    T.gain = actx.createGain();
		  //   if(type === "noise") {
				// var bufferSize = 2 * actx.sampleRate,
				//     noiseBuffer = actx.createBuffer(1, bufferSize, actx.sampleRate),
				//     output = noiseBuffer.getChannelData(0);
				// for (var i = 0; i < bufferSize; i++)
				//     output[i] = Math.random() * 2 - 1;

				// T.oscillator = actx.createBufferSource();
				// T.oscillator.buffer = noiseBuffer;
				// T.oscillator.loop = true;
		  //   } else {
		    T.oscillator = actx.createOscillator();
		    T.oscillator.frequency.value = F;
		    T.oscillator.type = type;
		    
		    // }
		    
		    
		    

		    
		    T.play = function(d, W, D, V){
			    T.d = d;
			    T.V = V || 1;
			    T.D = D || 1;
			    T.oscillator.connect(T.gain);
			    T.gain.gain.value = V;
			    T.gain.connect(d);
			    T.oscillator.start(actx.currentTime + W);
			    T.oscillator.stop(actx.currentTime + D);
		    };
		    
		    T.stop = function(W){
		    	var W = W || 0;
			    T.oscillator.stop(W);
		    };   
		}

		function fade(A,f,t,W,h) {
			A.linearRampToValueAtTime(f,actx.currentTime + W);
			A.linearRampToValueAtTime(t,actx.currentTime + W + h);
		};

		//  PITCH BEND
		function pitchBend(o) {
			//  GET FREQUENCY
			var F = o.frequency.value;
			o.frequency.linearRampToValueAtTime(F,actx.currentTime + W);
			o.frequency.linearRampToValueAtTime(F + bend, actx.currentTime + W + A + sT + D);
		};

		// //  FADE IN (ATTACK)
		// function fadeIn(VNode) {
		// 	//  SET VOLUME TO 0
		// 	VNode.gain.value = 0;

		// 	VNode.gain.linearRampToValueAtTime(0,actx.currentTime+W);
		// 	VNode.gain.linearRampToValueAtTime(V,actx.currentTime + W + A);
		// };

		// //  FADE OUT (DECAY)
		// function fadeOut(VNode) {
		// 	VNode.gain.linearRampToValueAtTime(V,actx.currentTime + W + A);
		// 	VNode.gain.linearRampToValueAtTime(sP,actx.currentTime + W + A + sT + D);
		// };

		

		// //  ECHO
		// function addEcho(VNode) {
		// 	//  CREATE NODES
		// 	var feedback = actx.createGain(),
		// 		delay = actx.createDelay(),
		// 		filter = actx.createBiquadFilter();

		// 	//  SET THEIR VALUES
		// 	delay.delayTime = echo[0];
		// 	feedback.gain.value = echo[1];
		// 	if(echo[2]) filter.frequency.value = echo[2];

		// 	//  CREATE FEEDBACK LOOP
		// 	delay.connect(feedback);
		// 	if(echo[2]) {
		// 		feedback.connect(filter);
		// 		filter.connect(delay);
		// 	} else feedback.connect(delay);

		// 	//  CONNECT DELAY LOOP TO OSCILATOR VOLUME
		// 	VNode.connect(delay);

		// 	// CONNECT DELAY LOOP TO MAIN SOUND CHAINS PAN NODE
		// 	delay.connect(actx.destination);
		// };

		// //  REVERB
		// function addReverb(VNode) {
		// 	var convolver = actx.createConvolver();
		// 	convolver.buffer = impulseResponse(reverb[0],reverb[1],reverb[2]);
		// 	VNode.connect(convolver);
		// 	convolver.connect(actx.destination);
		// };

		// function impulseResponse(dr,D,reverse) {

		// 	//  LENGTH OF THE BUFFER
		// 	var length = actx.sampleRate * dr;

		// 	//  CREATE AN AUDIO BUFFER
		// 	var impulse = actx.createBuffer(2,length,actx.sampleRate);

		// 	//  INIT EMPTY ARRAYS TO STORE SOUND DATA
		// 	var left = impulse.getChannelData(0);
		// 	var right = impulse.getChannelData(1);

		// 	//  LOOP THROUGH EACH FRAME AN DFILL CHANNEL WITH RANDOM NOISE
		// 	for(var i=0; i<length; i++) {

		// 		//  APPLY REVERSE IF TRUE
		// 		var n;
		// 		if(reverse)
		// 			n = length - i;
		// 		else n = i;

		// 		//  FILL LEFT AND RIGHT CHANNELS WITH RANDOM WHITE NOSE THAT DECAYS EXPONENTIALLY
		// 		left[i] = (Math.random() * 2 -1) * Math.pow(1-n/length,D);
		// 		right[i] = (Math.random() * 2 -1) * Math.pow(1-n/length,D);
		// 	}

		// 	return impulse;
		// };

		// //  DISSONANCE
		// function addDissonance() {
		// 	//  MAKE TWO MORE OSCILLATORS
		// 	var d1 = actx.createOscillator(),
		// 		d2 = actx.createOscillator(),
		// 		d1Volume = actx.createGain(),
		// 		d2Volume = actx.createGain();

		// 	//  SET VOLUME
		// 	// d1Volume.gain.value = 0;//dissonantAmount;
		// 	// d2Volume.gain.value = 0;//dissonantAmount;

		// 	//  CONNECT OSCILLATORS
		// 	d1.connect(d1Volume);
		// 	d1Volume.connect(actx.destination)
		// 	d2.connect(d2Volume);
		// 	d2Volume.connect(actx.destination)

		// 	//  SET WAVEFORMS
		// 	d1.type = "sawtooth";
		// 	d2.type = "sawtooth";

		// 	//  DETUNE FREQUENCIES
		// 	d1.frequency.value = F + dissonance;
		// 	d2.frequency.value = F - dissonance;

		// 	//  APPLY EFFECTS
		// 	if(A > 0) {
		// 		fadeIn(d1Volume);
		// 		fadeIn(d2Volume);
		// 	}
		// 	if(D > 0) {
		// 		fadeOut(d1Volume);
		// 		fadeOut(d2Volume);
		// 	}
		// 	if(bend > 0) {
		// 		pitchBend(d1);
		// 		pitchBend(d2);
		// 	}
		// 	if(echo) {
		// 		addEcho(d1Volume);
		// 		addEcho(d2Volume);
		// 	}
		// 	if(reverb) {
		// 		addReverb(d1Volume);
		// 		addReverb(d2Volume);
		// 	}

		// 	d1.start(actx.currentTime + W);
		// 	d1.stop(actx.currentTime + W + A + sT + D);

		// 	d2.start(actx.currentTime + W);
		// 	d2.stop(actx.currentTime + W + A + sT + D);
		// };
		}


	};


	function pT(Nd){
	    var curr = Nd,
	        path = [];
	    while(curr.pr) {
	        path.push(curr);
	        curr = curr.pr;
	    }
	    return path.reverse();
	}

	function getHeap() {
	    return new bH(function(Nd) {
	        return Nd.f;
	    });
	}

	var As = {
	    /**
	    * Perform an A* Search on a gR given a start and end Nd.
	    * @param {Graph} gR
	    * @param {Gn} start
	    * @param {Gn} end
	    * @param {Object} [oP]
	    * @param {bool} [oP.cl] Specifies whether to return the
	               path to the cl Nd if the Tg is unreachable.
	    * @param {Function} [oP.H] Heuristic function (see
	    *          As.Hs).
	    */
	    search: function(gR, S, E, o) {
	        gR.Cd();
	        o = o || {};
	        var H = o.H || As.Hs.mH,
	            cl = o.cl || true;

	        var oH = getHeap(),
	            cL = S; // set the S Nd to be the cl if required

	        S.h = H(S, E);

	        oH.push(S);

	        while(oH.size() > 0) {

	            // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
	            var cN = oH.pop();

	            // End case -- result has been found, return the traced path.
	            if(cN === E) {
	                return pT(cN);
	            }

	            // Normal case -- move cN from open to Cl, process each of its nBs.
	            cN.Cl = true;

	            // Find all nBs for the current Nd.
	            var nBs = gR.nBs(cN);


	            //  If the cN is in the Pt list
	            // for(var i=0,iL=o.Pt.length; i<iL; i++) {
	            //     var portal = o.Pt[i];
	            //     if(cN.x === portal.x
	            //     && cN.y === portal.y)
	            //         {}

	            // }

	            for (var i = 0, il = nBs.length; i < il; ++i) {
	                var nB = nBs[i];

	                if (nB.Cl || nB.isWall()) {
	                    // Not a valid Nd to process, skip to next nB.
	                    continue;
	                }

	                // The g score is the shortest dS from S to current Nd.
	                // We need to check if the path we have arrived at this nB is the shortest one we have seen yet.
	                var gS = cN.g + nB.gC(cN),
	                    bV = nB.v;

	                if (!bV || gS < nB.g) {

	                    // Found an optimal (so far) path to this Nd.  Take score for Nd to see how good it is.
	                    nB.v = true;
	                    nB.pr = cN;
	                    nB.h = nB.h || H(nB, E, gR.oP.Pt);

	                    nB.g = gS;
	                    nB.f = nB.g + nB.h;
	                    gR.mD(nB);
	                    if (cl) {
	                        // If the nB is closer than the current cL or if it's equally close but has
	                        // a cheaper path than the current cl Nd then it becomes the cl Nd
	                        if (nB.h < cL.h || (nB.h === cL.h && nB.g < cL.g)) {
	                            cL = nB;
	                        }
	                    }

	                    if (!bV) {
	                        // Pushing to heap will put it in proper place based on the 'f' value.
	                        oH.push(nB);
	                    }
	                    else {
	                        // Already seen the Nd, but since it has been rescored we need to reorder it in the heap
	                        oH.rE(nB);
	                    }
	                }
	            }
	        }

	        if (cl) {
	            return pT(cL);
	        }

	        // No result was found - empty array signifies failure to find path.
	        return [];
	    },
	    // See list of Hs: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
	    Hs: {
	        mH: function(a, b, Pt) {
	            var h = heur(a,b);
	            for(var i in Pt) {
	                var j = heur(a,Pt[i]) + heur(Pt[i].to,b);
	                if(j < h) h = j;
	            }
	            return h;
	            
	            function heur(a,b) {
	                var d1 = Math.abs(b.x - a.x);
	                var d2 = Math.abs(b.y - a.y);
	                return d1 + d2;
	            };
	        }
	    },
	    cln:function(Nd){
	        Nd.f = 0;
	        Nd.g = 0;
	        Nd.h = 0;
	        Nd.v = false;
	        Nd.Cl = false;
	        Nd.pr = null;
	    }
	};

	/**
	* A gR memory structure
	* @param {Array} GrIn 2D array of input ws
	* @param {Object} [oP]
	* @param {bool} [oP.diagonal] Specifies whether diagonal moves are allowed
	*/
	function Graph(GrIn, oP) {
		var T = this;
	    T.oP = oP || {};
	    T.Nds = [];
	    // T.diagonal = oP.diagonal || false;
	    T.Gr = [];

	     for(var y=0, yL=GrIn.length; y<yL; y++) {

	        var row = [];
	        for(var x=0, xL=GrIn[0].length; x<xL; x++) {
	            // if(ws !== undefined)
	                // var Nd = new Gn(x,y,GrIn[y][x],ws[y][x]);
	            // else 
	            var Nd = new Gn(x,y,GrIn[y][x]);
	            row.push(Nd);
	            T.Nds.push(Nd);
	        }
	        T.Gr.push(row);
	    }
	    T.init();
	}

	Graph.prototype.init = function() {
	    this.dirtyNodes = [];
	    for (var i = 0; i < this.Nds.length; i++) {
	        As.cln(this.Nds[i]);
	    }
	};

	Graph.prototype.Cd = function() {
	    for (var i = 0; i < this.dirtyNodes.length; i++) {
	        As.cln(this.dirtyNodes[i]);
	    }
	    this.dirtyNodes = [];
	};

	Graph.prototype.mD = function(Nd) {
	    this.dirtyNodes.push(Nd);
	};

	Graph.prototype.nBs = function(Nd) {
	    var R = [],
	        x = Nd.x,
	        y = Nd.y,
	        Gr = this.Gr;

	    // West
	    if(Gr[y] && Gr[y][x-1]) {
	        R.push(Gr[y][x-1]);
	    }

	    // East
	    if(Gr[y] && Gr[y][x+1]) {        
	        R.push(Gr[y][x+1]);
	    }

	    // South
	    if(Gr[y-1] && Gr[y-1][x]) {
	        R.push(Gr[y-1][x]);
	    }

	    // North
	    if(Gr[y+1] && Gr[y+1][x]) {
	        R.push(Gr[y+1][x]);
	    }

	    // if (this.diagonal) {
	    //     // Southwest
	    //     if(Gr[y-1] && Gr[y-1][x-1]) {
	    //         R.push(Gr[y-1][x-1]);
	    //     }

	    //     // Southeast
	    //     if(Gr[y-1] && Gr[y-1][x+1]) {
	    //         R.push(Gr[y-1][x+1]);
	    //     }

	    //     // Northwest
	    //     if(Gr[y+1] && Gr[y+1][x-1]) {
	    //         R.push(Gr[y+1][x-1]);
	    //     }

	    //     // Northeast
	    //     if(Gr[y+1] && Gr[y+1][x+1]) {
	    //         R.push(Gr[y+1][x+1]);
	    //     }
	    // }

	    for(var i=0,iL=this.oP.Pt.length; i<iL; i++) {
	        var portal = this.oP.Pt[i];
	        if(x === portal.x
	        && y === portal.y) {
	            R.push(Gr[portal.to.y][portal.to.x]);


	        }

	    }

	    return R;
	};

	// Graph.prototype.toString = function() {
	//     var gRString = [],
	//         Nds = this.Gr, // W using Gr
	//         rowDebug, row, y, l;
	//     for (var x = 0, len = Nds.length; x < len; x++) {
	//         rowDebug = [];
	//         row = Nds[x];
	//         for (y = 0, l = row.length; y < l; y++) {
	//             rowDebug.push(row[y].w);
	//         }
	//         gRString.push(rowDebug.join(" "));
	//     }
	//     return gRString.join("\n");
	// };

	function Gn(x, y, W) {
	    this.x = x;
	    this.y = y;
	    this.w = W;
	}

	// Gn.prototype.toString = function() {
	//     return "[" + this.x + " " + this.y + "]";
	// };

	Gn.prototype.gC = function(N) {
	    // Take diagonal w into consideration.
	    // if (N && N.x != this.x && N.y != this.y) {
	    //     return this.w * 1.41421;
	    // }
	    return this.w;
	};

	Gn.prototype.isWall = function() {
	    return this.w === 0;
	};

	function bH(S){
	    this.content = [];
	    this.sF = S;
	}

	bH.prototype = {
	    push: function(e) {
	        // Add the new El to the end of the array.
	        this.content.push(e);

	        // Allow it to sink down.
	        this.Sd(this.content.length - 1);
	    },
	    pop: function() {
	        // Store the first El so we can return it later.
	        var result = this.content[0];
	        // Get the El at the end of the array.
	        var end = this.content.pop();
	        // If there are any Els left, put the end El at the
	        // start, and let it bubble up.
	        if (this.content.length > 0) {
	            this.content[0] = end;
	            this.bU(0);
	        }
	        return result;
	    },
	    remove: function(Nd) {
	        var i = this.content.indexOf(Nd);

	        // When it is found, the process seen in 'pop' is repeated
	        // to fill up the hole.
	        var end = this.content.pop();

	        if (i !== this.content.length - 1) {
	            this.content[i] = end;

	            if (this.sF(end) < this.sF(Nd)) {
	                this.Sd(i);
	            }
	            else {
	                this.bU(i);
	            }
	        }
	    },
	    size: function() {
	        return this.content.length;
	    },
	    rE: function(Nd) {
	        this.Sd(this.content.indexOf(Nd));
	    },
	    Sd: function(n) {
	        // Fetch the El that has to be sunk.
	        var El = this.content[n];

	        // When at 0, an El can not sink any further.
	        while (n > 0) {

	            // Compute the pr El's index, and fetch it.
	            var prN = ((n + 1) >> 1) - 1,
	                pr = this.content[prN];
	            // Swap the Els if the pr is greater.
	            if (this.sF(El) < this.sF(pr)) {
	                this.content[prN] = El;
	                this.content[n] = pr;
	                // Update 'n' to continue at the new position.
	                n = prN;
	            }
	            // Found a pr that is less, no need to sink any further.
	            else {
	                break;
	            }
	        }
	    },
	    bU: function(n) {
	        // Look up the Tg El and its score.
	        var L = this.content.length,
	            El = this.content[n],
	            eS = this.sF(El);

	        while(true) {
	            // Compute the indices of the child Els.
	            var c2 = (n + 1) << 1,
	                c1 = c2 - 1;
	            // This is used to store the new position of the El, if any.
	            var swap = null,
	                c1S;
	            // If the first child exists (is inside the array)...
	            if (c1 < L) {
	                // Look it up and compute its score.
	                var C1 = this.content[c1];
	                c1S = this.sF(C1);

	                // If the score is less than our El's, we need to swap.
	                if (c1S < eS){
	                    swap = c1;
	                }
	            }

	            // Do the same checks for the other child.
	            if (c2 < L) {
	                var C2 = this.content[c2],
	                    c2s = this.sF(C2);
	                if (c2s < (swap === null ? eS : c1S)) {
	                    swap = c2;
	                }
	            }

	            // If the El needs to be moved, swap it, and continue.
	            if (swap !== null) {
	                this.content[n] = this.content[swap];
	                this.content[swap] = El;
	                n = swap;
	            }
	            // Otherwise, we are done.
	            else {
	                break;
	            }
	        }
	    }
	};

	var CTRL = function() {

		this.keys = {};
		this.touch = {};

        var ths = this;
        document.onkeydown = function(e){ths.down(e);};
        document.onkeyup = function(e){ths.up(e);};

		addEventListener("mousedown",this.tDown.bind(this),false);
        addEventListener("mouseup",this.tUp.bind(this),false);
        addEventListener("mousemove",this.tMove.bind(this),false);
        
        addEventListener("touchstart",this.tDown.bind(this),false);
        addEventListener("touchend",this.tUp.bind(this),false);
        addEventListener("touchmove",this.tMove.bind(this),false);
    }

    //  REGISTER
    CTRL.prototype.rG = function(name,ascii,D,U,H) {
		if(name === "touch") {
			window.bTs = [];
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

	CTRL.prototype.update = function() {
		for(i in this.keys) {
			var key = this.keys[i];
			if(key.held 
			&& key.keyDown) 
				key.held();
		}

		if(this.touches.length > 0) {
			for(var i in this.touches) {
				var touch = this.touches[i];
				if(bTs.length > 0 && touch) {
					for(var i in bTs) {
						var bT = bTs[i];
						if(bT
						&& bT.held
						&& pC(bT,touch))
							bT.held();
					}
				}
			}
		}
	};

	CTRL.prototype.down = function(e) {
		e.preventDefault();
		for(i in this.keys) {
			var key = this.keys[i];
			if(e.keyCode === key.code
			&& !key.keyDown) {
				key.keyDown = true;
				if(key.down)
					key.down();
			}
		}
	};

	CTRL.prototype.up = function(e) {
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

	CTRL.prototype.tDown = function(e) {
		var touches = [];		
		// if(mobile) {
		// 	e.preventDefault();
		// 	touches = getTouches(e);
		// } else {
			touches.push({
				x: e.clientX-offX,
				y: e.clientY-offY,
				id: 0
			});
			

		// }

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
				if(bTs.length > 0) {
					for(var i in bTs) {
						var bT = bTs[i];
						if(bT
						&& bT.down
						&& pC(bT,touch))
							bT.down();
					}
				}	
			}			
		}
		// this.touch.down();
		// this.touch.touched = true;


	};

	CTRL.prototype.tUp = function(e) {
		// if(mobile) {
		// 	if(this.touches.length === 1)
		// 		this.touches = [];
		// 	else {
		// 		var touches = getTouches(e);
		// 		this.touches = touches;
		// 	}
		// } else 
		this.touches = [];
		
		
		
		// if(this.touch.up)
		// 	this.touch.up();
		// this.touch.touched = false;
	};

	CTRL.prototype.tMove = function(e) {
		e.preventDefault();
		
		// this.touch.x = null;
		// this.touch.y = null;
		
		// if(this.touch.up)
		// 	this.touch.up();
		// this.touch.touched = false;
	};

	function Nm8() {
		this.eA = [];
		this.aNms = [];

		this.toRemove = [];
	};

	Nm8.prototype.pAnm = function() {
		for(var i=0,iL=this.eA.length; i<iL; i++) {
			var obj = this.eA[i];
			if(obj === undefined
			|| obj.ease === undefined
			|| obj.ease === null)
				continue;
			else if(obj.ease.length === 0) 
				this.eA.splice(this.eA.indexOf(obj));
			else {
				for(var j=0,jL=obj.ease.length; j<jL; j++)
					if(obj.ease[j])	obj.ease[j].aNm();
			}
		}
		if(this.toRemove.length > 0) {
			for(var i in this.toRemove)
				this.removeEasing(this.toRemove[i]);
			this.toRemove = [];
		}
	};

	//  - - - - - - - - - EASING ANIMATIONS - - - - - - - - - 
	Nm8.prototype.aV = function(Tg, V, from, to, D, dr, cLb, type, tm) {

		var i = this.eA.indexOf(Tg);
		if(i !== -1) this.eA.splice(i,1);
		this.eA.push(Tg);

		this.animate({
			Tg: Tg,
			V: V,
			D: D,//|| function(X){return X;},
			dr: dr || 1000,
			type: type || "once",
			tm: tm,
			cLb: cLb,
			step: function(D) {
				Tg[V] = from - ((from - to) * D);
			}
		});


	};

	Nm8.prototype.animate = function(o) {
		var start = new Date().getTime();


		function aNm() {
			var timePassed = (new Date().getTime() - start),
				pr = timePassed / (o.dr || 1000);
			var D = o.D;// || RL.cubicBezier(0, 0, 1, 1, epsilon);



			//  ONCE
			//  LIKE NORMAL, QUIT AFTER 1

			//  LOOP
			//  AFTER 1, MODULO TO 1

			//  PING PONG
			//  AFTER 1, COUNT BACK DOWN TO 0
			//  THEN IF (int)pr % 2 === 0 COUNT UP, ELSE COUNT DOWN
			switch(o.type) {
				case "once":
					if(pr > 1) pr = 1;
					o.step(D(pr));
					if(pr === 1) {
						// this.toRemove.push(this);
						rea(o.Tg,this);
					}

				break;
				case "loop":
					o.step(D(pr % 1));
					if(option.tm && pr > o.tm) 
						rea(o.Tg,this);
				break;
				case "pingpong":
					if(pr > 1) {
						if(Fl(pr) % 2 === 0)
							o.step(D(pr % 1));
						else o.step(1 - D(pr % 1));
					} else o.step(D(pr));
					if(o.tm && pr > o.tm * 2) 
						rea(o.Tg,this);
				break;
			}
		}

		//  ADD EASING TO OBJECTS ARRAY, CREATING IT IF NECERLARY
		if(o.Tg.ease && o.Tg.ease !== null) {
			//  REMOVE ANY OLD EASINGS ON THE SAME VALUE
			if(o.Tg.ease.indexOf({type:o.V,aNm:aNm}) !== -1)
				o.Tg.ease.splice(o.Tg.ease.indexOf({type:o.V,aNm:aNm}),1);
			//  PUSH EASING TO OBJECT
			o.Tg.ease.push({type:o.V,aNm:aNm});
		}
		//  CREATE ARRAY ON OBJECT WITH EASING IN IT
		else o.Tg.ease = [{type:o.V,aNm:aNm}];
		var ths = this;
		function rea(Tg,easing) {
			Tg.cLb = o.cLb;
			Tg.toRemove = easing;
			ths.toRemove.push(Tg);
		};
	}

	Nm8.prototype.removeEasing = function(Tg,easing) {

		//  REMOVE FROM OBJECT'S ARRAY
		Tg.ease.splice(Tg.ease.indexOf(Tg.toRemove),1);
		Tg.toRemove = undefined;
		//  REMOVE FROM GAME'S ARRAY IF NECERLARY
		
		if(Tg.ease.length === 0) {

			this.eA.splice(this.eA.indexOf(Tg),1);

		}
		//  CALL CALLBACK FUNCTION IF NECERLARY
		if(Tg.cLb !== undefined) {

			Tg.cLb(Tg);
			Tg.cLb = undefined;
		}
	};

	Nm8.prototype.movePiece = function(sprite,x,y,dr,type,cLb) {

		var count = 0;
		var type = type || function(X){return X*X*(3-2*X)}
		// var dr = dr || 500;
		// var epsilon = (1000/60/dr)/4;
		if(y !== sprite.y) {
			count++;
			this.aV(sprite,"y",sprite.y,y,
						type,
						// RL.cubicBezier(0.5,0.5,1,1,epsilon),
						dr,function(){
							count--;
							done();
						});
		}
		if(x !== sprite.x) {
			count++;
			this.aV(sprite,"x",sprite.x,x,
						// RL.cubicBezier(0.5,0.5,1,1,epsilon),
						type,
						dr,function(){
							count--;
							done();
						});
		}
		var done = function() {

			if(cLb && count === 0)
				cLb(sprite);
		}
		// if(RL.eA.indexOf(sprite) !== -1)
			// RL.eA.splice(RL.eA.indexOf(sprite),1);
		// this.eA.push(sprite);

	};

	function TxO(tX,x,y,lineWidth,textAlign,colour) {
		var T = this;
		T.tX = tX;
		T.x = x;
		T.y = y;
		T.colour = colour || "rgb(30,30,30)";
		T.alpha = 1;
		T.textAlign = textAlign || "left";
		T.font = U*0.75+"px 'avenirnext-bold','droid sans'";
		T.lineWidth = lineWidth;
		T.strokeStyle = "white"
		T.visible = true;
		T.w = 0;
		T.lh = 0;
	};

	TxO.prototype.render = function(dR) {
		var T = this;
		if(T.visible) {
			dR.save();

			if(T.alpha < 1)
				dR.globalAlpha = T.alpha;

			dR.font = T.font;
			dR.textAlign = T.textAlign;
			Fs(T.colour);
			dR.lineWidth = T.lineWidth;
			Ss(T.strokeStyle);
			if(T.w === 0) {
				dR.fillText(T.tX,T.x,T.y);
				if(T.lineWidth > 0)
					dR.strokeText(T.tX,T.x,T.y);
			}
			else wT(dR,T.tX,T.x,T.y,T.w,T.lh)
			
			dR.restore();
		}

	};


	function Ac(){};
	Ac.prototype.init = function(gM,x,y,type,w) {
		var T = this;

		T.gM = gM;

		T.type = type;
		T.dead = false;


		//  POSITION AND SIZE
		T.x = x*U || 0;
		T.y = y*U || 0;
		T.w = w*U || U;
		T.h = w*U || U;

		T.yOff = 0;

		//  ROTATION, ALPHA, VISIBILITY, AND SCALE
		T.alpha = 1;
		T.visible = true;

		T.H = 0.33;
		T.S = 0.03;
		T.L = 0.2;

		T.colour;
		T.alpha = 1;

		T.moving = false;

		T.gx = x;
		T.gy = y;

		T.vx = 0;
		T.vy = 0;
		T.speed = M_S;

		T.dir = "";
		T.nextDir = "";
		T.lastDir = "E";

		T.portal = "";

		T.zIndex = T.gy*3 + 2;
		if(T.gM)
			T.gM.sprites.push(T);
	};

	Ac.prototype.render = function(dR) {
		var T = this;
		dR.save();
		if(T.visible) {
			if(T.alpha < 1)
				dR.globalAlpha = T.alpha;

			Dr[T.type](dR,T.x,T.y,T.w,T);
			

			switch(T.portal) {
				case "left":
					Dr[T.type](dR,T.x-23*U,T.y,T.w,T);
				break;
				case "right":
					Dr[T.type](dR,T.x+23*U,T.y,T.w,T);
				break;
			}
		}

		dR.restore();

	};

	Ac.prototype.update = function() {
		this.gx = Fl(this.x / U);
		this.gy = Fl(this.y / U);

	};

	Ac.prototype.Colour = function() {
		return hTr(this.H,this.S,this.L,1);
	};

	Ac.prototype.fadeIn = function() {
		this.fading = true;
		var ths = this;
		NM8.aV(this,"H",0.33,0.67,function(X){return Math.pow(Math.sin(X*Math.PI/2),2);},400);
  		NM8.aV(this,"S",0.03,0.2,function(X){return Math.pow(Math.sin(X*Math.PI/2),2)},400);
  		NM8.aV(this,"L",0.2,0.7,function(X){return Math.pow(Math.sin(X*Math.PI/2),2)},400,function() {
  			ths.fading = false;
  		});
  		this.lit = true;
	};

	Ac.prototype.fadeOut = function() {
		this.fading = true;
		var ths = this;
		NM8.aV(this,"H",0.67,0.33,function(X){return Math.pow(Math.sin(X*Math.PI/2),2);},400);
  		NM8.aV(this,"S",0.2,0.03,function(X){return Math.pow(Math.sin(X*Math.PI/2),2)},400);
  		NM8.aV(this,"L",0.7,0.2,function(X){return Math.pow(Math.sin(X*Math.PI/2),2)},400,function() {
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

	Ac.prototype.AI = function() {
		var T = this;

		if(!T.moving && (T.path === undefined || T.path.length === 0)) {
			var ply = T.gM.Pl;
			switch(T.aiType) {
				case "follow":
					T.path = T.gM.bestPath(T,ply);
				break;
				case "cutOff":
					var Gr = Cg(T.gM.map);
					Gr[ply.gy][ply.gx] = 0;

					if(ply.dir !== "" && dS(T,T.gM.Pl) > 4
					&& Gr[ply.gy+directions[ply.dir].y] !== undefined
					&& Gr[ply.gy+directions[ply.dir].y][ply.gx+directions[ply.dir].x] !== undefined) {
						T.path = T.gM.bestPath(T,{gx:ply.gx+directions[ply.dir].x,
															 gy:ply.gy+directions[ply.dir].y},Gr);
					}
					else T.path = T.gM.bestPath(T,ply);
				break;
				case "patrol":
					if(dS(T,T.gM.Pl) < 5) {
						T.path = T.gM.bestPath(T,ply);
					} else {

						if(T.patrolNumber === undefined)
							T.patrolNumber = random(0,3,true);

						T.path = T.gM.bestPath(T,T.gM.eLocs[T.patrolNumber]);

						if(T.path !== undefined
						&& T.path.length < 1)
							T.patrolNumber = (T.patrolNumber + random(0,3,true)) % T.gM.eLocs.length;
						T.path = T.gM.bestPath(T,T.gM.eLocs[T.patrolNumber]);
					}



				break;
				case "dumb":
					if(dS(T,T.gM.Pl) < 4) {
						T.path = T.gM.bestPath(T,ply);
					} else {

						if(T.Tg === undefined
						|| (T.path !== undefined && T.path.length === 0)) {
							// var rnd = random(0,T.gM.floorCells.length-1,true);
							T.Tg = T.gM.floorCells[Fl(Math.random()*T.gM.floorCells.length-1)];
							
							
						}
						T.path = T.gM.bestPath(T,T.Tg);

						
						if(T.path !== undefined
						&& T.path.length < 1) {
							T.Tg = T.gM.floorCells[Fl(Math.random()*T.gM.floorCells.length-1)];
							T.path = T.gM.bestPath(T,T.Tg);
						}
					}

				break;
			}
			

		}
		if(T.path !== undefined) {
			
			var Nd = T.path[0];

			if(Nd) {
				if(Nd.y < T.gy) T.nextDir = "N";
				if(Nd.x > T.gx) T.nextDir = "E";
				if(Nd.y > T.gy) T.nextDir = "S";
				if(Nd.x < T.gx) T.nextDir = "W";

				
				if(Math.abs(T.gx - Nd.x) !== 1) {
					if(T.gx === 0) T.nextDir = "W";
					if(T.gx === 22) T.nextDir = "E";
				}

				T.path = undefined;
				T.GrMove();
			}
		}
	};

	// Ac.prototype.removeFromGrid = function() {
	// 	var act = this.gM.Gr[this.gy][this.gx].actors;
	// 	act.splice(act.indexOf(this),1);
	// };

	Ac.prototype.GrMove = function(cLb) {
		var T = this;
		
		//  EASING FUNCTION
		var ease = function(x) {return x};
		// var time = 500;
		var time = T.speed;


		//  MAKE SURE WE AREN"T ALREADY MOVING
		if(!T.moving 
		&& (T.dir !== "" || T.nextDir !== "")) {

			T.moving = true;


			
			//  WE"RE NOT MOVING, BUT ARE READY TOO
			if(T.dir === "") {
				T.dir = T.nextDir;
				T.nextDir = "";				
			}

			//  WE WANT TO TURN
			else if(T.dir !== T.nextDir && T.nextDir !== "") {
				//  CHECK TO SEE IF THAT SPACE IS OPEN
				if(T.gM.checkSpace(T.gx+directions[T.nextDir].x,T.gy+directions[T.nextDir].y)) {
					//  IF IT IS, SET IT TO THE DIRECTION WE WANT TO GO

					T.dir = T.nextDir;
				}
				
				
			}
			// T.lastDir = T.dir;
			//  WE"RE MOVING IN THE RIGHT DIRECTION
			// else {
			// 		ease = function(x) {
			// 			return x;
			// 		}
			// }

			//  THE DIRECTION THE ACTOR IS FACING
			// T.dir = n;
			var x = directions[T.dir].x;
			var y = directions[T.dir].y;



			//  IF THE SPACE IT IS GOING TO MOVE ONTO EXISTS AND
			//  ISN"T  A WALL
			if(T.gM.checkSpace(T.gx+x,T.gy+y)) {

				T.lastDir = T.dir;


	
				//  THE OLD COORDINATES
				var ogx = T.gx;
				var ogy = T.gy;

				var dx = T.gx + x;
				var dy = T.gy + y;

				//  NEW COORDINATES
				T.gx = T.gx + x;
				T.gy = T.gy + y;




				if(T.gx > 22) {
					// T.sprite.x = 0;
					T.gx = 0;
					T.portal = "left";
				}
				else if(T.gx < 0) {
					// T.sprite.x = 22 * U;
					T.gx = 22;
					T.portal = "right";
				} else T.portal = "";

				if(T.type === "Pl")
					NM8.aV(T,"yOff",0,U/8,function(p) { return Math.sin(p*Math.PI); },M_S);

					

					//  MOVE THE PIECE
					// var T = T;
					NM8.movePiece(T,
								  dx*U,
								  dy*U,
								  time, ease,
								  function() {


								  	//  SET ACTOR TO BEING DONE MOVING
								  	T.moving = false;
								  	//  SWITCH THE SPRITES IF IT HASN"T ALREADY BEEN DONE
								  	sWt();
								  	T.x = T.gx *U;
									T.y = T.gy *U;
								  	// Pl.update();
								  	
							  		// && T.type === "ghost") {
								  	// 	// console.log(T.alpha)
								  		
								  	// }
								  	//  TURN ON LIGHT AT SQUARE
								  	if(T.type === "Pl") {
								  		
								  		
								  		// pS([
								  		// 	{ sfx:"step" },
								  		// 	{ sfx:"step", time:0.14 }
								  		// ]);



								  		var tile = T.gM.Gr[T.gy][T.gx].ground;
								  		if(!T.gM.lVc && tile) {
									  		// tile.colour = hTr(1-1/3,0.2,0.7);
									  		// tile.S = 0.2;
									  		// tile.L = 0.7;

									  		

											if(!tile.lit) {
									  			sE(0,SFX.lights);
									  			T.gM.score += 10;

									  			tile.fadeIn();
									  			// tile.H = 0.67;
									  			// tile.S = 0.2;
									  			// tile.L = 0.7;

									  			// NM8.aV(tile,"H",0.33,0.67,function(X){return Math.pow(Math.sin(X*Math.PI/2),2);},400);
										  		// NM8.aV(tile,"S",0.03,0.2,function(X){return Math.pow(Math.sin(X*Math.PI/2),2)},400);
										  		// NM8.aV(tile,"L",0.2,0.7,function(X){return Math.pow(Math.sin(X*Math.PI/2),2)},400);
										  		// NM8.eA.push(tile);

									  			tile.lit = true;
												T.gM.litTiles.push(tile);
											}
											if(T.gM.pS === "P")
										  		tile.litTime = new Date().getTime();
										  	else tile.litTime = T.gM.steps;


									  	}
								  		

								  		if(T.gM.lVc
								  		&& T.gM.Pl.gx === 11
								  		&& T.gM.Pl.gy === 6) {
								  			T.gM.nXl = true;
												// T.gM.PAUSED = true;
												// setTimeout(function(){
													// fade("2000","out",function(){T.gM.init()});
												// },500);
												// T.gM.init();
											// }

											
										}
								  	}

								  	if(cLb) cLb();
								  });


					
					//  IF WE ARE GOING DOWN OR RIGHT, SWITCH SPRITES NOW

					if((x > 0 || y > 0) && T.gx === dx) {
						sWt();
					}

					//  SO WE DON"T SWITCH TWICE
					var switched = false;
					function sWt() {
						if(!switched) {
							if(T.type === "Pl") {
								T.gM.Gr[ogy][ogx].Pl = null;
								T.gM.Gr[T.gy][T.gx].Pl = T;
								T.zIndex = T.gy*3+2;

							} else {
								//  OLD SPOT BECOMES NULL
								T.gM.Gr[ogy][ogx].actors.splice(T.gM.Gr[ogy][ogx].actors.indexOf(T));
								// T.gM.toRemove.push({ghost:T,loc:{x:ogx,y:ogy}});
								//  NEW SPOT GETS THE ACTOR
								T.zIndex = T.gy*3+2;
								// T.gM.Gr[T.gy][T.gx].actors.push(T);
							}
							

						}
						switched = true;
					};
				

			} else {
				T.dir = "";
				T.moving = false;
			}
		} else {
			//  WE"RE MOVING AND WANT TO REVERSE DIRECTIONS
			if((T.dir === "S" && T.nextDir === "N")
			|| (T.dir === "N" && T.nextDir === "S")
			|| (T.dir === "E" && T.nextDir === "W")
			|| (T.dir === "W" && T.nextDir === "E")) {
				T.dir = T.nextDir;

			}
		}
	};


	function Wp(gM) {
		var T = this;
		T.gM = gM;
		T.visible = false;
		T.alpha = 1;
		T.type = "";
		T.x = 0;
		T.y = 0;
		T.Tg = null;
		T.FIRING = false;
	};

	Wp.prototype.render = function(dR) {
		dR.save();
		dR.lineWidth = 4;
		if(this.alpha < 1)
			dR.globalAlpha = this.alpha;
		if(this.visible) {

			switch(this.type) {
				case "laser":
					if(this.Tg)
						Dr[this.type](dR,
											this.x,
											this.y,
											this.Tg.x*U + U/2,
											this.Tg.y*U + U/4);
				break;
				case "proxy":
					Dr[this.type](dR,
										this.x,
										this.y,
										this.radius*U);
				break;
			}
		}
		
		dR.restore();
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
		tW:[
			["b"],
			["m",0.2,1],
			["l",0.25,0.3],
			["bt",0.25,0.24,0.7,0.24,0.75,0.3],
			["l",0.8,1]
		],
		brick:[
			["b"],
			["m",0.1,0.25],
			["bt",0.3,0.11,0.8,0.11,0.9,0.2],
			["bt",1,0.3,1,0.8,0.9,0.9],
			// ["l",0.9,0.9],
			["bt",0.8,0.8,0.1,0.8,0.1,0.95],
			["bt",0,0.8,0,0.2,0.1,0.25],
			// ["l",0.1,0.9],


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
			["l",0.833,0.85],
			["l",0.667,1.1],
			["l",0.5,0.9],
			["l",0.333,1.1],
			["l",0.167,0.85]
		],
		// eye1:[
		// 	["b"],
		// 	["m",0.1,0.5],
		// 	["bt",0.1,0.3,0.45,0.35,0.45,0.5],
		// 	["bt",0.4,0.6,0.1,0.6,0.1,0.5]
		// ],
		eye2:[
			["b"],
			["m",0.1,0.5],
			["bt",0.1,0.4,0.45,0.4,0.45,0.52],
			["bt",0.45,0.6,0.1,0.65,0.1,0.5]
		],
		eye3:[
			["b"],
			["m",0.1,0.48],
			["bt",0.1,0.4,0.4,0.38,0.45,0.53],
			["bt",0.43,0.63,0.1,0.65,0.1,0.48]
		],
		eye4:[ //  FOLLOWER - MEDIUM ANGRY EYES
			["b"],
			["m",0.1,0.45],
			["bt",0.15,0.4,0.45,0.4,0.45,0.6],
			["bt",0.3,0.6,0.1,0.6,0.1,0.45]
		],
		eye5:[ //  CUTOFF - MORE ANGRY
			["b"],
			["m",0.1,0.4],
			["l",0.4,0.5],
			// ["bt",0.2,0.4,0.3,0.4,0.4,0.5],
			["bt",0.4,0.66,0.1,0.68,0.1,0.4]
		],
		hatW:[
			["b"],
			["m",0,0.45],
			["l",0.4,0.4],
			["l",0.9,0.1],
			["l",0.85,0.6],
			["l",1,0.9],
			["q",0.7,1,0.3,0.7],
			["l",0.45,0.55],
			["l",0.1,0.6],
			// ["c"]
		],
		hatE:[
			["b"],
			["m",1,0.45],
			["l",0.6,0.4],
			["l",0.1,0.1],
			["l",0.15,0.6],
			["l",0,0.9],
			
			["q",0.55,0.95,1,0.45],
			// ["c"]
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
		cloakS: [
			["b"],
			["m",0,1],
			["bt",-0.1,0.9,0,0.6,0,0.5],
			["bt",0.1,0.4,0.9,0.5,1,0.4],
			["bt",1,0.6,0.85,0.8,1.1,1],
			["bt",0.85,1.1,0.1,1.1,0,1],

			// ["c"]
		],
		cloakD: [
			["b"],
			["m",-0.1,1],
			["bt",0.1,0.9,0.15,0.2,0,0.4],
			["bt",0.1,0.4,0.35,0.45,0.45,0.55],
			["l",0.45,1.1],
			["bt",0.45,1.15,0,1,0,1],
			["c"]
			// ["m",1,1],
			// ["l",1,0.5],
			// ["l",0.55,0.5],
			// ["l",0.55,1],
			// ["l",1,1],


			// ["l",1,0.5],
			// ["l",1,1],
			// ["c"]
		],
		cloakU: [
			["b"],
			["m",-0.1,1],
			["bt",0.1,0.9,0.15,0.2,0,0.4],
			["bt",0.1,0.4,0.35,0.45,0.5,0.55],

			["bt",0.65,0.5,0.9,0.4,1,0.4],
			["bt",0.85,0.2,0.9,0.9,1.1,1],
			// ["bt",,,,,-0.1,1]
			// ["q",0.5,-0.1,1]
			["q",0.5,1.2,-0.1,1]
			// ["c"]
		],
		staff:[
			["b"],
			["m",0.1,0.7],
			["l",0.6,0.4],
			["bt",0.6,0.3,0.9,0.1,1,0.2],
			["bt",1,0.3,0.3,0.6,0.2,0.8],
			["q",-0.12,0.85,0.1,0.7]
		],
		staffShadow:[
			["b"],
			["m",0.6,0.4],
			["q",1.05,0.18,0.75,0.275]


		],

		pacman:[
			["b"],
			["m",0.5,0.5],
			["l",0.8,0.4],
			["bt",0.8,0.1,0.2,0.1,0.2,0.5],
			["bt",0.2,0.9,0.8,0.9,0.8,0.6],
			["c"]
		],
		arrow:[
			["b"],
			["m",0,0.75],
			["l",0.8,0.55],
			["l",0.8,0.45],
			["l",0,0.25],
			["c"]

		],
		speaker:[
			["b"],
			["m",0,0.7],
			["l",0,0.3],
			["l",0.3,0.3],
			["l",0.7,0],
			["q",1.1,0.5,0.7,1],
			["l",0.3,0.7],

			["c"]

		]
	};

	function dRPath(dR,Ps,x,y,S,R) {
		if(S === undefined) S = 4;
		// S *= U;
		var g;
		dR.save();
		dR.translate(x,y);
		if(R) {
			dR.translate(U,0);
			dR.scale(-1,1);
			x *= -1;
		}


		for(var i in Ps) {
			var P = Ps[i];
			switch(P[0]) {
				case "b":
					dR.beginPath();
				break;
				case "c":
					dR.closePath();
				break;


				case "m":
					dR.moveTo(P[1]*S,P[2]*S);
				break;
				case "l":
					dR.lineTo(P[1]*S,P[2]*S);
				break;
				case "a":
					dR.arc(P[1]*S,P[2]*S,P[3]*S,P[4],P[5],P[6])
				break;
				case "at":
					dR.arcTo(P[1]*S,P[2]*S,P[3]*S,P[4]*S,P[5]*S);
				break;
				case "q":
					dR.quadraticCurveTo(P[1]*S,
										  P[2]*S,
										  P[3]*S,
										  P[4]*S);
				break;
				case "bt":
					dR.bezierCurveTo(P[1]*S,P[2]*S,P[3]*S,P[4]*S,P[5]*S,P[6]*S);
				break;

			};
		}
		dR.restore();
	};

	var Dr = {
		Pl: function(dR,x,y,w,actor) {
			y -= actor.yOff + U/4;



			Fs("black");
			// dR.globalAlpha = 1;
			dR.beginPath();
			dR.arc(x+U/2,(y+U*0.45)-Fl(U/4),(w*0.95)/2,0,Math.PI*2);
			dR.fill();

			

			// dR.beginPath();
			// dR.arc(x+U/2,(y+U/2)-Fl(U/4),(w*0.98)/2,0,Math.PI*2);
			// dR.fill();

			Dr["eye"](dR,x,y,w,actor);

			dR.save();
			
			//  CLOAK
			Fs("blue");
			Ss("gold");
			dR.lineWidth = U/10;

			switch(actor.lastDir) {
				case "E":
					dRPath(dR,art['cloakS'],x,y,w*0.9,true);
				break;
				case "W":
					dRStaff(true);
					dRPath(dR,art['cloakS'],x+U/20,y,w*0.9);
				break;
				case "N":
					dRStaff(true);
					dRPath(dR,art['cloakU'],x+U/20,y,w*0.9);
				break;
				case "S":
					dRPath(dR,art['cloakD'],x+U/20,y,w*0.9);
					dR.fill();
					dR.stroke();
					dRPath(dR,art['cloakD'],x-U/20,y,w*0.9,true);
				break;
			}
			dR.fill();
			dR.stroke();
			if(actor.lastDir === "E" || actor.lastDir === "S")
				dRStaff();


			//  HAT
			Fs("yellow");
			var grd;
			switch(actor.lastDir) {
				case "E":
					dRPath(dR,art['hatE'],x-U/4,y-U*0.85,w*1.5);
					dR.fill();

					grd = dR.createRadialGradient(x+U*0.1,y-U*0.4,0,x+U*0.1,y-U*0.4,w);

					dRPath(dR,art['hatE'],x-U/4,y-U*0.85,w*1.5);
					// dR.fillRect(0,0,720,480)
					
				break;
				case "W":
					dRPath(dR,art['hatW'],x-U/4,y-U*0.85,w*1.5);
					dR.fill();

					grd = dR.createRadialGradient(x+U*0.9,y-U*0.4,0,x+U*0.9,y-U*0.4,w);
					dRPath(dR,art['hatW'],x-U/4,y-U*0.85,w*1.5);
				break;
				case "N":
					dRPath(dR,art['hatU'],x-U*0.28,y-U*0.85,w*1.6);
					dR.fill();

					grd = dR.createRadialGradient(x+U*0.5,y-U*0.38,0,x+U*0.5,y-U*0.38,w);
					dRPath(dR,art['hatU'],x-U*0.28,y-U*0.85,w*1.6);
				break;
				case "S":
					dRPath(dR,art['hatD'],x-U*0.28,y-U*0.95,w*1.6);
					dR.fill();

					grd = dR.createRadialGradient(x+U*0.5,y-U*0.4,0,x+U*0.5,y-U*0.4,w);
					dRPath(dR,art['hatD'],x-U*0.28,y-U*0.95,w*1.6);
				break;
			}
			
			grd.addColorStop(0,"rgba(0,0,0,0)");
			grd.addColorStop(0.5,"rgba(0,0,0,0.4)");
			grd.addColorStop(1,"rgba(0,0,0,0)");
			Fs(grd);
			dR.fill();

			
			function dRStaff(R) {
				dR.save();
				Fs("brown");
				dRPath(dR,art['staff'],x,y-U/4,w*1.5,R);
				dR.fill();
				Ss("rgba(0,0,0,0.5)");
				dR.lineWidth = U/30;
				dRPath(dR,art['staffShadow'],x,y-U/4,w*1.5,R);
				dR.stroke();
				dR.restore();
			};

			dR.restore();
		},


		ghost: function(dR,x,y,w,actor) {
			y-= actor.yOff + U/9;
			// var colour = actor.colour;
				// dir = actor.dir;
			//  DRAW GHOST SHAPE AND FILL IT
			Fs(actor.colour);
			dRPath(dR,art['ghost'],x,y,w);
			dR.fill();

			//  DRAW GHOST SHAPE AND GIVE IT A GRADIENT
			dRPath(dR,art['ghost'],x,y,w);
			var grd = dR.createRadialGradient(x+w/2,y,w/2,x+w/2,y+w,w/2);
			grd.addColorStop(0,"rgba(0,0,0,0)");
			grd.addColorStop(1,"rgba(0,0,0,0.2)");
			Fs(grd);
			dR.fill();
			Dr["eye"](dR,x,y,w,actor);

			// var blink = Math.random() < 0.01 ? true : false;

			

			// Fs("white");
			// dRPath(dR,art['eye1'],x,y-U/4);
			// dR.fill();
			// dRPath(dR,art['eye1'],x,y-U/4,1,true);
			// dR.fill();
			// dR.fillRect(x,y-Fl(U/2),w,h);
			// dR.beginPath();
			// dR.moveTo
		},
		eye: function(dR,x,y,w,actor) {

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
					// 	Fs("black");
					// 	dRPath(dR,art['blink'],x+U/2,y-U/4);
					// 	dR.fill();

					// } else {

						Fs("white");
						dRPath(dR,art[eye],x+U/2,y-U/4,w);
						dR.fill();

						Fs("black");
						dR.beginPath();
						dR.arc(x+4.8*U/6,y+U*0.25,U/15,0,2*Math.PI);
						dR.fill();
					// }


				break;
				case "S":
					Fs("white");
					dRPath(dR,art[eye],x,y-U/4,w);
					dR.fill();
					dRPath(dR,art[eye],x,y-U/4,w,true);
					dR.fill();

					Fs("black");
					dR.beginPath();
					dR.arc(x+4.3*U/6,y+U*0.26,U/15,0,2*Math.PI);
					// dR.fill();

					// dR.beginPath();
					dR.arc(x+1.7*U/6,y+U*0.26,U/15,0,2*Math.PI);
					dR.fill();
				break;
				case "W":
					Fs("white");
					dRPath(dR,art[eye],x-U/2,y-U/4,w,true);
					dR.fill();

					Fs("black");
					dR.beginPath();
					dR.arc(x+1.2*U/6,y+U*0.25,U/15,0,2*Math.PI);
					dR.fill();
				break;
			}
		},
		energy: function(dR,x,y,w,actor) {
			w += actor.yOff;
			// Fs("SeaShell");
			var grd = dR.createRadialGradient(x+U/2,y+U/2-Fl(U/8),0,x+U/2,y+U/2-Fl(U/8),w*0.25);
			grd.addColorStop(0,"rgba(255,255,255,1)");
			grd.addColorStop(1,"rgba(64,200,200,0)");
			Fs(grd);
			dR.beginPath();
			dR.arc(x+U/2,y+U/2-Fl(U/8),w*0.3,0,Math.PI*2);
			dR.fill();
		},
		laser: function(dR,x1,y1,x2,y2) {
			dR.lineWidth = U /3;
			Ss("rgba(64,200,200,0.5)");

			dR.beginPath();
			dR.moveTo(x1,y1);
			dR.lineTo(x2,y2);
			dR.stroke();
			dR.lineWidth = U /6;
			Ss("turquoise");
			dR.stroke();
		},
		proxy: function(dR,x,y,r) {
			dR.lineWidth = U /6;

			var grd = dR.createRadialGradient(x+U/2,y+U/4,U/3,x+U/2,y+U/4,U);
			grd.addColorStop(0,"rgba(255,255,255,0)");
			grd.addColorStop(1,"rgba(64,200,200,1)");
			Fs(grd);


			Ss("turquoise");
			dR.beginPath();
			dR.arc(x+U/2,y+U/4,r,0,Math.PI*2);
			dR.stroke();

			
			dR.fill();
		},




		wall: function(dR,x,y,w) {
			Fs(wC);

			dR.fillRect(x,y-Fl(U/2),w,w+Fl(U/2));
			// if(mobile)
			// 	Fs("rgba(0,0,0,0.2)");
			// else {
				var grd = dR.createLinearGradient(x,y,x,y+w);
				grd.addColorStop(0,"rgba(0,0,0,0.2)");
				grd.addColorStop(1,"rgba(0,0,0,0.6)");
				Fs(grd);
			// }
			dR.fillRect(x,y,w,w);
		},
		wall2: function(dR,x,y,w) {
			Fs(wC);
			dR.fillRect(x,y-Fl(U/2),w,w);
			
		},
		stairs: function(dR,x,y,w) {

			Fs(wC);
			dR.fillRect(x,y-w/6,w,w+w/6);
			Fs("rgba(0,0,0,0.2)");
			dR.fillRect(x,y+w/6,w,w/6);
			dR.fillRect(x,y+3*(w/6),w,w/6);
			dR.fillRect(x,y+5*(w/6),w,w/6);
			
		},
		
		floor: function(dR,x,y,w,sprite) {
			// Fs(colour());
			// dR.save();
			Fs(sprite.Colour());//hTr(sprite.H,sprite.S,sprite.L,1));
			dR.fillRect(x,y,w,w);
			// if(!mobile) {
				var grd = dR.createRadialGradient(x+w/2,y+w/2,0,x+w/2,y+w/2,w/1.1);

				grd.addColorStop(1,"rgba(0,0,0,0.2)");
				grd.addColorStop(0,"rgba(0,0,0,0)");
				
				Fs(grd);

				dR.fillRect(x,y,w,w);
			// }

			// dR.restore();

		},
		tW: function(dR,x,y,w,sprite) {
			// w;
			Ss("rgba(0,0,0,0.7)");
			Fs("darkslategray");
			dRPath(dR,art['crown'],x,y,w);
			dR.fill();
			dR.stroke();

			dR.save()

			dR.globalAlpha = 0.2;
			Fs("black");
			dRPath(dR,art['ellipse'],x,y,w);
			dR.fill();

			dR.restore();
			
			Fs("darkslategray");
			dRPath(dR,art['tW'],x,y,w);
			dR.fill();
			dR.stroke();


			
		},
		cloud: function(dR,x,y,w) {
			// w;

			dRPath(dR,art['cloud'],x,y,w);
			var grd = dR.createRadialGradient(x+w/2,y+w*0.8,0,x+w/2,y+w*0.8,w/4);
			grd.addColorStop(0,"rgba(170,170,170,1)");
			grd.addColorStop(0.7,"rgba(180,180,180,0.7)");
			grd.addColorStop(1,"rgba(255,255,255,0.0)");
			Fs(grd);

			// dRPath(dR,art['cloud'],x,y,w);
			// // var grd = dR.createLinearGradient(x+w.2,y+w);
			// grd.addColorStop(0,"rgba(200,200,255,1)");
			// grd.addColorStop(0.8,"rgba(255,255,255,0.7)");
			// grd.addColorStop(1,"rgba(255,255,255,0.0)");
			// Fs(grd);

			
			dR.fill();
		},
		pacman: function(dR,x,y,w) {
			// dR.beginPath();
			Fs("yellow");
			dR.lineWidth = U * 0.1;
			Ss("steelblue");
			dRPath(dR,art["pacman"],x,y,w)
			dR.fill();
			dR.stroke();

		},

	};





    //  BLOCK TYPES
    var bases = [

        //  SINGLE
        [ [0,0,0],
          [0,1,0],
          [0,0,0] ],

        //  END CAPS
        [ [0,1,0],
          [0,1,0],
          [0,0,0] ],

        //  ACROSS
        [ [0,0,0],
          [1,1,1],
          [0,0,0] ],

        //  CORNERS
        [ [0,1,0],
          [0,1,1],
          [0,0,0] ],

        //  INTERSECTIONS
        [ [0,1,0],
          [1,1,1],
          [0,0,0] ],

        [ [0,1,0],
          [1,1,1],
          [0,1,0] ],

        //  ADDITIONAL PIECES FOR MAP MAKING

        [ [1,0,0],
          [1,1,1],
          [0,0,0] ],

        [ [0,0,0],
          [1,1,1],
          [1,0,0] ],

        [ [0,0,0],
          [0,1,1],
          [1,1,0] ],

        [ [0,0,0],
          [1,1,0],
          [0,1,1] ]


    ];
    //  EACH BLOCK IN EACH NECESSARY ROTATION
    var blocks = [
            bases[0],
            bases[1],
            rot(bases[1],1),
            rot(bases[1],2),
            rot(bases[1],3),
            bases[2],           // 5
            rot(bases[2],1),
            bases[3],
            rot(bases[3],1),
            rot(bases[3],2),
            rot(bases[3],3),    //10
            bases[4],
            rot(bases[4],1),
            rot(bases[4],2),
            rot(bases[4],3),
            bases[6],           //15
            rot(bases[6],1),
            rot(bases[6],2),
            rot(bases[6],3),
            bases[7],
            rot(bases[7],1),    //20
            rot(bases[7],2),
            rot(bases[7],3),
            bases[8],
            rot(bases[8],1),
            rot(bases[8],2),    //25
            rot(bases[8],3),
            bases[9],
            rot(bases[9],1),
            rot(bases[9],2),
            rot(bases[9],3),    //30
            bases[5],
    ];

    //  HOW TO TELL WHICH BLOCK WE NEED FROM ITS NEIGHBOUR PROFILE
    var legend = {
        "0000":0,
        "1000":1,
        "0001":2,
        "0010":3,
        "0100":4,
        "0101":5,
        "1010":6,
        "1100":7,
        "1001":8,
        "0011":9,
        "0110":10,
        "1101":11,
        "1011":12,
        "0111":13,
        "1110":14,
        "1111":31
    };


   





    function Maps() {};

    Maps.prototype.makeMap = function() {        

        //  MAKE A MAP OF ZEROES
        Gr = eG(6,6);
        //  THE NUMBER THAT WILL BE PUT IN THE GRID
        this.copyNumber = 2;
        //  WHEN DONE
        this.done = false;

        //  FULL SIZED MAP
        map = eG(21,13);

        Gr[5][3] = 1;
        // debugGrid(Gr);

        //  ESSENTIALLY I AM TAKING RANDOM TETRIS PIECES AND TESTING EVERY LOCATION IN THE GRID
        //  TO SEE WHICH HAS THE HIGHEST SCORE BY BEING LOWEST ON THE GRID, AND PUTTING IT THERE.
        //  THEN I TURN IT SIDEWAYS AND MIRROR IT AND DRAW PATHS AROUND ALL THE PIECES ON A BIGGER GRID

        while(!this.done) {

             //  RANDOMIZE A PIECE
            var piece = blocks[sR(5,31,true)];
            // debugGrid(piece);

            // BEST SCORE
            var bestScore = {score:0};

            //  EACH POSITION ALONG THE GRIDS WIDTH
            for(var w= -2,wL=Gr[0].length; w<wL; w++) {
            // for(var w=0,wL=1; w<wL; w++) {
                //  FOR EACH POSSIBLE ROTATION OF THAT PIECE
                for(var r=0; r<4; r++) {
                    var p = rot(piece,r);

                    //  FOR EACH POSITION ALONG THE HEIGHT OF THE GRID
                    for(var h=0,hL=Gr[0].length; h<hL; h++) {
                        var valid = true;
                        //  SCORE
                        var score = 0;
                        //  FOR EACH GRID SPACE IN THE PIECE
                        for(var y=0,yL=p.length; y<yL; y++) {
                            //  IF THIS ROW IS UNDEFINED, CONTINUE
                            if(Gr[h+y] === undefined) continue;

                            for(var x=0,xL=p[0].length; x<xL; x++) {
                                //  IF THIS COLUMN IS UNDEFINED, CONTINUE
                                // if(Gr[h+y][w+x] === undefined) continue;
                                //  COMPARE THAT VALUE TO THE ONE ON THE GRID

                                if(p[y][x] === 1) {
                                    if(Gr[h+y][w+x] !== 0)
                                        valid = false;

                                    else score += y+h;
                                }
                            }
                        }
                        if(!valid) continue;

                        if(score > bestScore.score) {
                            bestScore = {
                                score: score,
                                x:w,
                                y:h,
                                r:r
                            }

                        }

                    }
                }         
            }
            
            if(bestScore.score > 0) {

                var p = rot(piece,bestScore.r)
                // debugGrid(p);
                for(var y=0; y<3; y++) {
                    if(Gr[y+bestScore.y] === undefined) continue;
                    for(var x=0; x<3; x++) {
                        if(Gr[y+bestScore.y][x+bestScore.x] !== undefined
                        && p[y][x] === 1)
                            Gr[y+bestScore.y][x+bestScore.x] = this.copyNumber;
                    }
                }
                this.copyNumber++;
                // if(this.copyNumber>9) this.copyNumber = 1;
            } else {
                // debugGrid(Gr);
                this.done = true;
            }



        }
// debugGrid(Gr);
        //  CUT OFF TOP 3 LINES.  THEY WERE ONLY THERE TO FILL UP MORE
        Gr.splice(0,1);
// debugGrid(Gr);
        //  CUT CORNERS TO MAKE ROUNDISH
        // Gr[0][0] = Gr[0][width-1] = 0//Gr[0][1] = Gr[0][width-2] = Gr[1][0] = Gr[1][width-1] = 0;

        //  MIRROR THE GRID
        for(var y=Gr.length-1; y>=0; y--) {

            // var t = [];
            // for(var i=0,iL=width; i<iL; i++)
                // t.push(0);
            Gr.push([]);
            for(var i=0,iL=Gr[y].length; i<iL; i++) {
                Gr[Gr.length-1].push(Gr[y][i] * 10);
                if(Gr[y][i] === 1) Gr[Gr.length-1][i] = 1;

            }
        }
        // debugGrid(Gr);

        //  ROTATE
        Gr = rot(Gr,1);
        // debugGrid(Gr);
        //  SPLICE OUT A MIDDLE COLUMN
        //  IT HAD TO STAY SQUARE BEFORE FOR THE rot() FUNCTION
        // for(var i=0,iL=Gr.length; i<iL; i++)
        //     Gr[i].splice(Fl(Gr[0].length/2),1);


        
        // debugGrid(map);

        
        //  FOR EACH SPOT IN THE GRID
        for(var y=0,yL=Gr.length; y<yL; y++) {
            for(var x=0,xL=Gr[0].length; x<xL; x++) {
        // for(var y=0,yL=1; y<yL; y++) {
        //     for(var x=0,xL=Gr[0].length; x<xL; x++) {

                var val = Gr[y][x];
                if(val > 0) {
                    
                    //  GET NEIGHBOURHOOD
                    var neigh = "";
                    check( x,   y-1 );
                    check( x+1, y   );
                    check( x,   y+1 );
                    check( x-1, y   );

                    function check(x,y) {
                        if(Gr[y] !== undefined
                        && Gr[y][x] !== undefined
                        && Gr[y][x] === val) neigh += 1;
                        else neigh += 0;
                    };
                    //  COMPARE WITH LEGEND
                    var piece = blocks[legend[neigh]];

                    //  PLACE UP TO 9 NUMBERS ON MAP
                    for(var h=0,hL=3; h<hL; h++) {
                        for(var w=0,wL=3; w<wL; w++) {
                            if(piece[h][w] === 1)
                                map[y*2+h][x*2+w] = 0;
                            else map[y*2+h][x*2+w] = 1;
                        }
                    }
                }
        // debugGrid(map);

            }

        }


//  ADD ZEROES AROUND EDGES
        for(var i=0,iL=map.length; i<iL; i++) {
            map[i].unshift(0);
            map[i].push(0);
        }

        var line = [];
        for(var i=0,iL=map[0].length; i<iL; i++)
            line.push(0);
        map.unshift(line);
        map.push(line);



        
        var possibleLocations = [];

        for(var i=2,iL=map.length-2; i<iL; i++) {
            
            if(map[i][1] !== 0) {

                
                possibleLocations.push(i);
            }
        }
        var rand = possibleLocations[sR(0,possibleLocations.length-1,true)];

        map[rand][0] = 1;
        map[rand][map[0].length-1] = 1;

        // debugGrid(map);

        //  POSSIBLE LOCATIONS TO PLACE ENERGY PICKUPS
        var tLocs = [];
        var bLocs = [];
        for(var y=0; y<4; y++) {
            for(var x=0; x<4; x++) {
                if(map[y][x] === 1) {

                    tLocs.push({x:x,y:y});
                }

                if(map[map.length-1-y][x] === 1) {

                    bLocs.push({x:x,y:map.length-1-y})
                }
            }
        }
        var rnd1 = sR(0,bLocs.length-1,true);

        var tLoc = tLocs[sR(0,tLocs.length-1,true)];
        var bLoc = bLocs[sR(0,bLocs.length-1,true)];

        

        // var map2 = Cg(map);
        // debugGrid(map2);

        //  FOR EACH CELL IN THE MAP

        //  CHECK IF ITS A 0

        //  IF IT IS, FIND ALL NEIGHBOURS RECURSIVELY AND ADD TO OBJECT

        return {
            Pt:[
                {x:0,y:rand,to:{x:map[0].length-1,y:rand}},
                {x:map[0].length-1,y:rand,to:{x:0,y:rand}}
            ],
            eLocs:[
                {x:tLoc.x, y:tLoc.y, gx:tLoc.x, gy:tLoc.y},
                {x:bLoc.x, y:bLoc.y, gx:bLoc.x, gy:bLoc.y}
            ],
            map:map
        };

    };



    //  ROTATE A SQURE GRID (b) 90 DEGREES CCW
    function rot(G,I) {

        //  i, x AND y ITERATORS
        var i,
            x,
            y,
            g = Cg(G);
            //  RESULT
            r = [];

        // debugGrid(g);

        for(i=0; i<I; i++) {
            //  EMPTY THE RESULT, IT GETS REUSED
            r = [];
            //  ITERATE OVER 3x3 GRID, MAKING A NEW ONE
            //  WITH THE SAME NUMBERS, BUT IN DIFFERENT SPOTS
            for(y in g[0]) {
                r.push([]);
                for (x in g) {

                    r[y].push(g[x][g[0].length-y-1]);
                }
            }
            g = Cg(r);
        }

        return g;

    };


	function Game(Cn,pS) {
		var T = this;

		T.Cn = Cn;
		T.pS = pS;





		T.score = 0;

		var tX = {};
		tX.score = new TxO("SCORE: ",U*0.25,U*0.5,U/40);

		tX.highScore = new TxO("HIGH SCORE: "+highScore,U*22.5,U*0.5,U/40,"right");
		// tX.highScore.textAlign = "right";

		tX.charges = new TxO("CHARGES: ",U*0.25,U*14.5,U/40);
		// tX.charges.lineWidth = U/40;

		tX.gO = new TxO("GAME OVER!",11.5*U,T.Cn.height/2,U/40,"center","rgb(60,60,60)");
		tX.gO.font = U*2+"px 'avenirnext-bold','droid sans'";
		tX.gO.visible = false;
		tX.gO.alpha = 0;
		
		tX.cG = new TxO("Congratulations!",11.5*U,U*6.5,U/40,"center","rgb(60,60,60)");
		tX.cG.font = U*2+"px 'avenirnext-bolditalic','droid sans'";
		tX.cG.visible = false;

		tX.cG2 = new TxO("You've beat you're high score!",11.5*U,U*8.5,U/40,"center","rgb(60,60,60)");
		tX.cG2.font = U+"px 'avenirnext-bold','droid sans'";
		tX.cG2.w = U*16;
		tX.cG2.lh = U;
		tX.cG2.visible = false;
		T.tX = tX;

		T.init(1);
		// var T = T;
		

		T.steps = 0;
		T.READY = pS === "P";


		// cT.keys.esc.down = function() {
		// 	if(!T.PAUSED) T.PAUSED = true;
		// 	else T.PAUSED = false;
		// };
		cT.keys.space.down = function() {
			T.fireWp("laser");
		};
		//  CHECK FOR CONTROLS
		cT.keys.up.down = function() { move("N"); }
		cT.keys.right.down = function() { move("E"); }
		cT.keys.down.down = function() { move("S"); }
		cT.keys.left.down = function() { move("W"); }
		cT.keys.up.held = function() { move("N"); }
		cT.keys.right.held = function() { move("E"); }
		cT.keys.down.held = function() { move("S"); }
		cT.keys.left.held = function() { move("W"); }
		bTs = [];
		var W = Cn.width;
		var H = Cn.height;
		
		T.exit = {x:W - U*0.75,
					  y:0,
					  w:U*0.75,
					  h:U*0.75,
					  down:function(){
						  toCover();
						},
					};
					// console.log(T.exit);
		bTs.push(T.exit);
		// if(mobile) {
		// 	T.bTs = [];
		// 	T.bTs.push({x:0,
		// 				  y:0,
		// 				  w:W* 0.2,
		// 				  h:H,
		// 				  down:function(){
		// 					  move("W");
		// 					},
		// 				  held:function(){
		// 					  move("W");
		// 					}
		// 				});
		// 	T.bTs.push({x:W*0.2,
		// 				  y:0,
		// 				  w:W*0.6,
		// 				  h:W*0.2,
		// 				  down:function(){
		// 					  move("N");
		// 					},
		// 				  held:function(){
		// 					  move("N");
		// 					}
		// 				});
		// 	T.bTs.push({x:W*0.2,
		// 				  y:H-W*0.2,
		// 				  w:W*0.6,
		// 				  h:W*0.2,
		// 				  down:function(){
		// 					  move("S");
		// 					},
		// 				  held:function(){
		// 					  move("S");
		// 					}


		// 				});
		// 	T.bTs.push({x:W-W*0.2,
		// 				  y:0,
		// 				  w:W*0.2,
		// 				  h:H,
		// 				  down:function(){
		// 					  move("E");
		// 					},
		// 				  held:function(){
		// 					  move("E");
		// 					}


		// 				});

		// 	T.bTs.push({x:W*0.2,
		// 				  y:W*0.2,
		// 				  w:W*0.6,
		// 				  h:H-W*0.4,
		// 				  down:function(){
		// 				  	T.fireWp("laser");}
		// 				});

		// 	for(var i in T.bTs)
		// 		bTs.push(T.bTs[i]);
		// }
		function move(dir) {

			if(T.pS === "P"
			|| (T.pS === "R" && !T.Pl.moving)) {


				T.Pl.nextDir = dir;
				T.READY = true;
				T.steps++;
			}
		};
		// function ready() {
		// 	for(var i=0,iL=T.ghosts.length; i<iL; i++) {
		// 		if(T.ghosts[i].moving)
		// 			return false
		// 	}
		// 	if(T.Pl.moving)
		// 		return false;
		// 	return true;
		// };


	};

	Game.prototype.init = function(lv) {
		var T = this;
		wC = hTr(random(0,1),0.9,0.4,1);

		if(lv) seq = lv;

		// var T = T;



		// NM8.eA = [];
		// T.tX.gO.alpha = 0;
		// T.tX.gO.visible = false;
		T.PAUSED = true;

		T.lVc = false;
		T.nXl = false;
		T.GAME_OVER = false;
		T.steps = 0;

		T.FP = [];

		

		T.sprites = [];

		T.Ep = [];
		T.charges = 0;

		// T.weapon = new Wp();
		// T.weapon.visible = false;

		// T.sprites.push(T.weapon);

		T.heap = new bH(function(Nd){return Nd.zIndex;});

		


		
		// cT.keys.space.up = function() {T.init(seq++);};
		T.PAUSED = true;
		
		fade(2000,"out",function(){
			T.PAUSED = false;
		});
		

		

		T.mapMaker = new Maps();
		//  19,11  is stable
		//  23,13
		//  23,15
		T.Map = T.mapMaker.makeMap(19,13);
		T.map = T.Map.map;
		T.Pt = T.Map.Pt;
		T.eLocs = T.Map.eLocs;

		// T.map = T.mapMaker.makeMap(20,13);
		// T.map = T.mapMaker.makeMap(23,15);
		// debugGrid(map);

		
		T.litTiles = [];


		T.WAIT = 1;
		T.MOVE = 2;
		T.state = 1;

		if(T.buildGrid(T.map)) {
			// T.camera = new Camera(T);
			// T.camera.initCam(0,0);
			T.centreTile = T.Gr[6][11].walls;


			T.Pl = pool.nX();
			T.Pl.init(T,11,7,"Pl");
			T.Pl.nextDir = "E";



			T.lastEnemy = new Date().getTime();
			T.enemyPeriod = 10000;
			T.ghostTypes = [
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
			
			T.ghosts = [];
			// T.toRemove = [];
			T.addEnemy();

			//  MAKE ENERGY PELLETS ON LEFT
			for(var i=0,iL=T.eLocs.length; i<iL; i++) {
				var eL = T.eLocs[i];
				var energy = pool.nX();
				energy.init(T,eL.x,eL.y,"energy");
				energy.zIndex = eL.y*3 + 1;
				NM8.aV(energy,"yOff",0,U/10,function(X){return X*X*(3-2*X)},400,undefined,"pingpong");
				T.Ep.push(energy);
				T.sprites.push(energy);
				// T.Gr[eL.y][eL.x].actors.push(energy);
			}

			//  MAKE ENERGY PELLETS ON THE RIGHT AND TELL eLocs ABOUT THEM
			for(var i=0,iL=T.eLocs.length; i<iL; i++) {
				var eL = T.eLocs[i];
				var energy = pool.nX();
				energy.init(T,T.Gr[0].length-1-eL.x,eL.y,"energy");
				energy.zIndex = eL.y*3 + 1;
				T.eLocs.push({x:T.Gr[0].length-1-eL.x,y:eL.y,gx:T.Gr[0].length-1-eL.x,gy:eL.y});
				NM8.aV(energy,"yOff",0,U/10,function(X){return X*X*(3-2*X)},400,undefined,"pingpong");
				T.sprites.push(energy);
				T.Ep.push(energy);
				// T.Gr[eL.y][eL.x].actors.push(energy);
			}
			// debugGrid(T.map);

		}
	};

	

	Game.prototype.fireWp = function(type) {
		var T = this;
		// wC = hTr(random(0,1),0.9,0.4,1);
		T.weapon = new Wp();
		var wpn = T.weapon;

		// T.sprites.push(T.weapon);
		var pl = T.Pl
		// var wpn = new Wp();
		T.sprites.push(wpn);

		var deadGhosts = [];

		//  IF WE HAVE ANY CHARGES
		if(T.charges > 0 && !wpn.FIRING) {
			wpn.FIRING = true;

			sE(0,SFX.sS);

			wpn.visible = true;
			wpn.type = type;
			wpn.zIndex = pl.zIndex;

			switch(type) {
				case "laser":

					var cObj = {x:0,y:0,w:0,h:0};
					//  GET THE LINE AHEAD OF US
					switch(pl.lastDir) {
						case "N":

							cObj.x = pl.x;
							cObj.w = U;
							for(var i=1,iL=pl.gy+1; i<iL; i++) {
								//  AS LONG AS WE FIND AN OPEN SPACE IN THIS DIRECTION
								if(T.map[pl.gy-i][pl.gx] === 1)
									cObj.h += U;
								else {
								//  FOUND A CLOSED SPACE
									cObj.y = pl.y - cObj.h;
									wpn.Tg = {x: pl.gx, y: pl.gy - i}

									break;
								}
							}
						break;
						case "E":
							cObj.x = pl.x;
							cObj.y = pl.y;
							cObj.h = U;

							for(var i=1,iL=T.map[0].length-pl.gx; i<iL; i++) {
								if(T.map[pl.gy][pl.gx+i] === 1)
									cObj.w += U;
								else {
									wpn.Tg = {x: pl.gx + i, y: pl.gy}
									break;
								}
							}
						break;
						case "S":
							cObj.x = pl.x;
							cObj.y = pl.y;
							cObj.w = U;
							for(var i=1,iL=T.map.length-pl.gy; i<iL; i++) {

								if(T.map[pl.gy+i][pl.gx] === 1)
									cObj.h += U;
								else {
									
									wpn.zIndex = (pl.gy+i) * 3 - 2;

									wpn.Tg = {x: pl.gx, y: pl.gy + i}
									break;
								}
							}
						break;
						case "W":
							cObj.y = pl.y;
							cObj.h = U;
							for(var i=1,iL=pl.gx+1; i<iL; i++) {
								if(T.map[pl.gy][pl.gx-i] === 1)
									cObj.w += U;
								else {
									cObj.x = pl.x - cObj.w;
									wpn.Tg = {x: pl.gx - i, y: pl.gy}
									break;
								}
							}
						break;
						
					}

					
					wpn.x = pl.x + U/2;
					wpn.y = pl.y + U/4;

					for(var i in T.ghosts) {
						if(T.ghosts[i]) {

							if(bC(cObj,T.ghosts[i]))

								deadGhosts.push(T.ghosts[i]);
						}
					}
					// wpn.Tg = cellsToRoast[cellsToRoast.length-1];
					fade(300,"out",function() {
							wpn.visible = false;
							wpn.FIRING = false;
							// T.Tg = null;
						},wpn);
					// NM8.aV(wpn,"alpha",1,0, function(X){return X*X*(3-2*X)},300,
					// 	function() {
					// 		wpn.visible = false;
					// 		wpn.FIRING = false;
					// 		// T.Tg = null;
					// 	});
					// NM8.eA.push(wpn);

				break;

				case "proxy":


					for(var i in T.ghosts) {
						if(dS({x:pl.x,y:pl.y},T.ghosts[i]) < 2.5*U)
							deadGhosts.push(T.ghosts[i]);
					}


					//  WEAPON DRAWING
					wpn.x = pl.x;
					wpn.y = pl.y;
					wpn.zIndex = pl.zIndex;
					NM8.aV(wpn,"radius",0.1,2.5, function(X){return X*X*(3-2*X)},300,
						function() {
							// T.Tg = null;
						});
					fade(300,"out",function() {
							wpn.visible = false;
							wpn.FIRING = false;
							// T.Tg = null;
						},wpn);
					// NM8.aV(wpn,"alpha",1,0, function(X){return X*X*(3-2*X)},300,
					// 	function() {
					// 		wpn.visible = false;
					// 		wpn.FIRING = false;
					// 		// T.Tg = null;
					// 	});
					// NM8.eA.push(wpn);

				break;
			}

			//  KILL GHOSTS
			for(var i in deadGhosts) {
				T.score += 100;


				var ghost = deadGhosts[i];
				ghost.dead = true;
				
				T.removeEnemy(ghost);
				// ghost.removeFromGrid();

				

				// for(var j=0,jL=T.Gr[cell.y][cell.x].actors.length; j<jL; j++) {

				// 		T.removeEnemy(T.Gr[cell.y][cell.x].actors[j]);
				// }
			}
			

			//  USE A CHARGE
			T.charges -= 1;


		} 
		// else {
		// 	console.log("your wand fizzles")
		// }
		
	};

	

	Game.prototype.addEnemy = function() {
		var T = this;
		if(T.ghostTypes.length > 0) {
			var ghost = T.ghostTypes.splice(0,1)[0];
			var type = ghost.type;
			var colour = hTr(random(0,1),0.8,0.55,0.85);
			var ghost = pool.nX();
			ghost.init(T,11,5,"ghost");
			ghost.path = T.bestPath(ghost,T.Pl);
			ghost.aiType = type;
			ghost.colour = colour;
			ghost.alpha = 0;
			var ths = T;
			ghost.speed = M_S * 1.3;
			fade(700,"in",function() {ths.ghosts.push(ghost)},ghost);
			NM8.aV(ghost,"yOff",0,U/8,function(X){return X*X*(3-2*X)},400,undefined,"pingpong");
			// NM8.aV(ghost,"alpha",0,1, function(X){return X*X*(3-2*X)},700,
			// 	function() {ths.ghosts.push(ghost)});
			// NM8.eA.push(ghost);
			// (Tg, value, from, to, D, dr, cLb, type, tm)
			
			// T.ghosts.push(ghost)
		}
	};

	Game.prototype.removeEnemy = function(enemy) {
		var T = this;

		//  TAKE HIM OUT OF this.ghosts IMMEDIATELY TO STOP COLLISION
		for(var i in T.ghosts) {
			var gh = T.ghosts[i];
			if(enemy.aiType === gh.aiType) {
				//  RE QUEUE THE GHOST FOR "BIRTH"
				if(!T.lVc)
					T.ghostTypes.push({
						type:enemy.aiType,
						colour:enemy.colour
					});

				//  FADE HIM OUT
				fade(700,"out",function() {
						var act = enemy.gM.Gr[enemy.gy][enemy.gx].actors;
						act.splice(act.indexOf(enemy),1);
						enemy.visible = false;
					},enemy);
				// NM8.aV(enemy,"alpha",1,0, function(X){return X*X*(3-2*X)},700,
				// 	function() {
				// 		var act = enemy.gM.Gr[enemy.gy][enemy.gx].actors;
				// 		act.splice(act.indexOf(enemy),1);
				// 		enemy.visible = false;
				// 	});
				T.ghosts.splice(T.ghosts.indexOf(enemy),1);
				// T.toRemove.push(T);
				// T.sprites.splice(T.ghosts.indexOf(enemy),1);
			}

		}
		

		
		// NM8.eA.push(enemy);
		
		
	};

	Game.prototype.buildGrid = function(lvGrid) {
		var T = this;
		T.Gr = [];
		T.floorCells = [];
		for(var y=0,yL=T.map.length; y<yL; y++) {
			T.Gr.push([]);
			for(var x=0,xL=T.map[0].length; x<xL; x++) {
				var obj = {
					stairs: null,
					ground: null,
					Pl: null,
					actors: [],
					walls: null
				};

				//  WALL TILES
				if(T.map[y][x] === 0) {
					//  THE CENTRE TILE GETS STAIRS BENEATH IT
					if(y===6 && x===11) {

						var S = pool.nX();
						S.init(T,x,y,"stairs");

						S.gx = x;
						S.gy = y;

						S.zIndex = y*3;
						S.visible = false;

						T.stairs = S;


					}

					var W = pool.nX();
					W.init(T,x,y,"wall");
					if(T.pS === "R")
						W.alpha = 0;
					if(T.map[y+1] !== undefined
					&& T.map[y+1][x] === 0)
						W.type = "wall2";
					W.zIndex = y*3;
					obj.walls = W;

					
				}

				//  FLOOR TILES
				if(T.map[y][x] === 1) {
					var G = pool.nX()
					G.init(T,x,y,"floor");

					if(T.pS === "R")
						G.alpha = 0;
					G.lit = false;
					G.litTime = null;

					G.gx = x;
					G.gy = y;
					obj.ground = G;
					
					T.floorCells.push(G);
					G.zIndex = y*3;
				}

				T.Gr[y].push(obj);

			}

		}
		T.floorTileCount = T.floorCells.length;

		return true;
	};

	Game.prototype.update = function() {
		var T = this;
		
		// var T = T;

		
			


		//  FINDS THE PATH TO THE STAIRS AFTER A LEVEL IS COMPLETE
		function FP() {
			if(T.lVc) {

				T.FP = T.bestPath(T.Pl,T.centreTile);
				for(var i=T.litTiles.length-1; i>=0; i--) {
					var tile = T.litTiles[i];
					tile.light = false;
				}

				if(T.FP.length > 0) {
					for(var i=0,iL=T.FP.length; i<iL; i++) {
						var Nd = T.FP[i];
						var tile = T.Gr[Nd.y][Nd.x].ground;
						
						if(tile) {
							tile.light = true;
							T.litTiles.push(tile);
						}


					}
					
				}
				for(var i=T.litTiles.length-1; i>=0; i--) {
					var tile = T.litTiles[i];
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
var ths = this;
		//  CHECK IF ALL FLOOR TILES ARE LIT
		if(!T.lVc 
		&& T.litTiles.length === T.floorTileCount) {
			if(!T.lVc) {
				sE(0,SFX.lv);
				T.score += 10000;
				T.stairs.visible = true;
				T.sprites.push(T.stairs);
				for(var i=T.ghosts.length-1; i>=0; i--) 
					T.removeEnemy(T.ghosts[i]);
				setTimeout(function() {
					for(var i in ths.litTiles) {
						var tile = ths.litTiles[i];
						// tile.fadeOut();
						tile.H = 0.67;
						tile.S = 0.7;
						tile.L = 0.2;
					}
					ths.litTiles = [];
				},500);
				

				T.lVc = true;
				T.centreTile.visible = false;
				T.Gr[T.centreTile.gy][T.centreTile.gx].walls = null;
				T.map[T.centreTile.gy][T.centreTile.gx] = 1;

			}
		}


			if(T.lVc && T.nXl) {
				T.lVc = false;
				T.nXl = false;

			// 	if(T.Pl.gx === 11 && T.Pl.gy === 6) {
			// 		// var T = T;
				T.PAUSED = true;
				setTimeout(function(){
					fade("2000","in",function(){
						for(var i in T.sprites)
							pool.free(T.sprites[i]);
						// pool.free(T.Pl);
						T.init()
					});
				},500);
		// 		// T.init();
			}

		if(!T.PAUSED) {
			if(T.pS === "R") {
	  			for(var i in T.ghosts) {
		  			var ghost = T.ghosts[i];
		  			// if(T.isVisible(ghost)) {
						var dir = ghost.vis ? "in" : "out";
				  		if((ghost.alpha === 1 && dir === "out")
				  		|| (ghost.alpha === 0 && dir === "in"))
					  		fade(200,dir,undefined,ghost);
		  			// }
		  		}
	  		}

			//  UPDATE SCORE TEXT OBJECT
			T.tX.score.tX = "SCORE: " + T.score;
			T.tX.charges.tX = "CHARGES: " + T.charges;

			//  CHECK COLLISION WITH GHOSTS
			for(var i in T.ghosts) {

				var gh = T.ghosts[i];
				if(gh) {
					if(bC(T.Pl,gh,C_B)) {

						if(T.charges > 0) {

							T.fireWp("proxy");
						}
						else T.gO();
					}
				}
			}

			//  CHECK COLLISION WITH ENERGY PELLETS
			var toSplice = [];
			for(var i in T.Ep) {
				var pellet = T.Ep[i];
				if(dS({x:pellet.x,y:pellet.y},T.Pl) < U) {
					sE(0,SFX.powerUp);
					T.charges += 1;
					toSplice.push(pellet);
					pellet.visible = false;
				}
			}
			for(var i in toSplice)
				T.Ep.splice(T.Ep.indexOf(toSplice[i]),1);
		
			//  IF IT'S NOT PAUSED
			if(T.READY) {
				if(T.pS === "R") {

					// T.steps++;
					T.READY = false;

				}
								
				//  CHECK IF WE NEED TO ADD ANOTHER GHOST
				if(!T.lVc 
				&& (T.ghostTypes.length > 0
				&& ((T.pS === "P" && new Date().getTime() > T.lastEnemy + T.enemyPeriod))
					|| (T.pS === "R" && T.steps%40 === 39))) {

					T.lastEnemy = new Date().getTime();
					T.addEnemy();
				}

				//  MOVE PLAYER
				T.Pl.GrMove(FP);


				//  MOVE GHOSTS
				for(var i in T.ghosts) {
					T.ghosts[i].AI();
				}
					


				

				for(var i=T.sprites.length-1; i>=0; i--) {
					if(!T.sprites[i].visible)
						T.sprites.splice(i,1);
				}
			}
		}

	};
//  GAME OVER
	Game.prototype.gO = function() {
		var T = this;
		sE(0,SFX.death);

		T.GAME_OVER = true;
		NM8.eA = [];
		T.ghosts = [];

		if(T.score > localStorage.WIZARD_TOWER_HIGH_SCORE) {
			localStorage.WIZARD_TOWER_HIGH_SCORE = T.score;
			highScore = T.score;
			T.tX.highScore.tX = "HIGH SCORE: " + highScore;
			
			T.tX.cG.alpha = 0;
			T.tX.cG.visible = true;
			fade(1000,"in",null,T.tX.cG);
			// NM8.aV(T.tX.cG,"alpha",0,1,function(X){return X*X*(3-2*X)},1000);
			// NM8.eA.push(T.tX.cG);
			
			T.tX.cG2.alpha = 0;
			T.tX.cG2.visible = true;
			fade(1000,"in",null,T.tX.cG2);
			// NM8.aV(T.tX.cG2,"alpha",0,1,function(X){return X*X*(3-2*X)},1000);
			// NM8.eA.push(T.tX.cG2);

		} else {
			//  TURN ON GAME OVER TEXT
			T.tX.gO.visible = true;
			fade(1000,"in",null,T.tX.gO);
			// NM8.aV(T.tX.gO,"alpha",0,1,function(X){return X*X*(3-2*X)},1000);
			// NM8.eA.push(T.tX.gO);
			// console.log("gM over");
		}
		

		


		// playString("0,,0.1133,,0.59,0.29,,0.12,-0.16,0.6,0.28,0.34,,0.1263,,,,,1,,,,,0.43");
		T.PAUSED = true;
		setTimeout(function(){
			fade("2000","in",toCover)
		},2000);
		
	};

	// Game.prototype.isPortal = function(x,y) {
	// 	for(var i=0,iL=this.Pt.length; i<iL; i++) {
	// 		var portal = this.Pt[i];
	// 		if(x === portal.x
	// 		&& y === portal.y)

	// 	}
	// };

	Game.prototype.checkSpace = function(x,y) {
		if(this.Gr[y][x] === undefined)
			return true;
		if(this.Gr[y] !== undefined 
		&& this.Gr[y][x] !== undefined
		&& this.Gr[y][x].walls === null)
			return true;
	};

	Game.prototype.bestPath = function(from,to,Gr) {
		var map = Gr || this.map;

		if(from !== undefined && to !== undefined) {
			var oP = {
				diagonal:false,
				Pt: this.Pt
			};
			var gR = new Graph(map,oP);
			var start = gR.Gr[from.gy][from.gx];

			var end = gR.Gr[to.gy][to.gx];

			var path = As.search(gR,start,end,oP);
			return path;
		}
	};


	Game.prototype.isVisible = function(S) {
		var gx = Fl(S.x/U),
			gy = Fl(S.y/U);

		// if(this.map[gy][gx] === 0)
		// 	return true;

		var l = line(gx, gy,
					this.Pl.gx,
					this.Pl.gy);

		for(var i=1,iL=l.length; i<iL; i++) {
			if(this.map[l[i].y][l[i].x] === 0) {
				if(S.type === "ghost")
					S.vis = false;
				return false;
			}
		}
		if(S.type === "ghost") {
			S.vis = true;
		} else {
			if(S.alpha < 1-(i-2)/10)
				S.alpha = 1-(i-2)/10;
			
		}
		S.seen = true;
		return true;
	};
	
		
		

	Game.prototype.render = function(dR) {
		dR.save();
		dR.translate(XOFF,YOFF);
		dR.beginPath();
		dR.rect(0,-U,23*U,16*U);
		dR.clip();

		for(i in this.sprites) {
			var S = this.sprites[i];
			if(this.pS === "R") {
				
					this.isVisible(S);
				if(S.seen) {
					this.heap.push(S);
				}
			} else this.heap.push(S);
		}
		for(var i=0,iL=this.heap.size(); i<iL; i++) {
			this.heap.pop().render(dR);
		}
		// for(var i in this.ghosts)
		// 	this.ghosts[i].seen = false;

		// Fs("blue");
		// dR.fontWeight = "bold";
		// dR.font = Fl(U*0.75)+"px 'arial black','avenirnext-bold','droid sans'";

		for(var i in this.tX)
			this.tX[i].render(dR);



		
        
        dR.restore();

		

  //       if(mobile && !this.GAME_OVER) {
	 //    	dR.save();

		// 	for(var i=0,iL=this.bTs.length; i<iL; i++) {
		// 		var b = this.bTs[i];
		// 		// dR.globalAlpha = 0.007;
		// 		Fs("rgba(255,255,255,0.1)");
		// 		dR.lineWidth = 4;
		// 		Ss("rgba(255,255,255,0.2)");
		// 		dR.strokeRect(b.x,b.y,b.w,b.h);
		// 		dR.fillRect(b.x,b.y,b.w,b.h);

		// 	}

		// 	dR.restore();
		// }
		// else if(!mobile) {
			// Fs("red");
			// dR.fillRect(this.exit.x,this.exit.y,this.exit.w,this.exit.h);
			dR.fontWeight = "bold";
			dR.font = Fl(U*0.75)+"px 'arial black','avenirnext-bold','droid sans'";
			Fs("darkslategray");
			dR.fillText("x",this.exit.x,this.exit.y+U*0.6);
		// }
			

		
	};

		

	


	function Cover(Cn) {
		var T = this;
		this.Cn = Cn;
		// sE(0,SFX.lv);
		if(Sn === 1)
			pS([
				{sfx:"Sn",8:220},
				{sfx:"Sn",8:440},
				{sfx:"Sn",8:392},
				{sfx:"Sn",8:349.23},

				{sfx:"Sn",8:311.13,3:2},
				// {sfx:"Sn",8:440},
				// {sfx:"Sn",8:392},
				// {sfx:"Sn",8:349.23},

				// {sfx:"Sn",8:220},
				// {sfx:"Sn",8:466.16},
				// {sfx:"Sn",8:415.30},
				// {sfx:"Sn",8:369.99},

				// {sfx:"Sn",8:220},
				// {sfx:"Sn",8:466.16},
				// {sfx:"Sn",8:415.30},
				// {sfx:"Sn",8:369.99}
			],0.9);

		// pS([
  // 			{ sfx:"step" },
  // 			{ sfx:"step", time:0.5 }
  		// ]);


		this.tW = pool.nX();
		this.tW.init(null,5.5,3.5,"tW",13);


		this.clouds = [];
		this.backClouds = [];
		var deadClouds = [];

		this.pacman = pool.nX();
		this.pacman.init(null,2,6,"pacman",5.5);


		for(var i=0,iL=16; i<iL; i++) {

			var rnd = random(1,9,true),
				w = 13 + rnd;
			if(i>8) {
				rnd = random(5,13,true);
				w = 11 + rnd;
			}
			 
			var	cloud = pool.nX();
			cloud.init(null,(i%8)*6-10,6-rnd,"cloud",w);
			rnd = random(5,10);

				NM8.aV(cloud,"x",cloud.x,cloud.x+U,function(X){return X*X*(3-2*X);},rnd*1000,undefined,"pingpong");

			if(i<8)
				this.clouds.push(cloud);
			else 
				this.backClouds.push(cloud);

		}


		//  ARE WE SITUATED PROPERLY
		this.oriented = true;//!mobile || orientation === 90 ? true : false;

		// //  ADD EVENT LISTENER
		// if(!this.oriented) {
		// 	addEventListener("orientationchange",reorient,false);
		// 	function reorient() {
		// 		if(orientation === 90)
		// 			location.reload();
		// 	};
		// }

		var W = Cn.width;
		var H = Cn.height;
		bTs = [];
		bTs.push({x:W/10,
					  y:H/2.5,
					  w:W/5,
					  h:W/5,
					  down:function(){
					  	fade(300,"in",function(){
							beginGame("P");
					  	});
					  	
					  }
					});
		bTs.push({x:W/10 * 7,
					  y:H/2.5,
					  w:W/5,
					  h:W/5,
					  down:function(){
					  	fade(300,"in",function(){
							beginGame("R");
					  	});
					}
					});
		bTs.push({x:0,
					  y:H - W/8,
					  w:W/8,
					  h:W/8,
					  time:0,
					  down:function(){
					  	this.time = new Date().getTime();
					  	if(seed > 1)
						  	seed-=1;
						localStorage.SEED = seed;
					  },
					  held:function(){
						  if(new Date().getTime() > this.time +200) {
						  	if(seed > 11)
							  	seed-=10;
							else seed = 1;
						  }
						  localStorage.SEED = seed;
					  	
					  }
					});
		bTs.push({x:W/8,
					  y:H - W/8,
					  w:W/8,
					  h:W/8,
					  time:0,
					  down:function(){
					  	this.time = new Date().getTime();
					  	seed += 1;
					  	localStorage.SEED = seed;
					  },
					  held:function(){
					  	if(new Date().getTime() > this.time +200)
						  	seed += 10;
						localStorage.SEED = seed;
					  }
					});
		bTs.push({x:W/8*7,
					  y:H - W/8,
					  w:W/8,
					  h:W/8,
					  down:	toggleSound
					  
					});

		fade(300,"out");

	};

	// Cover.prototype.update = function() {
	// 	// var ths = this;
	// 	// for(var i in this.deadClouds) {

	// 	// 	var cloud = this.deadClouds[i];
	// 	// 	cloud.x = -U*10;

	// 	// 	NM8.aV(cloud,"x",cloud.x,this.Cn.width + 10*U,function(X){return X},12000,function(){
	// 	// 		ths.deadClouds.push(cloud);
	// 	// 	});
	// 	// 	NM8.eA.push(cloud);

	// 	// 	this.clouds.push(cloud);

	// 	// }
	// 	// this.deadClouds = [];
	// 	if(mobile) {

	// 	}
		
	// };

	Cover.prototype.render = function(dR) {
		dR.save();
		// Fs("midnightblue");
		var grd = dR.createLinearGradient(0,0,0,this.Cn.height*1.1);
		grd.addColorStop(1,"black");
		grd.addColorStop(0,"midnightblue");
		Fs(grd);

		dR.fillRect(0,0,this.Cn.width,this.Cn.height);
		


		if(this.oriented) {

			dR.font = U*2.4+"px 'arial black','avenirnext-bold','droid sans'";
			Fs("red")
			var tX = "WIZARD  TOWER!",
			xLoc = this.Cn.width/2 - dR.measureText(tX).width/2;

			dR.fillText(tX, xLoc, this.Cn.height/4);
			dR.lineWidth = U*0.1;
			Ss("orange");
			dR.strokeText(tX, xLoc, this.Cn.height/4);



			//  DRAW CLOUDS IN THE BACK
			for(var i in this.backClouds)
				this.backClouds[i].render(dR);

			//  DRAW @ SYMBOL
			// dR.lineWidth = 4;
			Ss("steelblue");
			Fs("yellow");
			dR.font = 4*U+"px 'arial black','avenirnext-bold','droid sans'";
			dR.fillText("@",17.5*U,10*U);
			dR.strokeText("@",17.5*U,10*U);


			//  DRAW PACMAN
			this.pacman.render(dR);

			
			//  DRAW THE TWOER
			this.tW.render(dR);

			//  DRAW THE FRONT CLOUDS
			for(var i in this.clouds)
				this.clouds[i].render(dR);

			//  WRITING AT THE BOTTOM

			

			Fs("rgba(200,0,0,1)");
			// Fs("red");

			dR.font = U+"px 'arial black','avenirnext-bold','droid sans'";
			dR.textAlign = "middle";
			dR.fillText("A Rogue/Pac-like",7.3*U,13*U);
			dR.font = 0.75*U+"px 'arial black','avenirnext-bold','droid sans'";
			dR.fillText("JS13K 2015, KeithK",7.8*U,14*U);



			Fs("black");
			dR.font = U*0.75+"px 'arial black','avenirnext-bold','droid sans'";
			// dR.textAlign = "middle";
			dR.fillText("Seed: "+seed,1.5*U,13.5*U);

			Fs("black");
			Ss(	dRPath(dR,art["arrow"],3.5*U,13.5*U,U*2));
			dR.fill();
			dR.stroke();
			dRPath(dR,art["arrow"],1.5*U,13.5*U,U*2,true);
			dR.fill();
			dR.stroke();

			Ss("slategray");
			Ss("cyan")
			dRPath(dR,art["speaker"],21.5*U,13.5*U,U*2);
			// dR.fill();
			dR.stroke();




		} else {
			dR.font = U+"px futura";
			Fs("red")
			dR.textAlign = "center";
			var tX = "Please rotate your device",
			xLoc = this.Cn.width/2;

			wT(dR,tX, xLoc, this.Cn.height/4, this.Cn.width * 0.8, U);
		}

		// for(var i in bTs) {
		Ss("rgba(255,255,255,0.6)");
		// 	dR.strokeRect(bTs[i].x,bTs[i].y,bTs[i].w,bTs[i].h);
		// }

		dR.restore();
	};








//--------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------
    // localStorage.clear();

window.AudioContext = window.AudioContext || window.webkitAudioContext;

// // create a new Web Audio API context
	var actx = new AudioContext();

if(localStorage.WIZARD_TOWER_HIGH_SCORE === undefined)
    localStorage.WIZARD_TOWER_HIGH_SCORE = 0;
	var highScore = localStorage.WIZARD_TOWER_HIGH_SCORE;




	var Cn = document.createElement("canvas");    

    // var div = document.getElementById("div");

    // div.appendChild(Cn);



    var h = window.innerHeight,
        w = window.innerWidth,
        hs = h/480,
        ws = w/720;
    // if(hs<ws) {
    //     scl = hs;
    //     Cn.style.marginLeft = w/2+"px";
    // } else {
    //     scl = ws;
    //     Cn.style.marginTop = h/2+"px";
    // }
    scl = hs < ws ? hs : ws;

    Cn.height = 480 * scl;
    Cn.width = 720 * scl;
    var offX = (w-Cn.width)/2;
    var offY = (h-Cn.height)/2;

    Cn.style.margin = offY+"px "+offX+"px";


    //     Cn.width  = 960;
    // Cn.height = 640;



    document.body.appendChild(Cn);

    var dR = Cn.getContext("2d");
    function Fs(s) {
    	dR.fillStyle = s;
    }
    function Ss(s) {
    	dR.strokeStyle = s;
    }

    addEventListener("orientationchange",orientationHandler,false);
    function orientationHandler (event) {
        Cn.height = window.innerHeight;
        Cn.width  = window.innerWidth;
    }
    

    //  IF WE'RE ON MOBILE
    // var mobile = false;
    // if(typeof orientation !== 'undefined'){

    //     mobile = true;
    //     // div.syle.height = Cn.height * 2 + "px";
    //     window.top.scrollTo(0,1);
    // }

    //  ANIMATOR
    var NM8 = new Nm8();
    var pool = new OpL(Ac);


    //  UNIT SIZE
    var U = Fl(Math.ceil(Cn.height / 16));
    //  COLLISION BUFFER
    var C_B = 0.2;
    //  MOVE SPEED
    var M_S = 250;
    var XOFF = (Cn.width - U*23) / 2;
    var YOFF = Fl((Cn.height - U*15) * 0.75);
	//  WALL COLOUR
    var wC;
    var Sn = localStorage.MUTE;
    
    if(Sn === undefined) Sn = 1;
    else Sn = parseInt(Sn);

	function toggleSound() {

		if(Sn === 0) Sn = 1;
		else Sn = 0;
		localStorage.MUTE = Sn;
	};


	
    //  GAME STATES
    var COVER = 0,
        PLAY = 1,
        state = 0;

    function beginGame(style) {
        gM = new Game(Cn,style);
        state = PLAY;
        cover = null;

    };

    function toCover() {
        state = COVER;
        gM = null;
    };


    var alpha = 0;
    function fade(dr,dir,cLb,sprite) {
        var f = 1,
            t = 0,
            s = sprite || this;
        if(dir === "in") 
            f = 0, t = 1;
        // switch(dir) {
            // case "in":
                // this.alpha = 1;
                NM8.aV(s,"alpha",f,t,function(X){return X*X*(3-2*X)},dr,function() {
                    if(cLb) cLb();
                });
                // NM8.eA.push(this);
        //     break;
        //     case "out":
        //         // this.alpha = 0;
        //         NM8.aV(this,"alpha",0,1,function(X){return X*X*(3-2*X)},dr,function() {
        //             if(cLb) cLb();
        //         });
        //         // NM8.eA.push(this);
        //     break;
        // }
    };


	// var maps = new Maps();
 //    var map = maps.makeMap(8);



    var colour = "blue";

    //  KEY CONTROLS
    var cT = new CTRL();
    cT.rG("space",32);

    cT.rG("left",37);
    cT.rG("up",38);
    cT.rG("right",39);
    cT.rG("down",40);
    cT.rG("space",32);
    // cT.rG("esc",27);

    
    cT.rG("touch",0,function(){},
                                function(){},
                                function(){});


    

    
    var cover = null;
    var gM = null;
    // var currentTime = 0;
    // var gMTime = new Date().getTime();

    // var fps = {
    //     startTime : 0,
    //     frameNumber : 0,
    //     d: 0,
    //     result: 0,
    //     getFPS : function(){
    //         this.frameNumber++;
    //         d = new Date().getTime();
    //         currentTime = ( d - this.startTime ) / 1000;
    //         result = Fl( ( this.frameNumber / currentTime ) );

    //         if( currentTime > 1 ){
    //             this.startTime = new Date().getTime();
    //             this.frameNumber = 0;
    //         }
    //         return result;

    //     }   
    // };


    // var FPS = 0;

    
    update();
    function update() {
        //  FPS
        // FPS = fps.getFPS();
        // FPS = new Date().getTime() - gMTime;




        requestAnimationFrame(update);

        cT.update();
        NM8.pAnm();
        
        switch(state) {

            case COVER:
                if(cover === null) cover = new Cover(Cn);
                // cover.update();
            break;
            case PLAY:
                // if(gM === null) gM = new Game(Cn);
                gM.update();
            break;
        }

        render();
    }

    function render() {
        // dR.clearRect(0,0,Cn.width,Cn.height);
        Fs("black");
        dR.fillRect(0,0,Cn.width,Cn.height)

        switch(state) {

            case COVER:
                cover.render(dR);
            break;
            case PLAY:
                gM.render(dR);
            break;
        }
        // dR.font = U+"px futura";
        // Fs("blue");
        // dR.fillText(FPS,0,Cn.height);



        // if(mobile) {
        //     // Fs(colour);
        //     Ss("black");



        //     // dR.beginPath();
        //     // dR.rect(10,10,100,100);
            
        //     // dR.stroke();
        //     // dR.fill();
        // }
        if(this.alpha > 0) {
            dR.save();
            dR.globalAlpha = this.alpha;
            Fs("black");
            dR.fillRect(0,0,Cn.width,Cn.height);
            dR.restore();
        }
    }

    

})();