# US-SDK-02 : UserCatalog

| Statut |
|:---:|
| `TO_DO` |

* **En tant que** développeur·se consommant le SDK `@digital-net-org/digital-api-sdk`
* **Je veux** un `UserCatalog` typé exposant les endpoints `User` (profil, mot de passe, avatar, schéma)
* **Afin de** permettre au frontend de lire et modifier le profil de l'utilisateur connecté, consulter les métadonnées CRUD du schéma `User`, et gérer l'avatar (upload, lecture, suppression)

> **Note technique :** Le catalog suit le pattern établi par `AuthCatalog` : classe stockant un `http: HttpClient` privé, méthodes retournant `Promise<Result<T>>`, délégation à `CatalogRunner.run<T>()`, support des `CatalogCallbacks<T>`. Les endpoints avatar manipulent des fichiers binaires (upload via `FormData`, lecture en `Blob`) — cela peut nécessiter des adaptations du `HttpSerializer` (voir section 4).
> **Pré-requis :** `AuthCatalog` déjà en place. Pas de tests unitaires/intégration — validation via playbook Node uniquement. **Ce ticket est celui qui crée le dossier `src/types/entities/`** : il est le premier à définir des DTO d'entités DB.
> **Source backend :** `packages/digital.net/Digital.Net.Core/Endpoints/UserEndpoints.cs`

### Critères d'acceptation :

**1. Routes (constantes prêtes à copier/coller)**

Créer `src/routes/user.ts` :

```ts
export const DN_API_USER_SCHEMA = 'user/schema' as const;
export const DN_API_USER_BY_ID = 'user/:id' as const;
export const DN_API_USER_SELF = 'user/self' as const;
export const DN_API_USER_SELF_PASSWORD = 'user/self/password' as const;
export const DN_API_USER_SELF_AVATAR = 'user/self/avatar' as const;
export const DN_API_USER_AVATAR_BY_ID = 'user/:id/avatar' as const;
```

Mettre à jour `src/routes/index.ts` :

```ts
export * from './user';
```

