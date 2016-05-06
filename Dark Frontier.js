
EnemyTank = function (index, game, player, bullets) {

    var x = game.world.randomX;
    var y = game.world.randomY;

    this.game = game;
    this.health = 3;
    this.player = player;
    this.bullets = bullets;
    this.fireRate = 1300;
    this.nextFire = 0;
    this.alive = true;

    this.shadow = game.add.sprite(x, y, 'enemy', 'shadow'); // position asset_key(name) spriteImage
    this.tank = game.add.sprite(x, y, 'enemy', 'tank1');
    this.turret = game.add.sprite(x, y, 'enemy', 'turret');

    this.shadow.anchor.set(0.5); // sets origin to the middle
    this.tank.anchor.set(0.5);
    this.turret.anchor.set(0.3, 0.5);

    this.tank.name = index.toString();
    game.physics.enable(this.tank, Phaser.Physics.ARCADE);
    this.tank.body.immovable = false;
    this.tank.body.collideWorldBounds = true;
    this.tank.body.bounce.setTo(1, 1);

    this.tank.angle = game.rnd.angle();


    game.physics.arcade.velocityFromRotation(this.tank.rotation, 100, this.tank.body.velocity); //??

};

EnemyTank.prototype.damage = function(damage) {


    this.health -= damage;

    if (this.health <= 0)
    {
        this.alive = false;

        this.shadow.kill();
        this.tank.kill();
        this.turret.kill();

        return true;
    }

    return false;

};

EnemyTank.prototype.update = function() {

    this.shadow.x = this.tank.x;
    this.shadow.y = this.tank.y;
    this.shadow.rotation = this.tank.rotation;

    this.turret.x = this.tank.x;
    this.turret.y = this.tank.y;
    this.turret.rotation = this.game.physics.arcade.angleBetween(this.tank, this.player);

    if (this.game.physics.arcade.distanceBetween(this.tank, this.player) < 300)
    {
        if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0)
        {
            this.nextFire = this.game.time.now + this.fireRate;

            var bullet = this.bullets.getFirstDead();

            bullet.reset(this.turret.x, this.turret.y);

            bullet.rotation = this.game.physics.arcade.moveToObject(bullet, this.player, 500);
        }
    }
    // console.log(this.tank.position.y );

    if (this.tank.position.y > boundary1){
        this.tank.position.y = boundary1 - 5;
        this.tank.body.velocity.y = -this.tank.body.velocity.y;
        //console.log("Out of bounds Sir");
    }

    if (this.tank.position.y < boundary){
        this.tank.position.y = boundary + 5;
        this.tank.body.velocity.y = -this.tank.body.velocity.y;
        // console.log("Out of bounds Sir");
    }
};

