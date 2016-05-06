
Enemyship = function (index, game, player, bullets) {

    var x = game.world.randomX;
    var y = game.world.randomY;

    this.game = game;
    this.health = 3;
    this.player = player;
    this.bullets = bullets;
    this.fireRate = 1300;
    this.nextFire = 0;
    this.alive = true;


    this.ship = game.add.sprite(x, y, 'enemy', 'ship1');

    this.ship.anchor.set(0.5);

    this.ship.name = index.toString();
    game.physics.enable(this.ship, Phaser.Physics.ARCADE);
    this.ship.body.immovable = false;
    this.ship.body.collideWorldBounds = true;
    this.ship.body.bounce.setTo(1, 1);

    this.ship.angle = game.rnd.angle();


    game.physics.arcade.velocityFromRotation(this.ship.rotation, 100, this.ship.body.velocity); //??

};

Enemyship.prototype.damage = function(damage) {

    this.health -= damage;

    if (this.health <= 0)
    {


        this.alive = false;

        this.ship.kill();



        return true;


    }

    return false;

};

Enemyship.prototype.update = function() {





    if (this.game.physics.arcade.distanceBetween(this.ship, this.player) < 300)
    {
        if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0)
        {
            this.nextFire = this.game.time.now + this.fireRate;

            var bullet = this.bullets.getFirstDead();

            bullet.reset(this.ship.x, this.ship.y);

            bullet.rotation = this.game.physics.arcade.moveToObject(bullet, this.player, 500);
        }
    }
    // console.log(this.ship.position.y );

    if (this.ship.position.y > boundary1){
        this.ship.position.y = boundary1 - 5;
        this.ship.body.velocity.y = -this.ship.body.velocity.y;
        //console.log("Out of bounds Sir");
    }

    if (this.ship.position.y < boundary){
        this.ship.position.y = boundary + 5;
        this.ship.body.velocity.y = -this.ship.body.velocity.y;
        // console.log("Out of bounds Sir");
    }
};

