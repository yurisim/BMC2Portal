

export function getBR(x, y, bullseye) {
    var deltaX = bullseye.x - x;
    var deltaY = bullseye.y - y;
  
    var rng = Math.floor(Math.sqrt(deltaX * deltaX + deltaY * deltaY) / 4);
    var brg = Math.round(270 + toDegrees(Math.atan2(bullseye.y - y, bullseye.x - x)));
    if (brg > 360) {
      brg = brg - 360;
    }
  
    return {
      bearing: lpad(brg, 3),
      range: rng
    };
}

export function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
  
export function randomHeading(format) {
    if (format !== "ALSA") {
      return randomNumber(60, 120);
    } else {
      return randomNumber(0, 360);
    }
}
  
export function toRadians(angle) {
    return angle * (Math.PI / 180);
}
  
export function toDegrees(rads) {
    return rads * (180 / Math.PI);
}
  
export function lpad(value, padding) {
    return ([...Array(padding)].join("0") + value).slice(-padding);
}
  