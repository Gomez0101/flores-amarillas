var audio = document.querySelector("audio");

// Ocultar el mensaje después de un rato para que se vea bien la foto de fondo
var TITLE_HIDE_DELAY = 20000; // Milisegundos que se muestra el mensaje

setTimeout(ocultarTitulo, TITLE_HIDE_DELAY);

//funcion titulo
// Función para ocultar el título con un desvanecimiento
function ocultarTitulo() {
  var titulo = document.querySelector(".titulo");
  titulo.style.animation =
    "fadeOut 3s ease-in-out forwards"; /* Duración y función de temporización de la desaparición */
  setTimeout(function () {
    titulo.style.display = "none";
  }, 3000); // Espera 3 segundos antes de ocultar completamente
}

// Si el navegador bloquea la reproducción automática, pide un toque para iniciar la música
var playButton = document.querySelector("#play");

function iniciarMusica() {
  audio.play().then(function () {
    playButton.hidden = true;
  }).catch(function () {
    playButton.hidden = false;
  });
}

playButton.addEventListener("click", iniciarMusica);
iniciarMusica();


// Corazones que aparecen por toda la pantalla, crecen y explotan
// Los moraditos se repiten para que salgan más seguido: son nuestro corazón 💜
var HEART_COLORS = [
  "#9d4edd", "#b366ff", "#c77dff", "#e0aaff", "#9d4edd", "#c77dff",
  "#ff4d6d", "#ff8fab", "#ffb3c6", "#ffd60a", "#ffffff",
];
var HEART_START_DELAY = 3500; // Espera a que las flores terminen de abrir (ms)
var HEART_INTERVAL = 180; // Cada cuánto aparece un corazón (ms)
var MAX_HEARTS = 40; // Límite de corazones a la vez para no poner lenta la página
var BURST_PIECES = 8; // Pedacitos que salen al explotar
var HEART_SVG =
  '<svg viewBox="0 0 32 29" aria-hidden="true"><path d="M16 29 13.7 26.9C5.4 19.4 0 14.5 0 8.5 0 3.6 3.8 0 8.7 0c2.8 0 5.4 1.3 7.3 3.3C17.9 1.3 20.5 0 23.3 0 28.2 0 32 3.6 32 8.5c0 6-5.4 10.9-13.7 18.4Z" fill="currentColor"/></svg>';

var heartsLayer = document.querySelector(".hearts");

function colorAlAzar() {
  return HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
}

function crearElementoCorazon(className, x, y, size, color) {
  var heart = document.createElement("span");
  heart.className = className;
  heart.innerHTML = HEART_SVG;
  heart.style.left = x + "px";
  heart.style.top = y + "px";
  heart.style.width = size + "px";
  heart.style.height = size + "px";
  heart.style.color = color;
  return heart;
}

function explotar(x, y, size, color) {
  // Destello en forma de anillo
  var ring = document.createElement("span");
  ring.className = "heart-ring";
  ring.style.left = x + "px";
  ring.style.top = y + "px";
  ring.style.width = size * 2.5 + "px";
  ring.style.height = size * 2.5 + "px";
  ring.style.color = color;
  ring.addEventListener("animationend", function () {
    ring.remove();
  });
  heartsLayer.appendChild(ring);

  // Mini corazones que salen disparados en círculo
  for (var i = 0; i < BURST_PIECES; i++) {
    var angle = (Math.PI * 2 * i) / BURST_PIECES + Math.random() * 0.4;
    var distance = size * (1.2 + Math.random() * 1.2);
    var piece = crearElementoCorazon("heart-piece", x, y, size * 0.3, i % 2 ? color : colorAlAzar());
    piece.style.setProperty("--dx", Math.cos(angle) * distance + "px");
    piece.style.setProperty("--dy", Math.sin(angle) * distance + "px");
    piece.addEventListener("animationend", function () {
      this.remove();
    });
    heartsLayer.appendChild(piece);
  }
}

function crearCorazon() {
  if (document.hidden || heartsLayer.childElementCount > MAX_HEARTS * 3) return;

  var size = 22 + Math.random() * 34; // Entre 22px y 56px
  var x = Math.random() * window.innerWidth;
  var y = Math.random() * window.innerHeight;
  var color = colorAlAzar();
  var duration = 2.2 + Math.random() * 1.8; // Tiempo que pasea y crece antes de explotar

  var heart = crearElementoCorazon("heart", x, y, size, color);
  heart.style.animationDuration = duration + "s";
  heart.style.setProperty("--tilt", (Math.random() - 0.5) * 40 + "deg");

  // Camino libre: tres puntos al azar por donde pasea el corazón
  var px = 0;
  var py = 0;
  for (var i = 1; i <= 3; i++) {
    px += (Math.random() - 0.5) * 160;
    py += (Math.random() - 0.5) * 160;
    heart.style.setProperty("--x" + i, px + "px");
    heart.style.setProperty("--y" + i, py + "px");
    heart.style.setProperty("--r" + i, (Math.random() - 0.5) * 50 + "deg");
  }

  heart.addEventListener("animationend", function () {
    heart.remove();
    explotar(x + px, y + py, size, color); // Explota donde terminó su paseo
  });
  heartsLayer.appendChild(heart);
}

