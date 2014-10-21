/**
 * Game
 */
var Game = function() {
  this.playing = false;
  this.width = 500;
  this.height = 500;
  this.position = new Point(0, 0);
  this.outerElement = document.getElementById('game-board');
  this.el = document.createElement('div');
  this.el.id = 'game';
  this.el.style.width = this.width + 'px';
  this.el.style.height = this.height + 'px';
  this.el.style.top = this.position.getY('px');
  this.el.style.left = this.position.getX('px');
  this.score = 0;
  this.scoreBoardEl = document.createElement('div');
  this.scoreBoardEl.classList.add('score-board');
  this.scoreBoardEl.innerHTML = this.score;
  this.directionChangeIntreval;

  this.scoreBoard = document.getElementById('leaderboard-table');
  this.scoreInput = document.getElementById('scoreInput');
  this.nameInput = document.getElementById('nameInput');
};

Game.prototype.startChangeIntreval = function() {
  this.directionChangeIntreval = setTimeout(function() {
    var newDirection = randomBetween(0, 5);
    for (var i = 0; i < this.enemies.length; i++) {
      if (newDirection >= 4) {
        this.el.classList.add('berzerk');
        this.enemies[i].changeDirection(randomBetween(0, 3));
      } else {
        this.el.classList.remove('berzerk');
        this.enemies[i].changeDirection(newDirection);
      }
    };
  this.startChangeIntreval();
  }.bind(this), randomBetween(2000, 5000));
};

Game.prototype.stopChangeIntreval = function() {
  window.clearInterval(this.directionChangeIntreval);
};

Game.prototype.init = function() {
  this.outerElement.insertBefore(this.el, this.scoreBoard);
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
