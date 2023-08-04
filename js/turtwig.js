const TURT_LOCALSTORAGE_KEY = "TURT";
let perFrameDistance = 0.3;
let cursorOffset = 12;
const EATING_TIME = 10000; // ms
const STARTING_OFFSET = 40;
const GROTLE_SPEED_FACTOR = 2;
const TORTERRA_SPEED_FACTOR = 4;
let eating_start = null;
let eaten = false;
let stage = "turtwig";

function loadConfig() {
  const config = localStorage.getItem(TURT_LOCALSTORAGE_KEY);
  if (!config) {
    return {
      level: 0,
      enabled: true,
    };
  }

  return JSON.parse(config);
}

const config = loadConfig();

function saveConfig() {
  localStorage.setItem(TURT_LOCALSTORAGE_KEY, JSON.stringify(config));
}

function incrementLevel() {
  config.level += 1;

  saveConfig();
}

function toggleEnabled() {
  config.enabled = !config.enabled;

  if (config.enabled) {
    freeTurt();
  } else {
    banishTurt();
  }

  saveConfig();
}

function getInitialStartPoint() {
  const point = {
    x: window.screen.width * Math.random(),
    y: window.screen.height * Math.random(),
  };

  if (config?.level > 0) {
    if (Math.random() > 0.5) {
      point.x = -STARTING_OFFSET;
    } else {
      point.y = -STARTING_OFFSET;
    }
  }

  return point;
}
let current = { x: -32, y: -32 };
// const current = getInitialStartPoint();
const target = { x: 0, y: 0 };

function angle(cx, cy, ex, ey) {
  const dy = ey - cy;
  const dx = ex - cx;
  let theta = Math.atan2(dy, dx); // range (-PI, PI]
  theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
  //if (theta < 0) theta = 360 + theta; // range [0, 360)
  return theta;
}

function getHeading(current, target) {
  const angl = angle(current.x, current.y, target.x, target.y);

  // -157 > -122 = NW
  if (-157 <= angl && angl < -122) {
    return "NW";
  }

  // -122 > -67 = N
  else if (-122 <= angl && angl < -67) {
    return "N";
  }

  // -67 > -22 = NE
  else if (-67 <= angl && angl < -22) {
    return "NE";
  }

  // -22 > 23 = E
  else if (-22 <= angl && angl < 23) {
    return "E";
  }

  // 23 > 68 = SE
  else if (23 <= angl && angl < 68) {
    return "SE";
  }

  // 68 > 113 = S
  else if (68 <= angl && angl < 113) {
    return "S";
  }

  // 113 > 158 = SW
  else if (113 <= angl && angl < 158) {
    return "SW";
  }

  // < -157  || > 158 = W
  else {
    return "W";
  }
}

function calculateNextPosition(current, target) {
  const angle = Math.atan2(target.y - current.y, target.x - current.x);
  const sin = Math.sin(angle) * perFrameDistance;
  const cos = Math.cos(angle) * perFrameDistance;

  return { cos, sin };
}

function animateMove() {
  if (!config.enabled) {
    return;
  }

  delete turtwig.title;
  turtwig.style.top = current.y + "px";
  turtwig.style.left = current.x + "px";

  if (eaten) {
    // he's full, go to sleep
    turtwig.className = `${stage} sleep`;
    document.body.classList.add("eaten");
    incrementLevel();
    turtwig.title = "Level: " + config.level;

    // ! DONT CHECK ANIMATION FRAME ANYMORE WERE DONE !
  } else if (
    (Math.floor(current.x) === target.x || Math.ceil(current.x) === target.x) &&
    (Math.floor(current.y) === target.y || Math.ceil(current.y) === target.y)
  ) {
    // if we're there, do the eating animation
    turtwig.className = `${stage} eat`;
    if (eating_start === null) {
      eating_start = Date.now();
    } else if (Date.now() >= eating_start + EATING_TIME) {
      eaten = true;
    }

    window.requestAnimationFrame(animateMove);
  } else {
    eating_start = null;
    // move and rotate turtwig
    turtwig.className = `${stage} ${getHeading(current, target)}`;
    const { cos, sin } = calculateNextPosition(current, target);
    current.x += cos;
    current.y += sin;

    window.requestAnimationFrame(animateMove);
  }
}

function onEggClick() {
  const turtwig = document.getElementById("turtwig");
  turtwig.onclick = null;

  incrementLevel();
  freeTurt();
}

function freeTurt() {
  document.body.classList.add("leaf");
  document.getElementById("turtwig").classList.remove("banished");
  window.requestAnimationFrame(animateMove);
}

function banishTurt() {
  document.body.classList.remove("leaf");
  document.getElementById("turtwig").classList.add("banished");
}

let started = false;
function start() {
  started = true;
  current = getInitialStartPoint();

  if (config.level > 0) {
    freeTurt();
    stage = "turtwig";

    if (config.level >= 32) {
      stage = "torterra";
      perFrameDistance /= TORTERRA_SPEED_FACTOR;
      cursorOffset = 20;
    } else if (config.level >= 18) {
      stage = "grotle";
      perFrameDistance /= GROTLE_SPEED_FACTOR;
      cursorOffset = 15;
    }
  } else {
    const turtwig = document.getElementById("turtwig");

    turtwig.className = "egg";
    turtwig.title = "???";
    turtwig.style.top = current.y + "px";
    turtwig.style.left = current.x + "px";
    turtwig.onclick = onEggClick;
  }
}

document.addEventListener("mousemove", function (e) {
  if (!started && config.enabled) {
    start();
  }

  target.x = e.pageX;
  target.y = e.pageY - cursorOffset;
});

const turtTogglerBtn = document.getElementById("turtToggler");
function updateTogglerState() {
  if (config.enabled) {
    turtTogglerBtn.classList.add("btn-success");
    turtTogglerBtn.classList.remove("btn-warning");
    turtTogglerBtn.innerHTML = "turt = on";
  } else {
    turtTogglerBtn.classList.add("btn-warning");
    turtTogglerBtn.classList.remove("btn-success");
    turtTogglerBtn.innerHTML = "turt = off";
  }
}
turtTogglerBtn.addEventListener("click", function turtToggler() {
  toggleEnabled();
  updateTogglerState();
});
updateTogglerState();
