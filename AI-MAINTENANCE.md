# AI-MAINTENANCE.md — Comment ce site est construit

À lire par toute IA (Gemini, OpenCode, Claude, IA locale…) avant de toucher au projet.
Les règles d'accès sont dans `AUTORISATIONS-IA.md` (prioritaires sur tout le reste).

## Ce que c'est
Site vitrine **statique** : HTML + CSS, **aucun JavaScript, aucun serveur, aucune base de données**.
C'est volontaire : moins de code = moins de failles et presque pas de maintenance.

## Fichiers
| Fichier | Rôle |
|---|---|
| `index.html` | page d'accueil (tout le contenu) |
| `styles.css` | styles (couleurs en variables dans `:root`, mode sombre automatique) |
| `404.html` | page « introuvable » |
| `_headers` | en-têtes de sécurité appliqués par Cloudflare Pages (CSP stricte) |
| `robots.txt` | autorise l'indexation Google |
| `HANDOFF.md` | passage de relais entre IA — à lire en arrivant, à mettre à jour en partant |
| `TODO.md` | tâches à faire |
| `.github/workflows/verifications.yml` | vérifications automatiques à chaque proposition |

## Mise en ligne
- Hébergement : **Cloudflare Pages**, relié à ce dépôt GitHub. Aucune étape de construction (« build ») : les fichiers sont servis tels quels.
- Toute branche autre que `main` → **aperçu** automatique sur une adresse temporaire.
- Fusion dans `main` (via pull request, après vérifications vertes) → **mise en ligne**.
- Jamais de push direct sur `main`.

## Règles de modification
1. Travailler sur une branche `ia/<sujet-court>`, ouvrir une pull request.
2. **Pas de JavaScript, de script externe, de police externe ni d'iframe** sans mise à jour de `_headers` ET accord du propriétaire (la CSP bloque tout le reste, c'est voulu).
3. Pas d'attribut `style="..."` ni de `<style>` dans le HTML (bloqué par la CSP) : tout va dans `styles.css`.
4. Images : dans `/images`, formats WebP/AVIF, largeur ≤ 1600 px, attribut `alt` obligatoire.
5. Textes : français, phrases courtes. Aucun faux avis, faux chiffre ou fausse référence client.
6. Aucune donnée personnelle ni secret dans le dépôt (il est public).
7. Après chaque modification : vérifier l'affichage mobile (largeur 375 px) et ordinateur.

## Pour créer un nouveau site à partir de ce modèle
`gh repo create <nom> --public --template Mauvaischoix/modele-site --clone`, puis adapter `index.html`, les couleurs dans `styles.css`, et relier le nouveau dépôt à Cloudflare Pages.
