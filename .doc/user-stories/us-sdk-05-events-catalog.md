# US-SDK-05 : EventsCatalog

| Statut |
|:---:|
| `TO_DO` |

* **En tant que** développeur·se consommant le SDK `@digital-net-org/digital-api-sdk`
* **Je veux** un `EventsCatalog` typé exposant les endpoints de consultation de l'audit log (événements applicatifs)
* **Afin de** permettre aux administrateurs de consulter l'historique des événements (auth, CRUD, erreurs) depuis le backoffice, avec pagination et filtrage par utilisateur, type et plage de dates

> **Note technique :** Le catalog suit le pattern établi par `AuthCatalog` : classe stockant un `http: HttpClient` privé, méthodes retournant `Promise<Result<T>>`, délégation à `CatalogRunner.run<T>()`, support des `CatalogCallbacks<T>`. Les deux endpoints nécessitent un **rôle admin** côté backend. L'audit log est purement en lecture : aucune méthode de création, modification ou suppression d'événement.
> **Pré-requis :** `AuthCatalog` déjà en place. **Dépendance forte** vers `QueryResult<T>` du ticket US-SDK-04 : si US-SDK-04 n'a pas encore été implémenté quand ce ticket démarre, il faut créer `src/types/QueryResult.ts` en amont (voir section 2). Pas de tests unitaires/intégration — validation via playbook Node uniquement.
> **Source backend :** `packages/digital.net/Digital.Net.Core/Endpoints/EventsEndpoints.cs`

### Critères d'acceptation :

**1. Routes (constantes prêtes à copier/coller)**

Créer `src/routes/events.ts` :

```ts
export const DN_API_EVENTS = 'events' as const;
export const DN_API_EVENTS_BY_ID = 'events/:id' as const;
```

Mettre à jour `src/routes/index.ts` :

```ts
export * from './events';
```

