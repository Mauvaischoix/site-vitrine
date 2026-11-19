// Chasse aux bugs — mini-jeu en JavaScript natif (Canvas 2D), sans bibliothèque.
'use strict';

(function () {
  const L = 720; // largeur logique
  const H = 480; // hauteur logique
  const PAS = 1 / 120; // pas de temps fixe (secondes)
  const CLE_RECORD = 'chasse-aux-bugs-record';

  const ecran = document.getElementById('ecran');
  const ctx = ecran.getContext('2d');
  const el = {
    score: document.getElementById('score'),
    vies: document.getElementById('vies'),
    niveau: document.getElementById('niveau'),
    record: document.getElementById('record'),
    menu: document.getElementById('menu'),
    menuTitre: document.getElementById('menu-titre'),
    menuTexte: document.getElementById('menu-texte'),
    jouer: document.getElementById('jouer'),
    annonce: document.getElementById('annonce'),
  };

  const mouvementReduit = window.matchMedia('(prefers-reduced-motion: reduce)');
  const theme = window.matchMedia('(prefers-color-scheme: dark)');

  // ---------- Couleurs (lues dans styles.css, suivent le mode sombre) ----------
  let couleurs = {};
  function lireCouleurs() {
    const s = getComputedStyle(document.documentElement);
    const v = (nom, defaut) => (s.getPropertyValue(nom).trim() || defaut);
    couleurs = {
      fond: v('--fond-alt', '#f1efe8'),
      texte: v('--texte', '#1c1f1e'),
      doux: v('--texte-doux', '#55605c'),
      accent: v('--accent', '#1f6f5c'),
      bord: v('--bord', '#e2ded3'),
      bug: '#d64545',
      fonction: '#2f9e5b',
      cafe: '#9a6a3a',
    };
  }
  lireCouleurs();
  theme.addEventListener('change', lireCouleurs);

  // ---------- Record (stockage local, peut être indisponible) ----------
  function lireRecord() {
    try { return Number(localStorage.getItem(CLE_RECORD)) || 0; } catch (e) { return 0; }
  }
  function ecrireRecord(n) {
    try { localStorage.setItem(CLE_RECORD, String(n)); } catch (e) { /* stockage bloqué : sans gravité */ }
  }

  // ---------- Écran net sur les écrans haute densité ----------
  function ajusterResolution() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    ecran.width = L * ratio;
    ecran.height = H * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }
  ajusterResolution();
  window.addEventListener('resize', ajusterResolution);

  // ---------- État du jeu ----------
  const etat = {
    phase: 'menu', // menu | jeu | pause | fin
    score: 0,
    vies: 3,
    niveau: 1,
    record: lireRecord(),
    combo: 0,
    temps: 0,
    lent: 0, // secondes de ralenti restantes
    tremble: 0,
    prochainObjet: 0,
    objets: [],
    particules: [],
    textes: [],
    joueur: { x: L / 2, l: 96, h: 18, vitesse: 520 },
  };
  const touches = { gauche: false, droite: false };
  let cible = null; // position visée à la souris / au doigt

  function majTableau() {
    el.score.textContent = etat.score;
    el.vies.textContent = etat.vies;
    el.niveau.textContent = etat.niveau;
    el.record.textContent = etat.record;
  }

  function nouvellePartie() {
    Object.assign(etat, {
      phase: 'jeu', score: 0, vies: 3, niveau: 1, combo: 0, temps: 0,
      lent: 0, tremble: 0, prochainObjet: 0.6, objets: [], particules: [], textes: [],
    });
    etat.joueur.x = L / 2;
    el.menu.hidden = true;
    el.annonce.textContent = 'Partie lancée.';
    majTableau();
    ecran.scrollIntoView({ block: 'center', behavior: mouvementReduit.matches ? 'auto' : 'smooth' });
    ecran.focus({ preventScroll: true });
  }

  function finDePartie() {
    etat.phase = 'fin';
    const nouveauRecord = etat.score > etat.record;
    if (nouveauRecord) { etat.record = etat.score; ecrireRecord(etat.score); }
    majTableau();
    el.menuTitre.textContent = nouveauRecord ? 'Nouveau record !' : 'Bug en production…';
    el.menuTexte.textContent = 'Score : ' + etat.score + ' · niveau ' + etat.niveau + '.';
    el.jouer.textContent = 'Rejouer';
    el.menu.hidden = false;
    el.annonce.textContent = 'Partie terminée. Score ' + etat.score + '.' + (nouveauRecord ? ' Nouveau record.' : '');
    el.jouer.focus({ preventScroll: true });
  }

  function basculerPause() {
    if (etat.phase === 'jeu') {
      etat.phase = 'pause';
      el.menuTitre.textContent = 'Pause';
      el.menuTexte.textContent = 'Espace ou le bouton pour reprendre.';
      el.jouer.textContent = 'Reprendre';
      el.menu.hidden = false;
      el.annonce.textContent = 'Pause.';
    } else if (etat.phase === 'pause') {
      etat.phase = 'jeu';
      el.menu.hidden = true;
      el.annonce.textContent = 'Reprise.';
      ecran.focus({ preventScroll: true });
    }
  }

  // ---------- Apparition des objets ----------
  function aleatoire(min, max) { return min + Math.random() * (max - min); }

  function creerObjet() {
    const t = Math.random();
    const type = t < 0.72 ? 'bug' : t < 0.92 ? 'fonction' : 'cafe';
    const vitesseBase = 110 + etat.niveau * 22;
    etat.objets.push({
      type,
      x: aleatoire(30, L - 30),
      y: -24,
      r: type === 'bug' ? 14 : 13,
      vy: aleatoire(vitesseBase * 0.85, vitesseBase * 1.2),
      vx: type === 'bug' ? aleatoire(-30, 30) * Math.min(etat.niveau / 4, 1.5) : 0,
      phase: Math.random() * Math.PI * 2,
    });
  }

  function eclats(x, y, couleur, n) {
    const nombre = mouvementReduit.matches ? Math.ceil(n / 3) : n;
    for (let i = 0; i < nombre; i++) {
      const a = Math.random() * Math.PI * 2;
      const v = aleatoire(60, 220);
      etat.particules.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 60, vie: aleatoire(0.35, 0.7), couleur });
    }
  }

  function texteFlottant(x, y, texte, couleur) {
    etat.textes.push({ x, y, texte, couleur, vie: 0.9 });
  }

  // ---------- Mise à jour (pas fixe) ----------
  function mettreAJour(dt) {
    etat.temps += dt;
    if (etat.lent > 0) etat.lent = Math.max(0, etat.lent - dt);
    const facteur = etat.lent > 0 ? 0.45 : 1;

    // Niveau : toutes les 20 secondes
    const niveau = 1 + Math.floor(etat.temps / 20);
    if (niveau !== etat.niveau) {
      etat.niveau = niveau;
      texteFlottant(L / 2, H / 2, 'Niveau ' + niveau, couleurs.accent);
      el.annonce.textContent = 'Niveau ' + niveau + '.';
      majTableau();
    }

    // Joueur
    const j = etat.joueur;
    if (cible !== null) {
      const ecart = cible - j.x;
      j.x += Math.sign(ecart) * Math.min(Math.abs(ecart), j.vitesse * 1.6 * dt);
    } else {
      if (touches.gauche) j.x -= j.vitesse * dt;
      if (touches.droite) j.x += j.vitesse * dt;
    }
    j.x = Math.max(j.l / 2, Math.min(L - j.l / 2, j.x));

    // Apparition
    etat.prochainObjet -= dt;
    if (etat.prochainObjet <= 0) {
      creerObjet();
      etat.prochainObjet = Math.max(0.28, 1.05 - etat.niveau * 0.08) * aleatoire(0.7, 1.3);
    }

    // Objets
    const haut = H - 40;
    for (let i = etat.objets.length - 1; i >= 0; i--) {
      const o = etat.objets[i];
      o.phase += dt * 6;
      o.y += o.vy * facteur * dt;
      o.x += o.vx * facteur * dt;
      if (o.x < o.r || o.x > L - o.r) o.vx = -o.vx;

      const touche = o.y + o.r >= haut && o.y - o.r <= haut + j.h && Math.abs(o.x - j.x) <= j.l / 2 + o.r * 0.6;
      if (touche) {
        etat.objets.splice(i, 1);
        attraper(o);
        continue;
      }
      if (o.y - o.r > H) {
        etat.objets.splice(i, 1);
        if (o.type === 'bug') {
          etat.vies -= 1;
          etat.combo = 0;
          if (!mouvementReduit.matches) etat.tremble = 0.25;
          texteFlottant(o.x, H - 20, 'En prod !', couleurs.bug);
          majTableau();
          if (etat.vies <= 0) { finDePartie(); return; }
        }
      }
    }

    // Particules et textes
    for (let i = etat.particules.length - 1; i >= 0; i--) {
      const p = etat.particules[i];
      p.vie -= dt;
      p.vy += 420 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.vie <= 0) etat.particules.splice(i, 1);
    }
    for (let i = etat.textes.length - 1; i >= 0; i--) {
      const t = etat.textes[i];
      t.vie -= dt;
      t.y -= 40 * dt;
      if (t.vie <= 0) etat.textes.splice(i, 1);
    }
    if (etat.tremble > 0) etat.tremble = Math.max(0, etat.tremble - dt);
  }

  function attraper(o) {
    if (o.type === 'bug') {
      etat.combo += 1;
      const gain = 10 * Math.min(1 + Math.floor(etat.combo / 5), 4);
      etat.score += gain;
      eclats(o.x, o.y, couleurs.bug, 14);
      texteFlottant(o.x, o.y - 10, '+' + gain + (etat.combo >= 5 ? ' ×' + Math.min(1 + Math.floor(etat.combo / 5), 4) : ''), couleurs.texte);
    } else if (o.type === 'fonction') {
      etat.combo = 0;
      etat.score = Math.max(0, etat.score - 15);
      eclats(o.x, o.y, couleurs.fonction, 10);
      texteFlottant(o.x, o.y - 10, '−15', couleurs.fonction);
    } else {
      etat.lent = 4;
      eclats(o.x, o.y, couleurs.cafe, 12);
      texteFlottant(o.x, o.y - 10, 'Café : ralenti', couleurs.cafe);
    }
    majTableau();
  }

  // ---------- Dessin ----------
  function dessinerBug(o) {
    const patte = Math.sin(o.phase) * 3;
    ctx.save();
    ctx.translate(o.x, o.y);
    ctx.strokeStyle = couleurs.texte;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let k = -1; k <= 1; k++) {
      ctx.moveTo(-o.r * 0.6, k * 5); ctx.lineTo(-o.r - 4, k * 6 + (k === 0 ? patte : -patte));
      ctx.moveTo(o.r * 0.6, k * 5); ctx.lineTo(o.r + 4, k * 6 + (k === 0 ? -patte : patte));
    }
    ctx.moveTo(-4, -o.r + 2); ctx.lineTo(-8, -o.r - 6);
    ctx.moveTo(4, -o.r + 2); ctx.lineTo(8, -o.r - 6);
    ctx.stroke();
    ctx.fillStyle = couleurs.bug;
    ctx.beginPath(); ctx.ellipse(0, 2, o.r * 0.8, o.r, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = couleurs.texte;
    ctx.beginPath(); ctx.arc(0, -o.r + 4, 5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(0, -o.r + 8); ctx.lineTo(0, o.r); ctx.stroke();
    ctx.restore();
  }

  function dessinerFonction(o) {
    ctx.save();
    ctx.translate(o.x, o.y);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = couleurs.fonction;
    ctx.fillRect(-o.r * 0.75, -o.r * 0.75, o.r * 1.5, o.r * 1.5);
    ctx.restore();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(o.x - 5, o.y); ctx.lineTo(o.x - 1, o.y + 4); ctx.lineTo(o.x + 6, o.y - 4);
    ctx.stroke();
  }

  function dessinerCafe(o) {
    ctx.save();
    ctx.translate(o.x, o.y);
    ctx.fillStyle = couleurs.cafe;
    ctx.fillRect(-9, -6, 16, 16);
    ctx.strokeStyle = couleurs.cafe;
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(9, 2, 4, -Math.PI / 2, Math.PI / 2); ctx.stroke();
    ctx.strokeStyle = couleurs.doux;
    ctx.lineWidth = 1.5;
    const v = Math.sin(o.phase) * 2;
    ctx.beginPath(); ctx.moveTo(-4, -9); ctx.quadraticCurveTo(-4 + v, -14, -4, -18);
    ctx.moveTo(3, -9); ctx.quadraticCurveTo(3 - v, -14, 3, -18); ctx.stroke();
    ctx.restore();
  }

  function dessinerDecor() {
    ctx.fillStyle = couleurs.fond;
    ctx.fillRect(0, 0, L, H);
    // Lignes de code stylisées en arrière-plan
    ctx.font = '13px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
    ctx.fillStyle = couleurs.bord;
    const lignes = ['function deployer() {', '  verifier(tests);', '  if (bugs.length) return;', '  publier();', '}'];
    for (let i = 0; i < 12; i++) {
      ctx.fillText(String(i + 1).padStart(2, ' ') + '  ' + lignes[i % lignes.length], 16, 30 + i * 34);
    }
    // Ligne « production »
    ctx.strokeStyle = couleurs.bug;
    ctx.globalAlpha = 0.35;
    ctx.setLineDash([6, 6]);
    ctx.beginPath(); ctx.moveTo(0, H - 6); ctx.lineTo(L, H - 6); ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
  }

  function dessiner() {
    ctx.save();
    if (etat.tremble > 0) {
      const f = etat.tremble * 24;
      ctx.translate(aleatoire(-f, f), aleatoire(-f, f));
    }
    dessinerDecor();

    if (etat.lent > 0) {
      ctx.fillStyle = couleurs.cafe;
      ctx.globalAlpha = 0.08;
      ctx.fillRect(0, 0, L, H);
      ctx.globalAlpha = 1;
    }

    for (const o of etat.objets) {
      if (o.type === 'bug') dessinerBug(o);
      else if (o.type === 'fonction') dessinerFonction(o);
      else dessinerCafe(o);
    }

    // Joueur : accolades « { } »
    const j = etat.joueur;
    const y = H - 40;
    ctx.fillStyle = couleurs.accent;
    ctx.beginPath();
    ctx.roundRect(j.x - j.l / 2, y, j.l, j.h, 9);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 15px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('{ debug }', j.x, y + j.h / 2 + 1);

    for (const p of etat.particules) {
      ctx.globalAlpha = Math.max(0, p.vie / 0.7);
      ctx.fillStyle = p.couleur;
      ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
    }
    ctx.globalAlpha = 1;

    ctx.font = 'bold 16px system-ui, sans-serif';
    for (const t of etat.textes) {
      ctx.globalAlpha = Math.max(0, t.vie / 0.9);
      ctx.fillStyle = t.couleur;
      ctx.fillText(t.texte, t.x, t.y);
    }
    ctx.globalAlpha = 1;

    if (etat.combo >= 5 && etat.phase === 'jeu') {
      ctx.textAlign = 'right';
      ctx.fillStyle = couleurs.accent;
      ctx.fillText('Combo ' + etat.combo, L - 16, 24);
    }
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.restore();
  }

  // ---------- Boucle principale à pas fixe ----------
  let precedent = performance.now();
  let reserve = 0;
  function boucle(maintenant) {
    let ecoule = (maintenant - precedent) / 1000;
    precedent = maintenant;
    if (ecoule > 0.25) ecoule = 0.25; // évite un saut après une longue pause
    if (etat.phase === 'jeu') {
      reserve += ecoule;
      while (reserve >= PAS && etat.phase === 'jeu') {
        mettreAJour(PAS);
        reserve -= PAS;
      }
    } else {
      reserve = 0;
    }
    dessiner();
    requestAnimationFrame(boucle);
  }

  // ---------- Commandes ----------
  function versLogique(clientX) {
    const r = ecran.getBoundingClientRect();
    return ((clientX - r.left) / r.width) * L;
  }

  window.addEventListener('keydown', (e) => {
    const k = e.key;
    if (k === 'ArrowLeft' || k === 'a' || k === 'A' || k === 'q' || k === 'Q') { touches.gauche = true; cible = null; }
    else if (k === 'ArrowRight' || k === 'd' || k === 'D') { touches.droite = true; cible = null; }
    else if ((k === ' ' || k === 'p' || k === 'P' || k === 'Escape') && (etat.phase === 'jeu' || etat.phase === 'pause')) { basculerPause(); }
    else return;
    if (etat.phase === 'jeu' || k === ' ') e.preventDefault();
  });
  window.addEventListener('keyup', (e) => {
    const k = e.key;
    if (k === 'ArrowLeft' || k === 'a' || k === 'A' || k === 'q' || k === 'Q') touches.gauche = false;
    if (k === 'ArrowRight' || k === 'd' || k === 'D') touches.droite = false;
  });

  ecran.addEventListener('pointermove', (e) => {
    if (etat.phase !== 'jeu') return;
    if (e.pointerType === 'mouse' || e.buttons || e.pointerType === 'touch') cible = versLogique(e.clientX);
  });
  ecran.addEventListener('pointerdown', (e) => {
    if (etat.phase === 'jeu') { cible = versLogique(e.clientX); ecran.setPointerCapture(e.pointerId); }
  });
  ecran.addEventListener('pointerleave', () => { cible = null; });

  el.jouer.addEventListener('click', () => {
    if (etat.phase === 'pause') basculerPause();
    else nouvellePartie();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && etat.phase === 'jeu') basculerPause();
  });

  ecran.tabIndex = 0;
  majTableau();
  requestAnimationFrame(boucle);
})();
