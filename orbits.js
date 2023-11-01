let centerX; // Center of the sun
let centerY; // Center of the sun
let ypos = 0; // Initial velocity of the satellite (before orbiting)
let canvasWidth = 500; // Canvas width
let canvasHeight = 500 // Canvas height
let sun_radius = 100; // Radius of the sun
let satellite_radius = 25; // Radius of the satellite
let satellite_x = 170; // Initial x coordinate of the satelite
let gravity_field = sun_radius*3.5 // Gravitational field is radius of the sun scaled up by 3.5
let distX; // Used to calculate distance between two objects
let distY; // Used to calculate distance between two objects
let grav_distance; // Distance between satellite and gravitational field
let horizon_distance; // Distance between satellite and sun
let angle = 0; // angle
let orbit_x = 0; // x coordinate for an orbiting satellite
let orbit_y = 0; // y coordinate for an orbiting satelite
let vector_orbit_x = 0; // x coordinate for vectors for orbiting satellite
let vector_orbit_y = 0; // y coordinate for vectors for orbiting satellite
let grav = false; // Gravity on or off
let f_g = false; // Gravity on or off
let disable = false; // Disable gravity or tan velocity on or off
let g_disable = false; // Disable gravity
let t_v_disable = false; // Disable tangential velocity
let g_force; // Button for disabling gravity
let tan_v; // Button for disabling tangential velocity
let v_increase; // Button for increasing velocity
let v_decrease; // Button for decreasing velocity
let v_change = 1;
let flung_x = 0 // x position for satellite when gravity is disabled
let flung_y = 0 // y position for satellite when gravity is disabled
let v_flung_x = 0 // x position for tangential velocity vector when gravity is disabled
let v_flung_y = 0 // y position for tangential velocity vector when gravity is disabled
let spaghetti_x = 0 // x position for satellite when velocity is disabled
let spaghetti_y = 0 // y position for satellite when velocity is disabled
let saved_angle = 0 // Angle of satellite when either are disabled
let restart;

function setup() {
    createCanvas(700, 1000);
    centerX = canvasWidth/2+100
    centerY = canvasHeight/2
    angleMode(DEGREES) // Angles are in degrees
    frameRate(60) // 60 frames displayed per second
}

function draw() {
    background(100); // gray background
    sun();
    if (!disable) { // If neither gravity nor tangential velocity is disabled
        if (ypos < 1000 && !grav) { // Move satellite directly down if no gravity
            ypos+=8
        } else if (ypos > 1000){
            ypos = 0
        }
        if (!f_g) {
            angle = 0
        } else if (f_g) { // When gravity is in effect
            angle += v_change // Increase angle
            if (angle > 360) { // Reset back to 0
                angle = 0
            }
            orbit_x = centerX - (gravity_field/2 * cos(angle)); // Calculation
            orbit_y = centerY + (gravity_field/2 * sin(angle)); // Calculation
            vector_orbit_x = centerX - (gravity_field/1.85 * cos(angle)); // Calculation
            vector_orbit_y = centerY + (gravity_field/1.85 * sin(angle)); // Calculation
        }
        satellite();
        velocity_v();
        gravity();
        orbit();
        // Assign these variables to be used if gravity or velocity is disabled
        flung_x = orbit_x
        flung_y = orbit_y
        spaghetti_x = orbit_x
        spaghetti_y = orbit_y
        v_flung_x = vector_orbit_x
        v_flung_y = vector_orbit_y
        saved_angle = angle
        
    } else if (disable) {
        if (g_disable) {
            flung();
        } else if (t_v_disable) {
            gravity();
            spaghetti();
        }
    }
    push()
    fill('white')
    textSize(15)
    text("There are four buttons to press: Disable Centripetal Acceleration, Disable Tangential Velocity,", 30, 500)
    text("and Increase and Decrease Tangential Velocity,", 30, 520)
    text("Disabling centripetal acceleration will cause the satellite to move in the direction of", 30, 560)
    text("its tangential velocity, indicated by the purple arrow.", 30, 580)
    text("Since there is no centripetal acceleration acting on the satellite,", 30, 600)
    text("it is free to move in its tangential velocity.", 30, 620)
    text("Disabling tangential velocity will cause the satellite to accelerate towards the center", 30, 680)
    text("due to the centripetal acceleration pointing towards the center.", 30, 700);
    text("Increasing or decreasing tangential velocity causes the satellite to move faster or slower.", 30, 760);
    text("The centripetal acceleration gets scaled as well in order to keep the path of orbit the same." , 30, 780);
    pop()

    console.log(v_change)
}

