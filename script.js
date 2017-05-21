/*
 MACIEJ M. MARDOSZ
 CS-416-1 AI and Robotics

 */

// Robot properties
var ROBOTPOS_X = 80, ROBOTPOS_Y = 80, ROBOT_SIZE = 20;

// Temp. storage for laser properties
var CURRENT_LASER_LOC_X_FROM = 0, CURRENT_LASER_LOC_Y_FROM = 0;

// Fixed obstacle properties
var LANDMARK1_X = 200, LANDMARK1_Y = 200, LANDMARK1_X_SIZE = 100, LANDMARK1_Y_SIZE = 100;

// Visual laser beam (visualization canvas; black line) properties
var LASER_R = 300;
var DEFAULT_LASER_COLOR = "black";

// Alpha and Theta of laser and robot
var LASER_ALPHA = 30;
var ROBOT_THETA = 0; // No initial rotation

var M = 0;
// Temp. storage for laser tip information
var tempTipX, tempTipY;

// Global canvas size
var CANVAS_SIZE = 300;

// Internal speed of animation/robot's speed of movement
var INTERVAL_SPEED = 2300;

// New canvasses
var canvas, canvas_results;

// Global movement variable (speed with which robot jumps from pixel to pixel) - For Debugging.
// to speed up, instead of going pixel by pixel, go +5.
var DEFINED_ROBOT_MOVEMENT = 5;

// Start both visualizations
function startVisualization() {

    canvas = document.getElementById("maincanvas");
    canvas_results = document.getElementById("results");

    if (canvas.getContext) {

        // Main visualization canvas (left)
        context = canvas.getContext("2d");
        context.fillStyle = "#F0F0F0";
        context.rect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        context.fill();

        // Canvas with results (what the robot sees; right)
        canvas_results = document.getElementById("results");
        context_results = canvas_results.getContext("2d");
        context_results.fillStyle = "black";
        context_results.rect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        context_results.fill();

        // Go robot, go!
        drawRobot();
        setInterval(drawRobot, INTERVAL_SPEED);
    }
}

// Simple int randomizer
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

// Get m by calculating distance from the laser source to the point of touch.
function calcDistanceBetweenTwoPoints(x1, x2, y1, y2) {

    return Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));
}

// Laser beam directions.
function laserBeam(a) {

    var cos = Math.cos(Math.PI * a / 180.0), sin = Math.sin(Math.PI * a / 180.0);
    return {
        x: cos + sin, y: sin - cos
    }
}

// Send an aminated beam (result's canvas; right).
function sendAbeam() {

    var x = i * beam.x, y = i * beam.y;

    if ((CURRENT_LASER_LOC_X_FROM + x) < LANDMARK1_X || (CURRENT_LASER_LOC_Y_FROM + y) < LANDMARK1_Y) {

        context_results = canvas_results.getContext("2d");
        context_results.beginPath();
        context_results.arc(CURRENT_LASER_LOC_X_FROM + x, CURRENT_LASER_LOC_Y_FROM + y, 1, 0, 2 * Math.PI, true);

        context_results.fillStyle = "white";
        context_results.fill();

        tempTipX = x + ROBOTPOS_X;
        tempTipY = y + ROBOTPOS_Y;
    }

    i = i + 1;

    if (i < LASER_R) {
        requestAnimationFrame(sendAbeam);

    }

    M = calcDistanceBetweenTwoPoints(ROBOTPOS_X, tempTipX, ROBOTPOS_Y, tempTipY);

    document.getElementById("laser_tip_X").innerHTML = tempTipX;
    document.getElementById("laser_tip_Y").innerHTML = tempTipY;
    document.getElementById("m").innerHTML = M;

    // console.log(slam(M, LASER_ALPHA, ROBOT_THETA));
    var temp = slam(M, LASER_ALPHA, ROBOT_THETA);
    document.getElementById("coor_of_obstacle_x").innerHTML = +temp.x;
    document.getElementById("coor_of_obstacle_y").innerHTML = +temp.y;

    var temp2 = world(temp.x, temp.y, ROBOTPOS_X, ROBOTPOS_Y, temp.x, temp.y);
    document.getElementById("coor_world_x").innerHTML = +temp2.x;
    document.getElementById("coor_world_y").innerHTML = +temp2.y;
}

