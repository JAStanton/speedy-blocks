function randomColor() {
  return '#'+Math.floor(Math.random()*16777215).toString(16);
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