function sun() { // Draw the sun
    push()
    stroke('black')
    fill("gold")
    ellipse(centerX, centerY, sun_radius)
    pop()
}

function satellite() { // Draw the satellite
    push()
    stroke('black')
    fill('blue')
    if (!grav && !disable) {
        ellipse(satellite_x, ypos, satellite_radius)
    } else if (grav) {
        ellipse(orbit_x, orbit_y, satellite_radius)
    }
    pop()
}

function flung() { // Draw the satellite and its velocity vector when gravity is disabled
    push()
    stroke('black')
    fill('blue')
    flung_x += 4*sin(saved_angle)*v_change
    flung_y += 4*cos(saved_angle)*v_change
    v_flung_x += 4*sin(saved_angle)*v_change
    v_flung_y += 4*cos(saved_angle)*v_change
    ellipse(flung_x, flung_y, satellite_radius) // Draw satellite
    pop()
    
    push()
    stroke("purple")
    strokeWeight(5)
    line(v_flung_x+sin(saved_angle)*v_change, v_flung_y+cos(saved_angle)*v_change, v_flung_x+satellite_radius/2*sin(saved_angle)*v_change*2, v_flung_y+satellite_radius/2*cos(saved_angle)*v_change*2) // purple velocity vector
    pop()

    push()
    stroke("white")
    strokeWeight(4)
    line(v_flung_x+20*sin(saved_angle)*v_change, v_flung_y+20*cos(saved_angle)*v_change, v_flung_x+satellite_radius*sin(saved_angle)*v_change, v_flung_y+satellite_radius*cos(saved_angle)*v_change) // white vector tip
    pop()
}

function spaghetti() { // Draw the satellite and its acceleration vector when tangential velocity is disabled
    if (!horizon(spaghetti_x, spaghetti_y)) {
        push()
        stroke('black')
        fill('blue')
        // All terms are SQUARED due to INVERSE SQUARE LAW (Fg to inversely proportional to the square of the distance between two objects)
        if (saved_angle > 0 && saved_angle < 90) { // 0-90
            spaghetti_x += sq(5*cos(saved_angle))
            spaghetti_y += -1*sq(5*sin(saved_angle)) // multiply by -1
        } else if (saved_angle >= 90 && saved_angle < 180) { // 90-180
            spaghetti_x += -1*sq(5*cos(saved_angle)) // multiply by -1
            spaghetti_y += -1*sq(5*sin(saved_angle)) // multiply by -1
        } else if (saved_angle >= 180 && saved_angle < 270) { // 180-270
            spaghetti_x += -1*sq(5*cos(saved_angle)) // multiply by -1
            spaghetti_y += sq(5*sin(saved_angle))
        } else if (saved_angle >= 270 && saved_angle < 360) { // 270-360
            spaghetti_x += sq(5*cos(saved_angle))
            spaghetti_y += sq(5*sin(saved_angle))
        }
        ellipse(spaghetti_x, spaghetti_y, satellite_radius) // Draw the satellite
        pop()

        push()
        stroke('red')
        strokeWeight(5)
        line(spaghetti_x, spaghetti_y, spaghetti_x + 40*cos(saved_angle)*v_change, spaghetti_y - 40*sin(saved_angle)*v_change) // Draw acceleration vector
        pop()

        push()
        stroke('white')
        strokeWeight(4)
        line(spaghetti_x + 30*cos(saved_angle)*v_change, spaghetti_y - 30*sin(saved_angle)*v_change, spaghetti_x + 40*cos(saved_angle)*v_change, spaghetti_y - 40*sin(saved_angle)*v_change) // Tip of acceleration vector
        pop()
    } else if (horizon(spaghetti_x, spaghetti_y)) { // If satellite is close enough to the planet
        push()
        stroke('black')
        fill('blue')
        ellipse(centerX, centerY, satellite_radius) // Satellite is stuck to the center of the planet
        pop()
    }
}

