var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    disableContextMenu: true,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
};

var text;
var circ;

var game = new Phaser.Game(config);

function preload() {
    this.load.image('cursor', 'rcbf1.png')

}

var sprite;
var sprites = [];

function create() {

    var blocks = this.physics.add.group({key: 'cursor', frameQuantity: 6, setXY: { x: 100, y: 400, stepX: 100 }});
    circ = this.add.circle(200, 100, 50).setStrokeStyle(2, 0xffff00);
    var cursor = this.add.image(0,0,'cursor');
    var wheat = this.add.image('wheat', 'wheat.png')

    for (var i = 0; i < 100; i++)
    {
        var pos = Phaser.Geom.Rectangle.Random(this.physics.world.bounds);

        var block = this.physics.add.image(pos.x, pos.y, 'cursor');

        //block.setBounce(1).setCollideWorldBounds(true);
        block.setDamping(true)
        block.setDrag(0.2);

        //Phaser.Math.RandomXY(block.body.velocity, 100);

        sprites.push(block);
    }

    this.input.on('pointermove', function (pointer){
        circ.setPosition(pointer.x,pointer.y)
        cursor.setVisible(true).setPosition(pointer.x, pointer.y);
    },this);
}

function update() {
    var bodies = this.physics.overlapCirc(circ.x, circ.y, circ.radius, true, true);
    for(var i =0; i<bodies.length; i++){
        //console.log(bodies[i]);
        var velX = bodies[i].x - circ.x;
        var velY = bodies[i].y - circ.y;
        bodies[i].setVelocity(velX* 5,velY*5);
    }
    for(var i =0; i<sprites.length; i++){
        sprites[i].setAcceleration(0);
        //sprites[i].setVelocity(0);
    }
    Phaser.Actions.SetAlpha(bodies.map((body) => body.gameObject), 1);
}