**2. Types partagés (DTO d'entités DB — à créer)**

Ce ticket **crée** le dossier `src/types/entities/` ainsi que les deux premiers DTO d'entités partagées.

Créer `src/types/entities/AvatarDto.ts` :

```ts
export interface AvatarDto {
    id: string;
    documentId?: string;
    x: number;
    y: number;
}
```

Créer `src/types/entities/UserDto.ts` :

```ts
import type { AvatarDto } from './AvatarDto';

export interface UserDto {
    id: string;
    username?: string;
    login?: string;
    email?: string;
    avatar?: AvatarDto;
    isActive?: boolean;
    createdAt: string;
    updatedAt?: string;
}
```

Créer `src/types/entities/index.ts` :

```ts
export * from './AvatarDto';
export * from './UserDto';
```

Mettre à jour `src/types/index.ts` pour ré-exporter le nouveau dossier :

```ts
export * from './Result';
export * from './ResultMessage';
export * from './entities';
```

**3. Payloads du catalog (co-localisés)**

Créer `src/Catalog/UserCatalog/types/UpdatePasswordPayload.ts` :

```ts
export interface UpdatePasswordPayload {
    currentPassword: string;
    newPassword: string;
}
```

Créer `src/Catalog/UserCatalog/types/UserSchema.ts` (type minimal — le schéma .NET est complexe, on expose une forme lâche réutilisable) :

```ts
export interface UserSchemaProperty {
    name: string;
    type: string;
    isReadOnly?: boolean;
    isRequired?: boolean;
    [key: string]: unknown;
}
```

Créer `src/Catalog/UserCatalog/types/index.ts` :

```ts
export * from './UpdatePasswordPayload';
export * from './UserSchema';
```

**4. Méthodes du catalog**

Créer `src/Catalog/UserCatalog/UserCatalog.ts` avec les méthodes suivantes :

```ts
public async getSchema(
    options: CatalogCallbacks<UserSchemaProperty[]> = {}
): Promise<Result<UserSchemaProperty[]>>
// GET user/schema — JWT/ApiKey

public async getById(
    id: string,
    options: CatalogCallbacks<UserDto> = {}
): Promise<Result<UserDto>>
// GET user/:id — JWT/ApiKey — passer id via slugs: { id }

public async getSelf(
    options: CatalogCallbacks<UserDto> = {}
): Promise<Result<UserDto>>
// GET user/self — JWT/ApiKey

public async patchSelf(
    patch: Array<{ op: string; path: string; value?: unknown }>,
    options: CatalogCallbacks<null> = {}
): Promise<Result<null>>
// PATCH user/self — body = JSON Patch RFC 6902 — JWT/ApiKey
// Vérifier côté .NET si l'endpoint exige 'Content-Type: application/json-patch+json'
// (si oui, override via headers: { 'Content-Type': 'application/json-patch+json' })

public async updatePassword(
    payload: UpdatePasswordPayload,
    options: CatalogCallbacks<null> = {}
): Promise<Result<null>>
// PUT user/self/password — JWT/ApiKey

public async updateAvatar(
    file: Blob | File,
    options: CatalogCallbacks<null> = {}
): Promise<Result<null>>
// PUT user/self/avatar — body = FormData avec un champ 'avatar'
// HttpClient supprime automatiquement Content-Type pour FormData (laisse fetch gérer le boundary)
// JWT/ApiKey

public async removeAvatar(
    options: CatalogCallbacks<null> = {}
): Promise<Result<null>>
// DELETE user/self/avatar — JWT/ApiKey

public async getUserAvatar(
    id: string,
    options: CatalogCallbacks<Blob> = {}
): Promise<Result<Blob>>
// GET user/:id/avatar — réponse binaire (image/*)
// POINT D'ATTENTION : vérifier que HttpSerializer.deserializeBody gère les
// réponses binaires. Si ce n'est pas le cas, la tâche préalable de ce ticket
// consiste à ajouter la gestion des Content-Type binaires dans HttpSerializer
// (retourner un Blob au lieu de tenter un JSON.parse).
```

Créer `src/Catalog/UserCatalog/index.ts` :

```ts
export * from './UserCatalog';
export * from './types';
```

**5. Intégration dans l'agrégateur Catalog**

Mettre à jour `src/Catalog/Catalog.ts` :

```ts
import { UserCatalog } from './UserCatalog';
// ...
public readonly user: UserCatalog;
// dans le constructor :
this.user = new UserCatalog(http);
```

Mettre à jour `src/Catalog/index.ts` :

```ts
export * from './UserCatalog';
```

**6. Playbook de validation manuelle (scénario détaillé)**

Créer `playbook/playbook.user.mjs`. Arguments : `--base-url`, `--login`, `--password`.

| # | Action | Détails | Assertion visuelle |
|---|---|---|---|
| 1 | `auth.login({ login, password })` | Obtenir le JWT | `hasError: false`, `value` = token JWT |
| 2 | `user.getSelf()` | Récupérer le profil courant | `value.id`, `value.login === login` CLI |
| 2b | Stocker `selfId = result.value.id` et `originalEmail = result.value.email` | Réutilisés aux étapes 6 et 9 | — |
| 3 | `user.getSchema()` | Lister les propriétés du schéma User | `value` = tableau non vide, contient des entrées `login`, `email` |
| 4 | `user.patchSelf([{ op: 'replace', path: '/email', value: 'playbook@test.local' }])` | Modifier l'email via JSON Patch | `hasError: false` |
| 5 | `user.getSelf()` à nouveau | Vérifier que l'email a changé | `value.email === 'playbook@test.local'` |
| 6 | `user.patchSelf([{ op: 'replace', path: '/email', value: originalEmail }])` | Restaurer l'email initial | `hasError: false` |
| 7 | `user.updatePassword({ currentPassword: password, newPassword: 'PlaybookTemp123!' })` | Changer le mot de passe | `hasError: false` |
| 8 | `user.updatePassword({ currentPassword: 'PlaybookTemp123!', newPassword: password })` | Restaurer le mot de passe initial | `hasError: false` |
| 9 | `user.getById(selfId)` | Lire un user par ID (ici soi-même) | `value.id === selfId` |
| 10 | `auth.logout()` | Nettoyage | `hasError: false` (ou cookie manquant en Node = attendu) |

Exit code 0 si les étapes 1-10 passent.

**Playbook avatar séparé** — `playbook/playbook.user-avatar.mjs` :

Ce scénario est séparé car il nécessite un fichier image local. Arguments supplémentaires : `--avatar-path=<chemin vers .png ou .jpg>`.

| # | Action | Détails | Assertion visuelle |
|---|---|---|---|
| 1 | `auth.login({ login, password })` | — | `hasError: false` |
| 2 | `user.getSelf()` → stocker `selfId` | — | `value.id` |
| 3 | Lire le fichier via `readFileSync(avatarPath)` → `new Blob([buffer], { type: 'image/png' })` | Préparation du payload | — |
| 4 | `user.updateAvatar(blob)` | Upload de l'avatar | `hasError: false` |
| 5 | `user.getUserAvatar(selfId)` | Téléchargement du même avatar | `value` est un `Blob`, afficher `value.size` (> 0) et `value.type` (`image/*`) |
| 6 | `user.removeAvatar()` | Supprimer l'avatar | `hasError: false` |
| 7 | `user.getUserAvatar(selfId)` | Vérifier que l'avatar est absent | `hasError: true` (404) OU `value.size === 0` selon le comportement .NET |
| 8 | `auth.logout()` | Cleanup | — |

Exit code 0 si les étapes 1-6 et 8 passent (l'étape 7 est attendue en erreur).

**7. Hors périmètre**

* Pas de tests unitaires ni d'intégration (Vitest)
* Pas de cropping / resizing d'avatar côté SDK — l'image est envoyée telle quelle
* Pas de cache des schémas User côté SDK
* Pas de helpers pour construire le JSON Patch (le caller fournit un tableau valide RFC 6902)

### Références d'implémentation :

| Référence | Chemin |
|---|---|
| Pattern Catalog | `packages/digital.net.js/packages/digital-api-sdk/src/Catalog/AuthCatalog/AuthCatalog.ts` |
| Runner | `packages/digital.net.js/packages/digital-api-sdk/src/Catalog/CatalogRunner.ts` |
| Types Callbacks | `packages/digital.net.js/packages/digital-api-sdk/src/Catalog/types/CatalogCallbacks.ts` |
| Agrégateur | `packages/digital.net.js/packages/digital-api-sdk/src/Catalog/Catalog.ts` |
| Routes existantes | `packages/digital.net.js/packages/digital-api-sdk/src/routes/auth.ts` |
| HttpClient config | `packages/digital.net.js/packages/digital-api-sdk/src/HttpClient/types/HttpRequestConfig.ts` |
| HttpSerializer (binaire) | `packages/digital.net.js/packages/digital-api-sdk/src/HttpClient/HttpSerializer.ts` |
| Playbook modèle | `packages/digital.net.js/packages/digital-api-sdk/playbook/playbook.auth.mjs` |
| Logger playbook | `packages/digital.net.js/packages/digital-api-sdk/playbook/Logger.mjs` |
| Source endpoints .NET | `packages/digital.net/Digital.Net.Core/Endpoints/UserEndpoints.cs` |