var game = new Phaser.Game(600, 800, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload () {

    game.load.atlas('ship', 'assets/Playership.png', 'assets/DF.json');
    game.load.atlas('enemy', 'assets/EnemyShip.png', 'assets/DF.json');
    game.load.image('bullet', 'assets/bullet.png');
    game.load.image('p_bullet', 'assets/bullet.png');
    game.load.image('earth', 'assets/spaceBackground.png');
    game.load.spritesheet('kaboom', 'assets/explosion.png', 64, 64, 23);
    game.load.image('colTest', 'assets/Test.png');
    game.load.image('trishot', 'assets/triBullet.png');
    game.load.image('shield', 'assets/shield.png');

    game.load.image('P_shield', 'assets/shield_P.png');
    game.load.image('P_Turbo', 'assets/Turbo.png');
    game.load.image('P_Trishot', 'assets/Trishot.png');
    game.load.image('P_FireRate' , 'assets/FireRate.png');

}


var land;

var ship;
var ship2;

var colTest;
var enemies;
var enemyBullets;
var enemiesTotal = 0;
var enemiesAlive = 0;
var explosions;
var triShot;
var boundary = 250;
var boundary1 = 550;



var currentSpeed = 0;
var cursors;

var bullets;
var fireRate = 300;
var nextFire = 0;

var bulletType;
var bulletType2;
var speedBoost = false;


var invulnerable = false;
var shield;
var shieldCount = 0;
var shieldBool = false;
var P_shield;
var P_Turbo;
var P_FireRate;
var P_Trishot;


var fb;
var locations;
var BulletsFB;
var playerBullets;

var firing = false;
function create () {

    //  Resize our game world to be a 2000 x 2000 square
    game.world.setBounds(0, 0, 600, 800);

    //  Our tiled scrolling background
    land = game.add.tileSprite(0, 0, 600, 800, 'earth', 0);
    land.fixedToCamera = true;

    //  The base of our ship
    ship = game.add.sprite (300, 800, 'ship', 'ship1');
    ship.anchor.setTo(0.5, 0.5);

    ship.health = 20;

    //  This will force it to decelerate and limit its speed
    game.physics.enable(ship, Phaser.Physics.ARCADE);
    ship.body.drag.set(0.2);
    ship.body.maxVelocity.setTo(400, 400);
    ship.body.collideWorldBounds = true;

    ship2 = game.add.sprite (300, 800, 'ship', 'ship1');
    ship2.anchor.setTo(0.5, 0.5);
    ship2.animations.add('move', ['ship1', 'ship2', 'ship3', 'ship4', 'ship5', 'ship6'], 20, true);
    ship2.health = 20;

    //  This will force it to decelerate and limit its speed
    game.physics.enable(ship2, Phaser.Physics.ARCADE);
    ship2.body.drag.set(0.2);
    ship2.body.maxVelocity.setTo(400, 400);
    ship2.body.collideWorldBounds = true;

    P_shield = game.add.group();
    P_shield.enableBody = true;
    P_shield.physicsBodyType = Phaser.Physics.ARCADE;
    P_shield.createMultiple(5, 'P_shield');
    P_shield.setAll('anchor.x', 0.5);
    P_shield.setAll('anchor.y', 0.5);
    P_shield.setAll('outOfBoundsKill', true);


    P_Turbo = game.add.group();
    P_Turbo.enableBody = true;
    P_Turbo.physicsBodyType = Phaser.Physics.ARCADE;
    P_Turbo.createMultiple(5, 'P_Turbo');
    P_Turbo.setAll('anchor.x', 0.5);
    P_Turbo.setAll('anchor.y', 0.5);
    P_Turbo.setAll('outOfBoundsKill', true);


    P_FireRate = game.add.group();
    P_FireRate.enableBody = true;
    P_FireRate.physicsBodyType = Phaser.Physics.ARCADE;
    P_FireRate.createMultiple(5, 'P_FireRate');
    P_FireRate.setAll('anchor.x', 0.5);
    P_FireRate.setAll('anchor.y', 0.5);
    P_FireRate.setAll('outOfBoundsKill', true);


    P_Trishot = game.add.group();
    P_Trishot.enableBody = true;
    P_Trishot.physicsBodyType = Phaser.Physics.ARCADE;
    P_Trishot.createMultiple(5, 'P_Trishot');
    P_Trishot.setAll('anchor.x', 0.5);
    P_Trishot.setAll('anchor.y', 0.5);
    P_Trishot.setAll('outOfBoundsKill', true);

    shield = game.make.sprite(ship.x, ship.y, 'shield');


    //  The enemies bullet group
    enemyBullets = game.add.group();
    enemyBullets.enableBody = true;
    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    enemyBullets.createMultiple(100, 'bullet');

    enemyBullets.setAll('anchor.x', 0.5);
    enemyBullets.setAll('anchor.y', 0.5);
    enemyBullets.setAll('outOfBoundsKill', true);
    enemyBullets.setAll('checkWorldBounds', true);


    enemies = [];

    enemiesTotal = 20;
    enemiesAlive = 20;

    for (var i = 0; i < enemiesTotal; i++)
    {
        enemies.push(new Enemyship(i, game, ship, enemyBullets));
    }


    // shield = game.add.sprite(0, 0, 'shield');
    shield.anchor.setTo(0.5, 0.5);
    shield.scale.setTo(0.2, 0.2);

    //  Our bullet group
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet', 0, false);
    bullets.setAll('anchor.x', 1);
    bullets.setAll('anchor.y', 0.5);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);
    bulletType = 1;




    playerBullets = game.add.sprite (300, 800, 'p_bullet');
    playerBullets.anchor.setTo(0.5, 0.5);


    //  Our trishot group
    triShot = game.add.group();
    triShot.enableBody = true;
    triShot.physicsBodyType = Phaser.Physics.ARCADE;
    triShot.createMultiple(30, 'trishot', 0, false);
    triShot.setAll('anchor.x', 0.5);
    triShot.setAll('anchor.y', 0.5);
    triShot.setAll('outOfBoundsKill', true);
    triShot.setAll('checkWorldBounds', true);


    //  Explosion pool
    explosions = game.add.group();

    for (var j = 0; j < 10; j++)
    {
        var explosionAnimation = explosions.create(0, 0, 'kaboom',0, false);
        explosionAnimation.anchor.setTo(0.5, 0.5);
        explosionAnimation.animations.add('kaboom');
    }

    ship.bringToTop();

    ship2.bringToTop();


    game.camera.follow(ship);
    game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
    game.camera.focusOnXY(0, 0);

    cursors = game.input.keyboard.createCursorKeys();

    fb = new Firebase('https://dark-frontier.firebaseio.com/');
    locations = {};
    BulletsFB = {};

    initFB();
    addLocation('Ian', ship.x);
    bullets.forEach(getName, this);
    bullets.forEach(addBullets, this);


}



