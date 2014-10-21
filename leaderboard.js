var LeaderBoard = function(firebaseId) {
  this.scoreListRef_ = new Firebase(firebaseId);
  this.scoreListView_ = this.scoreListRef_.limit(LeaderBoard.SIZE);
  this.leaderboardTable_ = document.getElementById("leaderboardTable");
  this.nameInput_ = document.getElementById("nameInput");
  this.scoreInput_ = document.getElementById("scoreInput");
  this.htmlForPath_ = {};
  this.bindEvents_();
};


LeaderBoard.SIZE = 100;


LeaderBoard.prototype.bindEvents_ = function() {
  this.scoreListView_.on('child_moved', this.changedCallback_.bind(this));
  this.scoreListView_.on('child_changed', this.changedCallback_.bind(this));
  this.scoreListView_.on('child_added', this.handleScoreAdded_.bind(this));
  this.scoreListView_.on('child_removed', this.handleScoreRemoved_.bind(this));

  this.nameInput_.addEventListener("keyup", function(evt) {
    if (evt.keyCode != 13) return;
    var newScore = Number(this.scoreInput_.value);
    var name = this.nameInput_.value;
    this.scoreInput_.value = '';
    if (name.length === 0) return;
    var userScoreRef = this.scoreListRef_.child(name);
    userScoreRef.setWithPriority({ name:name, score:newScore }, newScore);
  }.bind(this));
};


LeaderBoard.prototype.handleScoreAdded_ =
    function(scoreSnapshot, prevScoreName) {
  var newScoreRow = document.createElement("tr");
  newScoreRow.innerHTML =
      "<td>" + scoreSnapshot.val().name  + "</td>" +
      "<td>" + scoreSnapshot.val().score + "</td>";

  // Store a reference to the table row so we can get it again later.
  this.htmlForPath_[scoreSnapshot.name()] = newScoreRow;

  // Insert the new score in the appropriate place in the table.
  if (prevScoreName === null) {
    this.leaderboardTable_.appendChild(newScoreRow);
  } else {
    var lowerScoreRow = this.htmlForPath_[prevScoreName];
    this.leaderboardTable_.insertBefore(newScoreRow, lowerScoreRow);
  }
};


LeaderBoard.prototype.handleScoreRemoved_ = function(scoreSnapshot) {
  var removedScoreRow = this.htmlForPath_[scoreSnapshot.name()];
  removedScoreRow.remove();
  delete this.htmlForPath_[scoreSnapshot.name()];
};


LeaderBoard.prototype.changedCallback_ = function(scoreSnapshot, prevScoreName) {
  this.handleScoreRemoved_(scoreSnapshot);
  this.handleScoreAdded_(scoreSnapshot, prevScoreName);
};


var leaderboard =
    new LeaderBoard('https://boiling-fire-7438.firebaseio-demo.com/scoreList');
