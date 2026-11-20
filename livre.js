/* livre.js — interactions du portfolio (table des matières, apparitions, curseur, profondeur, formulaire).
   Seul appel réseau : l'envoi du formulaire de contact à Web3Forms. Aucune bibliothèque. Le site reste entièrement lisible sans ce fichier. */
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

  /* 3 bis. Formulaire : envoi sans quitter la page, confirmation verte, champs vidés.
     Sans JavaScript, le formulaire s'envoie normalement et redirige vers la page de remerciement. */
  var formulaire = document.querySelector(".contact__formulaire");
  var retour = formulaire && formulaire.querySelector(".contact__retour");
  if (formulaire && retour && window.fetch && window.FormData) {
    var en = doc.lang.indexOf("en") === 0;
    var textes = en
      ? { ok: "Message sent. Thank you, I will get back to you soon.", ko: "Sending failed. Please try again or contact me on LinkedIn.", envoi: "Sending…" }
      : { ok: "Message envoyé. Merci, je vous réponds rapidement.", ko: "L'envoi a échoué. Réessayez ou écrivez-moi sur LinkedIn.", envoi: "Envoi…" };
    var NS = "http://www.w3.org/2000/svg";
    var afficher = function (succes) {
      retour.textContent = "";
      retour.classList.toggle("contact__retour--erreur", !succes);
      if (succes) {
        var svg = document.createElementNS(NS, "svg");
        svg.setAttribute("viewBox", "0 0 20 20");
        svg.setAttribute("aria-hidden", "true");
        var c = document.createElementNS(NS, "circle");
        c.setAttribute("cx", "10"); c.setAttribute("cy", "10"); c.setAttribute("r", "9");
        c.setAttribute("fill", "none"); c.setAttribute("stroke", "currentColor"); c.setAttribute("stroke-width", "1.6");
        var t = document.createElementNS(NS, "path");
        t.setAttribute("d", "M6 10.5l2.6 2.6L14 7.6");
        t.setAttribute("fill", "none"); t.setAttribute("stroke", "currentColor"); t.setAttribute("stroke-width", "1.8");
        t.setAttribute("stroke-linecap", "round"); t.setAttribute("stroke-linejoin", "round");
        svg.appendChild(c); svg.appendChild(t);
        retour.appendChild(svg);
      }
      retour.appendChild(document.createTextNode(succes ? textes.ok : textes.ko));
      retour.hidden = false;
    };
    formulaire.addEventListener("submit", function (e) {
      e.preventDefault();
      var envoyer = formulaire.querySelector("[type=submit]");
      var libelle = envoyer.textContent;
      envoyer.disabled = true;
      envoyer.textContent = textes.envoi;
      retour.hidden = true;
      var donnees = {};
      new FormData(formulaire).forEach(function (v, k) { if (k !== "redirect") donnees[k] = v; });
      fetch(formulaire.action, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(donnees)
      }).then(function (r) { return r.json(); })
        .then(function (rep) {
          var ok = rep && rep.success === true;
          if (ok) formulaire.reset();
          afficher(ok);
        })
        .catch(function () { afficher(false); })
        .then(function () { envoyer.disabled = false; envoyer.textContent = libelle; });
    });
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
