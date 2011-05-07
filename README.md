Box.js
=======
By [Jeremy Clarke (geckojsc)](http://geckojsc.com/)
MIT Licensed

Box is a JS class which simplifies making cross-browser games
with the DOM. It gives you a flexible and extensible object-
oriented rectangle system to ease the development process.

### Getting Started ###
Box.js is pretty easy to pick up. Let's make a simple box:

```javascript
var b = new Box({x:10, y:20, w:8, h:8, color:'#f00'});
```
If you try running that, you won't see anything. Why not? When
you make a new box a div is made to represent it, but the div
is not added to the document.

```html
<div id="stage"></div>
<script>
  var stage = new Box({w:400, h:300, id:'stage', rate:50});
  var b = new Box({x:10, y:20, w:8, h:8, color:'#f00'});
  stage.add(b);
</script>
```
What we just did, was create a 'stage' for our game, and bind
it to an existing DOM element using the *id* parameter. Also,
we used the *rate* parameter to make the stage update every 50
milliseconds. This will be useful when we start moving things
around. Let's tweak our declaration of 'b':

```javascript
var b = new Box({
  x:10, y:20, w:8, h:8, color:'#f00',
  update: function () {
	this.x += 1;
  }
});
```
Here, we provided an *update* method for our box. Every 50
milliseconds, the stage loops through all its children and
calls their update function, as well as applying any visual
changes that have been made.