function getName(bullet){
    bullet.name += "Ian ";
    bullet.name += bullets.getIndex(bullet);


}

function getPlayerName(bullet){
    bullet.name += "Chris ";
    bullet.name += playerBullets.getIndex(bullet);

}

function initFB(){
    if (fb) {
        // This gets a reference to the 'location" node.
        var fbLocation = fb.child("/location");
        var fbBullets = fb.child("/bullets");
        // Now we can install event handlers for nodes added, changed and removed.
        fbLocation.on('child_added', function(sn){
            var data = sn.val();
            // console.dir({'added': data});
            locations[sn.key()] = data;
        });
        fbLocation.on('child_changed', function(sn){
            var data = sn.val();
            locations[sn.key()] = data;
            //console.dir({'moved': data})
        });
        fbLocation.on('child_removed', function(sn){
            var data = sn.val();
            delete locations[sn.key()];
            //console.dir(({'removed': data}));
        });



        fbBullets.on('child_added', function(sn){
            var data = sn.val();
            // console.dir({'added': data});
            BulletsFB[sn.key()] = data;
        });
        fbBullets.on('child_changed', function(sn){
            var data = sn.val();
            BulletsFB[sn.key()] = data;
            //console.dir({'moved': data})
        });
        fbBullets.on('child_removed', function(sn){
            var data = sn.val();
            delete BulletsFB[sn.key()];
            //console.dir(({'removed': data}));
        });
    }

}

function getKey(name){
    var loc= 0;
    for(loc in locations){
        if(locations[loc].player == name){
            return loc;
        }
    }
    return null;
}

function getBulletKey(name){
    var loc;
    for(loc in BulletsFB){
        if(BulletsFB[loc].name == name){
            return loc;

        }
    }
    return null;
}

function addLocation(name, x, rotation) {
    if (getKey(name)) return;

    fb.child("/location").push({
        player: name,
        x: x,
        timestamp: Firebase.ServerValue.TIMESTAMP,
        rotation: rotation

    }, function(err) {
        if(err) console.dir(err);
    });

}

function formatPlayerInfo(location) {
    "use strict";
    var info = location + ":", loc = locations[location];
    info += loc.player + " @ (" + loc.x + ", " + loc.y + ") - " + loc.timestamp + "\n";
    if(loc.player == 'Chris'){
        ship2.x = loc.x;
    }

}

function showLocations() {
    "use strict";
    var loc, info = "";
    for (loc in locations) {
        info += formatPlayerInfo(loc);

    }
}

function addBullets(bullets){

    fb.child("/bullets").push({
        x : bullets.x,
        y: bullets.y,
        type: bulletType,
        name: bullets.name,
        rotation:bullets.rotation


    }, function(err) {
        if(err) console.dir(err);
    });

}

function moveBullet(x, y){
    var bullet = playerBullets.getFirstExists(false);
    bullet.x = x;
    bullet.y = y;
}

