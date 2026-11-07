# FECOLUTTA - validation et point de reprise

## Lot 1 : listes territoriales, 7 novembre 2026

Parcours : session FECOLUTTA autoris?e -> Ligues, Ententes, Clubs -> lecture Sheets -> tableau/recherche/filtres/pagination. Livrer ce point de contr?le avant les formulaires. ?tat actuel : lecture r?elle confirm?e par connecteur et interface valid?e sur sa capture ; connexion applicative compl?te encore bloqu?e (voir ci-dessous).

### D?p?ts et protections

- Cible et racine Git r?elle : `C:/Projets/SNDS-RDC/data/monosport/fecolutta-managment`.
- R?f?rence en lecture seule et racine Git r?elle : `C:/Projets/SNDS-RDC/data/monosport/fecot-managment`.
- ?tat initial FECOLUTTA : README.md et package-lock.json d?j? modifi?s ; code, docs, tests et configuration non suivis. Aucun reset, nettoyage ni remplacement des changements existants.
- FECOT : docs/identifiants-athletes.md d?j? modifi? ; aucun fichier de la r?f?rence ?crit.
- `origin` FECOLUTTA pointe encore sur `https://github.com/Rodanyoca/fecot-saas.git`. Destination FECOLUTTA non fournie : remote non modifi?, aucun push. Corriger cette liaison avec une URL valid?e avant toute future publication.
- Aucune liaison locale `.vercel` ni `vercel.json` observ?e. L'absence locale ne prouve pas l'absence d'int?gration distante ; ?tat cloud non v?rifi?. Aucune commande Vercel ni d?ploiement.
- Aucun AGENTS.md initial dans les deux d?p?ts. Next 16.3.8 a ensuite g?n?r? AGENTS.md et CLAUDE.md dans la cible ; instructions lues, guides locaux distDir/proxy consult?s. Cache propre `.next-fecolutta`.
- R?gles d'authentification, droits AUT-SPT, v?rification fra?che des comptes/autorisations et contr?le d'origine conserv?s. Uniquement isolation de configuration : `fecolutta_session` et `FECOLUTTA_USERS_SPREADSHEET_ID`. Aucun repli vers les comptes FECOT ; garde de refus si le nouvel ID utilisateurs est identique ? l'ancien. Aucun m?canisme d'authentification nouveau, aucun compte cr??.

### Rapport d'?cart court

| R?utilisable depuis FECOT | Adaptation FECOLUTTA / limite |
| --- | --- |
| Tableaux, cartes mobiles, recherche, filtres, tris, pagination, navigation Ligues -> Ententes -> Clubs | Mod?le visuel conserv? ; marque textuelle FECOLUTTA et libell? Lutteurs. Aucun logo officiel invent?. |
| Mappers et enrichissement territorial | `pseudo_ligue/email_ligue` et `pseudo_entente/email_entente` diff?rent des sigles/emails FECOT. Cat?gorie et code de club sont d?j? les bonnes cl?s FECOLUTTA. |
| Formulaires/?critures FECOT | Pas encore activ?s : leurs colonnes suppl?mentaires et g?n?ration UUID ne conviennent pas. Futur lot : ?crire seulement les colonnes pr?sentes et composer les codes locaux. |
| Protections d'acc?s | Conserv?es ; sources, cookie et cache isol?s pour FECOLUTTA. Les anciens scripts d'administration ciblent d?sormais la variable FECOLUTTA, sans ?tre ex?cut?s. |
| Mod?le de sport de combat | Interface r?utilisable dans un lot ult?rieur ; aucune reprise des grades/scores taekwondo, reprises de boxe, seuils ou classements automatiques. |
| M?dias/utilisateurs/registre licences | Hors p?rim?tre. Upload de logo refus? avant appel Drive. Licences n'effectue aucun appel au registre. |

### En-t?tes r?els et mapping

M?tadonn?es et lectures born?es via le connecteur Google Drive, en lecture seule. Sources :

