game.module(
	'plugins.pe_loader'
)
.require(
	'plugins.p2'
)
.body(function() {

	game.createClass('P2Sprite', 'Sprite', {

		init: function(img, physics, x, y) {

			if(typeof physics === 'undefined'){physics = {};};
			
			this._super(img, x, y);
			this.anchor.set(0.5, 0.5);
			
			this.body = new game.Body();
			this.body.fromJSON(physics);
			
			//set anchor
			this.anchor.set(
				this.body.anchorPosition.x / this.width, 
				this.body.anchorPosition.y / this.height 
			);
			
			this.body.position = [
				x / game.scene.world.ratio,
				y / game.scene.world.ratio
			];
			
			this.body.collide = this.collide.bind(this);
			
			
			//add body to world and scene
			game.scene.world.addBody(this.body);
			game.scene.addObject(this);

		},
		
		collide: function(){
			console.log("!");
		},
		
		update: function(){
			this.position.x = this.body.position[0] * game.scene.world.ratio;
			this.position.y = this.body.position[1] * game.scene.world.ratio;
			this.rotation = this.body.angle;
		},

		remove: function() {
			game.scene.world.removeBody(this.body);
			game.scene.removeObject(this);
			this._super();
		}
		
	});
	

	//update debug drawer
	game.DebugDraw.inject({
	    drawBodySprite: function(sprite, body) {
	        sprite.clear();
	        sprite.beginFill(game.DebugDraw.bodyColor);
	
	        if(body.shapes[0] instanceof game.Rectangle) {
	            sprite.drawRect(-body.shapes[0].width / 2 * game.scene.world.ratio, -body.shapes[0].height / 2 * game.scene.world.ratio, body.shapes[0].width * game.scene.world.ratio, body.shapes[0].height * game.scene.world.ratio);
	        }
	        if(body.shapes[0] instanceof game.Circle) {
	            sprite.drawCircle(0, 0, body.shapes[0].radius * game.scene.world.ratio);
	        }
	        if(typeof body.concavePath !== "undefined" && body.concavePath !== null){
				for(var i=0; i<body.concavePath.length; i++){
					if (i == 0) {sprite.moveTo(body.concavePath[i][0] * game.scene.world.ratio, body.concavePath[i][1] * game.scene.world.ratio);}
					else		{sprite.lineTo(body.concavePath[i][0] * game.scene.world.ratio, body.concavePath[i][1] * game.scene.world.ratio);}
				}
	        }
	    }
	});
	
	//load the settings for the body from a JSON that is generataed in PhysicsEditor (https://www.codeandweb.com/physicseditor)
	game.Body.prototype.fromJSON = function(settings) {
	    // Remove all shapes
	    for(var i=this.shapes.length; i>=0; --i){
	        this.removeShape(this.shapes[i]);
	    }
		//Add shape. Currently only a single circle or polygon are supported
		if(settings.shapes.length > 0){
			var shapeSettings = game.copy(settings.shapes[0]);
			if(shapeSettings.type === "CIRCLE"){
				//circle
				var shape = new game.Circle(shapeSettings.radius / game.scene.world.ratio);
				shape.position = shapeSettings.center;
				this.addShape(shape);
				this.anchorPosition = new game.Vector(shapeSettings.center.x, shapeSettings.center.y);
			}
			else{
				//polygon
				for(var i=0; i<shapeSettings.polygon.length; i++){
					shapeSettings.polygon[i][0] /= game.scene.world.ratio;
					shapeSettings.polygon[i][1] /= game.scene.world.ratio;
				}
				//store old position
				var positionOld = game.copy(this.position);
				//set polygon
				this.fromPolygon(shapeSettings.polygon);
				//calculate the coordinates of the anchor point
				this.anchorPosition = new game.Vector(
					this.position[0] - positionOld[0],
					this.position[1] - positionOld[1]
				).multiply(game.scene.world.ratio);
				
			}
			//now add other shape related settings
			for(var i = 0; i< this.shapes.length; i++){
				if(typeof settings.shapes[0].sensor !== "undefined"){this.shapes[i].sensor = settings.shapes[0].sensor;}
				if(typeof settings.shapes[0].collisionGroup !== "undefined"){this.shapes[i].collisionGroup = settings.shapes[0].collisionGroup;}
				if(typeof settings.shapes[0].collisionMask !== "undefined"){this.shapes[i].collisionMask = settings.shapes[0].collisionMask;}
			}
		}
		//update body settings
		if(typeof settings.damping !== "undefined"){this.damping = settings.damping;}
		if(typeof settings.angularDamping !== "undefined"){this.angularDamping = settings.angularDamping;}
		if(typeof settings.gravityScale !== "undefined"){this.gravityScale = settings.gravityScale;}
		if(typeof settings.mass !== "undefined"){this.mass = settings.mass;}
		if(!this.mass){
	        this.type = this.STATIC;
	    } 
	    else {
	        this.type = this.DYNAMIC;
	    }
	    this.updateMassProperties();
	};
	
	
});