var game = new Phaser.Game(600, 800, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload () {

    game.load.atlas('tank', 'assets/tanks.png', 'assets/tanks.json');
    game.load.atlas('enemy', 'assets/enemy-tanks.png', 'assets/tanks.json');
    game.load.image('logo', 'assets/logo.png');
    game.load.image('bullet', 'assets/bullet.png');
    game.load.image('p_bullet', 'assets/bullet.png');
    game.load.image('earth', 'assets/scorched_earth.png');
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

var shadow;
var tank;
var tank2;
var turret;
var turret2;

var colTest;
var enemies;
var enemyBullets;
var enemiesTotal = 0;
var enemiesAlive = 0;
var explosions;
var triShot;
var boundary = 250;
var boundary1 = 550;

var logo;

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

var name1;
var name2;

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

    //  The base of our tank
    tank = game.add.sprite (300, 800, 'tank', 'tank1');
    tank.anchor.setTo(0.5, 0.5);
    tank.animations.add('move', ['tank1', 'tank2', 'tank3', 'tank4', 'tank5', 'tank6'], 20, true);
    tank.health = 100;

    //  This will force it to decelerate and limit its speed
    game.physics.enable(tank, Phaser.Physics.ARCADE);
    tank.body.drag.set(0.2);
    tank.body.maxVelocity.setTo(400, 400);
    tank.body.collideWorldBounds = true;

    tank2 = game.add.sprite (300, 800, 'tank', 'tank1');
    tank2.anchor.setTo(0.5, 0.5);
    tank2.animations.add('move', ['tank1', 'tank2', 'tank3', 'tank4', 'tank5', 'tank6'], 20, true);
    tank2.health = 100;

    //  This will force it to decelerate and limit its speed
    game.physics.enable(tank2, Phaser.Physics.ARCADE);
    tank2.body.drag.set(0.2);
    tank2.body.maxVelocity.setTo(400, 400);
    tank2.body.collideWorldBounds = true;

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

    shield = game.make.sprite(tank.x, tank.y, 'shield');

    //  Finally the turret that we place on-top of the tank body
    turret = game.add.sprite(0, 0, 'tank', 'turret');
    turret.anchor.setTo(0.3, 0.5);

    turret2 = game.add.sprite(0, 0, 'tank', 'turret');
    turret2.anchor.setTo(0.3, 0.5);

    //  The enemies bullet group
    enemyBullets = game.add.group();
    enemyBullets.enableBody = true;
    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    enemyBullets.createMultiple(100, 'bullet');

    enemyBullets.setAll('anchor.x', 0.5);
    enemyBullets.setAll('anchor.y', 0.5);
    enemyBullets.setAll('outOfBoundsKill', true);
    enemyBullets.setAll('checkWorldBounds', true);

    // animateERockets = enemyBullets.animations.add("Fire");

    //enemyBullets.animations.play('Fire', 30, true);
    //  Create some baddies to waste :)
    enemies = [];

    enemiesTotal = 20;
    enemiesAlive = 20;

    for (var i = 0; i < enemiesTotal; i++)
    {
        enemies.push(new EnemyTank(i, game, tank, enemyBullets));
    }

    //  A shadow below our tank
    shadow = game.add.sprite(0, 0, 'tank', 'shadow');
    shadow.anchor.setTo(0.5, 0.5);

    // shield = game.add.sprite(0, 0, 'shield');
    shield.anchor.setTo(0.5, 0.5);
    shield.scale.setTo(0.2, 0.2);

    //  Our bullet group
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet', 0, false);
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);
    bulletType = 1;


    playerBullets = game.add.group();
    playerBullets.enableBody = true;
    playerBullets.physicsBodyType = Phaser.Physics.ARCADE;
    playerBullets.createMultiple(30, 'p_bullet', 0, false);
    playerBullets.setAll('anchor.x', 0.5);
    playerBullets.setAll('anchor.y', 0.5);
    playerBullets.setAll('outOfBoundsKill', true);
    playerBullets.setAll('checkWorldBounds', true);
    playerBullets.forEach(getPlayerName, this);


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

    tank.bringToTop();
    turret.bringToTop();

    tank2.bringToTop();
    turret2.bringToTop();

    logo = game.add.sprite(0, 200, 'logo');
    logo.fixedToCamera = true;

    game.input.onDown.add(removeLogo, this);

    game.camera.follow(tank);
    game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
    game.camera.focusOnXY(0, 0);

    cursors = game.input.keyboard.createCursorKeys();

    fb = new Firebase('https://dark-frontier.firebaseio.com/');
    locations = {};
    BulletsFB = {};

    initFB();
    addLocation('Chris', tank.x, turret.rotation);
    bullets.forEach(getName, this);
    bullets.forEach(addBullets, this);


}

function removeLogo () {
    game.input.onDown.remove(removeLogo, this);
    logo.kill();
}

function getName(bullet){

    bullet.name = bullets.getIndex(bullet);

}

function getPlayerName(bullet){

    bullet.name = playerBullets.getIndex(bullet);

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
            //console.log(loc + " Loc");
        }
    }
    return null;
}

function getBulletKey(name){
    var loc;
    for(loc in BulletsFB){
        // console.log("Bulllet" +name);
        if(BulletsFB[loc].name == name){
            return loc;

        }
    }
    return null;
}

function addLocation(name, x, rotation) {
    // Prevent a duplicate name...
    if (getKey(name)) return;
    //console.log(getKey(name));
    // Name is valid - go ahead and add it...
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
    if(loc.player == 'Ian'){ /////////////////////////
        tank2.x = loc.x;
        turret2.rotation = loc.rotation;
    }
    //console.log(loc.x);
    //console.log(loc);
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
        name: bullets.name


    }, function(err) {
        if(err) console.dir(err);
    });

}

function moveBullet(x, y){
    var bullet = playerBullets.getFirstExists(false);
    bullet.x = x;
    bullet.y = y;
    //console.log(bullet.x);
}

