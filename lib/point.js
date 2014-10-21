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
