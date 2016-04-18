
EnemyTank = function (index, game, player, bullets) {

    var x = game.world.randomX;
    var y = game.world.randomY;

    this.game = game;
    this.health = 3;
    this.player = player;
    this.bullets = bullets;
    this.fireRate = 1000;
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
    console.log(this.tank.position.y );

    if (this.tank.position.y > boundary1){
        this.tank.position.y = boundary1 - 1;
        this.tank.body.velocity.y = -this.tank.body.velocity.y;
        console.log("Out of bounds Sir");
    }

    if (this.tank.position.y < boundary){
        this.tank.position.y = boundary + 1;
        this.tank.body.velocity.y = -this.tank.body.velocity.y;
        console.log("Out of bounds Sir");
    }
};

var game = new Phaser.Game(600, 800, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload () {

    game.load.atlas('tank', 'assets/tanks.png', 'assets/tanks.json');
    game.load.atlas('enemy', 'assets/enemy-tanks.png', 'assets/tanks.json');
    game.load.image('logo', 'assets/logo.png');
    game.load.image('bullet', 'assets/bullet.png');
    game.load.image('earth', 'assets/scorched_earth.png');
    game.load.spritesheet('kaboom', 'assets/explosion.png', 64, 64, 23);
    game.load.image('colTest', 'assets/Test.png');
    game.load.image('trishot', 'assets/triBullet.png');
    game.load.image('shield', 'assets/shield.png');

}

var land;

var shadow;
var tank;
var turret;
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
var fireRate = 100;
var nextFire = 0;

var bulletType;
var speedBoost = false;
var clock2;

var invulnerable = false;
var shield;





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



    colTest = game.add.sprite(122, 500, 'colTest', 'colTest');
    colTest.anchor.setTo(0.5, 0.5);
    game.physics.enable(colTest, Phaser.Physics.ARCADE);


    //  Finally the turret that we place on-top of the tank body
    turret = game.add.sprite(0, 0, 'tank', 'turret');
    turret.anchor.setTo(0.3, 0.5);

    //  The enemies bullet group
    enemyBullets = game.add.group();
    enemyBullets.enableBody = true;
    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    enemyBullets.createMultiple(100, 'bullet');

    enemyBullets.setAll('anchor.x', 0.5);
    enemyBullets.setAll('anchor.y', 0.5);
    enemyBullets.setAll('outOfBoundsKill', true);
    enemyBullets.setAll('checkWorldBounds', true);

    //  Create some baddies to waste :)
    enemies = [];

    enemiesTotal = 5;
    enemiesAlive = 5;

    for (var i = 0; i < enemiesTotal; i++)
    {
        enemies.push(new EnemyTank(i, game, tank, enemyBullets));
    }

    //  A shadow below our tank
    shadow = game.add.sprite(0, 0, 'tank', 'shadow');
    shadow.anchor.setTo(0.5, 0.5);

    shield = game.add.sprite(0, 0, 'shield');
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

    logo = game.add.sprite(0, 200, 'logo');
    logo.fixedToCamera = true;

    game.input.onDown.add(removeLogo, this);

    game.camera.follow(tank);
    game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
    game.camera.focusOnXY(0, 0);

    cursors = game.input.keyboard.createCursorKeys();



}

function removeLogo () {

    game.input.onDown.remove(removeLogo, this);
    logo.kill();

}

function update () {

    game.physics.arcade.overlap(enemyBullets, tank, bulletHitPlayer, null, this);

    enemiesAlive = 0;

    for (var i = 0; i < enemies.length; i++)
    {
        if (enemies[i].alive)
        {
            enemiesAlive++;
            game.physics.arcade.collide(tank, enemies[i].tank);
            if(bulletType == 1)
                game.physics.arcade.overlap(bullets, enemies[i].tank, bulletHitEnemy, null, this);
            else if (bulletType == 2)
                game.physics.arcade.overlap(triShot, enemies[i].tank, bulletHitEnemy, null, this);

            enemies[i].update();


            
        }
    }
    
    game.physics.arcade.overlap(colTest, tank, killTest, null, this);





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

    turret.rotation = game.physics.arcade.angleToPointer(turret);

    if (game.input.activePointer.isDown)
    {
        //  Boom!
        fire();


        //console.log("fire");
    }

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

function killTest(turboFire, tank)
{
    //speedBoost = true;

    //shield = true;

    var clock = game.time.events.add(Phaser.Timer.SECOND * 15, clockOver, game, 2);
    turboFire.kill();




    //bulletType = 2;
    //fireRate = 10;

}
function clockOver(type){

    console.log(invulnerable);

    if(type == 1)
        speedBoost = false;


    if(type == 2)
        invulnerable = false;

    console.log("Time stopped");




    // console.log(clock2.seconds);
}

function bulletHitPlayer (tank, bullet) {



    if(invulnerable == false) {
        tank.damage(1);
        bullet.kill();

        invulnerable = true;

        var clock = game.time.events.add(Phaser.Timer.SECOND * 2, clockOver, game, 2);
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
    }

}

function fire () {

    if (game.time.now > nextFire && bullets.countDead() > 0)
    {


        nextFire = game.time.now + fireRate;

        var bullet;
    if (bulletType == 1)
        bullet = bullets.getFirstExists(false);
    else if(bulletType == 2)
        bullet = triShot.getFirstExists(false);
        //var bullet2 = bullets.getFirstExists(false);

        bullet.reset(turret.x, turret.y);

        
        bullet.rotation = game.physics.arcade.moveToPointer(bullet, 1000, game.input.activePointer, 500);
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
