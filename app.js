/* Placa NFC · interacciones */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  /* ── Nav: borde sólo cuando dejó de estar arriba de todo ── */
  var nav = document.getElementById("nav");
  if (nav) {
    var sentinel = document.createElement("div");
    sentinel.style.cssText = "position:absolute;top:0;height:1px;width:1px";
    document.body.prepend(sentinel);
    new IntersectionObserver(function (entries) {
      nav.dataset.stuck = String(!entries[0].isIntersecting);
    }).observe(sentinel);
  }

  /* ── Vitrina: inclinación con seguimiento suave del puntero ─
     El valor crudo del mouse se siente artificial; lo pasamos
     por un lerp para que tenga inercia.                        */
  var showcase = document.getElementById("showcase");
  var stage = document.getElementById("stage");
  if (showcase && stage && finePointer.matches && !reduced.matches) {
    var targetX = 0, targetY = 0, curX = 0, curY = 0, raf = null;

    function tick() {
      curX += (targetX - curX) * 0.09;
      curY += (targetY - curY) * 0.09;
      stage.style.transform = "rotateX(" + curY.toFixed(3) + "deg) rotateY(" + curX.toFixed(3) + "deg)";
      if (Math.abs(targetX - curX) > 0.01 || Math.abs(targetY - curY) > 0.01) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = null;
      }
    }
    function start() { if (raf === null) raf = requestAnimationFrame(tick); }

    showcase.addEventListener("pointermove", function (e) {
      var r = showcase.getBoundingClientRect();
      targetX = ((e.clientX - r.left) / r.width - 0.5) * 13;
      targetY = (0.5 - (e.clientY - r.top) / r.height) * 10;
      stage.style.transition = "none";
      start();
    });
    showcase.addEventListener("pointerleave", function () {
      targetX = 0; targetY = 0;
      start();
    });
  }
})();