function showBullets() {
    "use strict";
    var loc, info = "";
    for (loc in BulletsFB) {
        info = getBullets(loc);
       // moveBullet(info.x, info.y);
        //console.log(info);
    }
}
/////////////// not drawing but loc.x ect is working fine i think//////////////////////
function getBullets(bullets){
    var info = bullets + ":", loc = BulletsFB[bullets], itt = 0;
    info += "Name " + loc.name + " @ (" + loc.x + ", " + loc.y;
   // console.log(loc + "       Bullet" + bullets.x);
    //if(loc != null) {

        var N_bullets;
        N_bullets = playerBullets.getFirstExists(false);
        N_bullets.x = loc.x;
        N_bullets.y = loc.y;
        //N_bullets.name = loc.name;
        bulletType2 = loc.type;

        //N_bullets.rotation = game.physics.arcade.moveToXY(N_bullets, 1000, loc.x, loc.y);

        //console.log(N_bullets.x);
        //console.log(N_bullets.x + "  " + N_bullets.y + "   Name " + loc.name);
   // }
    //return info;
    // console.log(loc.x);
    //console.log(loc);
}

function updateLocation(ref, name, x, rotation){

    fb.child("/location/" + ref).set({
        player: name,
        x: x,
        timestamp: Firebase.ServerValue.TIMESTAMP,
        rotation: rotation
    }, function(err) {
        if(err) {
            console.dir(err);
        }
    });

}

function updateBullet(bullet){
    var ref = getBulletKey(bullet.name);
    //console.log(ref);
    //console.log(bullet.name);
    fb.child("/bullets/" + ref).set({
        x: bullet.x,
        y: bullet.y,
        name: bullet.name,
        type: bulletType
    }, function(err) {
        if(err) {
            console.dir(err);
        }
    })
}
function test(bullet){
    console.log("Name:  " +  bullet.name + " X " + bullet.x + " Y " + bullet.y);

}

function update () {

    game.physics.arcade.overlap(enemyBullets, tank, bulletHitPlayer, null, this);

    //updateLoc(1);
    showLocations();

    updateLocation(getKey('Chris'),'Chris', tank.x , turret.rotation);


    if(firing) {

        //updateBullet(getKey(bullets.forEach(getName(this), this)), bullets.getFirstExists(false));
        bullets.forEach(updateBullet, this );
        //updateBullet(bullets.forEach(getName, this), )
        //updateBullet(getKey(bullet.forEach(getName(this)), this), )


    }

    playerBullets.forEach(test, this);





    if (enemiesAlive == 0){
        enemiesTotal ++;
        enemiesAlive = enemiesTotal;
        console.log("YOU WIN!!");
    }


    for (var i = 0; i < enemies.length; i++)
    {
        if (enemies[i].alive)
        {
            //enemiesAlive++;
            game.physics.arcade.collide(tank, enemies[i].tank);
            if(bulletType == 1)
                game.physics.arcade.overlap(bullets, enemies[i].tank, bulletHitEnemy, null, this);
            else if (bulletType == 2)
                game.physics.arcade.overlap(triShot, enemies[i].tank, bulletHitEnemy, null, this);

            game.physics.arcade.overlap(playerBullets, enemies[i].tank, bulletHitEnemy, null, this);

            enemies[i].update();



        }
    }


    game.physics.arcade.overlap(P_FireRate, tank, F_FireRate, null, this);
    game.physics.arcade.overlap(P_shield, tank, F_shield, null, this);
    game.physics.arcade.overlap(P_Trishot, tank, F_Trishot, null, this);
    game.physics.arcade.overlap(P_Turbo, tank, F_Turbo, null, this);



//  The speed we'll travel at
    if(!speedBoost)
        currentSpeed = 3;
    else
        currentSpeed = 10;

    if (cursors.left.isDown)
    {

        tank.position.x -= currentSpeed;
        //game.physics.arcade.accelerateToXY(tank, 600,300, currentSpeed);
    }
    else if (cursors.right.isDown)
    {

        tank.position.x += currentSpeed;
        //game.physics.arcade.accelerateToXY(tank, 0,300, currentSpeed);
    }

    /* if (cursors.up.isDown)
     {
     //  The speed we'll travel at
     if(!speedBoost)
     currentSpeed = 300;
     else
     currentSpeed = 6000;
     }
     else
     {
     if (currentSpeed > 0)
     {
     currentSpeed -= 4;
     }
     }

     if (currentSpeed > 0)
     {
     game.physics.arcade.velocityFromRotation(tank.rotation, currentSpeed, tank.body.velocity);
     } */

    land.tilePosition.x = -game.camera.x;
    land.tilePosition.y = -game.camera.y;

    //  Position all the parts and align rotations
    shadow.x = tank.x;
    shadow.y = tank.y;
    shadow.rotation = tank.rotation;

    shield.x = tank.x;
    shield.y = tank.y;
    shield.rotation = tank.rotation;

    turret.x = tank.x;
    turret.y = tank.y;

    turret2.x = tank2.x;
    turret2.y = tank2.y;

    turret.rotation = game.physics.arcade.angleToPointer(turret);

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

    showBullets();

    if(invulnerable == true){
        tank.tint = 0xFF0000;
        turret.tint = 0xFF0000;
        tank.alpha = 0.3;
        turret.alpha = 0.3;
    }

    if(invulnerable == false){
        tank.tint = 0xFFFFFF;
        turret.tint = 0xFFFFFF;
        tank.alpha = 1;
        turret.alpha = 1;
    }

}



