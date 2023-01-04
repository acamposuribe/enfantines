// CODE BY ALEJANDRO - (RAT)CHITECT (@RATCHITECT), RATCHITECT.TEZ, RATCHITECT.ETH
// P5.JS LIBRARY LICENSE: https://p5js.org/copyright.html
// Music by Erik Satie, Menus propos enfantins, is PUBLIC DOMAIN. Played by Shardifty and Zazo

// CANVAS SIZE and MARGINS
    // Canvas proportion
    let canvasProp = 1.1;
    // Get "res" from URL for HQ Canvas
    if (parseInt(readURL('res'))) {var resolution = parseInt(readURL('res'));} else {var resolution = 0;}
    let widthW, heightW, pixel;
    // Landscape of Portrait Browser Window. Let Pixel allows for same result in varying screen sizes
    if (resolution != 171) {
        if(window.innerHeight <= window.innerWidth*canvasProp) {
            heightW = (Math.max(window.innerHeight, resolution*canvasProp));
            pixel = (heightW/700);
            widthW = (heightW/canvasProp);
        } else {
            widthW = (Math.max(window.innerWidth, resolution));
            heightW = (widthW*canvasProp);
            pixel = (heightW/700);
        }
    }
    else {
        heightW = window.innerHeight;
        pixel = (heightW/700);
        widthW = window.innerWidth;
    }
    // Margins
    let margin = (widthW * weightedRand({0.05: 40, 0.08: 40, 0.10: 20}));
    let w1Active = margin, w2Active = (widthW - margin), h1Active = margin, h2Active = (heightW - margin);
    // Print borders 20% of the times
    let border = parseInt(weightedRand({0: 80, 1: 20}));

// COLOR PALETTES
    const colors = [
        // Nombre,                  color1,     color2,          color3,        color4,         color5,         color6,        color7 
        ["Blanc Ivoire",            "#fffceb",  "#2c695a",      "#4ad6af",      "#7facc6",      "#4e93cc",      "#f6684f",      "#ffd300"],
        ["Outremer Gris",           "#e2e7dc",  "#7b4800",      "#002185",      "#003c32",      "#fcd300",      "#ff2702",      "#6b9404"],
        ["Gris Clair",              "#ccccc6",  "#877c6a",      "#f4bd48",      "#9c2128",      "#395a8e",      "#7facc6",      "#2c695a"], 
        ["BLeU",                    "#cdd3e3",  "#0657a9",      "#c6353c",      "#f6684f",      "#fcd300",      "#488b6d",      "#b0b0b0"],
        ["Playgrounds",             "#c49a70",  "#4e0042",      "#002185",      "#076d16",      "#feec00",      "#ff6900",      "#ff2702"],
        ["Le Rubis",                "#ffe6d4",  "#6c2b3b",      "#c76282",      "#445e87",      "#003c32",      "#e0b411",      "#c8491b"],
        ["Bleu Outremer Fonc\xE9",  "#0e2d58",  "#ffffff",      "#c8c9ca",      "#939598",      "#616568",      "#0e1318",      "#080f15"],
        ["Noir d'Ivoire",           "#080f15",  "#C8C1B7",      "#d7d7d7",      "#b0b0b0",      "#8b8b8b",      "#676767",      "#464646"],
    ];
    
    let palette = parseInt(weightedRand({
        0: 075,     // Blac Ivoire
        1: 110,     // Outremer Gris
        2: 075,     // Gris Clair
        3: 050,     // BLeU
        4: 030,     // Playgrounds
        5: 050,     // Le Rubis
        6: 025,     // Bleu Outremer Foncé
        7: 015,     // Noir d'Ivoire
    }));
    let gridColor = colors[palette][2];

// FLOW FIELD
    // Decide number of rows and columns for Flow Field - More info on Flow Fields here: https://tylerxhobbs.com/essays/2020/flow-fields
    let resolucion = parseFloat(widthW * 0.01), left_x = parseFloat(widthW * -0.5), right_x = parseFloat(widthW*1.5), top_y = parseFloat(heightW * -0.5), bottom_y = parseFloat(heightW*1.5), num_columns = Math.round((right_x - left_x) / resolucion), num_rows = Math.round((bottom_y - top_y) / resolucion), flow_field = [];
    // Types of Fields
    let ffTypes = [
        ["curved",1.05],
        ["truncated",1.1],
        ["tilted",1.05],
        ["zigzag",1],
        ["waves",1.08],
        ["scales",1.20],
        ["seabed",1.08],
        ["partiture",1],
    ];
    let ffSel = parseInt(weightedRand({
        0: 20,  // curved
        1: 10,  // truncated
        2: 15,  // tilted
        3: 15,  // zigzag
        4: 10,  // waves
        5: 5,   // scales
        6: 15,  // seabed
        7: 20,  // partiture
    }));
    // Select the field with weighted Randomness
    let ffType = ffTypes[ffSel][0], step_length = parseFloat(0.4*pixel);

// GRID
    let Grids = [];

// DISTRIBUTIONS and EFFECTS
    // Distribution of the strokes in the grid. 0 = short strokes. 1 = medium strokes. 2 = long strokes.
    let typeDistributions = [
        [0,1,2],
        [2,1,0],
        [0,2,1],
        [1,1,1],
        [2,2,2],
    ];
    let typeSelect = parseInt(weightedRand({
        0: 40,
        1: 30,
        2: 10,
        3: 15,
        4: 10,
    }));
    let typeDist = typeDistributions[typeSelect];
    // 0 = Random. 1 = Strokes in Even positions. 2 = Ordered strokes every 5 positions.
    let superOrder = parseInt(weightedRand({
        0: 75,
        1: 15,
        2: 5,
    }));
    // Caffeine = More and Bigger Strokes
    let caffeine = parseInt(weightedRand({0: 95,1: 5}));
    if(superOrder > 0) {caffeine = 0;}
    // Selective = Strokes of single brush type.
    let selective = parseInt(weightedRand({0: 75,1: 25}));
    // 0 = Random colors. 1 = Always same gradient of colors per element. 2 = Gradient of colors in rows. 3 = Color per row.
    let rainbow = parseInt(weightedRand({0: 80, 1: 20, 2: 15, 3: 15}));
    // Bug Mode = bugged strokes
    let bugged = parseInt(weightedRand({0: 97, 1: 3}));
    // Shadow mode
    let shadow = parseInt(weightedRand({0: 85, 1: 15}));
    // Show or hide GridLines. 1 = Show.
    let showGrid = parseInt(weightedRand({0: 3, 1: 95}));