- Territoire : `1rEVy4LLJPsDHxnyawidS9g38lYY4iwKTLV_cozSpOo4`, titre 01_FECOLUTTA_STRUCTURE_TERRITORIALE.
- R?f?rentiel : `1_RvDhBggMdiZKoeF_c582MRb8pRpnwmB3Mo7ZBYtgCs`, titre 00_FECOLUTTA_REFERENTIEL.

| Feuille | En-t?tes exacts lus | Raccordement |
| --- | --- | --- |
| LIGUES | id_ligue, nom_ligue, pseudo_ligue, email_ligue, id_province, statut, observations | pseudo_ligue -> sigleLigue ; email_ligue -> emailLigue ; identifiant texte. |
| ENTENTES | id_entente, code_entente, nom_entente, pseudo_entente, id_ligue, id_ville, email_entente, statut, observations | pseudo_entente -> sigle/pseudo ; email_entente -> email ; nom du parent r?solu par ID. |
| CLUBS | id_club, nom_club, id_categorie_club, id_sexe, date_affiliation, id_ville, id_entente, id_ligue, statut, observations, code_club | Aucune colonne ? inventer. Ligue d?duite de l'entente, ancien id_ligue gard? pour diagnostic. |

Lecture compl?te born?e : LIGUES 26 lignes, codes `01` ? `26` inchang?s ; ENTENTES 0 ligne ; CLUBS 0 ligne. Statuts vides conserv?s ? la source et rendus ? Non renseign? ?. Les tableaux n'affichent pas de donn?es de d?monstration.

R?f?rentiels lus : PROVINCES (id_province, nom_province, statut, observations ; 26 lignes), VILLES (id_ville, id_province, nom_ville, statut ; 36 lignes), CATEGORIES_CLUB (id_categorie_club, nom_categorie_club, observations ; 4 lignes), SEXES (id_sexe, nom_sexe, observations ; 3 lignes).

FORMATS_ID lu : LIGUE ## exemple 01 ; ENTENTE #### exemple 0102 ; CLUB ####### exemple 0102001. Le classeur indique pour CLUB ? ? confirmer selon base actuelle ? ; la consigne utilisateur confirme le format ? appliquer au futur formulaire. Actuellement aucun ID n'est cr??. Les modifications futures doivent conserver les IDs existants et ne pas importer le g?n?rateur UUID FECOT.

### Code et performances

- `lib/fecolutta-territorial-source.ts` : sch?ma r?el et garde stricte sur les deux IDs FECOLUTTA ; variables FECOT jamais utilis?es en repli.
- `lib/territorial-store.ts` : scope Sheets readonly ; deux batchGet pour trois feuilles territoriales et quatre r?f?rences ; plages limit?es A:G, A:I, A:K et A:D, valeurs format?es pour pr?server les z?ros. Erreurs Google assainies. Writer d?sactiv?.
- `lib/territorial-data.ts` : cache 30 s propre ? FECOLUTTA et mutualisation par requ?te ; comptes/autorisations restent hors cache m?tier.
- `lib/territorial-view-model.ts` : alias, r?solution par ID, noms des parents et diagnostic des incoh?rences/parents introuvables sans masquer le club.
- `components/territorial` : chargement, erreur distincte de vide et formulaires d?sactiv?s, m?me pour un administrateur. API de mutation renvoie un refus et ne contacte pas Sheets ; upload de logo refus? sans appel Drive.
- Les pages Licences affichent uniquement ? Le module Licences FECOLUTTA sera disponible prochainement. ?. Aucun registre, compteur, num?ro, licence fictive, d?livrance ou renouvellement.
- `tests/data/fecolutta-territory.json` : capture de contr?le du territoire et des r?f?rences publics. Aucun import depuis une route applicative : ce fichier ne sert jamais de repli ? Google.

### Configuration et blocages

