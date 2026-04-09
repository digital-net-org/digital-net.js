# US-SDK-06 : ValidationCatalog

| Statut |
|:---:|
| `TO_DO` |

* **En tant que** développeur·se consommant le SDK `@digital-net-org/digital-api-sdk`
* **Je veux** un `ValidationCatalog` typé exposant les endpoints qui retournent les règles de validation serveur (patterns regex, tailles maximales)
* **Afin de** permettre au frontend de valider les formulaires côté client avec exactement les mêmes contraintes que le serveur, sans avoir à dupliquer les regex dans le code JS

> **Note technique :** Le catalog suit le pattern établi par `AuthCatalog` : classe stockant un `http: HttpClient` privé, méthodes retournant `Promise<Result<T>>`, délégation à `CatalogRunner.run<T>()`, support des `CatalogCallbacks<T>`. **Particularité** : seul `getEmailPattern()` est public (pas besoin d'être connecté) — les autres endpoints requièrent une authentification JWT ou ApiKey. Aucun DTO d'entité DB : tous les retours sont des types primitifs (`string` ou `number`).
> **Pré-requis :** `AuthCatalog` déjà en place. Pas de tests unitaires/intégration — validation via playbook Node uniquement.
> **Source backend :** `packages/digital.net/Digital.Net.Core/Endpoints/ValidationEndpoints.cs`

### Critères d'acceptation :

**1. Routes (constantes prêtes à copier/coller)**

Créer `src/routes/validation.ts` :

```ts
export const DN_API_VALIDATION_EMAIL_PATTERN = 'validation/pattern/email' as const;
export const DN_API_VALIDATION_USERNAME_PATTERN = 'validation/pattern/username' as const;
export const DN_API_VALIDATION_PASSWORD_PATTERN = 'validation/pattern/password' as const;
export const DN_API_VALIDATION_AVATAR_SIZE = 'validation/size/avatar' as const;
export const DN_API_VALIDATION_API_KEY_NAME_PATTERN = 'validation/pattern/api-key-name' as const;
```

Mettre à jour `src/routes/index.ts` :

```ts
export * from './validation';
```

**2. Types partagés (DTO d'entités DB)**

Aucun — tous les retours sont des primitifs sérialisés dans `Result<string>` ou `Result<number>`.

**3. Payloads du catalog (co-localisés)**

Aucun — aucune méthode n'accepte d'argument métier (seulement le paramètre `options` de callbacks).

**4. Méthodes du catalog**

Créer `src/Catalog/ValidationCatalog/ValidationCatalog.ts` avec les méthodes suivantes :

```ts
public async getEmailPattern(
    options: CatalogCallbacks<string> = {}
): Promise<Result<string>>
// GET validation/pattern/email — public (skipAuth: true, skipRefresh: true)
// Seul endpoint public du catalog

public async getUsernamePattern(
    options: CatalogCallbacks<string> = {}
): Promise<Result<string>>
// GET validation/pattern/username — JWT/ApiKey

public async getPasswordPattern(
    options: CatalogCallbacks<string> = {}
): Promise<Result<string>>
// GET validation/pattern/password — JWT/ApiKey

public async getAvatarSizeLimit(
    options: CatalogCallbacks<number> = {}
): Promise<Result<number>>
// GET validation/size/avatar — JWT/ApiKey
// Retourne un nombre de bytes (long côté .NET, number côté JS — attention overflow si > 2^53)

public async getApiKeyNamePattern(
    options: CatalogCallbacks<string> = {}
): Promise<Result<string>>
// GET validation/pattern/api-key-name — JWT/ApiKey
```

Créer `src/Catalog/ValidationCatalog/index.ts` :

```ts
export * from './ValidationCatalog';
```

**5. Intégration dans l'agrégateur Catalog**

Mettre à jour `src/Catalog/Catalog.ts` :

```ts
import { ValidationCatalog } from './ValidationCatalog';
// ...
public readonly validation: ValidationCatalog;
// dans le constructor :
this.validation = new ValidationCatalog(http);
```

Mettre à jour `src/Catalog/index.ts` :

```ts
export * from './ValidationCatalog';
```

**6. Playbook de validation manuelle (scénario détaillé)**

Créer `playbook/playbook.validation.mjs`. Arguments : `--base-url`, `--login`, `--password`.

Le scénario vérifie à la fois le chemin public (sans login, sur `getEmailPattern`), la gestion du 401 (appel authentifié sans login), puis tous les endpoints authentifiés après login. Il teste aussi les regex retournées en les exécutant sur des valeurs connues valides.

| # | Action | Détails | Assertion visuelle |
|---|---|---|---|
| 1 | `validation.getEmailPattern()` **sans login** | Seul endpoint public | `hasError: false`, `value` = regex string (ex: `^[\w.-]+@[\w.-]+\.\w+$`) |
| 1b | Tester la regex sur un email valide : `new RegExp(result.value).test('test@example.com')` | Validation fonctionnelle de la regex retournée | `true` |
| 1c | Tester la regex sur un email invalide : `new RegExp(result.value).test('pas-un-email')` | Contre-exemple | `false` |
| 2 | `validation.getUsernamePattern()` **sans login** | Doit échouer car auth requise | `hasError: true` (401), callback `onStatus[401]` déclenchable |
| 3 | `auth.login({ login, password })` | Authentification pour les endpoints suivants | `hasError: false` |
| 4 | `validation.getUsernamePattern()` | Récupérer pattern username | `value` = regex string |
| 4b | Tester la regex sur le login CLI : `new RegExp(result.value).test(login)` | Le login de connexion doit être valide par définition | `true` |
| 5 | `validation.getPasswordPattern()` | Récupérer pattern password | `value` = regex string (ex: `^(?=.*\d).{8,}$`) |
| 5b | Tester la regex du mot de passe sur le password CLI : `new RegExp(result.value).test(password)` | Le mot de passe de connexion doit être valide par définition | `true` |
| 6 | `validation.getAvatarSizeLimit()` | Récupérer la taille max d'avatar | `value` = nombre > 0 (bytes) — afficher en Mo : `(value / 1024 / 1024).toFixed(2) + ' MB'` |
| 7 | `validation.getApiKeyNamePattern()` | Récupérer pattern nom de clé API | `value` = regex string |
| 7b | Tester la regex sur un nom valide : `new RegExp(result.value).test('ma-cle-api')` | Inspection visuelle | `true` ou `false` selon les contraintes réelles — afficher le résultat pour inspection |
| 8 | `auth.logout()` | Cleanup | — |

Exit code 0 si les étapes 1, 3-7 et 8 passent (l'étape 2 est attendue en erreur, c'est le comportement normal).

**7. Hors périmètre**

* Pas de tests unitaires ni d'intégration (Vitest)
* Pas de cache des patterns côté SDK — chaque appel déclenche une requête (le caller peut mettre en cache au niveau applicatif)
* Pas de helpers `validateEmail(str)` / `validatePassword(str)` — le caller récupère la regex et l'applique lui-même
* Pas de conversion automatique des tailles en Mo / Go côté SDK (le caller formate)
* Pas de support du format `BigInt` pour `getAvatarSizeLimit` (en pratique une limite d'avatar ne dépasse jamais `Number.MAX_SAFE_INTEGER`, même en bytes)

### Références d'implémentation :

| Référence | Chemin |
|---|---|
| Pattern Catalog | `packages/digital.net.js/packages/digital-api-sdk/src/Catalog/AuthCatalog/AuthCatalog.ts` |
| Runner | `packages/digital.net.js/packages/digital-api-sdk/src/Catalog/CatalogRunner.ts` |
| Types Callbacks | `packages/digital.net.js/packages/digital-api-sdk/src/Catalog/types/CatalogCallbacks.ts` |
| Agrégateur | `packages/digital.net.js/packages/digital-api-sdk/src/Catalog/Catalog.ts` |
| Routes existantes | `packages/digital.net.js/packages/digital-api-sdk/src/routes/auth.ts` |
| HttpClient config | `packages/digital.net.js/packages/digital-api-sdk/src/HttpClient/types/HttpRequestConfig.ts` |
| Playbook modèle | `packages/digital.net.js/packages/digital-api-sdk/playbook/playbook.auth.mjs` |
| Logger playbook | `packages/digital.net.js/packages/digital-api-sdk/playbook/Logger.mjs` |
| Source endpoints .NET | `packages/digital.net/Digital.Net.Core/Endpoints/ValidationEndpoints.cs` |