function F_shield(tank, pickup){
    shield = game.add.existing(shield);
    shieldBool = true;
    pickup.kill();
}

function F_Turbo(tank, pickup){
    speedBoost = true;
    pickup.kill();
    var clock = game.time.events.add(Phaser.Timer.SECOND * 4, clockOver, game, 2);
}

function F_Trishot(tank , pickup){
    bulletType = 2;
    pickup.kill();
    var clock = game.time.events.add(Phaser.Timer.SECOND * 4, clockOver, game, 3);
}

function F_FireRate(tank, pickup){

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

function bulletHitPlayer (tank, bullet) {
    bullet.kill();

    if (shieldBool == true) {

        shieldCount+= 1;

        if(shieldCount == 3){

            shieldCount = 0;
            shieldBool = false;
            shield.kill();

            if (invulnerable == false) {
                tank.damage(1);
                invulnerable = true;

                var clock = game.time.events.add(Phaser.Timer.SECOND * 2, clockOver, game, 5);
            }
        }
    }
}

function randDrop(tank){

    var int = game.rnd.integerInRange(0, 100);
    var pickup;


    if (int >61 && int < 70){

        pickup = P_shield.getFirstExists(false);
        pickup.reset(tank.x, tank.y);
        game.physics.arcade.moveToXY(pickup, tank.x, 700, 300);
        console.log("60");
    }
    if (int >71 && int < 80){
        pickup = P_Trishot.getFirstExists(false);
        pickup.reset(tank.x, tank.y);
        game.physics.arcade.moveToXY(pickup, tank.x, 700, 300);
        console.log("70");
    }
    if (int >81 && int < 90){
        pickup = P_FireRate.getFirstExists(false);
        pickup.reset(tank.x, tank.y);
        game.physics.arcade.moveToXY(pickup, tank.x, 700, 300);
        console.log("80");
    }
    if (int >91 && int < 100){
        pickup = P_Turbo.getFirstExists(false);
        pickup.reset(tank.x, tank.y);
        game.physics.arcade.moveToXY(pickup, tank.x, 700, 300);
        console.log("90");
    }



}

function bulletHitEnemy (tank, bullet) {
    bullet.kill();

    var destroyed;
    if(bulletType  == 1)
        destroyed = enemies[tank.name].damage(1);
    else if(bulletType == 2)
        destroyed = enemies[tank.name].damage(2);


    if (destroyed)
    {
        var explosionAnimation = explosions.getFirstExists(false);
        explosionAnimation.reset(tank.x, tank.y);
        explosionAnimation.play('kaboom', 30, false, true);
        randDrop(tank);
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
        //var bullet2 = bullets.getFirstExists(false);

        bullet.reset(turret.x, turret.y);


        bullet.rotation = game.physics.arcade.moveToPointer(bullet, 1000, game.input.activePointer);
        //bullet2.rotation = game.physics.arcade.moveToPointer(bullet2, 30, game.input.activePointer, 30);



    }

}

function render () {

    // game.debug.text('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.length, 32, 32);
    game.debug.text('Enemies: ' + enemiesAlive + ' / ' + enemiesTotal, 32, 32);
    game.debug.text('Health ' + tank.health + ' / ' + enemiesTotal, 32, 52);

}

/**
 * Created by chriz on 04/04/2016.
 */