`.env.local` ?tait une copie FECOT : classeurs FECOT, compte Google et deux secrets identiques ? la r?f?rence, constat?s par comparaison bool?enne sans affichage. Les valeurs sensibles n'ont pas ?t? modifi?es.

Les deux IDs fournis ont ?t? ajout?s dans `.env.local` sous :

- FECOLUTTA_STRUCTURE_TERRITORIALE_SPREADSHEET_ID : territoire FECOLUTTA.
- FECOLUTTA_REFERENTIELS_SPREADSHEET_ID : r?f?rentiel FECOLUTTA.

? renseigner par l'utilisateur dans `data/monosport/fecolutta-managment/.env.local` :

- FECOLUTTA_USERS_SPREADSHEET_ID : classeur utilisateurs propre ? la f?d?ration. Aucun ID n'a ?t? fourni pour ce bloc ; ne pas utiliser celui de FECOT.
- AUTH_SECRET et AUTH_TELEMETRY_HMAC_KEY : deux nouveaux secrets propres ? FECOLUTTA, distincts et de 32 caract?res minimum. Demande envoy?e ? l'utilisateur, sans lui demander de transmettre les valeurs dans le chat.

GOOGLE_CLIENT_EMAIL et GOOGLE_PRIVATE_KEY sont pr?sents. Le partage du compte de service ne prouve pas la cible ; le code v?rifie les IDs et utilise uniquement un scope readonly. `.env.example` contient les noms exacts utilis?s, avec valeurs vides ; les param?tres m?dias h?rit?s y sont identifi?s hors p?rim?tre.

Test direct SDK Google sur les trois feuilles territoriales, en lecture seule, apr?s contr?le des deux IDs : ?chec `EACCES` dans l'environnement d'ex?cution. Le connecteur Drive fonctionne, mais cela ne valide pas le r?seau/droits du SDK de l'application. Pas de nouvelle tentative identique, pas de contournement des protections, pas de repli vers la capture.

### V?rifications r?ellement effectu?es

- Lecture r?elle par connecteur : titres, en-t?tes, 26 ligues et listes enfants vides ; quatre r?f?rentiels et FORMATS_ID. Aucun changement de sch?ma ou ?criture Drive.
- 23 tests cibl?s r?ussis : mapping FECOLUTTA, code_club/cat?gorie, alias email/sigle, z?ros initiaux, ligue d?duite, incoh?rence conserv?e, parent absent, vide et erreur de sch?ma, refus de mauvaise cible, cookie FECOLUTTA, autorisations et session fail-closed.
- Commande : `node --experimental-strip-types --test tests/fecolutta-territorial-read.test.ts tests/unit/fecot-session-cookie.test.ts tests/unit/session-resolution.test.ts tests/unit/authorization-matrix.test.ts tests/territorial-permissions.test.ts`.
- `node scripts/fecolutta-lists-ui-qa.mjs` : code 0. Vrais composants et capture Drive isol?s : pagination 10/10/6, recherche Kinshasa, filtre Kwango, IDs 01/02, ? Non renseign? ?, ?tats vides, erreur sans faux tableau vide, absence d'actions Ajouter/Modifier, ordre de navigation, mobile 390 px sans d?bordement, aucune erreur JavaScript. R?seau bloqu? dans ce test : aucune mutation ni lecture Google. Ce contr?le n'est pas une connexion authentifi?e ? l'application.
- Captures `test-results/fecolutta-lists/` (ignor?es Git) : Ligues desktop, Clubs vide et Ligues mobile examin?s visuellement, mod?le FECOT conserv?. CSS existant r?utilis? ; aucun build requis pour ce contr?le isol?.
- `npm.cmd run lint` : code 0 apr?s ajout des tests et du raccordement. Le script du d?p?t est un alias `npm run typecheck` : TypeScript global, pas un ESLint distinct.
- Serveur Next local d?marr? sur http://127.0.0.1:3048 avec cache isol?. Protections anonymes contr?l?es s?par?ment ci-dessous. Aucun serveur d'un autre d?p?t arr?t?.
- Pas de build complet pour ce point de contr?le ; r?serv? ? un ensemble coh?rent. Aucune ?criture de test en production, aucun upload, push ou d?ploiement.

