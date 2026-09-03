/* ============================================================
   Placa NFC · interacciones
   ============================================================ */
(function () {
  "use strict";

  /* ──────────────────────────────────────────────────────────
     CONFIGURÁ ACÁ TUS DATOS DE CONTACTO
     ────────────────────────────────────────────────────────── */
  var CONTACTO = {
    whatsapp: "5491100000000",           // ← tu número, con código de país, sin + ni espacios
    email: "hola@tunegocio.com.ar",      // ← tu mail
    mensaje: "¡Hola! Me interesa la placa NFC para reseñas de Google."
  };
  /* ────────────────────────────────────────────────────────── */

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  /* ── Links de contacto ──────────────────────────────────── */
  var wsp = document.getElementById("cta-wsp");
  if (wsp) {
    wsp.href = "https://wa.me/" + CONTACTO.whatsapp + "?text=" + encodeURIComponent(CONTACTO.mensaje);
    wsp.target = "_blank";
  }
  var mail = document.getElementById("cta-mail");
  if (mail) {
    mail.href = "mailto:" + CONTACTO.email +
      "?subject=" + encodeURIComponent("Placa NFC para reseñas") +
      "&body=" + encodeURIComponent(CONTACTO.mensaje);
  }

  /* ── Nav: el borde aparece recién cuando dejás el tope ───── */
  var nav = document.getElementById("nav");
  if (nav) {
    var sentinel = document.createElement("div");
    sentinel.style.cssText = "position:absolute;top:0;height:1px;width:1px";
    document.body.prepend(sentinel);
    new IntersectionObserver(function (entries) {
      nav.dataset.stuck = String(!entries[0].isIntersecting);
    }).observe(sentinel);
  }

  /* ── Reveal on scroll ───────────────────────────────────── */
  var revealables = document.querySelectorAll(".reveal");
  if (revealables.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });
    revealables.forEach(function (el) { io.observe(el); });
  }

  /* ── Vitrina: inclinación con inercia ────────────────────
     Atar el transform directo al mouse se siente artificial;
     un lerp le da masa al movimiento.                        */
  var showcase = document.getElementById("showcase");
  var stage = document.getElementById("stage");
  if (showcase && stage && finePointer.matches && !reduced.matches) {
    var tX = 0, tY = 0, cX = 0, cY = 0, raf = null;

    function tick() {
      cX += (tX - cX) * 0.09;
      cY += (tY - cY) * 0.09;
      stage.style.transform = "rotateX(" + cY.toFixed(3) + "deg) rotateY(" + cX.toFixed(3) + "deg)";
      if (Math.abs(tX - cX) > 0.01 || Math.abs(tY - cY) > 0.01) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = null;
      }
    }
    function start() { if (raf === null) raf = requestAnimationFrame(tick); }

    showcase.addEventListener("pointermove", function (e) {
      var r = showcase.getBoundingClientRect();
      tX = ((e.clientX - r.left) / r.width - 0.5) * 13;
      tY = (0.5 - (e.clientY - r.top) / r.height) * 10;
      stage.style.transition = "none";
      start();
    });
    showcase.addEventListener("pointerleave", function () { tX = 0; tY = 0; start(); });
  }

  /* ── Demo del toque ──────────────────────────────────────
     Máquina de estados de 3 pasos, sincronizada con la lista.
     Corre sólo mientras está en pantalla y la pestaña visible. */
  var demoStage = document.getElementById("stage-demo");
  var stepsList = document.getElementById("steps");
  if (demoStage && stepsList) {
    var items = stepsList.querySelectorAll("li");
    var DURATIONS = [2100, 2700, 3400];
    var step = 0;
    var timer = null;
    var visible = false;

    function paint() {
      demoStage.dataset.step = String(step);
      for (var i = 0; i < items.length; i++) {
        items[i].dataset.active = String(i === step);
      }
    }

    function advance() {
      step = (step + 1) % 3;
      paint();
      schedule();
    }

    function schedule() {
      clearTimeout(timer);
      timer = setTimeout(advance, DURATIONS[step]);
    }

    function stop() { clearTimeout(timer); timer = null; }

    if (reduced.matches) {
      // Sin movimiento: mostramos el estado final, que es el que explica el producto.
      step = 2;
      paint();
    } else {
      paint();
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible && !document.hidden) { schedule(); } else { stop(); }
      }, { threshold: 0.35 }).observe(demoStage);

      document.addEventListener("visibilitychange", function () {
        if (document.hidden || !visible) { stop(); } else { schedule(); }
      });
    }
  }

  window.__nfcReady = true;

  /* ── Cotas que se dibujan al entrar ─────────────────────── */
  var dims = document.querySelectorAll(".dim");
  if (dims.length) {
    var dio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        dio.unobserve(entry.target);
      });
    }, { threshold: 0.4 });
    dims.forEach(function (el) { dio.observe(el); });
  }
})();
