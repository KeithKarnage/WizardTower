(function(definition) {
    /* global module, define */
    if(typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = definition();
    } else if(typeof define === 'function' && define.amd) {
        define([], definition);
    } else {
        var exports = definition();
        // window.extend = exports.extend;
        window.copyObject = exports.copyObject;
        window.debugGrid = exports.debugGrid;
        window.emptyGrid = exports.emptyGrid;
        window.copyGrid = exports.copyGrid;
        window.random = exports.random;
        window.sRandom = exports.sRandom;
        window.boxCollide = exports.boxCollide;
        window.pointCollide = exports.pointCollide;
        window.distance = exports.distance;
        window.line = exports.line;
        window.hslToRgb = exports.hslToRgb;
        window.wrapText = exports.wrapText;
    }
})(function() {

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

	function copyObject (object) {
		var result = {};
		for(var i in object)
			result[i] = object[i];
		return result;
	};

	function debugGrid(grid) {
		console.log("- - - - - grid - - - - -");
		for(var y in grid)
			console.log(grid[y]);
	};

	function emptyGrid(xL,yL) {
		var r = [],
			x,y;
		for(y=0; y<yL; y++) {
            r.push([]);
            for(x=0; x<xL; x++)
                r[y].push(0);
        }
        return r
	};

	function copyGrid(G) {
		var r = [];
		for(var y=0,yL=G.length; y<yL; y++) {
			r.push([]);
			for(var x=0,xL=G[0].length; x<xL; x++)
				r[y][x] = G[y][x];
		}
		return r;
	};

	//  a = min
	//  b = max
	//  c = int, !c = float
	function random(a,b,c) {
		var r = (Math.random() * (b-a)) + a;
		if(c) return Math.floor(r);
		else return r;
	};


	function sRandom(a,b,c) {
		var r = (sRand() * (b-a)) + a;
		if(c) return Math.floor(r);
		else return r;
	};

	window.seed = 1;
	window.seq = 1;
	function sRand() {
	    var x = Math.sin(seq++) * (10000 + seed);
	    // console.log(seq);
	    return x - Math.floor(x);
	};


	function boxCollide(box1,box2,buffer) {
		var B = buffer || 0;
		// console.log(box1.x,box2.x,box1.y,box2.y,B)

		if(box2.x < box1.x + box1.w - box1.w*B
		&& box2.y < box1.y + box1.h - box1.h*B
		&& box2.x + box2.w > box1.x + box1.w*B
		&& box2.y + box2.h > box1.y + box1.w*B)
			return true;
		return false;
	};

	function pointCollide(box,point) {
		if(point.x > box.x && point.x < box.x + box.w
		&& point.y > box.y && point.y < box.y + box.h)
			return true;
	};

	function distance(obj1,obj2) {
		if(obj1.gx !== undefined)
			return Math.sqrt((obj2.gx-obj1.gx)*(obj2.gx-obj1.gx) + (obj2.gy-obj1.gy)*(obj2.gy-obj1.gy));
		else return Math.sqrt((obj2.x-obj1.x)*(obj2.x-obj1.x) + (obj2.y-obj1.y)*(obj2.y-obj1.y));
	};

	function line(x0,y0,x1,y1) {
		var points = [];
		var dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
		var dy = Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1; 
		var err = (dx>dy ? dx : -dy)/2;
		 
		var finished = false;
		while(!finished) {
			// console.log(x0,y0)
			points.push({x:x0,y:y0});
			if (x0 === x1 && y0 === y1) finished = true;
			var e2 = err;
			if (e2 > -dx) { err -= dy; x0 += sx; }
			if (e2 < dy) { err += dx; y0 += sy; }
		}
		return points;
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
	function hslToRgb(h, s, l, a){
	    var result = "rgb",
		    r, g, b;

	    if(s == 0){
	        r = g = b = l; // achromatic
	    }else{
	        function hue2rgb(p, q, t){
	            if(t < 0) t += 1;
	            if(t > 1) t -= 1;
	            if(t < 1/6) return p + (q - p) * 6 * t;
	            if(t < 1/2) return q;
	            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
	            return p;
	        }

	        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	        var p = 2 * l - q;
	        r = Math.floor(hue2rgb(p, q, h + 1/3)*255);
	        g = Math.floor(hue2rgb(p, q, h)*255);
	        b = Math.floor(hue2rgb(p, q, h - 1/3)*255);
	    }

	    // result = [r * 255, g * 255, b * 255];
	    if(a) result += "a";
	    result += "("+r+","+g+","+b;
	    if(a) result += ","+a;
	    result += ")";

		return result;

	};


	function wrapText(context, text, x, y, maxWidth, lineHeight) {
		var words = text.split(' ');
		var line = '';
		
		for(var n = 0; n < words.length; n++) {
		  var testLine = line + words[n] + ' ';
		  var metrics = context.measureText(testLine);
		  var testWidth = metrics.width;
		  if (testWidth > maxWidth && n > 0) {
		    context.fillText(line, x, y);
		    line = words[n] + ' ';
		    y += lineHeight;
		  }
		  else {
		    line = testLine;
		  }
		}
		context.fillText(line, x, y);
	};
	

    


    return {
    	// extend: extend,
    	copyObject: copyObject,
        debugGrid: debugGrid,
        emptyGrid: emptyGrid,
        copyGrid: copyGrid,
        sRandom: sRandom,
        random: random,
        boxCollide: boxCollide,
        pointCollide: pointCollide,
        distance: distance,
        line: line,
        hslToRgb: hslToRgb,
        wrapText: wrapText
    };
});
