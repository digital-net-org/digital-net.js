# US-SDK-03 : ApiKeyCatalog

| Statut |
|:---:|
| `TO_DO` |

* **En tant que** développeur·se consommant le SDK `@digital-net-org/digital-api-sdk`
* **Je veux** un `ApiKeyCatalog` typé exposant les endpoints de gestion des clés API personnelles de l'utilisateur connecté
* **Afin de** permettre à l'utilisateur de créer, lister et révoquer ses clés API depuis son espace personnel du backoffice

> **Note technique :** Le catalog suit le pattern établi par `AuthCatalog` : classe stockant un `http: HttpClient` privé, méthodes retournant `Promise<Result<T>>`, délégation à `CatalogRunner.run<T>()`, support des `CatalogCallbacks<T>`. **Point critique : la clé plaintext n'est retournée qu'une seule fois**, à la création. Il n'y a aucun moyen de la récupérer ensuite — seules les métadonnées (`ApiKeyDto`) sont lisibles via la liste.
> **Pré-requis :** `AuthCatalog` déjà en place. Pas de tests unitaires/intégration — validation via playbook Node uniquement.
> **Source backend :** `packages/digital.net/Digital.Net.Core/Endpoints/ApiKeyEndpoints.cs`

### Critères d'acceptation :

**1. Routes (constantes prêtes à copier/coller)**

Créer `src/routes/apiKey.ts` :

```ts
export const DN_API_USER_API_KEY = 'user/self/api-key' as const;
export const DN_API_USER_API_KEY_BY_ID = 'user/self/api-key/:id' as const;
```

Mettre à jour `src/routes/index.ts` :

```ts
export * from './apiKey';
```

**2. Types partagés (DTO d'entités DB — à créer ou réutiliser)**

Ce ticket **crée** un nouveau DTO d'entité dans le dossier `src/types/entities/`.

Créer `src/types/entities/ApiKeyDto.ts` :

```ts
export interface ApiKeyDto {
    id: string;
    name?: string;
    createdAt: string;
    expiredAt?: string;
}
```

Mettre à jour `src/types/entities/index.ts` pour ré-exporter ce DTO :

```ts
export * from './ApiKeyDto';
```

> **Note** : si US-SDK-02 n'a pas encore été implémentée au moment de commencer ce ticket, c'est **ce** ticket qui crée alors le dossier `src/types/entities/` et met à jour `src/types/index.ts` pour ré-exporter le sous-module `entities` :
> ```ts
> export * from './Result';
> export * from './ResultMessage';
> export * from './entities';
> ```

**3. Payloads du catalog (co-localisés)**

Créer `src/Catalog/ApiKeyCatalog/types/ApiKeyCreatePayload.ts` :

```ts
export interface ApiKeyCreatePayload {
    name: string;
    expiredAt?: string;
}
```

Créer `src/Catalog/ApiKeyCatalog/types/index.ts` :

```ts
export * from './ApiKeyCreatePayload';
```

**4. Méthodes du catalog**

Créer `src/Catalog/ApiKeyCatalog/ApiKeyCatalog.ts` avec les méthodes suivantes :

```ts
public async create(
    payload: ApiKeyCreatePayload,
    options: CatalogCallbacks<string> = {}
): Promise<Result<string>>
// POST user/self/api-key — JWT/ApiKey
// Retourne la clé plaintext UNE SEULE FOIS (ne sera plus jamais visible ensuite)
// Le caller doit stocker/afficher la valeur immédiatement car elle n'est pas persistée

public async list(
    options: CatalogCallbacks<ApiKeyDto[]> = {}
): Promise<Result<ApiKeyDto[]>>
// GET user/self/api-key — JWT/ApiKey
// Retourne uniquement les métadonnées (id, name, createdAt, expiredAt), jamais la clé

public async delete(
    id: string,
    options: CatalogCallbacks<null> = {}
): Promise<Result<null>>
// DELETE user/self/api-key/:id — JWT/ApiKey — via slugs: { id }
```

Créer `src/Catalog/ApiKeyCatalog/index.ts` :

```ts
export * from './ApiKeyCatalog';
export * from './types';
```

**5. Intégration dans l'agrégateur Catalog**

Mettre à jour `src/Catalog/Catalog.ts` :

```ts
import { ApiKeyCatalog } from './ApiKeyCatalog';
// ...
public readonly apiKey: ApiKeyCatalog;
// dans le constructor :
this.apiKey = new ApiKeyCatalog(http);
```

Mettre à jour `src/Catalog/index.ts` :

```ts
export * from './ApiKeyCatalog';
```

**6. Playbook de validation manuelle (scénario détaillé)**

Créer `playbook/playbook.api-key.mjs`. Arguments : `--base-url`, `--login`, `--password`.

Le playbook vérifie le cycle complet (create → list → delete) et nettoie les clés qu'il a créées pour ne rien laisser traîner en base.

| # | Action | Détails | Assertion visuelle |
|---|---|---|---|
| 1 | `auth.login({ login, password })` | Obtenir JWT | `hasError: false` |
| 2 | `apiKey.list()` | Inventaire initial | Stocker `initialCount = result.value.length` |
| 3 | `apiKey.create({ name: 'playbook-' + Date.now() })` | Créer sans date d'expiration | `value` = string non vide (la clé plaintext) |
| 3b | Stocker `plaintextKey = result.value` et afficher via `Logger.truncateToken` | — | — |
| 4 | `apiKey.list()` | Vérifier que la liste contient +1 élément | `value.length === initialCount + 1` |
| 4b | Stocker `firstKeyId = value.find(k => k.name?.startsWith('playbook-') && !k.expiredAt).id` | Récupérer l'ID de la clé sans expiration | — |
| 5 | `apiKey.create({ name: 'playbook-expiring-' + Date.now(), expiredAt: '2030-01-01T00:00:00Z' })` | Créer avec date d'expiration | `hasError: false` |
| 6 | `apiKey.list()` | Vérifier count = `initialCount + 2` et présence d'un `expiredAt` sur la 2ème | Inspection visuelle |
| 6b | Stocker `secondKeyId = value.find(k => k.name?.startsWith('playbook-expiring-')).id` | — | — |
| 7 | `apiKey.delete(firstKeyId)` | Supprimer la première clé créée | `hasError: false` |
| 8 | `apiKey.list()` | Vérifier count = `initialCount + 1` | `value.length === initialCount + 1` |
| 9 | `apiKey.delete(secondKeyId)` | Nettoyage : supprimer la 2ème clé | `hasError: false` |
| 10 | `apiKey.list()` | État final = état initial | `value.length === initialCount` |
| 11 | `apiKey.delete('00000000-0000-0000-0000-000000000000')` | Tester la gestion d'erreur 404 (ID bidon) | `hasError: true`, callback `onStatus[404]` déclenchable |
| 12 | `auth.logout()` | Cleanup | — |

Exit code 0 si les étapes 1-10 passent (l'étape 11 est attendue en erreur, elle n'empêche pas le succès global).

**7. Hors périmètre**

* Pas de tests unitaires ni d'intégration (Vitest)
* Pas de helper pour générer un nom de clé unique
* Pas de cache de la liste des clés API côté SDK
* Pas de renouvellement/rotation de clé (il faut supprimer + recréer via deux appels)
* Pas de filtrage ou tri côté SDK (la liste est renvoyée telle qu'émise par le serveur)

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
| Source endpoints .NET | `packages/digital.net/Digital.Net.Core/Endpoints/ApiKeyEndpoints.cs` |
