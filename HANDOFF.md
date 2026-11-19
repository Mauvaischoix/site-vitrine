# HANDOFF.md — Passage de relais

Chaque IA : lis ce fichier en arrivant. En partant, ajoute une entrée EN HAUT (date, IA, fait, reste, problèmes/questions).

---

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
