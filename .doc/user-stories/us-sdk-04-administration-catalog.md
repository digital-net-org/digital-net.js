# US-SDK-04 : AdministrationCatalog

| Statut |
|:---:|
| `TO_DO` |

* **En tant que** développeur·se consommant le SDK `@digital-net-org/digital-api-sdk`
* **Je veux** un `AdministrationCatalog` typé exposant les endpoints d'administration des utilisateurs (CRUD, pagination, changement de statut et de rôle)
* **Afin de** permettre aux administrateurs de gérer les comptes utilisateurs depuis le backoffice (création, désactivation, promotion admin, suppression)

> **Note technique :** Le catalog suit le pattern établi par `AuthCatalog` : classe stockant un `http: HttpClient` privé, méthodes retournant `Promise<Result<T>>`, délégation à `CatalogRunner.run<T>()`, support des `CatalogCallbacks<T>`. Tous les endpoints exigent un **rôle admin** côté backend (renvoie 401/403 si l'utilisateur courant n'est pas admin). Les opérations sensibles (delete, updateRole) exigent la confirmation du mot de passe de l'admin courant dans le body.
> **Pré-requis :** `AuthCatalog` déjà en place. **Dépendance forte** vers `UserDto` du ticket US-SDK-02 : si US-SDK-02 n'a pas encore été implémenté quand ce ticket démarre, il faut créer `src/types/entities/UserDto.ts` et `src/types/entities/AvatarDto.ts` en amont (voir section 2). Pas de tests unitaires/intégration — validation via playbook Node uniquement.
> **Source backend :** `packages/digital.net/Digital.Net.Core/Endpoints/AdministrationEndpoints.cs`

### Critères d'acceptation :

**1. Routes (constantes prêtes à copier/coller)**

Créer `src/routes/administration.ts` :

```ts
export const DN_API_ADMIN_USER = 'admin/user' as const;
export const DN_API_ADMIN_USER_BY_ID = 'admin/user/:id' as const;
export const DN_API_ADMIN_USER_STATUS = 'admin/user/:id/status' as const;
export const DN_API_ADMIN_USER_ROLE = 'admin/user/:id/role' as const;
```

Mettre à jour `src/routes/index.ts` :

```ts
export * from './administration';
```

**2. Types partagés (DTO d'entités DB et infra de pagination — à réutiliser ou créer)**

* **Réutilise** `UserDto` de `src/types/entities/UserDto.ts` (créé par US-SDK-02). Si US-SDK-02 n'est pas encore implémenté, créer en amont `src/types/entities/UserDto.ts` et `src/types/entities/AvatarDto.ts` tels que décrits dans ce ticket (voir US-SDK-02 section 2).

* **Crée** le type d'infrastructure de pagination `QueryResult<T>` — **attention : ce type va dans `src/types/` plat, PAS dans `src/types/entities/`** (c'est une infra transverse, pas une entité DB).

Créer `src/types/QueryResult.ts` :

```ts
export interface QueryResult<T> {
    value: T[];
    index: number;
    size: number;
    total: number;
}
```

Mettre à jour `src/types/index.ts` pour ré-exporter `QueryResult` :

```ts
export * from './Result';
export * from './ResultMessage';
export * from './QueryResult';
export * from './entities';
```

**3. Payloads du catalog (co-localisés)**

Créer `src/Catalog/AdministrationCatalog/types/UserCreatePayload.ts` :

```ts
export interface UserCreatePayload {
    username: string;
    login: string;
    email: string;
    password: string;
    isActive?: boolean;
}
```

Créer `src/Catalog/AdministrationCatalog/types/UserDeletePayload.ts` :

```ts
export interface UserDeletePayload {
    password: string;
}
```

Créer `src/Catalog/AdministrationCatalog/types/UserStatusPayload.ts` :

```ts
export interface UserStatusPayload {
    isActive: boolean;
}
```

Créer `src/Catalog/AdministrationCatalog/types/UserRolePayload.ts` :

```ts
export interface UserRolePayload {
    isAdmin: boolean;
    password: string;
}
```

