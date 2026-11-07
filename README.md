# FECOLUTTA - F?d?ration congolaise de luttes associ?es

Premier lot : listes Ligues, Ententes et Clubs en lecture seule. R?f?rence FECOT consult?e sans modification. Voir [le mapping, les ?carts et le point de reprise](docs/FECOLUTTA_VALIDATION.md).

Les deux IDs territoriaux fournis sont configur?s dans `.env.local` ; [.env.example](.env.example) contient uniquement les noms des variables et des valeurs vides. Renseigner `FECOLUTTA_USERS_SPREADSHEET_ID` et deux secrets propres ? FECOLUTTA pour conserver les protections sans acc?der aux comptes FECOT. Aucun compte ni classeur utilisateurs cr?? ici.

Serveur local : `node node_modules/next/dist/bin/next dev --webpack --hostname 127.0.0.1 --port 3048`, puis http://127.0.0.1:3048/ligues. Les pages sont prot?g?es par la connexion ; l'acc?s SDK Google doit ?galement ?tre autoris? par le r?seau d'ex?cution.

Contr?les ind?pendants : `node --experimental-strip-types --test tests/fecolutta-territorial-read.test.ts`, `node scripts/fecolutta-lists-ui-qa.mjs`, `npm.cmd run lint` (alias TypeScript du d?p?t). Le navigateur isol? utilise une capture r?elle du territoire, jamais import?e par l'application. Il ne remplace pas un test connect?.

Formulaires et mutations territoriales d?sactiv?s pour ce premier point de contr?le. Licences : ? Le module Licences FECOLUTTA sera disponible prochainement. ? Aucun nouveau t?l?versement, push ou d?ploiement.

<details><summary>Archive du README h?rit? de FECOT - ne constitue pas la configuration FECOLUTTA</summary>

# FECOT - Federation congolaise de taekwondo

Application Next.js avec le bloc territorial porté depuis FEVOCO : ligues, ententes et clubs, listes, fiches, formulaires latéraux, recherches, filtres, tris, pagination et logos Drive. Connexion, activation, sessions et droits AUT-SPT également portés à la demande de l’utilisateur.

## Demarrage

```powershell
npm.cmd install
npm.cmd run dev
```

Ouvrir http://localhost:3000. Si le port est occupe, Next.js indique le port disponible.

```powershell
npm.cmd run typecheck
npm.cmd run build
npm.cmd start
```

## Configuration et périmètre

Renseigner les variables décrites dans [.env.example](.env.example) dans votre environnement ou votre fichier `.env.local`. Les valeurs du modèle sont volontairement vides. Aucun secret ni compte d’un autre dépôt n’est réutilisé.

La connexion exige un classeur utilisateurs FECOT, deux secrets indépendants et les accès Google. Le bloc territorial exige son classeur et le référentiel FECOT ; les logos nécessitent la configuration OAuth Drive. Sans configuration, l’application refuse l’accès et affiche une indisponibilité explicite.

Voir [le rapport et le guide de configuration](docs/structure-territoriale.md) pour les IDs des deux classeurs FECOT vérifiés, le modèle des données, la préparation du classeur utilisateurs et la création du premier administrateur.

Le bloc Acteurs et affiliations n’est pas encore intégré ; ses sections dans les fiches territoriales affichent un état explicite. Les autres modules restent en préparation. Aucun jeu de données métier fictif n’est utilisé dans l’application, aucune équipe ou division n’est ajoutée. Aucun logo officiel FECOT n’a été fourni ; la marque reste textuelle.

## Vérifications

```powershell
npm.cmd test
npm.cmd run typecheck
npm.cmd run build
npm.cmd run test:ui
node scripts/auth-ui-qa.mjs
```

Les tests UI utilisent Chromium local : `npx.cmd playwright install chromium` si nécessaire. Le test territorial est isolé : il part d’une lecture réelle des 26 ligues FECOT et conserve toutes les écritures de test en mémoire. Les comparaisons supposent le dépôt FEVOCO présent dans le même workspace.

</details>