// BRUSHES Types
    let styles = ["pen","2B","HB","2H","charcoal","marker","cpencil","spray","rotring"]
    let selectiveStyles = ["pen","cpencil","charcoal","marker"]
    // Arrays to stores odd and even cols for Music Mode, and all elements for Silent Mode.
    let strokesEven = [], strokesOdd = [], elements = [], pen, pencil2b, pencilhb, pencil2h, charcoal, marker, spray, cpencil, rotring;

// PALETTE ADJUSTMENTS
    if (palette == 4) { selective = 1; selectiveStyles = ["pen","cpencil","rotring","2B"]}
    if (palette == 6) { styles = ["pen","2B","HB","2H","charcoal","charcoal","cpencil","spray","rotring"]}
    if (ffType == "partiture") { showGrid = 1}

// SOUND and DRAWING MODES
    let soundFile, myFont, noteDone = 0, noteParDone = 0, noteImparDone = 0, strokeID = 0, strokesEven_ID = 0, strokesOdd_ID = 0, mode, nrmode, track, noteVelocity, notePitch, piece, selected;
    let firstNoteColor = Math.floor(2+5.9*fxrand()); let noteColors = createNCarray(firstNoteColor);
    let pianoPlayer = parseInt(weightedRand({
        0: 25,  // shardifty
        1: 75,  // Zazo
    }));
    let playerNames = ["shardifty","Zazo"]
    function preload() {soundJSON = loadJSON("./json/song"+pianoPlayer+".json");}

// FX(HASH) FEATURES
    window.$fxhashFeatures = {
        "Palette": colors[palette][0],
        "Field": ffType,
        "Pianist": playerNames[pianoPlayer],
    }

// LOADING SCREEN - separate canvas drawn on top - works differently in Safari and Chrome.
    let loaded=0, frameStart = [], traits = false;
    let one=false; function finished () {if (!one) {loaded++; one = true;}}
    let two=false; function finished1 () {if (!two) {loaded++; two = true;}}
    let sketch = function(p) {
        let message1 = "DOUBLE CLICK FOR AUDIO MODE";
        let message2 = 'WAIT 5 SECONDS FOR SILENT MODE';
        let messageTraits = "Your traits: \nselective: " + selective + "\nsuperOrder: " + superOrder + "\ncaffeine: " + caffeine + "\nrainbow: " + rainbow + "\nbugged: " + bugged + "\nshadow: " + shadow + "\nshowGrid: " + showGrid + "\ntypeDist: " + typeDist + "\nborders: " + border;
        let ancho = Math.floor(widthW);
        let alto = Math.floor(heightW);
        p.keyReleased = function() {
            if (keyCode === 73) {
                if (!traits) { traits = true; p.loop();}
                else {traits = false;p.loop();}
            }
        }
        p.setup = function() {        
            p.createCanvas(ancho, alto), p.rectMode(p.CENTER), p.textAlign(p.CENTER,p.CENTER), p.background(colors[palette][1]), p.fill(colors[palette][2]), p.textSize(9*pixel);
            p.text("LOADING...",ancho/2,alto/2);
            myFont = p.loadFont('./courier.ttf',finished);
            soundFile = p.loadSound("./mp3/satie"+pianoPlayer+".mp3",finished1);
        };
        p.draw = function() {
            if (loaded < 3) { if (loaded == 2) {loaded = 3;} }
            else if (loaded == 3) {
                p.clear(), p.textFont(myFont), p.textSize(12*pixel), p.noStroke();
                p.fill(colors[palette][2]);
                p.rect(ancho/2,alto/2-6*pixel,p.textWidth(message1)+4*pixel,13*pixel)
                p.rect(ancho/2,alto/2+10*pixel,p.textWidth(message2)+4*pixel,13*pixel)
                p.fill(colors[palette][1]);
                p.text(message1,ancho/2,alto/2-8*pixel);
                p.text(message2,ancho/2,alto/2+8*pixel);
            }
            else if (loaded > 3) {
                p.clear(), p.textSize(10*pixel); 
                if (traits) {
                    p.fill(colors[palette][2]); p.rect(ancho/2,alto/2,widthW/4,11.5*13*pixel); p.fill(colors[palette][1]); p.text(messageTraits,ancho/2,alto/2); p.noLoop();
                }
                else {p.noLoop();}
            }
        };
    };
    let myp5 = new p5(sketch);

// SETUP and DRAW
function setup () {

        // CANVAS AND SEEDS
        createCanvas(floor(widthW), floor(heightW)), angleMode(DEGREES), rectMode(CENTER), randomSeed(fxrand() * 999999), noiseSeed(fxrand() * 999999); pixelDensity(2);

        // CREATE FLOW FIELD
        createField(ffType)
        
        // BACKGROUND and texture
        background(colors[palette][1])
        bgTexture(palette)
        
        // INITIALISE BRUSHES - This could be done easily but initialising different styles gives more flexibility for future projects
        gridLines = new LineStyle("HB"), pen = new LineStyle("pen"), pencil2b = new LineStyle("2B"), pencilhb = new LineStyle("HB"), pencil2h = new LineStyle("2H"), charcoal = new LineStyle("charcoal"), marker = new LineStyle("marker"), spray = new LineStyle("spray"), cpencil = new LineStyle("cpencil"), rotring = new LineStyle("rotring"), borderLines = new LineStyle("2H");

        // CREATE GRID - Parameters are x and y for insertion point, and angle for direction (0 = to right, 90 = to top, 180 = to left, 270 = to bottom)
        // ffTypes[ffSel][1] adjusts the length of grid cols for the different flow field types, so they all use most of the canvas.
        Grids.push(new Grid((-0.07*widthW/ffTypes[ffSel][1]),h1Active,270));
        for (j=0; j < Grids[0].rowNumber; j++) {
            Grids[0].rowParameters();
            if (showGrid == 1) {Grids[0].guideLines((ffTypes[ffSel][1]*rand(0.9*widthW,0.95*widthW)),0);}
            Grids[0].col(j,(ffTypes[ffSel][1]*0.97*widthW),0);
        } 

        // BORDER LINES - If border is active, this will draw the lines.
        if(border == 1) {
            borderLines.line((w1Active-3*pixel),h1Active,(w2Active+3*pixel),h1Active,colors[palette][2],0.6,"straight");
            borderLines.line(w1Active,(h1Active-3*pixel),w1Active,(h2Active+3*pixel),colors[palette][2],0.6,"straight");
            borderLines.line(w2Active,(h1Active-3*pixel),w2Active,(h2Active+3*pixel),colors[palette][2],0.6,"straight");
            borderLines.line((w1Active-3*pixel),h2Active,(w2Active+3*pixel),h2Active,colors[palette][2],0.6,"straight");
        }        
}

