# US-SDK-01 : ApplicationCatalog

| Statut |
|:---:|
| `TO_DO` |

* **En tant que** développeur·se consommant le SDK `@digital-net-org/digital-api-sdk`
* **Je veux** un `ApplicationCatalog` typé exposant l'endpoint de métadonnées de l'application
* **Afin de** pouvoir afficher la version, le framework et le SHA du commit courant dans le pied de page du backoffice et pour le diagnostic en production

> **Note technique :** Le catalog suit le pattern établi par `AuthCatalog` : classe stockant un `http: HttpClient` privé, méthodes retournant `Promise<Result<T>>`, délégation à `CatalogRunner.run<T>()`, support des `CatalogCallbacks<T>`. L'endpoint est **public** : `skipAuth: true` et `skipRefresh: true` doivent être passés à la requête.
> **Pré-requis :** `AuthCatalog` déjà en place. Pas de tests unitaires/intégration — validation via playbook Node uniquement.
> **Source backend :** `packages/digital.net/Digital.Net.Core/Endpoints/RootEndpoints.cs`

### Critères d'acceptation :

**1. Routes (constantes prêtes à copier/coller)**

Créer `src/routes/application.ts` :

```ts
export const DN_API_APPLICATION_VERSION = '' as const;
```

Mettre à jour `src/routes/index.ts` :

```ts
export * from './application';
```

**2. Types partagés (DTO d'entités DB)**

Aucun — `ApplicationVersion` n'est pas une entité persistée en base, il s'agit d'un DTO de réponse système co-localisé avec le catalog (voir section 3).

**3. Payloads du catalog (co-localisés)**

Créer `src/Catalog/ApplicationCatalog/types/ApplicationVersion.ts` :

```ts
export interface ApplicationVersion {
    application: string;
    framework: string;
    origin: string;
    commitSha: string;
    release: string;
}
```

Créer `src/Catalog/ApplicationCatalog/types/index.ts` :

```ts
export * from './ApplicationVersion';
```

**4. Méthodes du catalog**

Créer `src/Catalog/ApplicationCatalog/ApplicationCatalog.ts` avec la méthode suivante :

```ts
public async getVersion(
    options: CatalogCallbacks<ApplicationVersion> = {}
): Promise<Result<ApplicationVersion>>
// GET / — public (skipAuth: true, skipRefresh: true)
```

Créer `src/Catalog/ApplicationCatalog/index.ts` :

```ts
export * from './ApplicationCatalog';
export * from './types';
```

**5. Intégration dans l'agrégateur Catalog**

Mettre à jour `src/Catalog/Catalog.ts` :

```ts
import { ApplicationCatalog } from './ApplicationCatalog';
// ...
public readonly application: ApplicationCatalog;
// dans le constructor :
this.application = new ApplicationCatalog(http);
```

Mettre à jour `src/Catalog/index.ts` :

```ts
export * from './ApplicationCatalog';
```

**6. Playbook de validation manuelle (scénario détaillé)**

Créer `playbook/playbook.application.mjs`. C'est le playbook le plus simple (1 seul appel), il sert aussi à vérifier que le serveur backend tourne.

**Particularité** : pas de login requis. Il faut soit ajuster `args.mjs` pour rendre `login` / `password` optionnels, soit utiliser un parseur d'arguments dédié dans ce playbook.

| # | Action | Détails | Assertion visuelle |
|---|---|---|---|
| 1 | `api.catalog.application.getVersion()` | Pas de login préalable — endpoint public | `hasError: false`, `value.application`, `value.framework`, `value.release`, `value.commitSha`, `value.origin` tous non vides |

Exit code 0 si `!result.hasError && result.value.application`.

**7. Hors périmètre**

* Pas de tests unitaires ni d'intégration (Vitest)
* Pas de mise à jour de la version du package `digital-api-sdk`
* Pas de documentation externe (README) au-delà du playbook
* Pas d'ajout de cache / memoization côté SDK

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
| Source endpoints .NET | `packages/digital.net/Digital.Net.Core/Endpoints/RootEndpoints.cs` |
