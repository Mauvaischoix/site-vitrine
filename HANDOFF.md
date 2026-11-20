# HANDOFF.md — Passage de relais

Chaque IA : lis ce fichier en arrivant. En partant, ajoute une entrée EN HAUT (date, IA, fait, reste, problèmes/questions).

---

## 2026-11-20 — Claude (publication de la refonte)
- Fait : le propriétaire a écrit « fusionne ». Branche `ia/publication-natural-digital` (= revue/natural-digital + cette entrée) poussée → PR automatique, fusion si vérifications vertes. Contient aussi le contenu de la PR #4, qui devient inutile (à fermer).
- Prochaine action : vérifier https://les-experiences-de-mohamed-tanouti.pages.dev (titre, CSP, formulaire) ; carrousel LinkedIn prêt dans outils-gratuits-claude\linkedin.

## 2026-11-20 — Claude (formulaire : retour sur la page après envoi)
- Fait : l'envoi en arrière-plan ne s'affichait pas chez le propriétaire (cause probable : ancien livre.js en cache 24 h). Remplacé par sa proposition : Web3Forms renvoie sur la même page `#message-envoye` → page rechargée, champs vides, message vert affiché en CSS `:target`. `connect-src` remis à `'none'`. `?v=3` sur nd.css et livre.js pour forcer le rechargement (exception adaptée dans verifications.yml).
- Reste : e-mail de confirmation à l'expéditeur (payant chez Web3Forms).

## 2026-11-20 — Claude (formulaire : confirmation sur la page)
- Fait : envoi en arrière-plan (livre.js → api.web3forms.com, `connect-src` ajouté pour `/` et `/en/`), message vert avec coche, champs vidés ; erreur en orange. Sans JS : envoi classique + page merci. Testé (Playwright, réponse simulée) FR/EN, html-validate OK.
- Reste : e-mail de confirmation à l'expéditeur = option payante de Web3Forms (Pro), non faite. Fusion sur « fusionne » du propriétaire.
- Prochaine action : tester l'aperçu revue-natural-digital après push.