function draw () {
    // If Music and Font are loaded, start the 5s count
    if (loaded == 3) {frameStart.push(frameCount);}
    if (frameCount-frameStart[0] < 6) {frameRate(1);}
    
    // When 5 seconds have passed with no input, initiate SILENT Mode
    if (frameCount-frameStart[0] == 6 && mode !== "music") {
        loaded = 4;
        mode = "silent";
        frameRate(60);
        selected = true;
    }

    // MODES
    if (mode == "finished") {       // FINISHED MODE
        if (soundFile.isPlaying()) {
            soundFile.stop(40); // Stop audio in 4 seconds
            soundFile.setVolume(0, 40);  // Fadeout volume for 3 seconds
        }
        fxpreview(), noLoop();
    } else if (mode == "silent") {  // SILENT MODE parameters
        strokeID = frameCount-frameStart[0]-6;
        nrmode = 1; // 1 stroke per Frame, to make it swift
    } else if (mode == "music") {   // AUDIO MODE parameters
        if (Grids[0].rowNumber <= 16) {nrmode = 1} // Strokes per Note, to adjust to col number
        else if (Grids[0].rowNumber <= 24) {nrmode = rande(1,2+(map(Grids[0].rowNumber,16,24,0,0.9,true)))}
        else {nrmode = 2;}
        frameRate(60);
        if (soundFile.currentTime() >= soundJSON.duration) { mode == "finished" }
    }
    
    // DRAW STROKES
    if ((conditionD(mode,0) || conditionD(mode,1))) {
        for (i=0;i<nrmode;i++) {
            if (mode == "silent") {var att = elements[strokeID+i]; var strand = rande(0,strokeID+i-2); var multiply = rande(1,2.5);}
            if (mode == "music") {
                if (track == 0 && strokesEven_ID < strokesEven.length-1) {var att = strokesEven[strokesEven_ID+i]; var strand = rande(0,strokesEven_ID+i-2);}
                else if (track == 1 && strokesOdd_ID < strokesOdd.length-1) {var att = strokesOdd[strokesOdd_ID+i]; var strand = rande(0,strokesOdd_ID+i-2);}
                else {var att = false}
                if (att) {
                var multiply = (map(noteVelocity,soundJSON.velMaxMin[0],soundJSON.velMaxMin[1],0.5,3));
                var pitch = Math.floor(map(notePitch,soundJSON.midiMaxMin[0],soundJSON.midiMaxMin[1],0,5.9,true));
                var durationSize = (map(noteDuration,soundJSON.durMaxMin[0],soundJSON.durMaxMin[1],1,3,true));
                att[5] = colors[palette][noteColors[pitch]]; 
                att[6] = durationSize;}
            }
            // Shadow mode
            if (att && shadow == 1) {
                pencilhb.line(att[1],att[2],0.6*att[3],45,colors[palette][2],att[6])
            }
            switch (att[0]) {
                case "pen":
                    pen.line(att[1],att[2],multiply*att[3],att[4],att[5],att[6])
                    break;
                case "2B":
                    pencil2b.line(att[1],att[2],multiply*att[3],att[4],att[5],att[6])
                    break;
                case "HB":
                    pencilhb.line(att[1],att[2],multiply*att[3],att[4],att[5],att[6])
                    break;
                case "2H":
                    pencil2h.line(att[1],att[2],multiply*att[3],att[4],att[5],att[6])
                    break;
                case "charcoal":
                    charcoal.line(att[1],att[2],multiply*att[3],att[4],att[5],att[6])
                    break;
                case "marker":
                    loadPixels();
                    marker.line(att[1],att[2],multiply*att[3],att[4],att[5],att[6])
                    updatePixels();
                    break;
                case "spray":
                    spray.line(att[1],att[2],multiply*att[3],att[4],att[5],att[6])
                    break;
                case "cpencil":
                    cpencil.line(att[1],att[2],multiply*att[3],att[4],att[5],att[6])
                    break;
                case "rotring":
                    rotring.line(att[1],att[2],multiply*att[3],att[4],att[5],att[6])
                    break;
            }
            // BUGGED MODE
            if (bugged == 1) {
                try {pencilhb.line(att[1],att[2],elements[strand][1],elements[strand][2],att[5],att[6],"straight");} catch {}
            }
        }
        if (mode == "music") {
            if (track == 0) {noteParDone ++; strokesEven_ID = strokesEven_ID + nrmode;}
            else {noteImparDone ++; strokesOdd_ID = strokesOdd_ID + nrmode;}
        }
    }
    else if (strokesEven_ID >= strokesEven.length-nrmode && strokesOdd_ID >= strokesOdd.length-nrmode) { mode = "finished";} // If both Even and Odd cols are finished -> Finish.
    else if (mode == "silent") { mode = "finished"; } // For SILENT mode, if all elements have been drawn -> Finish.

    // WRITE LYRICS
    if (mode == "music" && strokesEven_ID < strokesEven.length  && strokesOdd_ID < strokesOdd.length) {
        // Write Lyrics always in the bottom moving col
        if (strokesEven[strokesEven_ID][2] > strokesOdd[strokesOdd_ID][2]) {
            writeLyrics(soundFile.currentTime(),strokesEven[strokesEven_ID][1],strokesEven[strokesEven_ID][2]);
        } else {
            writeLyrics(soundFile.currentTime(),strokesOdd[strokesOdd_ID][1],strokesOdd[strokesOdd_ID][2]);
        }
    }
}

