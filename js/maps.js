(function(definition) {
    /* global module, define */
    if(typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = definition();
    } else if(typeof define === 'function' && define.amd) {
        define([], definition);
    } else {
        var exports = definition();
        window.Maps = exports.Maps;
        
    }
})(function() {




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
        grid = emptyGrid(6,6);
        //  THE NUMBER THAT WILL BE PUT IN THE GRID
        this.copyNumber = 2;
        //  WHEN DONE
        this.done = false;

        //  FULL SIZED MAP
        map = emptyGrid(21,13);

        grid[5][3] = 1;
        // debugGrid(grid);

        //  ESSENTIALLY I AM TAKING RANDOM TETRIS PIECES AND TESTING EVERY LOCATION IN THE GRID
        //  TO SEE WHICH HAS THE HIGHEST SCORE BY BEING LOWEST ON THE GRID, AND PUTTING IT THERE.
        //  THEN I TURN IT SIDEWAYS AND MIRROR IT AND DRAW PATHS AROUND ALL THE PIECES ON A BIGGER GRID

        while(!this.done) {

             //  RANDOMIZE A PIECE
            var piece = blocks[sRandom(5,31,true)];
            // debugGrid(piece);

            // BEST SCORE
            var bestScore = {score:0};

            //  EACH POSITION ALONG THE GRIDS WIDTH
            for(var w= -2,wL=grid[0].length; w<wL; w++) {
            // for(var w=0,wL=1; w<wL; w++) {
                //  FOR EACH POSSIBLE ROTATION OF THAT PIECE
                for(var r=0; r<4; r++) {
                    var p = rot(piece,r);

                    //  FOR EACH POSITION ALONG THE HEIGHT OF THE GRID
                    for(var h=0,hL=grid[0].length; h<hL; h++) {
                        var valid = true;
                        //  SCORE
                        var score = 0;
                        //  FOR EACH GRID SPACE IN THE PIECE
                        for(var y=0,yL=p.length; y<yL; y++) {
                            //  IF THIS ROW IS UNDEFINED, CONTINUE
                            if(grid[h+y] === undefined) continue;

                            for(var x=0,xL=p[0].length; x<xL; x++) {
                                //  IF THIS COLUMN IS UNDEFINED, CONTINUE
                                // if(grid[h+y][w+x] === undefined) continue;
                                //  COMPARE THAT VALUE TO THE ONE ON THE GRID
                                // console.log(p[y][x],grid[w+y][x])
                                if(p[y][x] === 1) {
                                    if(grid[h+y][w+x] !== 0)
                                        valid = false;
                                    // console.log(y)
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
                            // console.log(score,bestScore);
                        }

                    }
                }         
            }
            
            if(bestScore.score > 0) {
                // console.log(bestScore);
                var p = rot(piece,bestScore.r)
                // debugGrid(p);
                for(var y=0; y<3; y++) {
                    if(grid[y+bestScore.y] === undefined) continue;
                    for(var x=0; x<3; x++) {
                        if(grid[y+bestScore.y][x+bestScore.x] !== undefined
                        && p[y][x] === 1)
                            grid[y+bestScore.y][x+bestScore.x] = this.copyNumber;
                    }
                }
                this.copyNumber++;
                // if(this.copyNumber>9) this.copyNumber = 1;
            } else {
                // debugGrid(grid);
                this.done = true;
            }



        }
// debugGrid(grid);
        //  CUT OFF TOP 3 LINES.  THEY WERE ONLY THERE TO FILL UP MORE
        grid.splice(0,1);
// debugGrid(grid);
        //  CUT CORNERS TO MAKE ROUNDISH
        // grid[0][0] = grid[0][width-1] = 0//grid[0][1] = grid[0][width-2] = grid[1][0] = grid[1][width-1] = 0;

        //  MIRROR THE GRID
        for(var y=grid.length-1; y>=0; y--) {
            // console.log("not happeing")
            // var t = [];
            // for(var i=0,iL=width; i<iL; i++)
                // t.push(0);
            grid.push([]);
            for(var i=0,iL=grid[y].length; i<iL; i++) {
                grid[grid.length-1].push(grid[y][i] * 10);
                if(grid[y][i] === 1) grid[grid.length-1][i] = 1;

            }
        }
        // debugGrid(grid);

        //  ROTATE
        grid = rot(grid,1);
        // debugGrid(grid);
        //  SPLICE OUT A MIDDLE COLUMN
        //  IT HAD TO STAY SQUARE BEFORE FOR THE rot() FUNCTION
        // for(var i=0,iL=grid.length; i<iL; i++)
        //     grid[i].splice(Math.floor(grid[0].length/2),1);


        
        // debugGrid(map);

        
        //  FOR EACH SPOT IN THE GRID
        for(var y=0,yL=grid.length; y<yL; y++) {
            for(var x=0,xL=grid[0].length; x<xL; x++) {
        // for(var y=0,yL=1; y<yL; y++) {
        //     for(var x=0,xL=grid[0].length; x<xL; x++) {

                var val = grid[y][x];
                if(val > 0) {
                    
                    //  GET NEIGHBOURHOOD
                    var neigh = "";
                    check( x,   y-1 );
                    check( x+1, y   );
                    check( x,   y+1 );
                    check( x-1, y   );

                    function check(x,y) {
                        if(grid[y] !== undefined
                        && grid[y][x] !== undefined
                        && grid[y][x] === val) neigh += 1;
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
        // console.log(map.length)
        for(var i=2,iL=map.length-2; i<iL; i++) {
            
            if(map[i][1] !== 0) {
                // console.log(i)
                
                possibleLocations.push(i);
            }
        }
        var rand = possibleLocations[sRandom(0,possibleLocations.length-1,true)];
        // console.log()
        map[rand][0] = 1;
        map[rand][map[0].length-1] = 1;

        // debugGrid(map);

        //  POSSIBLE LOCATIONS TO PLACE ENERGY PICKUPS
        var tLocs = [];
        var bLocs = [];
        for(var y=0; y<4; y++) {
            for(var x=0; x<4; x++) {
                if(map[y][x] === 1) {
                    // console.log(map[y][x])
                    tLocs.push({x:x,y:y});
                }

                if(map[map.length-1-y][x] === 1) {
                    // console.log(map[y][x])
                    bLocs.push({x:x,y:map.length-1-y})
                }
            }
        }
        var rnd1 = sRandom(0,bLocs.length-1,true);
        // console.log(rnd1);
        var tLoc = tLocs[sRandom(0,tLocs.length-1,true)];
        var bLoc = bLocs[sRandom(0,bLocs.length-1,true)];

        

        // var map2 = copyGrid(map);
        // debugGrid(map2);

        //  FOR EACH CELL IN THE MAP

        //  CHECK IF ITS A 0

        //  IF IT IS, FIND ALL NEIGHBOURS RECURSIVELY AND ADD TO OBJECT

        return {
            portals:[
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
            g = copyGrid(G);
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
                    // console.log(x,y,g[y][x])
                    r[y].push(g[x][g[0].length-y-1]);
                }
            }
            g = copyGrid(r);
        }

        return g;

    };

    return {
        Maps: Maps
    };
});
