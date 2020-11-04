import { AltStack, BRAA, Bullseye } from '../canvas/interfaces'

export function getTrackDir(heading: number): string {
  var direction:string = "";
  if (heading > 0 && heading < 20) {
    direction = "NORTH";
  } else if (heading >= 20 && heading < 70) {
    direction = "NORTHEAST";
  } else if (heading >= 70 && heading < 120) {
    direction = "EAST";
  } else if (heading >= 120 && heading < 160) {
    direction = "SOUTHEAST";
  } else if (heading >= 160 && heading < 200) {
    direction = "SOUTH";
  } else if (heading >= 200 && heading < 250) {
    direction = "SOUTHWEST";
  } else if (heading >= 250 && heading < 280) {
    direction = "WEST";
  } else if (heading >= 280 && heading < 340) {
    direction = "NORTHWEST";
  } else {
    direction = "NORTH";
  }
  return direction;
}

export function getBR(x: number, y:number, bullseye: Bullseye): BRAA {
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

export function randomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min);
}
  
export function randomHeading(format: string): number {
    if (format !== "alsa") {
      return randomNumber(60, 120);
    } else {
      return randomNumber(0, 360);
    }
}
  
export function toRadians(angle: number): number {
    return angle * (Math.PI / 180);
}
  
export function toDegrees(rads: number): number {
    return rads * (180 / Math.PI);
}
  
export function lpad(value: number, padding: number): string {
    return ([...Array(padding)].join("0") + value).slice(-padding);
}

export function getAltStack(altitudes: number[], format: string): AltStack {
  var formattedAlts: string[] = altitudes.map((a: number) => ("0" + a).slice(-2) + "0").sort().reverse();
  
  var stackHeights: string[] = [];
  var stackIndexes: number[] = [];

  for (var x = 0; x < formattedAlts.length; x++) {
    if (x + 1 < formattedAlts.length) {
      var diff:number = parseInt(formattedAlts[x]) - parseInt(formattedAlts[x + 1]);
      if (diff >= 100) {
        if (stackHeights.indexOf(formattedAlts[x]) === -1) {
          stackHeights.push(formattedAlts[x]);
        }
        if (stackHeights.indexOf(formattedAlts[x + 1]) === -1) {
          stackIndexes.push(x + 1);
          stackHeights.push(formattedAlts[x + 1]);
        }
      }
    }
  }

  var stacks: string[][] = [];
  var lastZ: number = 0;
  for (var z = 0; z < stackIndexes.length; z++) {
    stacks.push(formattedAlts.slice(lastZ, stackIndexes[z]));
    lastZ = stackIndexes[z];
  }
  stacks.push(formattedAlts.slice(lastZ));

  var answer = formattedAlts[0].replace(/0$/, "k") + " ";
  var answer2 = "";
  if (stacks.length > 1) {
    answer = "STACK ";
    for (var y = 0; y < stacks.length; y++) {
      answer +=
        (y === stacks.length - 1 && format !== "ipe" ? " AND " : "") +
        stacks[y][0].replace(/0$/, "k") +
        " ";
    }

    if (altitudes.length > 2) {
      switch (stacks.length) {
        case 2:
          answer2 += stacks[0].length + " HIGH ";
          answer2 += stacks[1].length + " LOW ";
          break;
        case 3:
          answer2 += stacks[0].length + " HIGH ";
          answer2 += stacks[1].length + " MEDIUM ";
          answer2 += stacks[2].length + " LOW ";
          break;
      }
    }
  }

  if (stacks.length <= 1) {
    altitudes.sort();
    if (altitudes[altitudes.length - 1] >= 40) {
      answer2 += " HIGH ";
    }
  }

  return {
    stack: answer,
    fillIns: answer2
  };
}
  