Créer `src/Catalog/AdministrationCatalog/types/UserQuery.ts` :

```ts
export interface UserQuery {
    index?: number;
    size?: number;
    orderBy?: string;
    createdFrom?: string;
    createdTo?: string;
    updatedFrom?: string;
    updatedTo?: string;
    username?: string;
    email?: string;
    isActive?: boolean;
}
```

Créer `src/Catalog/AdministrationCatalog/types/index.ts` :

```ts
export * from './UserCreatePayload';
export * from './UserDeletePayload';
export * from './UserStatusPayload';
export * from './UserRolePayload';
export * from './UserQuery';
```

**4. Méthodes du catalog**

Créer `src/Catalog/AdministrationCatalog/AdministrationCatalog.ts` avec les méthodes suivantes :

```ts
public async getUserById(
    id: string,
    options: CatalogCallbacks<UserDto> = {}
): Promise<Result<UserDto>>
// GET admin/user/:id — JWT/ApiKey + role Admin — via slugs: { id }

public async getPaginatedUsers(
    query: UserQuery = {},
    options: CatalogCallbacks<QueryResult<UserDto>> = {}
): Promise<Result<QueryResult<UserDto>>>
// GET admin/user?<query> — JWT/ApiKey + role Admin
// Passer query via params (HttpClient gère le querystring)

public async createUser(
    payload: UserCreatePayload,
    options: CatalogCallbacks<string> = {}
): Promise<Result<string>>
// POST admin/user — retourne le Guid du nouvel utilisateur — JWT/ApiKey + Admin

public async deleteUser(
    id: string,
    payload: UserDeletePayload,
    options: CatalogCallbacks<null> = {}
): Promise<Result<null>>
// DELETE admin/user/:id avec body (mot de passe admin courant confirmé)
// JWT/ApiKey + Admin
// 403 si tentative de supprimer un autre admin (les admins sont protégés)

public async updateUserStatus(
    id: string,
    payload: UserStatusPayload,
    options: CatalogCallbacks<null> = {}
): Promise<Result<null>>
// PUT admin/user/:id/status — JWT/ApiKey + Admin
// 403 si tentative de désactiver un admin

public async updateUserRole(
    id: string,
    payload: UserRolePayload,
    options: CatalogCallbacks<null> = {}
): Promise<Result<null>>
// PUT admin/user/:id/role — JWT/ApiKey + Admin
// 401 si mot de passe admin incorrect
// 403 si on tente de rétrograder un admin existant
```

Créer `src/Catalog/AdministrationCatalog/index.ts` :

```ts
export * from './AdministrationCatalog';
export * from './types';
```

**5. Intégration dans l'agrégateur Catalog**

Mettre à jour `src/Catalog/Catalog.ts` :

```ts
import { AdministrationCatalog } from './AdministrationCatalog';
// ...
public readonly administration: AdministrationCatalog;
// dans le constructor :
this.administration = new AdministrationCatalog(http);
```

Mettre à jour `src/Catalog/index.ts` :

```ts
export * from './AdministrationCatalog';
```

**6. Playbook de validation manuelle (scénario détaillé)**

Créer `playbook/playbook.administration.mjs`. Le playbook nécessite un **compte admin**. Arguments : `--base-url`, `--login` (admin), `--password` (admin).

Le scénario couvre le cycle complet CRUD + modification de statut + promotion/rétrogradation admin + gestion d'erreurs (mauvais mot de passe, user admin protégé). Il **nettoie systématiquement** l'utilisateur qu'il a créé à la fin.