// BG TEXTURE - This draws the different paper textures
function bgTexture(palette) {
    var chosenbg = color(colors[palette][1]);
    switch(palette) {
        case 0: //SPECIAL CORRUGATED PAPER
            bgtexture = new LineStyle("2H");
            var textureC = color(red(chosenbg)-8,green(chosenbg)-8,blue(chosenbg)-8);
            for (i=0;2.5*i*pixel<=widthW;i++) {
                bgtexture.line((2.5*i*pixel),0,(2.5*i*pixel),heightW,textureC,0.3,"straight")
            }
        break; //BASIC
        case 1: case 2: case 3: case 5: case 6:
            bgtexture = new LineStyle("spray");
            var textureC = color(red(chosenbg)-25,green(chosenbg)-25,blue(chosenbg)-25);
            for (i=0;150*i*pixel<=widthW;i++) {
                bgtexture.line((200*i*pixel),0,(200*i*pixel),heightW,textureC,30,"straight")
            }
        break;
        case 4: //KRAFT
            bgtexture = new LineStyle("2H");
            bgtexture2 = new LineStyle("spray");
            var textureC1 = color(red(chosenbg)-10,green(chosenbg)-10,blue(chosenbg)-10);
            var textureC2 = color(red(chosenbg)+25,green(chosenbg)+25,blue(chosenbg)+25);
            for (i=0;2.5*i*pixel<=widthW;i++) {
                bgtexture.line((2.5*i*pixel),0,(2.5*i*pixel),heightW,textureC1,0.4,"straight")
            }
            for (j=0;180*j*pixel<=widthW;j++) {
                bgtexture2.line((180*j*pixel),0,(180*j*pixel),heightW,textureC2,30,"straight")
            }
        break;
        case 7: //BASIC
            bgtexture = new LineStyle("spray");
            var textureC = color(red(chosenbg)+25,green(chosenbg)+25,blue(chosenbg)+25);
            for (i=0;200*i*pixel<=widthW;i++) {
                bgtexture.line((200*i*pixel),0,(200*i*pixel),heightW,textureC,40,"straight")
            }
        break;
    }
}

// FLOW FIELD TYPES - Create the different Flow Fields
function createField (a) {
    switch (a) {
        case "curved":
            angleRange = rande(-15,-5);
            if (rande(0,100)%2 == 0) {angleRange=angleRange*-1}
            for (column=0;column<num_columns;column++){
                flow_field.push([0]);
                for (row=0;row<num_rows;row++) {               
                    var scaled_x = parseFloat((column) * 0.015);
                    var scaled_y = parseFloat((row) * 0.015);
                    var noise_val = noise(parseFloat(scaled_x.toFixed(3)), parseFloat(scaled_y.toFixed(3)))
                    var angle = map(noise_val, 0.0, 1.0, -angleRange, angleRange)
                    flow_field[column][row] = 3*angle;
                }
            }
        break;
        case "truncated":
            angleRange = rande(-20,-12);
            if (rande(0,100)%2 == 0) {angleRange=angleRange*-1}
            truncate = rande(5,10);
            for (column=0;column<num_columns;column++){
                flow_field.push([0]);
                for (row=0;row<num_rows;row++) {               
                    var scaled_x = parseFloat((column) * 0.02);
                    var scaled_y = parseFloat((row) * 0.02);
                    var noise_val = noise(parseFloat(scaled_x.toFixed(3)), parseFloat(scaled_y.toFixed(3)))
                    var angle = map(noise_val, 0.0, 1.0, -angleRange, angleRange)
                    var angle = round(angle/truncate)*truncate;
                    flow_field[column][row] = 4*angle;
                }
            }
        break;
        case "tilted":
            angleRange = rande(-45,-25);
            if (rande(0,100)%2 == 0) {angleRange=angleRange*-1}
            var dif = angleRange;
            for (column=0;column<num_columns;column++){
                flow_field.push([0]);
                var angle = 0;
                for (row=0;row<num_rows;row++) {               
                    flow_field[column][row] = angle;
                    angle = angle + dif;
                    dif = -1*dif;
                }
            }
        break;
        case "zigzag":
            angleRange = rande(-30,-15);
            if (rande(0,100)%2 == 0) {angleRange=angleRange*-1}
            var dif = angleRange;
            var angle = 0;
            for (column=0;column<num_columns;column++){
                flow_field.push([0]);
                for (row=0;row<num_rows;row++) {               
                    flow_field[column][row] = angle;
                    angle = angle + dif;
                    dif = -1*dif;
                }
                angle = angle + dif;
                dif = -1*dif;
            }
        break;
        case "waves":
            sinrange = rande(10,15);
            cosrange = rande(3,6);
            baseAngle = rande(20,35);
            for (column=0;column<num_columns;column++){
                flow_field.push([0]);
                for (row=0;row<num_rows;row++) {               
                    angle = sin (sinrange*column)*(baseAngle*cos(row*cosrange)) + rande(-3,3);
                    flow_field[column][row] = angle;
                }
            }
        break;
        case "scales":
            baseSize = rand(0.3,0.8)
            baseAngle = rande(20,45);
            for (column=0;column<num_columns;column++){
                flow_field.push([0]);
                for (row=0;row<num_rows;row++) {       
                    addition = rande(row/65,row/35)        
                    angle = baseAngle*cos(baseSize*column*row)+addition;
                    flow_field[column][row] = angle;
                }
            }
        break;
        case "seabed":
            baseSize = rand(0.3,0.8)
            baseAngle = rande(18,26);
            for (column=0;column<num_columns;column++){
                flow_field.push([0]);
                for (row=0;row<num_rows;row++) {       
                    addition = rande(15,20)        
                    angle = baseAngle*sin(baseSize*row*column+addition);
                    flow_field[column][row] = 1.1*angle;
                }
            }
        break;
        case "partiture":
            for (column=0;column<num_columns;column++){
                flow_field.push([0]);
                for (row=0;row<num_rows;row++) {               
                    flow_field[column][row] = 0;
                }
            }
        break;
    }
}

// CURRENT POSITION in the FLOW FIELD, and UpdatePosition, isIn condition, Angle, and MoveTo functions
class Pos {
    constructor (x,y) {
        this.x = (x);
        this.y = (y);
        this.update(this.x,this.y);
    }
    update (x,y) {
        this.x = x;
        this.y = y;
        this.x_offset = (this.x-left_x);
        this.y_offset = (this.y-top_y);
        this.column_index = Math.round(this.x_offset / resolucion);
        this.row_index = Math.round(this.y_offset / resolucion);
    }
    isIn() { // This will check if current position is inside field
        return ((this.column_index >= 0 && this.row_index >= 0) && (this.column_index < num_columns && this.row_index < num_rows))
    }
    angle () { // This will return the flow field angle for current position
        if (this.isIn()) {
            this.grid_angle = flow_field[this.column_index][this.row_index];
        } else {this.grid_angle = 0;}
        return (this.grid_angle);
    }
    moveTo (length,dir) { // This will move the position through the field, for the given distance, in the desired direction in DEGREES (0 = to right, 90 = to top, 180 = to left, 270 = to bottom)
        this.num_steps = ((length/pixel)/(step_length/pixel));
        if (this.isIn()) {
            for (this.i=0;this.i<this.num_steps;this.i++) {
                this.update(this.x,this.y);   
                this.x_step = (step_length * cos(this.angle()-dir));
                this.y_step = (step_length * sin(this.angle()-dir));
                this.x = Math.round(1000*(this.x+this.x_step)/pixel)/1000*pixel;
                this.y = Math.round(1000*(this.y+this.y_step)/pixel)/1000*pixel;
            }
        }
        this.update(this.x,this.y);
    }
}

