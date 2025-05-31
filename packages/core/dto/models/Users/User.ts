import type { Avatar } from '../Avatars/Avatar';
import type { Entity } from '../../Entity';

export interface User extends Entity {
    username: string;
    login: string;
    email: string;
    avatar?: Avatar;
    isActive: boolean;
}
