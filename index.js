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
var cursor;

var game = new Phaser.Game(config);
var container = new Phaser.Geom.Rectangle(0,0,800,600);


function preload() {
    this.load.image('cursor', 'rcbf1.png')

}

var sprite;
var sprites = new Phaser.Structs.List();

function create() {

    const text = this.add.text(350, 250, '', { font: '16px Courier', fill: '#00ff00' });
    
    this.add.existing(container);
    //this.add.rectangle(400,300,800,600).setFillStyle(0xffff00);
    var blocks = this.physics.add.group({key: 'cursor', frameQuantity: 6, setXY: { x: 100, y: 400, stepX: 100 }});
    circ = this.add.circle(200, 100, 50);
    cursor = this.add.image(0,0,'cursor');
    var wheat = this.add.image('wheat', 'wheat.png')

    cursor.setDataEnabled();
    cursor.data.set('Leafs',0);

    text.setText([
        'Leafs: ' + cursor.data.get('Leafs'),
    ]); 
    cursor.on('changedata-Leafs', function (gameObject, value) {
        text.setText([
            'Leafs: ' + cursor.data.get('Leafs'),
        ]); 
    });

    for (var i = 0; i < 100; i++)
    {
        var pos = Phaser.Geom.Rectangle.Random(this.physics.world.bounds);

        var block = this.physics.add.image(pos.x, pos.y, 'cursor');
        
        block.setDamping(true)
        block.setDrag(0.2);

        sprites.add(block);
    }

    this.input.on('pointermove', function (pointer){
        circ.setPosition(pointer.x,pointer.y)
        cursor.setVisible(true).setPosition(pointer.x, pointer.y);
    },this);
}
function leafOut(){

}
function update() {
    var bodies = this.physics.overlapCirc(circ.x, circ.y, circ.radius, true, true);
    for(var i =0; i<bodies.length; i++){
        //console.log(bodies[i]);
        var velX = bodies[i].x - circ.x;
        var velY = bodies[i].y - circ.y;
        bodies[i].setVelocity(bodies[i].velocity.x + velX,bodies[i].velocity.y +velY);
    }
    for(var i =0; i<sprites.length; i++){
        //sprites[i].setAcceleration(0);
        var leaf = sprites.getAt(i);
        if(!container.contains( leaf.x, leaf.y)){
            //console.log("here");
            leaf.destroy();
            cursor.data.values.Leafs += 1;
            sprites.remove(leaf);
        }
        //sprites[i].setVelocity(0);
    }
    Phaser.Actions.SetAlpha(bodies.map((body) => body.gameObject), 1);
}