// GRID class and functions
let rowsDistance = []; // Array for the adjustment of strokes
class Grid {
    constructor(x0,y0,dir) {
        this.x0 = (x0), this.y0 = (y0), this.dir = dir;
        this.type = "lines";
        this.baseSize = (rande(5,13)*pixel);
        this.rowS = (this.baseSize*(3+4.5*fxrand())); if(ffType == "partiture" || ffType == "tilted") {(this.rowS = this.baseSize*(4.5+3*fxrand()));}
        this.rowNumber = Math.round((heightW+3*h1Active)/this.rowS);
        this.rowO = new Pos(this.x0,this.y0);
        if (selective == 1) {this.globalBrush = selectiveStyles[rande(0,selectiveStyles.length-0.1)]} // If selective, create a Global Brush Style
        this.currentColor = 0;
    }
    rowParameters() {
        this.base = 10;
        if (superOrder != 0) {this.separacion = (6*pixel);}
        else {this.separacion = (rand(0.7,1.3)*6*pixel);}
        this.rowO.moveTo(this.rowS+this.baseSize,this.dir);
        this.current = new Pos(this.rowO.x,this.rowO.y);
    }
    guideLines(length, dir) {   // DRAW GRID GUIDELINES
        this.colLength = (length);
        if (palette == 5) {gridColor = colors[palette][Math.floor(2+fxrand()*5.9)] }
        push();
        gridLines.line(this.rowO.x,this.rowO.y,length,dir,gridColor,0.9);
        this.rowO.moveTo(this.baseSize,360-this.dir)
        gridLines.line(this.rowO.x,this.rowO.y,length,dir,gridColor,0.85);
        pop();
    }
    col (j,length,dir) {        // DRAW COL FUNCTION
        rowsDistance.push([0]);
        this.randColor = rande(2,7.9);
        this.maxV = Math.round(length/this.separacion);
        this.maxR = rande(0.75*this.maxV,this.maxV);
        for (this.k=0; this.k<=widthW/(0.7*6*pixel); this.k++) {
            this.current.moveTo(this.separacion,dir);
            if (superOrder > 0) { // THIS is an ADJUST FUNCTION to fit the strokes in between Guidelines
                rowsDistance[j][this.k] = [this.current.x,this.current.y];
                if (j>0) {
                    this.adjust = (ajustar(this.current.x,this.current.y,dist(rowsDistance[j][this.k][0],rowsDistance[j][this.k][1],rowsDistance[j-1][this.k][0],rowsDistance[j-1][this.k][1]),90)/ajustar(this.current.x,this.current.y,this.rowS,90));
                }
                else { this.adjust = 1; }
            }
            else if (caffeine == 1) { // CAFFEINE MODE
                this.adjust = rand(1,3);
            }
            else { this.adjust = 1; }
            
            if (this.k <= this.maxR) {
                if (this.k<=this.maxR/2) {this.weight = (this.maxR-this.k/2+1);}
                else {this.weight = (this.maxR-(this.maxR-this.k)*2+1);}
                
                // CONTINUOUS WEIGHED DISTRIBUTION - Distribution of strokes along the col
                this.area = parseInt(weightedRand({
                    0: (pow(this.maxR,2)/pow(this.k+1,3)),
                    1: (pow(this.maxR,2)/pow(this.weight,3)),
                    2: (pow(this.maxR,2)/pow(this.maxR-this.k+1,3)),
                }));
                
                // CREATE BRUSHES following the different distributions and special effects
                switch(this.area) {
                    case 0:
                        if(this.obsession(1)) {this.typeLines(typeDist[0],dir,j)}
                    break;
                    case 1:
                        if(this.obsession(3)) {this.typeLines(typeDist[1],dir,j)}
                    break;
                    case 2:
                        if(this.obsession(4.5)) {this.typeLines(typeDist[2],dir,j)}
                    break;
                }
            }
        }  
    }
    typeLines (n,dir,j) { // Push the Strokes to the different Arrays. Strokes will be rendered in the DRAW function, that's why we push them to arrays.
        if (selective == 1) {if (rande(0,12.8) == 4) {this.brush = "spray"} else {this.brush = this.globalBrush}} else {this.brush = styles[rande(0,8.9)]}
        switch(n) {
            case 0:
                this.displace = rande(0,4);
                this.lineColor = colors[palette][rande(2+this.displace,3.5+this.displace)];
                if (rainbow !== 0)  {this.lineColor = this.rainbow(j+1); }
                var elPush = [this.brush,this.current.x,this.current.y,(this.adjust*this.baseSize*1.1),90+dir,this.lineColor,0.6];
            break;
            case 1:
                this.displace = rande(0,3);
                this.lineColor = colors[palette][rande(2+this.displace,4.5+this.displace)];
                if (rainbow !== 0)  {this.lineColor = this.rainbow(j+1); }
                var elPush = [this.brush,this.current.x,this.current.y,(this.adjust*(this.rowS)),90+dir,this.lineColor,1.2];
            break;
            case 2:
                this.lineColor = colors[palette][rande(2,7.9)];
                if (rainbow !== 0)  {this.lineColor = this.rainbow(j+1); }
                this.numRows = rande(2,2+5.5*this.k/this.maxV);
                var elPush = [this.brush,this.current.x,this.current.y,(this.adjust*(this.rowS*2)),90+dir,this.lineColor,rande(1.5,2.3)];   
            break;
        }
        if (j% 2 == 0) {strokesOdd.push(elPush);}
        else {strokesEven.push(elPush);}
        elements.push(elPush);
    }
    obsession (n) { // For SuperOrder effects
        switch (superOrder) {
            case 0:
                return rande(0,this.k*rand(0,3))>=n*this.base
            case 1:
                this.rr = 2*rande(2,3);
                return this.k%this.rr == 0 || this.k%(this.rr+1) == 0
            case 2:
                return this.k%4 == 0
        }
    }
    rainbow(j) { // For Color effects
        switch(rainbow) {
            case 1:
                if (this.currentColor == 7) {
                    this.currentColor = 0;
                }
                this.currentColor++;
                return colors[palette][this.currentColor];        
            case 2:
                return colors[palette][Math.floor(map(j,0,this.rowNumber-3,2,7.9,true))];
            case 3:
                return colors[palette][this.randColor];
        }
    }
}

