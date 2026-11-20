/* livre.js — interactions du portfolio (table des matières, apparitions, curseur, profondeur, formulaire).
   Aucun appel réseau, aucune bibliothèque. Le site reste entièrement lisible sans ce fichier. */
(function () {
  "use strict";
  var doc = document.documentElement;
  var reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finPointeur = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  doc.classList.add("js");

  /* 1. Table des matières ouverte par le monogramme */
  var bouton = document.querySelector("[data-ouvre-table]");
  var table = document.getElementById("table");
  if (bouton && table) {
    var fermer = table.querySelector("[data-ferme-table]");
    var ouvrir = function () {
      table.hidden = false;
      bouton.setAttribute("aria-expanded", "true");
      doc.classList.add("table-ouverte");
      var premier = table.querySelector("a");
      if (premier) premier.focus();
    };
    var refermer = function (rendreFocus) {
      table.hidden = true;
      bouton.setAttribute("aria-expanded", "false");
      doc.classList.remove("table-ouverte");
      if (rendreFocus) bouton.focus();
    };
    bouton.addEventListener("click", function (e) {
      e.preventDefault();
      if (table.hidden) ouvrir(); else refermer(true);
    });
    if (fermer) fermer.addEventListener("click", function () { refermer(true); });
    table.addEventListener("click", function (e) {
      if (e.target === table) refermer(true);
      if (e.target.closest("a")) refermer(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !table.hidden) refermer(true);
      if (e.key === "Tab" && !table.hidden) {
        var liens = table.querySelectorAll("a, button");
        var a = liens[0], z = liens[liens.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    });
  }

  /* 2. Apparition des pages au défilement + animations jouées seulement quand elles sont visibles */
  var aObserver = document.querySelectorAll("[data-revele], [data-anime]");
  if ("IntersectionObserver" in window) {
    var obs = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (en) {
        if (en.target.hasAttribute("data-revele") && en.isIntersecting) en.target.classList.add("est-revele");
        if (en.target.hasAttribute("data-anime")) en.target.classList.toggle("en-vue", en.isIntersecting);
      });
    }, { threshold: 0.18 });
    aObserver.forEach(function (el) { obs.observe(el); });
  } else {
    aObserver.forEach(function (el) { el.classList.add("est-revele", "en-vue"); });
  }

  /* 3. Barre de progression de lecture */
  var barre = document.querySelector(".progression");
  if (barre) {
    var maj = function () {
      var max = doc.scrollHeight - window.innerHeight;
      barre.style.transform = "scaleX(" + (max > 0 ? window.scrollY / max : 0) + ")";
    };
    window.addEventListener("scroll", maj, { passive: true });
    maj();
  }

  /* 3 bis. Formulaire : après l'envoi, Web3Forms renvoie sur cette même page (#message-envoye) :
     la page se recharge, les champs sont vides et le message vert s'affiche (CSS :target).
     Ici on garde simplement le visiteur sur l'adresse où il est (utile pour les aperçus). */
  var retourVers = document.querySelector('.contact__formulaire input[name="redirect"]');
  if (retourVers && /^https?:$/.test(location.protocol)) {
    retourVers.value = location.origin + location.pathname + "#message-envoye";
  }

  if (reduit || !finPointeur) return;

  /* 4. Curseur discret (ordinateur uniquement, le curseur système reste visible) */
  var anneau = document.createElement("div");
  anneau.className = "curseur";
  anneau.setAttribute("aria-hidden", "true");
  document.body.appendChild(anneau);
  var cx = -100, cy = -100, ax = -100, ay = -100;
  window.addEventListener("pointermove", function (e) {
    cx = e.clientX; cy = e.clientY;
    anneau.classList.add("curseur--visible");
    var cible = e.target.closest("a, button, [data-survol]");
    anneau.classList.toggle("curseur--actif", !!cible);
  }, { passive: true });

  /* 5. Profondeur légère : les formes du prologue suivent le curseur */
  var calques = document.querySelectorAll("[data-profondeur]");
  var px = 0, py = 0;
  window.addEventListener("pointermove", function (e) {
    px = e.clientX / window.innerWidth - 0.5;
    py = e.clientY / window.innerHeight - 0.5;
  }, { passive: true });

  (function boucle() {
    ax += (cx - ax) * 0.2;
    ay += (cy - ay) * 0.2;
    anneau.style.transform = "translate(" + ax + "px," + ay + "px)";
    for (var i = 0; i < calques.length; i++) {
      var f = parseFloat(calques[i].getAttribute("data-profondeur")) || 10;
      calques[i].style.transform = "translate(" + (px * f) + "px," + (py * f) + "px)";
    }
    requestAnimationFrame(boucle);
  })();
})();
