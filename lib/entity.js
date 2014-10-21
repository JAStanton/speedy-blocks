/**
 * Entity
 */
var Entity = function(initialDirection) {
  this.direction = initialDirection;
  this.el = document.createElement('div');
  this.el.classList.add('enemy');
  var board = document.getElementById('game');
  board.appendChild(this.el);
};

Entity.prototype.reset = function() {
  this.width = randomBetween(6, 10);
  this.height = randomBetween(6, 10);

  if (this.direction == 0) {
    this.position = new Point(randomBetween(0, 500 - this.width), randomBetween(-300, -100));
  } else if (this.direction == 1) {
    this.position = new Point(randomBetween(0, 500 - this.width), randomBetween(512, 800));
  } else if (this.direction == 2) {
    this.position = new Point(randomBetween(-300, -100), randomBetween(0, 500 - this.width));
  } else if (this.direction == 3) {
    this.position = new Point(randomBetween(512, 800), randomBetween(0, 500 - this.width));
  }

  this.speed = randomBetween(1, 3);
  this.el.style.backgroundColor = randomColor();
  this.el.style.width = this.width + 'px';
  this.el.style.height = this.height + 'px';
  this.el.style.top = this.position.getY('px');
  this.el.style.left = this.position.getX('px');
};


Entity.prototype.changeDirection = function(newDirection) {
  this.direction = newDirection;
};

Entity.prototype.render = function() {
  // Direction
  if (this.direction == 0) {
    this.position.y += this.speed;
  } else if (this.direction == 1) {
    this.position.y -= this.speed;
  } else if (this.direction == 2) {
    this.position.x += this.speed;
  } else if (this.direction == 3) {
    this.position.x -= this.speed;
  }

  this.el.style.top = this.position.getY('px');
  this.el.style.left = this.position.getX('px');

  // Boundary detection
  if (this.direction == 0) {
    if (this.position.y > 500) {
      this.reset();
    }
  } else if (this.direction == 1) {
    if (this.position.y < 0) {
      this.reset();
    }
  } else if (this.direction == 2) {
    if (this.position.x > 500) {
      this.reset();
    }
  } else if (this.direction == 3) {
    if (this.position.x < 0) {
      this.reset();
    }
  }
};