// ADJUST FUNCTION
function ajustar (x0,y0,length,dir) {
    var step_length = (0.4*pixel);
    var distance1 = 0;
    var x = x0, y = y0;
    while (distance1 <= length) {
        var x_offset = (x-left_x); 
        var y_offset = (y-top_y);
        var column_index = int(x_offset / resolucion);
        var row_index = int(y_offset / resolucion);
        if ((column_index >= 0 && row_index >= 0) && (column_index < num_columns && row_index < num_rows)) {
            var grid_angle = flow_field[column_index][row_index]-dir;
        }
        x_step = (step_length * cos(grid_angle));
        y_step = (step_length * sin(grid_angle));
        x1 = Math.round(10000*(x + x_step)/pixel)/10000*pixel;
        y1 = Math.round(10000*(y + y_step)/pixel)/10000*pixel;
        distance1 = Math.round(10000*(distance1 + dist(x1,y1,x,y))/pixel)/10000*pixel;
        x = x1, y = y1;
    }
    return distance1;
}

// BRUSHES CLASS
class LineStyle {
    constructor (type) {
        this.type = type;
        switch (this.type) { // Global Parameters for the brushes
            case "pen":
                this.weight = 1*pixel;
                this.vibration = 0.3;
                this.def = 0.5;
                this.quality = 5;
                this.opacity = 220;
                this.step_length = (0.4*pixel);
            break;
            case "rotring":
                this.weight = 1*pixel;
                this.vibration = 0.1;
                this.def = 0.8;
                this.quality = 15;
                this.opacity = 150;
                this.step_length = (0.6*pixel);
            break;
            case "2B":
                this.weight = (0.8*pixel);
                this.vibration = 1.5;
                this.def = 0.3;
                this.quality = 10;
                this.opacity = 255;
                this.step_length = (0.4*pixel);
            break;
            case "HB":
                this.weight = (0.65*pixel);
                this.vibration = 1;
                this.def = 0.5;
                this.quality = 5;
                this.opacity = 150;
                this.step_length = (0.4*pixel);
            break;
            case "2H":
                this.weight = (0.7*pixel);    
                this.vibration = 0.6;
                this.def = 0.5;
                this.quality = 1;
                this.opacity = 130;
                this.step_length = (0.4*pixel);
            break;
            case "cpencil":
                this.weight = pixel;
                this.vibration = 1;
                this.def = 0.9;
                this.quality = 10;
                this.opacity = 70;
                this.step_length = (0.3*pixel);
            break;
            case "charcoal":
                this.weight = (1.7*pixel);
                this.vibration = 5;
                this.def = 0.85;
                this.quality = 2;
                this.opacity = 100;
                this.step_length = (0.1*pixel);
            break;
            case "marker":
                this.weight = (5*pixel);
                this.vibration = 0.5;
                this.def = 0.5;
                this.quality = 4;
                this.opacity = 15;
                this.step_length = (1.5*pixel);
                this.marker = true;
            break;
            case "spray":
                this.weight = (0.5*pixel);
                this.vibration = 20;
                this.quality = 50;
                this.opacity = 180;
                this.step_length = (2*pixel);
                this.spray = true;
            break;
        }            
    }
    brushvariation () {
        if(this.type == "pen") { // Parameters for each stroke, to give variation
            this.a = rand(0.35,0.65); this.b = rand(0.7,0.8); this.m1 = 1.3; this.m2 = 0.8; this.c = rand(3.5,5);
        }
        else if(this.type == "rotring") {
            this.a = rand(0.45,0.55); this.b = rand(0.7,0.8); this.m1 = 1.1; this.m2 = 0.9; this.c = rand(3.5,5);
        }
        else if(this.type == "2H" || this.type == "2B" || this.type == "HB") {
            this.a = rand(0.35,0.65); this.b = rand(0.7,0.8); this.m1 = 1.3; this.m2 = 0.8; this.c = rand(3.5,5);
        }
        else if(this.type == "cpencil") {
            this.a = rand(0.35,0.65); this.b = rand(0.7,0.8); this.m1 = 1.2; this.m2 = 0.9; this.c = rand(3.5,5);
        }
        else if(this.type == "charcoal") {
            this.a = rand(0.35,0.65); this.b = rand(0.7,0.8); this.m1 = 1.3; this.m2 = 0.8; this.c = rand(3.5,5);
        }
        else if(this.type == "marker") {
            this.a = rand(0.45,0.55); this.b = rand(0.85,0.9); this.m1 = 0.8; this.m2 = 1.2; this.c = rand(5,7);
        }
        else if(this.type == "spray") {
            this.a = rand(0.45,0.55); this.b = rand(0.85,0.9); this.m1 = 0.3; this.m2 = 1.2; this.c = rand(5,7);
        }
    }
    line (x,y,par1,par2,tono,scale,type) { 
        // Draw Line Function. Straight Type is for lines that don't follow the Flow Field.
        // STRAIGHT LINE Parameters: Start Point (x,y), End Point (x2,y2), Color, Weight (scale), and Type == "straight"
        // FLOW FIELD LINE parameters: Start Point (x,y), Length, Angle Direction, Color, Weight, type == null
        push();
        this.scale = scale, this.tono = color(tono), this.distance=0;
        if (this.marker) {this.adj = this.scale;this.adj2 = 0.9*this.scale;} else {this.adj = 1,this.adj2=1;}
        this.brushvariation();
        if (type == "straight") {
            this.x2 = par1, this.y2 = par2;
            this.difX = this.x2-x, this.difY = this.y2-y, this.difM = (Math.max(Math.abs(this.difX),Math.abs(this.difY))), this.linepoint = new Pos(x,y), this.length = (dist(this.x2,this.y2,x,y)), this.i=0;
        } else {
            this.x = (x), this.y = (y), this.length = (par1), this.dir = par2, this.distance=0, this.linepoint = new Pos(this.x,this.y);
        }
        if (!this.marker) {this.tono.setAlpha(this.opacity); stroke(this.tono);}
        this.randMark = rand(0.1,0.3); this.randMark2 = rand(0.7,0.9)
        while (this.distance <= this.length) {
            if (this.spray) { // SPRAY TYPE BRUSHES
                this.vibr = (pixel*this.scale*this.vibration*this.bell(0.5,0.9,3,0.2,1))+pixel*this.vibration/5*randomGaussian();
                strokeWeight(this.adj*rand(0.9*this.weight,1.1*this.weight));
                for (this.j = 0; this.j < this.quality; this.j++) {
                    this.randSp = rand(0.9,1.1);
                    this.randX = rand(this.randSp*-this.vibr, this.randSp*this.vibr);
                    this.randY = rand(-1, 1) * sqrt(sq(this.randSp*this.vibr) - this.randX * this.randX);
                    if ((this.linepoint.x + this.randX < 1.1*widthW && this.linepoint.x + this.randX > -0.1*widthW) && (this.linepoint.y + this.randY < 1.1*heightW && this.linepoint.y + this.randY > -0.1*heightW)) {
                        point(this.linepoint.x + this.randX, this.linepoint.y + this.randY);
                    }
                }
            }
            else if (this.marker) { // MARKER TYPE BRUSHES
                if ((this.linepoint.x < 1.1*widthW && this.linepoint.x > -0.1*widthW) && (this.linepoint.y < 1.1*heightW && this.linepoint.y > -0.1*heightW)) {
                    this.markerOpacity(0,this.randMark,"inicio");
                    this.markerOpacity(this.randMark2,1,"final");
                    for (this.j = 0; this.j < rande(1,4); this.j++) {
                        this.markerOpacity(this.j*0.25+rand(0.05,0.30),this.j*0.25+rand(0.25,0.40));
                    }
                    punto(this.linepoint.x,this.linepoint.y,this.scale*this.weight,this.tono); // This executes the color mixing function
                }
            }
            else { // REST OF BRUSHES
                this.vibr = pixel*this.scale*this.vibration*(this.def+(1-this.def)*this.bell(0.5,0.9,5,0.2,1)*randomGaussian());
                strokeWeight(this.adj*rand(0.9*this.weight,1.1*this.weight)*this.bell(this.a,this.b,5,this.m1,this.m2));
                if ((this.linepoint.x < 1.1*widthW && this.linepoint.x > -0.1*widthW) && (this.linepoint.y < 1.1*heightW && this.linepoint.y > -0.1*heightW)) {
                    if (rand(0,this.quality)>0.4) {
                        point(this.linepoint.x+0.7*rand(-this.vibr,this.vibr),this.linepoint.y+rand(-this.vibr,this.vibr));
                    }
                }
            }
            if (type == "straight") {
                this.i ++;
                this.x_step = map(this.i,0,this.difM*2/this.weight,0,this.difX);
                this.y_step = map(this.i,0,this.difM*2/this.weight,0,this.difY);
                this.linepoint.update(Math.round(10000*(x+this.x_step)/pixel)/10000*pixel,Math.round(10000*(y+this.y_step)/pixel)/10000*pixel);
                this.distance = sqrt(sq(this.x_step)+sq(this.y_step));
            } else {
                this.x_step =  (this.step_length/this.scale*sq(this.adj2) * cos(this.linepoint.angle()-this.dir));
                this.y_step =  (this.step_length/this.scale*sq(this.adj2) * sin(this.linepoint.angle()-this.dir));
                this.linepoint.update(this.linepoint.x+this.x_step,this.linepoint.y+this.y_step);
                this.distance =  this.distance + sqrt(sq(this.x_step)+sq(this.y_step));
            }
        }
        pop();
    }
    bell (a,b,c,m1,m2) {  // WEIGHT VARIATION (pressure simulation. a = center of bell, b = size bell, m1 and m2 -> new mapping
        this.graph = (1/(1+pow(Math.abs((this.distance-a*this.length)/(b*this.length/2)),2*c)));
        return map(this.graph,0,1,m1,m2);
    }
    markerOpacity(a,b,where) { // MARKER BRUSH special effect
        if (this.distance < b*this.length && this.distance > a*this.length) {
            if (where == "inicio") {
                this.opacity2 = this.opacity*(1-map(this.distance,a*this.length,b*this.length,0,1));
            } else if (where == "final") {
                this.opacity2 = this.opacity*(1-map(this.distance,a*this.length,b*this.length,1,0));
            }
            else {
                this.opacity2 = this.opacity*(1-Math.abs(map(this.distance,a*this.length,b*this.length,-1,1)));
            }
            strokeWeight(this.scale*this.weight);
            this.tono.setAlpha(this.opacity2);
            stroke(this.tono)
            punto(this.linepoint.x+rand(-this.vibration,this.vibration),this.linepoint.y+rand(-this.vibration,this.vibration),this.scale*this.weight,this.tono)
            if (this.distance <= rand(0.01,0.015)*this.length || this.distance >= rand(0.985,0.99)*this.length) {
                punto(this.linepoint.x,this.linepoint.y,this.scale*this.weight,this.tono)
            }
        }        
    }
}