**2. Types partagés (DTO d'entités DB et infra de pagination — à créer ou réutiliser)**

* **Crée** `EventDto` dans le dossier `src/types/entities/`.
* **Réutilise** `QueryResult<T>` de `src/types/QueryResult.ts` (créé par US-SDK-04). Si US-SDK-04 n'est pas encore implémenté, créer le fichier en amont tel que décrit dans US-SDK-04 section 2.

Créer `src/types/entities/EventDto.ts` :

```ts
export type EventState = 'Pending' | 'Completed' | 'Failed' | string;
// POINT D'ATTENTION : le type exact EventState est défini côté .NET comme un enum.
// Vérifier les valeurs réelles dans `packages/digital.net/Digital.Net.Core.Entities/`
// avant d'implémenter. Le type union ci-dessus avec fallback `string` est une version
// souple qui fonctionnera quelle que soit la sérialisation côté .NET (enum en int ou en string).

export interface EventDto {
    id: string;
    name: string;
    payload?: string;
    userId?: string;
    state?: EventState;
    hasError: boolean;
    errorTrace?: string;
    createdAt: string;
    updatedAt?: string;
}
```

Mettre à jour `src/types/entities/index.ts` pour ré-exporter ce DTO :

```ts
export * from './EventDto';
```

**3. Payloads du catalog (co-localisés)**

Créer `src/Catalog/EventsCatalog/types/EventQuery.ts` :

```ts
export interface EventQuery {
    index?: number;
    size?: number;
    orderBy?: string;
    createdFrom?: string;
    createdTo?: string;
    updatedFrom?: string;
    updatedTo?: string;
    userId?: string;
    eventType?: string;
}
```

Créer `src/Catalog/EventsCatalog/types/index.ts` :

```ts
export * from './EventQuery';
```

**4. Méthodes du catalog**

Créer `src/Catalog/EventsCatalog/EventsCatalog.ts` avec les méthodes suivantes :

```ts
public async getEventById(
    id: string,
    options: CatalogCallbacks<EventDto> = {}
): Promise<Result<EventDto>>
// GET events/:id — JWT/ApiKey + role Admin — via slugs: { id }

public async getPaginatedEvents(
    query: EventQuery = {},
    options: CatalogCallbacks<QueryResult<EventDto>> = {}
): Promise<Result<QueryResult<EventDto>>>
// GET events?<query> — JWT/ApiKey + role Admin
// Passer query via params (HttpClient gère le querystring)
```

Créer `src/Catalog/EventsCatalog/index.ts` :

```ts
export * from './EventsCatalog';
export * from './types';
```

**5. Intégration dans l'agrégateur Catalog**

Mettre à jour `src/Catalog/Catalog.ts` :

```ts
import { EventsCatalog } from './EventsCatalog';
// ...
public readonly events: EventsCatalog;
// dans le constructor :
this.events = new EventsCatalog(http);
```

Mettre à jour `src/Catalog/index.ts` :

```ts
export * from './EventsCatalog';
```

**6. Playbook de validation manuelle (scénario détaillé)**

Créer `playbook/playbook.events.mjs`. Le playbook nécessite un **compte admin**. Arguments : `--base-url`, `--login` (admin), `--password` (admin).

Le scénario vérifie la pagination, le tri, le filtrage par type d'événement et par user, ainsi que la lecture unitaire d'un event et la gestion 404.

| # | Action | Détails | Assertion visuelle |
|---|---|---|---|
| 1 | `auth.login({ login, password })` | Login admin | `hasError: false` — ce login lui-même va générer un événement d'audit, ce qui garantit qu'il y a au moins 1 event en base |
| 2 | `events.getPaginatedEvents({ size: 10, index: 1 })` | Page 1, 10 événements | `value.index === 1`, `value.total >= 1`, `value.value.length <= 10` |
| 2b | Stocker `firstEventId = result.value.value[0]?.id` | Réutilisé à l'étape 6 | — |
| 3 | `events.getPaginatedEvents({ size: 5, orderBy: 'CreatedAt' })` | Tester le tri (orderBy défaut côté .NET = `CreatedAt`) | `value.value[0].createdAt` est le plus récent (ou le plus ancien selon la direction par défaut) |
| 4 | `events.getPaginatedEvents({ size: 20, eventType: 'AUTHENTICATION_LOGIN' })` | Filtre par type d'événement (la valeur exacte est à ajuster selon les noms réels côté .NET — voir `Digital.Net.Core` pour la liste des `EventName`) | `value.value` contient des événements dont `name === 'AUTHENTICATION_LOGIN'` (ou équivalent) |
| 5 | `events.getPaginatedEvents({ userId: <selfId>, size: 10 })` | Filtre par user | Soit **(A)** récupérer `selfId` via `api.catalog.user.getSelf()` si US-SDK-02 est implémenté, soit **(B)** utiliser un autre moyen de récupérer l'ID : `administration.getPaginatedUsers({ username: login, size: 1 })` → `result.value.value[0].id` si US-SDK-04 est implémenté | `value.value` contient uniquement des events de ce user |
| 6 | `events.getEventById(firstEventId)` | Lecture unitaire | `value.id === firstEventId`, `value.name` non vide, `value.createdAt` non vide |
| 7 | `events.getEventById('00000000-0000-0000-0000-000000000000')` | Test 404 sur ID inexistant | `hasError: true`, callback `onStatus[404]` déclenchable |
| 8 | `auth.logout()` | Cleanup | — |

Exit code 0 si les étapes 1-6 et 8 passent (l'étape 7 est attendue en erreur).

**Dépendance inter-tickets pour l'étape 5** : ce playbook dépend implicitement d'au moins un des deux catalogs US-SDK-02 (UserCatalog) ou US-SDK-04 (AdministrationCatalog). Si **aucun** des deux n'est encore implémenté au moment du run, remplacer simplement l'étape 5 par un filtre sur plage de dates :

```js
events.getPaginatedEvents({ createdFrom: '2026-01-01T00:00:00Z', size: 10 })
```

**7. Hors périmètre**

* Pas de tests unitaires ni d'intégration (Vitest)
* Pas de streaming / SSE pour les nouveaux événements — le polling reste à la charge du caller
* Pas de parsing automatique du champ `payload` (string JSON brute — le caller parse lui-même)
* Pas de filtrage complexe (regex, full-text search) côté SDK
* Aucune méthode de création/suppression d'événement (lecture seule)

### Références d'implémentation :

| Référence | Chemin |
|---|---|
| Pattern Catalog | `packages/digital.net.js/packages/digital-api-sdk/src/Catalog/AuthCatalog/AuthCatalog.ts` |
| Runner | `packages/digital.net.js/packages/digital-api-sdk/src/Catalog/CatalogRunner.ts` |
| Types Callbacks | `packages/digital.net.js/packages/digital-api-sdk/src/Catalog/types/CatalogCallbacks.ts` |
| Agrégateur | `packages/digital.net.js/packages/digital-api-sdk/src/Catalog/Catalog.ts` |
| Routes existantes | `packages/digital.net.js/packages/digital-api-sdk/src/routes/auth.ts` |
| HttpClient config | `packages/digital.net.js/packages/digital-api-sdk/src/HttpClient/types/HttpRequestConfig.ts` |
| QueryResult à réutiliser | `packages/digital.net.js/packages/digital-api-sdk/src/types/QueryResult.ts` (créé par US-SDK-04) |
| Playbook modèle | `packages/digital.net.js/packages/digital-api-sdk/playbook/playbook.auth.mjs` |
| Logger playbook | `packages/digital.net.js/packages/digital-api-sdk/playbook/Logger.mjs` |
| Source endpoints .NET | `packages/digital.net/Digital.Net.Core/Endpoints/EventsEndpoints.cs` |