function showBullets() {
    "use strict";
    var loc, info = "";
    for (loc in BulletsFB) {
        info = getBullets(loc);

    }
}


function getBullets(bullets){
    var info = bullets + ":", loc = BulletsFB[bullets], itt = 0;
    info += "Name " + loc.name + " @ (" + loc.x + ", " + loc.y;

    var N_bullets = playerBullets;





        N_bullets.x = loc.x;
        N_bullets.y = loc.y;

        N_bullets.name = loc.name;
        bulletType2 = loc.type;
        N_bullets.rotation = loc.rotation;



//            console.log("Bullets function   " + N_bullets.x + "  " + N_bullets.y + "   Name " + N_bullets.name);




}

function updateLocation(ref, name, x, rotation){

    fb.child("/location/" + ref).set({
        player: name,
        x: x,
        timestamp: Firebase.ServerValue.TIMESTAMP
    }, function(err) {
        if(err) {
            console.dir(err);
        }
    });

}

function updateBullet(bullet){
    var ref = getBulletKey(bullet.name);

    fb.child("/bullets/" + ref).set({
        x: bullet.x,
        y: bullet.y,
        name: bullet.name,
        type: bulletType,
        rotation: bullet.rotation
    }, function(err) {
        if(err) {
            console.dir(err);
        }
    })
}



function update () {

    game.physics.arcade.overlap(enemyBullets, ship, bulletHitPlayer, null, this);

    //updateLoc(1);
    showLocations();

    updateLocation(getKey('Ian'),'Ian', ship.x);


    if(firing) {

        bullets.forEach(updateBullet, this );


    }



if(ship.health <= 0){
    game.debug.text('YOU LOSE!!!', 300, 400);
}



    if (enemiesAlive == 0){
        //enemiesTotal ++;
        //enemiesAlive = enemiesTotal;
        //console.log("YOU WIN!!");
        game.debug.text('YOU WIN!!!', 300, 400);
    }


    for (var i = 0; i < enemies.length; i++)
    {
        if (enemies[i].alive)
        {
            //enemiesAlive++;
            game.physics.arcade.collide(ship, enemies[i].ship);
            if(bulletType == 1)
                game.physics.arcade.overlap(bullets, enemies[i].ship, bulletHitEnemy, null, this);
            else if (bulletType == 2)
                game.physics.arcade.overlap(triShot, enemies[i].ship, bulletHitEnemy, null, this);

            game.physics.arcade.overlap(playerBullets, enemies[i].ship, bulletHitEnemy, null, this);

            enemies[i].update();



        }
    }


    game.physics.arcade.overlap(P_FireRate, ship, F_FireRate, null, this);
    game.physics.arcade.overlap(P_shield, ship, F_shield, null, this);
    game.physics.arcade.overlap(P_Trishot, ship, F_Trishot, null, this);
    game.physics.arcade.overlap(P_Turbo, ship, F_Turbo, null, this);



//  The speed we'll travel at
    if(!speedBoost)
        currentSpeed = 3;
    else
        currentSpeed = 10;

    if (cursors.left.isDown)
    {

        ship.position.x -= currentSpeed;
        //game.physics.arcade.accelerateToXY(ship, 600,300, currentSpeed);
    }
    else if (cursors.right.isDown)
    {

        ship.position.x += currentSpeed;
        //game.physics.arcade.accelerateToXY(ship, 0,300, currentSpeed);
    }


    land.tilePosition.x = -game.camera.x;
    land.tilePosition.y = -game.camera.y;

    //  Position all the parts and align rotations


    shield.x = ship.x;
    shield.y = ship.y;
    shield.rotation = ship.rotation;

    if (game.input.activePointer.isDown)
    {
        //  Boom!
        fire();

        firing = true;
        //console.log("fire");
    }
    else{
        firing = false;
    }



    if(invulnerable == true){
        ship.tint = 0xFF0000;
        ship.alpha = 0.3;
    }

    if(invulnerable == false){
        ship.tint = 0xFFFFFF;
        ship.alpha = 1;
    }

    showBullets();

}