// COLOR MIXING FUNCTION
    function punto(cx,cy,radius,clr) {
        var x0 = Math.round(clamp(cx-radius, 0, widthW));
        var x1 = Math.round(clamp(cx+radius, 0, widthW));
        var y0 = Math.round(clamp(cy-radius, 0, heightW));
        var y1 = Math.round(clamp(cy+radius, 0, heightW));
        let density = pixelDensity();     
        for (y=y0; y<y1; y++) {
            for (x=x0; x<x1; x++) {
                var distancia = dist(cx, cy, x, y);           
                if (distancia<=radius) {
                    //index1 = 4 * ((y * density) * width * density + (x * density));
                    //var mixedColor = mixbox.lerp([pixels[index1],pixels[index1+1],pixels[index1+2]], clr, 0.045 * smoothStep(radius, radius*0.75, distancia));
                    for (i = 0; i < density; i+=1) {
                        for (j = 0; j < density; j+=1) {
                        index = 4 * ((y * density + j) * width * density + (x * density + i));
                        var mixedColor = mixbox.lerp([pixels[index],pixels[index+1],pixels[index+2]], clr, 0.045 * smoothStep(radius, radius*0.75, distancia));
                        pixels[index] = mixedColor[0], pixels[index+1] = mixedColor[1], pixels[index+2] = mixedColor[2], pixels[index+3] = 255;
                        }
                    }
                }
            }
        }
    }
    function smoothStep(edge0, edge1, x) {x = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0); return x * x * (3 - 2 * x);}
    function clamp(x, lowerlimit, upperlimit) { if (x<lowerlimit) {return lowerlimit;} else if(x>upperlimit){return upperlimit;} else {return x;}}

