import type { User } from '@digital-net/dto';

export interface ApplicationUser extends User {
    authenticate: (body: Record<string, any>) => void;
    logout: () => void;
    refresh: () => void;
    isLoading: boolean;
    isLogged: boolean;
}