function F_shield(ship, pickup){
    shield = game.add.existing(shield);
    shieldBool = true;
    pickup.kill();
}

function F_Turbo(ship, pickup){
    speedBoost = true;
    pickup.kill();
    var clock = game.time.events.add(Phaser.Timer.SECOND * 4, clockOver, game, 2);
}

function F_Trishot(ship , pickup){
    bulletType = 2;
    pickup.kill();
    var clock = game.time.events.add(Phaser.Timer.SECOND * 4, clockOver, game, 3);
}

function F_FireRate(ship, pickup){

    fireRate = 10;
    pickup.kill();
    var clock = game.time.events.add(Phaser.Timer.SECOND * 4, clockOver, game, 4);
}

function clockOver(type){

    if(type == 2)
        speedBoost = false;

    if(type == 3)
        bulletType = 1;

    if(type == 4)
        fireRate = 300;

    if(type == 5)
        invulnerable = false;

}

function bulletHitPlayer (ship, bullet) {
    bullet.kill();
    console.log(shieldBool);
    if (shieldBool == false) {
        if (invulnerable == false) {
            console.log("work");
            ship.damage(1);
            invulnerable = true;

            var clock = game.time.events.add(Phaser.Timer.SECOND * 2, clockOver, game, 5);
        }
    }else{
        shieldCount+= 1;

        if(shieldCount == 3) {

            shieldCount = 0;
            shieldBool = false;
            shield.kill();

        }

    }

}

function randDrop(ship){

    var int = game.rnd.integerInRange(0, 100);
    var pickup;


    if (int >61 && int < 70){

        pickup = P_shield.getFirstExists(false);
        pickup.reset(ship.x, ship.y);
        game.physics.arcade.moveToXY(pickup, ship.x, 700, 300);
        console.log("60");
    }
    if (int >71 && int < 80){
        pickup = P_Trishot.getFirstExists(false);
        pickup.reset(ship.x, ship.y);
        game.physics.arcade.moveToXY(pickup, ship.x, 700, 300);
        console.log("70");
    }
    if (int >81 && int < 90){
        pickup = P_FireRate.getFirstExists(false);
        pickup.reset(ship.x, ship.y);
        game.physics.arcade.moveToXY(pickup, ship.x, 700, 300);
        console.log("80");
    }
    if (int >91 && int < 100){
        pickup = P_Turbo.getFirstExists(false);
        pickup.reset(ship.x, ship.y);
        game.physics.arcade.moveToXY(pickup, ship.x, 700, 300);
        console.log("90");
    }



}

function bulletHitEnemy (ship, bullet) {
    bullet.kill();

    var destroyed;
    if(bulletType  == 1)
        destroyed = enemies[ship.name].damage(1);
    else if(bulletType == 2)
        destroyed = enemies[ship.name].damage(2);


    if (destroyed)
    {
        var explosionAnimation = explosions.getFirstExists(false);
        explosionAnimation.reset(ship.x, ship.y);
        explosionAnimation.play('kaboom', 30, false, true);
        randDrop(ship);
        enemiesAlive--;
    }

}

function fire () {

    if (game.time.now > nextFire && bullets.countDead() > 0 && triShot.countDead() > 0)
    {

        nextFire = game.time.now + fireRate;

        var bullet;
        if (bulletType == 1)
            bullet = bullets.getFirstExists(false);

        else if(bulletType == 2)
            bullet = triShot.getFirstExists(false);

        bullet.reset(ship.x, ship.y);


        bullet.rotation = game.physics.arcade.moveToPointer(bullet, 1000, game.input.activePointer);

    }

}

function render () {

    game.debug.text('Enemies: ' + enemiesAlive + ' / ' + enemiesTotal, 32, 32);
    game.debug.text('Health ' + ship.health + ' / ' + 20, 32, 52);

}

/**
 * Created by chriz on 04/04/2016.
 */