// SOUND
// DRAW CONDITION for Even, Odd Cols, following music beats. The note tones, times and durations are stored in satie.js.
    function conditionD(mode2,trac) {
        track = trac;
        if (track == 0) { noteDone = noteParDone; var adjust=-0.15; } else {noteDone = noteImparDone;var adjust=-0.10;}
        if (pianoPlayer == 1) { var adjust = -0.05;}
        switch(mode2) {
            case "music":
                if (noteDone + nrmode < soundJSON.tracks[track].notes.length) {
                    noteVelocity = soundJSON.tracks[track].notes[noteDone].velocity;
                    notePitch = soundJSON.tracks[track].notes[noteDone].midi;
                    noteDuration = soundJSON.tracks[track].notes[noteDone].duration;
                    return soundJSON.tracks[track].notes[noteDone].time + adjust < soundFile.currentTime();
                }
                else {return false;}
            case "silent":
                return strokeID < elements.length;
        }
    }

// WRITE LYRICS. Lyrycs are stored in satie.js
    let lyricDone = 0; used = [0,0];

    function writeLyrics(second,x,y) {
        var adjustment = 0;
        if (pianoPlayer == 0) { adjustement = 0.9}
        if (lyricDone<lyrics.length) {
            if (lyrics[lyricDone][0+pianoPlayer] - adjustment < second) {
                if (ffType == "partiture" || ffType == "tilted") {
                    push(), noStroke(), textSize(7*pixel), textAlign(LEFT, CENTER), textFont(myFont), fill(colors[palette][2]);
                    var pX = x;
                    if (x <= 10*pixel) {var pX = 10*pixel;}
                    var pY = y+17*pixel-lyrics[lyricDone][3]*pixel;
                    if (pX <= used[0] && pY == used[1]) { pX = used[0]}
                    var pXright = pX+textWidth(lyrics[lyricDone][2])+8*pixel;
                    if (pXright <= height-10*pixel) {
                        text(lyrics[lyricDone][2],pX,pY)
                        used = [pXright,pY]
                    }
                    pop();
                }
                console.log(lyrics[lyricDone][2]);
                lyricDone ++;
            }
        }
    }

    let lyrics = [
        [0,1.5,"I. Le Chant Guerrier Du Roi Des Haricots",9],
        [1.3,3.4,"Quel roi jovial !",0],
        [4.4,7.25,"Sa figure est toute rouge.",0],
        [7.75,10.25,"Il sait danser lui-m\xEAme.",0],
        [11,13.6,"Son nez est couvert de poils.",0],
        [14.25,17.1,"Il se tape sur le ventre.",0],
        [20.8,24,"Quand il rit, il en a pour une heure.",0],
        [24.2,27.4,"Quel bon roi !",0],
        [27.2,31,"C'est un grand guerrier.",0],
        [31,34.7,"Il faut le voir \xE0 cheval.",0],
        [34.3,38.16,"Il porte un chapeau rouge.",0],
        [37.2,41.1,"Son cheval sait danser lui-m\xEAme.",0],
        [43.6,48,"Il donne des fortes claques \xE0 son cheval.",0],
        [50.16,54.8,"C'est un brave cheval !",0],
        [53.5,58.25,"Aussi aime-t-il la guerre et les boulets.",0],
        [59.75,65,"Quel beau cheval !",0],
        [60,67,"",0],

        [66,70,"II. Ce Que Dit La Petite Princesse Des Tulipes",9],
        [66.3,73.2,"J'aime beaucoup la soupe aux choux,",0],
        [76.5,83.7,"Mais j'aime encore mieux ma petite maman.",0],
        [86.7,94.5,"Parlons bas, car ma poup\xE9e a mal \xE0 la t\xEAte :",0],
        [95.2,103.7,"Elle est tomb\xE9e du 3e \xE9tage.",0],
        [100.4,109.7,"Le docteur dit que ce n'est rien.",0],
        [102,112,"",0],

        [107.5,116,"III. Valse Du Chocolat Aux Amandes",9],
        [108,120,"Tu vas en avoir un peu.",0],
        [118.3,130.2,"Tu aimes le chocolat ?",0],
        [121.75,133.64,"Laisse-le fondre dans la bouche.",0],
        [128.4,140.5,"Maman, il y a un os.",0],
        [131.5,143.75,"Non, mon petit : c'est une amande.",0],
        [137.2,159.2,"Le petit gar\xE7on veut manger toute la bo\xEEte.",0],
        [144,156,"Comme il est gourmand !",0],
        [150.7,162.8,"Sa maman lui refuse doucement :\nil ne faut pas qu'il se rende malade.",0],
        [159.1,171.4,"Horreur : il tr\xE9pigne de colère.",0],
    ]

// AUXILIARY RAND FUNCTIONS
    function rand(e, r) {return map(fxrand(), 0, 1, e, r)}
    function rande(e, r) {return Math.floor(map(fxrand(), 0, 1, e, r))}
    function weightedRand(e) {
        var r, a, n = [];
        for (r in e)
            for (a = 0; a < 10 * e[r]; a++)
                n.push(r);
            return n[Math.floor(fxrand() * n.length)]
    }
    function createNCarray (n) {
        colorArray = []
        for (i=0;i<6;i++) {
            if (n+i > 7) {colorArray.push(n+i-6)}
            else {colorArray.push(n+i)}
        }
        return colorArray;
    }


// INTERACTIVITY
let startTime;
if (pianoPlayer == 0) {startTime = 0.93} else {startTime = 0};
    function readURL(name){
        if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
        return decodeURIComponent(name[1]);
    }
    function mousePressed() {if(loaded >= 3) {doubletap(false);return false;}}
    function touchStarted() {if(loaded >= 3) {doubletap(true);return false;}}
    function mouseDragged() {return false;}
    var mylatesttap;
    function doubletap(touchmode) {
        var now = new Date().getTime();
        var timesince = now - mylatesttap;
        if((timesince < 400) && (timesince > 0)){
            if (loaded >= 3) {
                if (!selected && mode !== "silent") {
                    loaded = 4;
                    soundFile.play(startTime);
                    mode = "music";
                    loop();
                    selected = true;
                }
                else if (touchmode) {
                    saveCanvas(fxhash, 'png');
                }
            }
        }else{
            if (isLooping() && mode == "silent") {
                noLoop();
            } else if (mode == "silent") { loop(); }
    
            if (soundFile.isPlaying() && mode == "music") {
                soundFile.pause();
            } else if (mode == "music") {
                soundFile.play();
            }
        }
        mylatesttap = new Date().getTime();
    }
    function keyReleased(){
        if (keyCode === 49) {
            saveCanvas(fxhash, 'png');
        }   
        else if (keyCode === 77 && !selected && mode !== "silent") {
            loaded = 4;
            soundFile.play(startTime);
            mode = "music";
            console.log("'Menus propos enfantins' by Erik Satie"); console.log("")
            loop();
            selected = true;
        }
    }

    function finalizar () {
        mode == "finished"
    }