### Prochaine action exacte

1. Compl?ter la configuration utilisateurs/secrets FECOLUTTA ; utiliser un environnement o? le SDK Google peut sortir du refus EACCES. V?rifier le SDK en lecture seule, puis ouvrir les trois listes avec une session FECOLUTTA autoris?e. URLs : http://127.0.0.1:3048/ligues, /ententes, /clubs. Les pages restent prot?g?es pendant ce blocage.
2. Apr?s ce point de contr?le : raccorder les fiches/formulaires au sch?ma r?el, s?lectionner les parents, g?n?rer les IDs 01 -> 0102 -> 0102001, contr?ler unicit? et coh?rence c?t? serveur, pr?server l'ID en correction. Aucun ajout de colonne n?cessaire pour code_club/id_categorie_club. Tester uniquement en m?moire ou dans un classeur de test autoris? avant d'activer les mutations.
3. Acteurs : relire les en-t?tes de ATHLETES, COACHS, ARBITRES, OFFICIELS, MEDECINS, AUTRES ; commencer Lutteurs, identit? f?d?rale distincte de id_uww facultatif, id_national non obligatoire et jamais interpr?t? comme licence. Pas d'avatar/upload.
4. Affiliations : lire les cl?s par cat?gorie et STATUTS_AFFILIATION, puis historique/ajout/correction/fin de la m?me ligne, saison et club ; conserver clubs inactifs ou inconnus. Aucun transfert automatique ni r?gle de chevauchement import?e. Mandats s?par?s.
5. Comp?titions : v?rifier FED011/LUT, DISC041 gr?co-romaine et DISC042 libre ; une seule ?preuve/style en recette simul?e. Pas de seuils d'?ge/poids invent?s. Engagement individuel, deux lutteurs diff?rents engag?s dans l'?preuve, p?riode facultative selon r?glement, points techniques s?par?s du vainqueur/d?cision/statut. Raccorder id_decision_resultat, libelle_decision_officielle, numero_periode_fin, temps_arret. Recette aux points puis tomb? sans score, sans moteur de r?glement ni classement automatique.
6. Activit?s/Documents : lire leurs feuilles et en-t?tes avant raccordement ; relations et acc?s des liens existants conserv?s, aucun t?l?versement. Licences reste informatif et son registre n'est pas appel?.

Les classeurs Acteurs, Affiliations, Comp?titions, Activit?s et Documents ne sont pas encore lus ni raccord?s dans ce premier lot. L'ancien document structure-territoriale.md est une archive FECOT, pas une autorisation de modification des classeurs FECOLUTTA.

Protections locales confirmees : GET /ligues, /ententes et /clubs anonymes -> 307 vers /login ; GET /api/ligues anonyme -> 401. Aucune lecture du classeur utilisateurs FECOT. Le serveur 127.0.0.1:3048 reste actif pour le point de controle.

Controle final : lint/typecheck global code 0 apres le demarrage Next ; navigateur isole code 0 apres ajustement du libelle de statut vide. Recherche Drive ciblee (classeur dont le nom contient FECOLUTTA et USER/UTILISATEUR) : aucun resultat accessible. Cela ne prouve pas son inexistence sous un autre nom ; FECOLUTTA_USERS_SPREADSHEET_ID reste a fournir, sans creation de classeur dans ce lot.

## Rattachement Git demande par l’utilisateur

Destination fournie : https://github.com/Rodanyoca/fecolutta-saas.git, branche main. Le remote origin herite de FECOT est remplace par cette destination. Publication des sources explicitement demandee apres le premier lot ; secrets, .env.local, caches et resultats de tests restent exclus. Cela ne valide pas la connexion Google ni la configuration utilisateurs encore attendues. Aucune commande de deploiement.