## 2026-11-20 — Claude (refonte : anglais, pages simples, formulaire actif)
- **Fait** : clé Web3Forms en place (clé publique par conception, pas un secret) ; `/en/` au nouveau style (traduction complète, formulaire vers `/en/thanks/`) ; 404, pages légales FR/EN, `/merci/` et `/en/thanks/` au style « Natural Digital » ; `livre.css` supprimé (plus utilisé). Les pages du jeu gardent `styles.css`.
- **Testé** : html-validate OK, contrôle CSP OK, Chrome : aucune erreur sur /en/, pages légales, 404, merci ; mobile sans défilement horizontal.
- **Reste** : relecture et fusion par le propriétaire (PR #4 puis branche `revue/natural-digital`, ou directement cette branche qui contient tout) ; tester un envoi réel du formulaire sur l'aperçu.

## 2026-11-20 — Claude (refonte, suite)
- **Fait** (branche `revue/natural-digital`) : chapitres I, II, IV, V (« De l'idée à la réalisation, une même main » : méthode en 6 étapes animée, IA utilisées, langages), VI (3 fiches projets : portfolio, jeu, équipe d'IA sur Telegram, avec captures sans information personnelle) ; tous les chapitres ont « Lire » ; chiffres romains corrigés sur mobile ; épilogue avec LinkedIn + formulaire (Web3Forms, CSP `form-action` limitée à api.web3forms.com sur / et /en/, page /merci/) ; page Confidentialité FR/EN mise à jour.
- **Testé** : html-validate OK, contrôles CSP du workflow OK, Chrome 1440 et 390 px avec CSP : aucune erreur, pas de défilement horizontal, table des matières OK.
- **Reste** : clé Web3Forms (le propriétaire crée la clé avec son e-mail, puis remplacer `CLE_WEB3FORMS_A_REMPLACER`) ; version anglaise au nouveau style ; 404 et pages légales au nouveau style ; retrait de `livre.css`.

## 2026-11-20 — Claude (refonte « Natural Digital », prototype)
- **Fait** (branche `revue/natural-digital`, aperçu Cloudflare, pas de fusion automatique) : nouvelle page d'accueil FR (`index.html`, `nd.css`) : prologue avec portrait, savoir-faire, personnalité (boxe 8 bits originale en SVG, théâtre en illustration IA créditée), sommaire du livre, chapitre III complet, épilogue. Monogramme MT. qui ouvre la table des matières. `livre.js` (table des matières, apparitions, barre de lecture, curseur discret sur ordinateur, profondeur du portrait) ; CSP dédiée `script-src 'self'` sur `/` et `/en/` (accord du propriétaire) ; vérifications GitHub adaptées (exception limitée à `<script src="/livre.js" defer></script>`). Polices Manrope et DM Serif Display auto-hébergées (OFL), images en WebP.
- **Testé** : html-validate OK, contrôles CSP du workflow OK, Chrome sans interface 1440 et 390 px avec la CSP : aucune erreur console, table des matières (ouverture, Échap), pas de défilement horizontal.
- **Reste** : chapitres I, II, IV, V, VI ; version anglaise au nouveau style ; formulaire de contact ; 404 et pages légales au nouveau style ; captures d'écran (jeu, site, Telegram) ; retrait de `livre.css` quand plus utilisé.
- **Décisions** : voir `claude/refonte-natural-digital.md` dans le projet Claude.

## 2026-11-20 — Claude (retours du propriétaire sur le portfolio)
- **Fait** : boxeurs en pixel art à la place des gants ; chapitre AIDADOMI réécrit (positif, leadership, sans évoquer de difficultés) ; « Entreprendre » précise livreur indépendant / logistique du dernier kilomètre ; textes des chapitres IV et V plus professionnels (coût zéro = parti pris) ; pied de page « © 2026 Mohamed Tanouti · Tous droits réservés » + Mentions légales, Confidentialité, Cookies (pages FR et EN créées), Admin (lien vers le tableau de bord Cloudflare, à confirmer).
- **Voix du jeu** : remplacée par une voix de synthèse masculine plus enthousiaste façon dessin animé (Piper « pierre » UPMC, CC BY-SA 4.0 ; « joe », CC0 ; accélérée et plus aiguë avec ffmpeg), crédits mis à jour (jeu + mentions légales). Lien « Admin » retiré (décision du propriétaire).
- **Nouvelle adresse** : projet Cloudflare Pages `les-experiences-de-mohamed-tanouti` créé le 20/11 (même dépôt, branche de production `main`) → https://les-experiences-de-mohamed-tanouti.pages.dev ; liens canoniques, hreflang et og:url mis à jour. L'ancien projet `site-vitrine` (site-vitrine-cuc.pages.dev) existe encore : à supprimer ou garder (décision du propriétaire).

## 2026-11-20 — Claude (portfolio « livre interactif »)
- **Fait** (branche `revue/jeu-et-seo`, relue par le propriétaire avant fusion, pas de fusion automatique) : l'accueil « Atelier Web » est remplacé par le portfolio de Mohamed Tanouti, en FR (`/`) et EN (`/en/`) : prologue, 6 chapitres, épilogue. Animations en CSS et SVG uniquement (CSP `script-src 'none'` conservée sur ces pages). Styles dans `livre.css` (pages du jeu et 404 gardent `styles.css`). Lien vers le jeu dans le chapitre V et le pied de page. Logo des pages du jeu : « Mohamed Tanouti ».
- **Règles de contenu** : aucun chiffre interne AIDADOMI (décision du propriétaire), seulement ceux du CV. Aucun téléphone, adresse, e-mail personnel. Le site dit qu'il a été réalisé avec l'aide de l'IA.
- **Testé** : html-validate 11.17.0 OK, contrôle CSP du workflow OK, Chrome sans interface 1280 et 375 px (pas de défilement horizontal, aucune erreur console), animations désactivées si « réduire les animations ».
- **Reste** : logos officiels (fichiers fournis par le propriétaire), formulaire de contact (service d'envoi + Turnstile), photo. Toute modification de texte : dans les deux langues.

## 2026-11-20 — Claude (bilingue + accessibilité)
- **Fait** (même branche `ia/jeu-et-seo`) : site en français et en anglais (`/en/`, `/en/game/`, liens `hreflang`, bouton FR/EN, 404 bilingue). Jeu bilingue (textes choisis selon `<html lang>`). Explication du jeu en audio FR et EN (`jeu/audio/`, voix de synthèse Piper : SIWIS CC BY 4.0, LJ Speech domaine public) avec **texte intégral affiché** (accessible aux personnes sourdes et malentendantes). Le jeu n'utilise aucun son. Contact précisé « tout par écrit, pas besoin de téléphoner ».
- **Testé** : html-validate OK ; Chrome sans interface, CSP du jeu appliquée : audio chargé (41 s FR, 43 s EN), jeu et pause en FR et EN, aucune erreur console.
- **Reste** : vidéo en langue des signes (LSF / ASL) = nécessite un interprète humain, non fait. Toute modification de texte doit être faite dans les deux langues.

## 2026-11-20 — Claude (jeu + SEO)
- **Fait** : branche `ia/jeu-et-seo`. Mini-jeu `/jeu/` (« Chasse aux bugs », JavaScript natif, Canvas, aucune bibliothèque ni appel réseau). CSP dédiée à `/jeu/*` dans `_headers` (`script-src 'self'`, détachement `!` de la CSP générale) ; reste du site inchangé (`script-src 'none'`). Vérifications : exception limitée à la balise `<script src="/jeu/jeu.js">` + nouveau contrôle qui refuse `unsafe-inline`, `unsafe-eval` et les scripts externes. Accueil : lien canonique, balises Open Graph, lien vers le jeu en pied de page. En-tête `Cross-Origin-Resource-Policy` ajouté.
- **Testé** : html-validate OK, `node --check` OK, Chrome sans interface à 1280 px et 375 px avec la CSP du jeu : aucune erreur console, score, pause et vies fonctionnent.
- **Reste** : vérifier sur l'aperçu Cloudflare que `/jeu/` reçoit bien la CSP dédiée (le détachement `!` n'a pas pu être testé hors Cloudflare). Contenu (nom, e-mail, portfolio) : voir `TODO.md`.
- **Questions pour le propriétaire** : le JavaScript sur `/jeu/` est une exception à la règle 2 d'AI-MAINTENANCE.md, faite à ta demande du 20/11 ; à confirmer en relisant la PR.

---

## 2026-11-19 — OpenCode
- **Fait** : branche `ia/handoff`. Vérification : `HANDOFF.md` et `TODO.md` existent déjà à la racine et sont versionnés sur `main` (créés le 10/11/2026), rien à créer. Mise à jour de ce fichier uniquement.
- **Reste** : voir `TODO.md` (adresse e-mail réelle, nom définitif de l'activité).
- **Questions pour le propriétaire** : la demande « créer les deux fichiers » était sans objet. Faut-il les réécrire/compléter plutôt que les laisser tels quels ?

### Relais en cours
- Branche : `ia/handoff` (poussée, PR automatique).
- Dernière étape : entrée HANDOFF ajoutée, aucun autre fichier modifié.
- Prochaine étape : attendre la réponse du propriétaire sur la question ci-dessus.

---

## 2026-11-10 — Claude (construction)
- **Fait** : création du dépôt modèle (site vitrine statique, en-têtes de sécurité, vérifications automatiques, règles pour les IA).
- **Reste** : voir `TODO.md`.
- **Questions pour le propriétaire** : adresse e-mail de contact réelle à mettre dans `index.html` ; nom définitif de l'activité (actuellement « Atelier Web »).
