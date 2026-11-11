# OUTILS-AUTORISES.md — Liste blanche

> Seuls les outils listés ici peuvent être installés. Version figée, source officielle, vérifiée.
> Règle : version publiée depuis au moins 14 jours ; somme de contrôle ou paquet officiel ; jamais `curl | bash`.
> Ajouter un outil = validation du propriétaire (voir AUTORISATIONS-IA.md, section 5).

| Outil | Version | Source officielle | Vérification | Installé le | Où |
|---|---|---|---|---|---|
| Ubuntu (mises à jour) | auto | dépôts Ubuntu | signature apt | 10/11/2026 | serveur-ia |
| unattended-upgrades, fail2ban, zstd | dépôt Ubuntu | dépôts Ubuntu | signature apt | 10/11/2026 | serveur-ia |
| Tailscale | 1.104.5 | pkgs.tailscale.com (dépôt apt officiel) | clé de signature du dépôt | 10/11/2026 | serveur-ia + PC |
| Node.js (LTS) | v22.23.4 | nodejs.org/dist | SHA-256 (SHASUMS256.txt) OK | 10/11/2026 | serveur-ia |
| Antigravity CLI (`agy`, remplace Gemini CLI) | 1.5.5 | script officiel antigravity.google/cli/install.sh, **lu avant exécution** (pas de `curl \| bash`) | SHA-512 vérifié par le script ; installé dans le compte `agents` sans droits admin ; se met à jour lui-même (exception acceptée : éditeur Google) | 11/11/2026 | serveur-ia |
| GitHub CLI (`gh`) | 2.103.3 | cli.github.com (dépôt apt officiel) | clé de signature du dépôt | 10/11/2026 | serveur-ia (compte admin uniquement) |
| OpenCode | 1.19.4 (`opencode-ai`) | npm, mainteneur officiel thdxr | publiée le 22/10/2026 | 10/11/2026 | serveur-ia |
| Ollama | v0.40.11 | github.com/ollama/ollama/releases | SHA-256 (sha256sum.txt) OK, publiée le 24/10/2026 | 10/11/2026 | serveur-ia (écoute 127.0.0.1 seulement) |
| Modèle qwen2.5-coder:7b | — | registre officiel Ollama | — | 10/11/2026 | serveur-ia |

## Prévus (à vérifier avant installation)
- ECC (affaan-m/ECC) profil minimal
- Context7 (MCP officiel Upstash)
- Stirling-PDF (outil PDF, image officielle)
- OmniRoute (diegosouzapw/OmniRoute) — verrouillé en 127.0.0.1, clé API obligatoire
- Headroom

## Retirés
- Gemini CLI 0.65.0 : désinstallé le 11/11/2026 (connexion Google des particuliers arrêtée par Google le 18/06/2026).

## Interdits
G0DM0D3, watermark remover pour contenus d'autrui, TradingAgents en argent réel, tout fork ou copie non officielle, tout paquet au nom approchant.

_Dernière mise à jour : 11/11/2026._
