(function () {
var d = document;

window.Box = function (o) {
	if (o===undefined) o = {};
	
	this.div = o.id === undefined
			   ? d.createElement('div') : d.getElementById(o.id);
	(this.style = this.div.style).overflow = 'hidden';
	this.children = [];
	
	for (var i in o) this[i] = o[i];
	this.prev = { x:null, y:null, w:null, h:null, color:null, visible:null };
	this.updateStyle();
	
	if (this.rate !== null) {
		this.style.position = 'relative';
		var t = this;
		(function tick() {
			if (t.rate > 0)
				setTimeout(function () {
					t.update();
					t.updateChildren();
					t.updatStyle();
					tick();
				}, t.rate);
			else setTimeout(tick, 200);
		})();
	}
	else {
		this.style.position = 'absolute';
	}
};

Box.prototype = {
	constructor: Box,
	init: function(){},	// can be overridden, useful for extended classes
	parent: null,		// the parent box (which contains this)
	children: null,		// array of child boxes (contained by this)
	div: null,			// the <div> element that is linked to the box
	style: null,		// shorcut to this.div.style
	rate: null,			// (only for the stage) update interval in milliseconds
	
	// properties that affect the style of the box's div element:
	x:0, y:0, w:0, h:0, color:'#000000', visible:true,
	prev: null,
	set: {
		x: function (v) { this.style.left = v+'px'; },
		y: function (v) { this.style.top = v+'px'; },
		w: function (v) { this.style.width = v+'px'; },
		h: function (v) { this.style.height = v+'px'; },
		color: function (v) { this.style.backgroundColor = v; },
		visible: function (v) { this.style.display = v?'block':'none'; }
	},
	
	// called by the stage, checks for changed properties and applies changes
	//  to the div's style:
	updateStyle: function () {
		for (var i in this.prev)
			if (this[i] !== this.prev[i]) 
				this.set[i].call(this, this.prev[i] = this[i]);
	},
	
	// called by the stage, updates the box's children:
	updateChildren: function () {
		for (var i=0; i<this.children.length; i++) {
			var c = this.children[i];
			c.update();
			c.updateChildren();
			c.updateStyle();
		}
	},
	
	// called by the stage, can be overridden for custom behaviour:
	update: function(){},
	
	
	// add a child to this box and return it:
	add: function (b) {
		if (b.parent !== null) {
			b.parent.children.slice(b.parent.children.indexOf(b), 1);
			b.parent.div.removeChild(b.div);
		}
		(b.parent=this).children.push(b);
		this.div.appendChild(b.div);
		return b;
	},
	
	// remove a child from this box and return it:
	remove: function (b) {
		var n = this.children.indexOf(b);
		if (n !== -1) {
			this.div.removeChild(b.div);
			return this.children.slice(n, 1)[0];
		}
		return null;
	},
	
	// checks for a collision between two boxes, doesn't check the parents, so
	//  is inaccurate if the boxes' parents have different x/ys:
	overlaps: function (b) {
		return b.x+b.w > this.x && b.x < this.x+this.w
			&& b.y+b.h > this.y && b.y < this.y+this.h;
	}
	
};
Box.extend = function (o) {
	var constr = this;
	function Class(a) {
		constr.call(this, a);
		this.init();
	}
	for (var i in this.prototype)
		Class.prototype[i] = this.prototype[i];
	for (var i in o)
		Class.prototype[i] = o[i];
	return Class;
};
})();
