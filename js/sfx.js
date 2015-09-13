(function(definition) {
    /* global module, define */
    if(typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = definition();
    } else if(typeof define === 'function' && define.amd) {
        define([], definition);
    } else {
        var exports = definition();
        window.SFX = exports.SFX;
        window.playSequence = exports.playSequence;
        window.soundEffect = exports.soundEffect;
        
        
    }
})(function() {

	var SFX = {
		// lights: {
	 //        wait: 0,
	 //        attack: 0.04,
	 //        sustainPunch: 0.1,
	 //        sustainTime: 0.4,
	 //        decay: 0.2,
	 //        randomRange: 100,

	 //        tremelo: 50,
	 //        tremAmount: 50,

	 //        freq: 200,
	 //        bend: 0,
	 //        type: "sine",
	 //        volume: 0.3,

	 //        lpCutoff: 200,
	 //        lpSweep: 0,
	 //        hpCutoff: 20,
	 //        hpSweep: 500
	 //    },
	death:[,0.04,0.7,0.3,0.2,100,10,100,350,-100,"sine",0.5,15000,,20,],
	lights: [,0.04,0.1,0.4,0.2,100,50,50,200,,"sine",0.3,200,,20,500],
	powerUp: [,,0.4,0.5,0.1,100,12,80,300,500,"sine",0.7,200,1000,20,],
	shootSound: [,0.01,0.5,0.3,0.1,100,40,40,440,-350,"sawtooth",0.3,6000,-6000,20,],
	step: [0,,,,0.05,100,,,100,,"square",0.05,3000,,20,]

	};

	function playSequence(sequence,tempo) {

		for(var i=0,iL=sequence.length; i<iL; i++) {

			//  ITEM FROM THE SEQUENCE
			var item = sequence[i];
			if(item !== undefined) {
				//  THE SFX IT WANTS TO PLAY
				var sfx = copyObject(SFX[item.sfx]);
				//  OVERRIDE VALUES INCLUDED IN item
				for(var j in item) {

					sfx[j] = item[j];
					// console.log(sfx.freq);
				}

				//  IF A TEMPO IS DEFINED RUN AT THAT
				if(tempo !== undefined)
					soundEffect(tempo*i,sfx);

				//  OTHERWISE EACH ITEM NEEDS A time PROPERTY TO TELL WHEN TO PLAY THEM
				else soundEffect(item.time,sfx);
			}
		}
	};

	function soundEffect(when,oString) {

			var wait = when + oString[0] || 0,
		        attack = oString[1] || 0,
		        sustainPunch = oString[2] || 1,
		        sustainTime = oString[3] || 0,
		        decay = oString[4] || 0,
		        randomRange = oString[5] || 0,

		        tremelo = oString[6] || 0,
		        tremAmount = oString[7] || 0,

		        freq = oString[8] || 220,
		        bend = oString[9] || 0,
		        type = oString[10] || "sine",
		        volume = oString[11] || 1,

		        lpCutoff = oString[12] || 20000,
		        lpSweep = oString[13] || 0,
		        hpCutoff = oString[14] || 0,
		        hpSweep = oString[15] || 0;

	// function soundEffect(options,time) {
	// 	var freq = options.freq,
	// 		volume = options.volume || 1,						//  MASTER VOLUME

	// 		wait = options.wait + time || 0,				//  HOW LONG TO WAIT BEFORE PLAYING

	// 		attack = options.attack || 0,						//  HOW LONG TO ATTACK FOR

	// 		sustainPunch = options.sustainPunch || 0,			//  THE SUSTAIN COMPARED TO INITIAL ATTACK
	// 		sustainTime = options.sustainTime || 0,				//  HOW LONG IT RAMPS DOWN FROM THERE
	// 		decay = options.decay || 0.1,							//  HOW LONG TO KEEP THE CHANNEL OPEN FOR ECHO ETC. (NOT USEFUL FOR MOBILE)
	// 		type = options.type || "sine",						//  TYPE OF WAVEFORM

	// 		tremelo = options.tremelo || 0,
	// 		tremAmount = options.tremAmount || 6,
			

	// 		bend = options.bend ||0,							//  POSITIVE OR NEGATIVE
			
	// 		range = options.randomRange || 0,					//  POSITIVE, THE AMOUNT AROUND freq TO RANDOM BY
			

	// 		lpCutoff = options.lpCutoff || 20000,
	// 		lpSweep = options.lpSweep || 0,

	// 		hpCutoff = options.hpCutoff || 0,
	// 		hpSweep = options.hpSweep || 0

			// dissonance = options.dissonance || 0,				//  ADDITIONAL SAWTOOTHS TO REALLY FUCK THINGS UP
			// dissonantAmount = options.dissonantAmount || 0,			//  HOW MUCH OF THAT NASTY WE NEED
			// echo = options.echo || undefined,					//  DON'T USE FOR MOBILE
			// reverb = options.reverb || undefined;				//  DON'T USE FOR MOBILE
			







		




		var trem = actx.createOscillator(),
			tremDepth = actx.createGain(),
			loPass = actx.createBiquadFilter(),
			hiPass = actx.createBiquadFilter();


		//  CONNECT THE LOW PASS FILTER TO THE HIGH PASS FILTER
		loPass.connect(hiPass);
		//  MAKE IT A LOW PASS FILTER
		loPass.type = "lowpass";
		//  SET CUTOFF FREQUENCY
		loPass.frequency.value = lpCutoff;
		//  SWEEP IT
		fade(loPass.frequency,lpCutoff,lpCutoff + lpSweep, wait, attack + sustainTime + decay);


		//  CONNECT THE HIGH PASS FILTER TO THE HIGH PASS FILTER
		hiPass.connect(actx.destination);
		//  MAKE IT A HIGH PASS FILTER
		hiPass.type = "highpass";
		//  SET CUTOFF FREQUENCY
		hiPass.frequency.value = hpCutoff;
		//  SWEEP IT
		fade(hiPass.frequency,hpCutoff,hpCutoff + hpSweep, wait, attack + sustainTime + decay);

		
		
		//  CREATE THE MAIN OSCILLATOR
		osc = new oscillator(type,freq);

		//  TURN IT ON (ATTACHED TO loPass FILTER)
		osc.play(loPass,wait,wait + attack + sustainTime + decay,1);
		
		//  IF THERE IS A TREMELO, CREATE A SECOND OSCILLATOR
		if(tremelo > 0) {
			trem = new oscillator("sawtooth",tremelo);

			//  TURN IT ON
			trem.play(osc.oscillator.frequency,wait,wait + attack + sustainTime + decay,tremAmount);
		}
		
		//  IF THERE IS AN ATTACK PHASE, FADE THE MAIN OSC IN FROM 0
		if(attack > 0) {
			osc.gain.gain = 0;
			fade(osc.gain.gain,0,volume,wait,attack);
		//  OTHER WISE PRESET THE VOLUME TO MAX
		} else osc.gain.gain = volume;

		//  IF THERE IS A SUSTAIN PHASE, RAMP DOWN TO sustainPunch IN sustainTime AMOUNT OF TIME
		//  THEN RAMP TO 0 IN decay AMOUNT OF TIME
		if(sustainTime > 0) {
			fade(osc.gain.gain,volume,sustainPunch,wait+attack,sustainTime);
			fade(osc.gain.gain,sustainPunch,0,wait+attack+sustainTime,decay)

		//  IF THERE IS NO SUSTAIN PHASE BUT IS A DECAY PHASE, JUST RAMP TO 0 IN decay AMOUNT OF TIME
		} else if(decay > 0) {
			fade(osc.gain.gain,volume,0,wait+attack,decay);
		}

		if(bend !== 0) pitchBend(osc.oscillator);
		// if(echo) addEcho(amp);
		// if(reverb) addReverb(amp);
		// if(dissonance > 0) addDissonance();



		// A WRAPPER FOR OSCILLATORS
		function oscillator(type, frequency, detune){
		    this.type = type;
		    this.frequency = frequency;
		    this.detune = detune;
		    this.gain = actx.createGain();
		  //   if(type === "noise") {
				// var bufferSize = 2 * actx.sampleRate,
				//     noiseBuffer = actx.createBuffer(1, bufferSize, actx.sampleRate),
				//     output = noiseBuffer.getChannelData(0);
				// for (var i = 0; i < bufferSize; i++)
				//     output[i] = Math.random() * 2 - 1;

				// this.oscillator = actx.createBufferSource();
				// this.oscillator.buffer = noiseBuffer;
				// this.oscillator.loop = true;
		  //   } else {
		    this.oscillator = actx.createOscillator();
		    this.oscillator.frequency.value = frequency;
		    this.oscillator.type = type;
		    if(detune > 0)
			    this.oscillator.detune.value = detune;
		    // }
		    
		    
		    

		    
		    this.play = function(destination, when, duration, volume){
			    this.destination = destination;
			    this.volume = volume || 1;
			    this.duration = duration || 1;
			    this.oscillator.connect(this.gain);
			    this.gain.gain.value = volume;
			    this.gain.connect(destination);
			    this.oscillator.start(actx.currentTime + when);
			    this.oscillator.stop(actx.currentTime + duration);
		    };
		    
		    this.stop = function(when){
		    	var when = when || 0;
			    this.oscillator.stop(when);
		    };   
		}

		function fade(attribute,from,to,when,howLong) {
			attribute.linearRampToValueAtTime(from,actx.currentTime + when);
			attribute.linearRampToValueAtTime(to,actx.currentTime + when + howLong);
		};

		//  PITCH BEND
		function pitchBend(oscillatorNode) {
			//  GET FREQUENCY
			var freq = oscillatorNode.frequency.value;
			oscillatorNode.frequency.linearRampToValueAtTime(freq,actx.currentTime + wait);
			oscillatorNode.frequency.linearRampToValueAtTime(freq + bend, actx.currentTime + wait + attack + sustainTime + decay);
		};

		// //  FADE IN (ATTACK)
		// function fadeIn(volumeNode) {
		// 	//  SET VOLUME TO 0
		// 	volumeNode.gain.value = 0;

		// 	volumeNode.gain.linearRampToValueAtTime(0,actx.currentTime+wait);
		// 	volumeNode.gain.linearRampToValueAtTime(volume,actx.currentTime + wait + attack);
		// };

		// //  FADE OUT (DECAY)
		// function fadeOut(volumeNode) {
		// 	volumeNode.gain.linearRampToValueAtTime(volume,actx.currentTime + wait + attack);
		// 	volumeNode.gain.linearRampToValueAtTime(sustainPunch,actx.currentTime + wait + attack + sustainTime + decay);
		// };

		

		// //  ECHO
		// function addEcho(volumeNode) {
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
		// 	volumeNode.connect(delay);

		// 	// CONNECT DELAY LOOP TO MAIN SOUND CHAINS PAN NODE
		// 	delay.connect(actx.destination);
		// };

		// //  REVERB
		// function addReverb(volumeNode) {
		// 	var convolver = actx.createConvolver();
		// 	convolver.buffer = impulseResponse(reverb[0],reverb[1],reverb[2]);
		// 	volumeNode.connect(convolver);
		// 	convolver.connect(actx.destination);
		// };

		// function impulseResponse(duration,decay,reverse) {

		// 	//  LENGTH OF THE BUFFER
		// 	var length = actx.sampleRate * duration;

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
		// 		left[i] = (Math.random() * 2 -1) * Math.pow(1-n/length,decay);
		// 		right[i] = (Math.random() * 2 -1) * Math.pow(1-n/length,decay);
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
		// 	d1.frequency.value = freq + dissonance;
		// 	d2.frequency.value = freq - dissonance;

		// 	//  APPLY EFFECTS
		// 	if(attack > 0) {
		// 		fadeIn(d1Volume);
		// 		fadeIn(d2Volume);
		// 	}
		// 	if(decay > 0) {
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

		// 	d1.start(actx.currentTime + wait);
		// 	d1.stop(actx.currentTime + wait + attack + sustainTime + decay);

		// 	d2.start(actx.currentTime + wait);
		// 	d2.stop(actx.currentTime + wait + attack + sustainTime + decay);
		// };


	};

	

return {
		SFX: SFX,
		playSequence: playSequence,
        soundEffect: soundEffect
        
    };
});
