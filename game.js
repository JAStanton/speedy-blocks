function randomColor() {
  return '#'+Math.floor(Math.random()*16777215).toString(16);
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}


/**
 * Point
 */
var Point = function(x, y) {
  this.x = x || 0;
  this.y = y || 0;
};

Point.prototype.getX = function(opt_unit) {
  return opt_unit ? this.x + opt_unit : this.x;
};

Point.prototype.getY = function(opt_unit) {
  return opt_unit ? this.y + opt_unit : this.y;
};

/**
 * Entity
 */
var Entity = function(initialDirection) {
  this.direction = initialDirection;
  this.el = document.createElement("div");
  this.el.classList.add('enemy');
  var board = document.getElementById('game-board');
  board.appendChild(this.el);
}

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
  this.el.style.width = this.width + "px";
  this.el.style.height = this.height + "px";
  this.el.style.top = this.position.getY("px");
  this.el.style.left = this.position.getX("px");
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

  this.el.style.top = this.position.getY("px");
  this.el.style.left = this.position.getX("px");

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


/**
 * Game
 */
var Game = function() {
  this.playing = false;
  this.width = 500;
  this.height = 500;
  this.position = new Point(10, 10);
  this.el = document.createElement("div");
  this.el.id = 'game-board';
  this.el.style.width = this.width + "px";
  this.el.style.height = this.height + "px";
  this.el.style.top = this.position.getY("px");
  this.el.style.left = this.position.getX("px");
  this.score = 0;
  this.scoreBoardEl = document.createElement("div");
  this.scoreBoardEl.classList.add('score-board');
  this.scoreBoardEl.innerHTML = this.score;
  this.directionChangeIntreval;

  this.scoreBoard = document.getElementById("leaderboardTable");
  this.scoreInput = document.getElementById("scoreInput");
  this.nameInput = document.getElementById("nameInput");
};

Game.prototype.startChangeIntreval = function() {
  this.directionChangeIntreval = setTimeout(function() {
    var newDirection = randomBetween(0, 5);
    for (var i = 0; i < this.enemies.length; i++) {
      if (newDirection >= 4) {
        this.el.classList.add('crazy');
        this.enemies[i].changeDirection(randomBetween(0, 3));
      } else {
        this.el.classList.remove('crazy');
        this.enemies[i].changeDirection(newDirection);
      }
    };
  this.startChangeIntreval();
  }.bind(this), randomBetween(2000, 5000));
}

Game.prototype.stopChangeIntreval = function() {
  window.clearInterval(this.directionChangeIntreval);
}

Game.prototype.init = function() {
  document.body.appendChild(this.el);
  this.el.appendChild(this.scoreBoardEl);
  this.enemies = [];
  var initialDirection = randomBetween(0, 3);
  for (var i = 0; i < 150; i++) {
    var enemy = new Entity(initialDirection);
    enemy.reset();
    enemy.el.addEventListener('mouseover', this.end.bind(this));
    this.enemies.push(enemy);
  };

  this.el.addEventListener('mousedown', this.resume.bind(this));
  window.addEventListener('blur', this.end.bind(this));
  this.el.addEventListener('mouseout', this.end.bind(this));
};

Game.prototype.resume = function() {
  if (this.playing) return;
  this.score = 0;
  this.playing = true;
  this.render();
  this.el.classList.remove('end');
  this.startChangeIntreval();
  scoreInput.value = '';
  this.scoreBoard.classList.add('disabled');
};

Game.prototype.end = function() {
  scoreInput.value = this.score;
  this.nameInput.focus();
  this.playing = false;
  this.el.classList.add('end');
  this.stopChangeIntreval();
  this.scoreBoard.classList.remove('disabled');
};

Game.prototype.render = function() {
  if (!this.playing) return;
  for (var i = 0; i < this.enemies.length; i++) {
    this.enemies[i].render();
  };
  this.score += 1;
  this.scoreBoardEl.innerHTML = this.score;
  window.requestAnimationFrame(this.render.bind(this));
};


var game = new Game();
game.init();