| # | Action | Détails | Assertion visuelle |
|---|---|---|---|
| 1 | `auth.login({ login, password })` | Login admin (credentials de dev : `BenoitSafari` / `Devpassword123!`) | `hasError: false` |
| 2 | `administration.getPaginatedUsers({ size: 5, index: 1 })` | Lister page 1, 5 éléments | `value.index === 1`, `value.value.length <= 5`, `value.total >= 1` |
| 3 | `administration.getPaginatedUsers({ size: 100, username: 'Ben', orderBy: 'CreatedAt' })` | Tester le filtre `StartsWith` sur `username` | `value.value` contient au moins `BenoitSafari` |
| 4 | `administration.createUser({ username: 'playbook-' + Date.now(), login: 'playbook-login-' + Date.now(), email: 'playbook@test.local', password: 'Playbook123!', isActive: true })` | Créer un nouvel user | `value` = Guid string |
| 4b | Stocker `newUserId = result.value` | Réutilisé pour toutes les étapes suivantes | — |
| 5 | `administration.getUserById(newUserId)` | Vérifier que l'user est bien créé | `value.username` correspond à celui envoyé, `value.isActive === true` |
| 6 | `administration.updateUserStatus(newUserId, { isActive: false })` | Désactiver l'user | `hasError: false` |
| 7 | `administration.getUserById(newUserId)` | Vérifier le changement de statut | `value.isActive === false` |
| 8 | `administration.updateUserRole(newUserId, { isAdmin: true, password: password })` | Promouvoir en admin (mdp admin courant) | `hasError: false` |
| 9 | `administration.updateUserRole(newUserId, { isAdmin: false, password: 'WrongPassword' })` | Test erreur 401 : mauvais mdp admin | `hasError: true`, callback `onStatus[401]` déclenchable |
| 10 | `administration.deleteUser(newUserId, { password: 'WrongPassword' })` | Test erreur 401 : suppression avec mauvais mdp | `hasError: true` |
| 11 | `administration.deleteUser(newUserId, { password: password })` | Tentative de suppression d'un user admin — doit échouer (**403**) car les admins sont protégés | `hasError: true`, callback `onStatus[403]` déclenchable |
| 12 | `administration.updateUserRole(newUserId, { isAdmin: false, password: password })` | Rétrograder pour pouvoir supprimer | `hasError: false` |
| 13 | `administration.deleteUser(newUserId, { password: password })` | Suppression finale avec bon mdp admin | `hasError: false` |
| 14 | `administration.getUserById(newUserId)` | Vérifier que l'user est bien supprimé | `hasError: true` (404), callback `onStatus[404]` déclenchable |
| 15 | `auth.logout()` | Cleanup | — |

Exit code 0 si les étapes 1-8, 12-14 et 15 passent (les étapes 9, 10, 11 sont attendues en erreur).

**7. Hors périmètre**

* Pas de tests unitaires ni d'intégration (Vitest)
* Pas de helper pour construire des `UserQuery` complexes (dates, ranges)
* Pas de pagination infinie / scroll côté SDK — le caller gère `index` manuellement
* Pas de bulk operations (suppression ou modification de plusieurs users à la fois)
* Pas de cache côté SDK

### Références d'implémentation :

| Référence | Chemin |
|---|---|
| Pattern Catalog | `packages/digital.net.js/packages/digital-api-sdk/src/Catalog/AuthCatalog/AuthCatalog.ts` |
| Runner | `packages/digital.net.js/packages/digital-api-sdk/src/Catalog/CatalogRunner.ts` |
| Types Callbacks | `packages/digital.net.js/packages/digital-api-sdk/src/Catalog/types/CatalogCallbacks.ts` |
| Agrégateur | `packages/digital.net.js/packages/digital-api-sdk/src/Catalog/Catalog.ts` |
| Routes existantes | `packages/digital.net.js/packages/digital-api-sdk/src/routes/auth.ts` |
| HttpClient config | `packages/digital.net.js/packages/digital-api-sdk/src/HttpClient/types/HttpRequestConfig.ts` |
| UserDto à réutiliser | `packages/digital.net.js/packages/digital-api-sdk/src/types/entities/UserDto.ts` (créé par US-SDK-02) |
| Playbook modèle | `packages/digital.net.js/packages/digital-api-sdk/playbook/playbook.auth.mjs` |
| Logger playbook | `packages/digital.net.js/packages/digital-api-sdk/playbook/Logger.mjs` |
| Source endpoints .NET | `packages/digital.net/Digital.Net.Core/Endpoints/AdministrationEndpoints.cs` |
