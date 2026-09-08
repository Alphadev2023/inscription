\# Plateforme d'Inscription



Application de gestion des inscriptions en ligne : dossiers candidats,

dépôt de documents, workflow de validation par agents, et paiement

des frais d'inscription.



Deux interfaces consomment la même API : un front Angular et un front React.



\## Architecture



| Composant | Technologie | Dossier |

|---|---|---|

| API | Spring Boot 3.5 / Java 21, Spring Modulith, JWT | `inscription-backend` |

| Front Angular | Angular | `inscription-frontend` |

| Front React | React, Vite | `inscription-frontend-react` |

| Base de données | PostgreSQL 17 | conteneur |



Les migrations de schéma sont gérées par Flyway et s'appliquent

automatiquement au démarrage.



\## Prérequis



\- Docker Desktop (avec Docker Compose v2)

\- Les ports 4202, 4203, 8083 et 5433 libres



\## Démarrage



copy .env.example .env





Sous Linux ou macOS : `cp .env.example .env`



Deux variables sont obligatoires et bloquent le démarrage si elles sont vides :



| Variable | Description |

|---|---|

| `DB\_PASS` | Mot de passe PostgreSQL, libre |

| `JWT\_SECRET` | Clé de signature des jetons, encodée en Base64 |



Le `JWT\_SECRET` doit être une chaîne Base64 valide, car l'application la

décode au démarrage. Pour en générer une sous PowerShell :



$bytes = New-Object byte\[] 48

\[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)

\[Convert]::ToBase64String($bytes)





Coller le résultat sur une seule ligne dans le `.env`.



Puis :



docker compose up -d --build

docker compose ps





Attendre que `inscription\_backend` affiche `healthy`.



\## Services externes



Ces quatre intégrations sont désactivées par défaut. L'application démarre

sans elles ; seules les fonctionnalités correspondantes restent inactives.



| Variable | Fonctionnalité | Où obtenir la clé |

|---|---|---|

| `GOOGLE\_CLIENT\_ID` et `GOOGLE\_CLIENT\_SECRET` | Connexion via Google | Google Cloud Console, identifiants OAuth2 |

| `STRIPE\_SECRET\_KEY` | Paiement des frais | Tableau de bord Stripe, clés API |

| `STRIPE\_WEBHOOK\_SECRET` | Confirmation de paiement | Stripe, section Webhooks |

| `RECAPTCHA\_SECRET\_KEY` | Protection du formulaire d'inscription | Console reCAPTCHA v2 Google |



Pour Google OAuth2, renseigner comme URI de redirection autorisée :

`http://localhost:4202/oauth2/redirect`



Sans clé reCAPTCHA, la création de compte via le formulaire échoue :

utiliser les comptes de test ci-dessous.



\## URLs d'accès



| Interface | URL |

|---|---|

| Front Angular | http://localhost:4202 |

| Front React | http://localhost:4203 |

| Documentation API (Swagger) | http://localhost:8083/swagger-ui.html |

| Schéma OpenAPI | http://localhost:8083/api-docs |



\## Comptes de test



Créés par la migration `V8\_\_seed\_test\_accounts.sql`, donc recréés

automatiquement après un `docker compose down -v`.



| Email | Mot de passe | Rôle |

|---|---|---|

| admin@inscription.com | Passer@123 | ADMIN |

| agent@inscription.com | Passer@123 | AGENT |

| candidat@inscription.com | Passer@123 | CANDIDAT |



\## Arrêt



docker compose down





Pour tout supprimer, base de données comprise :



docker compose down -v





\## Dépannage



\*\*Un port est déjà occupé\*\*



Modifier les ports dans le `.env` :



ANGULAR\_PORT=4202

REACT\_PORT=4203

API\_PORT=8083

DB\_PORT=5433





Les ports internes des conteneurs ne changent pas, la communication entre

services reste inchangée.



\*\*Le démarrage échoue avec `DB\_PASS manquant`\*\*



Le `.env` n'a pas été créé ou la variable est vide. Reprendre l'étape de

copie du `.env.example`.



\*\*`failed to read .env: unexpected character`\*\*



Une valeur du `.env` est coupée sur plusieurs lignes. C'est fréquent avec

le `JWT\_SECRET` copié depuis un terminal. Chaque variable doit tenir sur

une seule ligne.



\*\*Le login renvoie une erreur 500\*\*



Le `JWT\_SECRET` n'est pas du Base64 valide. Les caractères comme le tiret

ne font pas partie de l'alphabet Base64. Regénérer avec la commande

ci-dessus.



\*\*`password authentication failed for user "postgres"`\*\*



Le volume PostgreSQL conserve le mot de passe de sa première

initialisation. Après un changement de `DB\_PASS` :



docker compose down -v

docker compose up -d





\*\*Une modification du code n'a aucun effet\*\*



Les fichiers de configuration et les fronts sont compilés dans les images.

Après toute modification, reconstruire :



docker compose up -d --build





Si le cache persiste : `docker compose build --no-cache <service>`.

Penser aussi au rechargement forcé du navigateur (Ctrl+Maj+R), les assets

étant mis en cache un an par nginx.



\*\*Erreur `ERR\_CONNECTION\_REFUSED` depuis un front\*\*



Le front appelle une URL absolue vers un port qui n'est plus exposé.

Les fronts doivent appeler l'API en relatif, sur `/api`, nginx assurant

le proxy. Vérifier `src/environments/environment.ts` côté Angular et

`.env.production` côté React.



\*\*Erreur 403 ou message CORS\*\*



L'origine du navigateur n'est pas autorisée. `CorsConfig.java` utilise

`setAllowedOriginPatterns` avec `http://localhost:\*`, ce qui couvre tous

les ports locaux.