// Frases que aparecen, pasean como los corazones y se desvanecen
var LOVE_PHRASES = ["Te quiero mucho 💜", "Tu ING 💜"];
var PHRASE_INTERVAL = 3000; // Cada cuánto aparece una frase (ms)
var phraseIndex = 0;

function crearFrase() {
  if (document.hidden) return;

  var text = document.createElement("span");
  text.className = "love-text";
  text.textContent = LOVE_PHRASES[phraseIndex];
  phraseIndex = (phraseIndex + 1) % LOVE_PHRASES.length;
  text.style.animationDuration = 4 + Math.random() * 2 + "s";

  // Camino libre de la frase
  var path = [];
  var px = 0;
  var py = 0;
  for (var i = 1; i <= 3; i++) {
    px += (Math.random() - 0.5) * 80;
    py += (Math.random() - 0.5) * 80;
    path.push({ x: px, y: py });
    text.style.setProperty("--x" + i, px + "px");
    text.style.setProperty("--y" + i, py + "px");
    text.style.setProperty("--r" + i, (Math.random() - 0.5) * 16 + "deg");
  }

  // Mide la frase para que todo su paseo quede dentro de la pantalla
  text.style.visibility = "hidden";
  heartsLayer.appendChild(text);
  var w = text.offsetWidth * 1.2; // Margen por el crecimiento al final
  var h = text.offsetHeight * 1.2;
  var xs = path.map((p) => p.x).concat(0);
  var ys = path.map((p) => p.y).concat(0, py - 30);
  var minX = w / 2 - Math.min.apply(null, xs) + 10;
  var maxX = window.innerWidth - w / 2 - Math.max.apply(null, xs) - 10;
  var minY = h / 2 - Math.min.apply(null, ys) + 10;
  var maxY = window.innerHeight - h / 2 - Math.max.apply(null, ys) - 10;

  // Busca un lugar que no se encime con otra frase
  var otras = Array.from(heartsLayer.querySelectorAll(".love-text")).filter((t) => t !== text);
  var x;
  var y;
  for (var intento = 0; intento < 15; intento++) {
    x = maxX > minX ? minX + Math.random() * (maxX - minX) : window.innerWidth / 2;
    y = maxY > minY ? minY + Math.random() * (maxY - minY) : window.innerHeight / 2;
    var libre = otras.every(function (o) {
      return (
        Math.abs(x - o._x) > (w + o._w) / 2 + 20 ||
        Math.abs(y - o._y) > (h + o._h) / 2 + 100
      );
    });
    if (libre) break;
  }
  text._x = x;
  text._y = y;
  text._w = w;
  text._h = h;
  text.style.left = x + "px";
  text.style.top = y + "px";
  text.style.visibility = "";

  text.addEventListener("animationend", function () {
    text.remove();
  });
}

// Fotitos de ella que suben desde abajo y se desvanecen
var PHOTO_FILES = ["img/fondo.jpg", "img/foto2.jpg"]; // Agrega más fotos aquí, ej: "img/foto3.jpg"
var PHOTO_INTERVAL = 2800; // Cada cuánto sale una fotito (ms)
var photoIndex = 0;

function crearFotito() {
  if (document.hidden) return;

  var photo = document.createElement("span");
  photo.className = "mini-photo";
  var img = document.createElement("img");
  img.src = PHOTO_FILES[photoIndex];
  img.alt = "";
  photo.appendChild(img);
  photoIndex = (photoIndex + 1) % PHOTO_FILES.length;

  var size = 55 + Math.random() * 35; // Entre 55px y 90px de ancho
  photo.style.width = size + "px";
  photo.style.left = 8 + Math.random() * 84 + "%";
  photo.style.animationDuration = 6 + Math.random() * 3 + "s";
  photo.style.setProperty("--sway", (Math.random() - 0.5) * 120 + "px");
  photo.style.setProperty("--rise", -(45 + Math.random() * 35) + "vh");
  photo.style.setProperty("--tilt-start", (Math.random() - 0.5) * 30 + "deg");
  photo.style.setProperty("--tilt-end", (Math.random() - 0.5) * 30 + "deg");

  photo.addEventListener("animationend", function () {
    photo.remove();
  });
  heartsLayer.appendChild(photo);
}

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  setTimeout(function () {
    setInterval(crearCorazon, HEART_INTERVAL);
    crearFrase();
    setInterval(crearFrase, PHRASE_INTERVAL);
    crearFotito();
    setInterval(crearFotito, PHOTO_INTERVAL);
  }, HEART_START_DELAY);
}