function velocity_v() { // Draw velocity vector
    if (!grav) {
        push()
        stroke('purple');
        strokeWeight(4)
        line(satellite_x, ypos, satellite_x, ypos+25) // Vector
        pop()
        fill("purple")
        triangle(satellite_x-5, ypos+25, satellite_x, ypos+35, satellite_x+5, ypos+25) // Vector tip
    } else if (grav && f_g) { // When in orbit
        push()
        stroke('purple');
        strokeWeight(5)
        line(vector_orbit_x+sin(angle), vector_orbit_y+cos(angle), vector_orbit_x+satellite_radius*sin(angle)*v_change, vector_orbit_y+satellite_radius*cos(angle)*v_change) // Tangential velocity vector
        stroke('white')
        strokeWeight(4)
        line(vector_orbit_x+20*sin(angle)*v_change, vector_orbit_y+20*cos(angle)*v_change, vector_orbit_x+25*sin(angle)*v_change, vector_orbit_y+25*cos(angle)*v_change) // Tip of tangential velocity vector
        pop()
    }
}

function gravity() { // Path of orbit by the satellite
    push()
    noFill(); // Border of a circle only
    stroke('white')
    strokeWeight(3)
    ellipse(centerX, centerY, gravity_field, gravity_field)
    pop()
}

function orbit() { // Determine if satellite is close enough to orbit
    distX = (centerX - satellite_x)
    distY = (centerY - ypos)
    grav_distance = sqrt((distX*distX) + (distY*distY)) // Distance formula
    if (grav_distance <= satellite_radius+gravity_field-194) { // If close enough to sun
        accel_v(); // Draw centripetal acceleration vector
        f_g = true;
        grav = true;
        g_force = createButton('Disable Centripetal Acceleration');
        g_force.position(30, 50);
        g_force.mousePressed(disable_g);
        
        tan_v = createButton('Disable Tangential Velocity');
        tan_v.position(30, 80);
        tan_v.mousePressed(disable_t_v);

        v_increase = createButton('Increase Tangential Velocity');
        v_increase.position(30, 410);
        v_increase.mousePressed(add_v);

        v_decrease = createButton('Decrease Tangential Velocity');
        v_decrease.position(30, 440);
        v_decrease.mousePressed(sub_v);
        
    } else {
        f_g = false;
        grav = false;
    }
    
}

function add_v() {
    v_change += 1
}

function sub_v() {
    v_change -= 1
    if (v_change <= 1) {
        v_change = 1
    }
}

function accel_v() { // Draw centripetal acceleration vector
    if (grav) {
        push()
        stroke('red');
        strokeWeight(5)
        line(orbit_x, orbit_y, orbit_x + 25 * cos(angle)*v_change, orbit_y - 25 * sin(angle)*v_change)
        pop();
        push()
        stroke('white');
        strokeWeight(4);
        line(orbit_x + 25 * cos(angle)*v_change, orbit_y - 25 * sin(angle)*v_change, orbit_x + 20 * cos(angle)*v_change, orbit_y - 20 * sin(angle)*v_change)
        pop()
    }
}

function disable_g() { // Disable gravity
    f_g = false
    grav = false;
    disable = true;
    g_disable = true;
}

function disable_t_v() { // Disable tangential velocity
    f_g = false
    grav = false;
    disable = true;
    t_v_disable = true;
}

function horizon(x, y) { // Calculate if satellite is close enough to the sun
    distX = centerX - x
    distY = centerY - y
    horizon_distance = sqrt((distX*distX) + (distY*distY)) // Distance formula
    if (horizon_distance <= sun_radius/2) { // If close to the sun
        return true;
    } else {
        return false;
    }
}