// Draw a robot, all visual supplements, and call necessary methods.
function drawRobot() {

    // First clear rectangular (new instance of a function)
    // in order to not cover old paintings (context) with the new ones.
    context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    context.fillStyle = "#F0F0F0";
    context.fill();
    context.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw robot's body
    context.beginPath();
    context.fillStyle = "blue";
    context.fillRect(ROBOTPOS_X, ROBOTPOS_Y, ROBOT_SIZE, ROBOT_SIZE);
    context.stroke();

    // Draw robots's visual coordinates
    context.beginPath();
    var max_beam_length = 500 * Math.sqrt(2);
    context.fillStyle = "green";
    context.fillRect(ROBOTPOS_X + 10, ROBOTPOS_Y + 10, ROBOT_SIZE - 19, max_beam_length);
    context.fillStyle = "black";
    context.fillText("Y[r]", ROBOTPOS_X + 20, max_beam_length / 4 + ROBOTPOS_Y);
    context.stroke();

    // Draw robots's visual coordinates
    context.beginPath();
    var max_beam_length = CANVAS_SIZE * Math.sqrt(2);
    context.fillStyle = "green";
    context.fillRect(ROBOTPOS_X + 10, ROBOTPOS_Y + 10, max_beam_length, ROBOT_SIZE - 19);
    context.fillStyle = "black";
    context.fillText("X[r]", max_beam_length / 4 + ROBOTPOS_Y, ROBOTPOS_Y + 20);
    context.stroke();

    // Create a black laser beam (visual) for main canvas
    CURRENT_LASER_LOC_X_FROM = ROBOTPOS_X + (ROBOT_SIZE / 2);
    CURRENT_LASER_LOC_Y_FROM = ROBOTPOS_Y + (ROBOT_SIZE / 2);
    document.getElementById("laser_alpha").innerHTML = "&alpha; = " + LASER_ALPHA + " degrees (from X[w])";
    context.moveTo(CURRENT_LASER_LOC_X_FROM, CURRENT_LASER_LOC_Y_FROM);
    context.strokeStyle = DEFAULT_LASER_COLOR;
    context.lineTo(CURRENT_LASER_LOC_X_FROM + LASER_R * Math.cos(Math.PI * LASER_ALPHA / 180.0), CURRENT_LASER_LOC_Y_FROM + LASER_R * Math.sin(Math.PI * LASER_ALPHA / 180.0));

    // Send laser beam on the results canvas (white one; right)
    beam = laserBeam(LASER_ALPHA + 45), i = 0;
    sendAbeam();
    requestAnimationFrame(sendAbeam);

    // Final stroke for laser (can be moved up btw)
    context.stroke();

    // Draw a fixed obstacle
    context.beginPath();
    context.fillStyle = "orange";
    context.fillRect(LANDMARK1_X, LANDMARK1_Y, LANDMARK1_X_SIZE, LANDMARK1_Y_SIZE);
    context.stroke();

    // Robot's movements
    if (ROBOTPOS_X < CANVAS_SIZE - ROBOT_SIZE && ROBOTPOS_Y < CANVAS_SIZE - ROBOT_SIZE) {

        if (getRandomInt(2, 5) == 3) {
            ROBOTPOS_X = ROBOTPOS_X + DEFINED_ROBOT_MOVEMENT;
            document.getElementById("arrow-y").innerHTML = "";
            document.getElementById("X_r").innerHTML = "" + ROBOTPOS_X;
            document.getElementById("arrow-x").innerHTML = "&#8594;";
        }
        else {
            ROBOTPOS_Y = ROBOTPOS_Y + DEFINED_ROBOT_MOVEMENT + 4;
            document.getElementById("arrow-x").innerHTML = "";
            document.getElementById("Y_r").innerHTML = "" + ROBOTPOS_Y;
            document.getElementById("arrow-y").innerHTML = "&#8595;";
        }
    }
    else {
        document.getElementById("X_r").innerHTML = "STOP AT X = " + ROBOTPOS_X;
        document.getElementById("Y_r").innerHTML = "STOP AT Y = " + ROBOTPOS_Y;
    }

}

function slam(m, alpha, theta) {
    return {
        x: m * Math.cos(theta - alpha), y: m * Math.sin(theta - alpha)
    }
}

function world(r_x, r_y, prev_r_x, prev_r_y, obst_x, obst_y) {
    return {
        x: (r_x + prev_r_x) - obst_x, y: (r_y + prev_r_y) - obst_y
    }
}