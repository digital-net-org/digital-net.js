import type { Entity } from './Entity';
import type { AvatarDto } from './AvatarDto';

export interface UserDto extends Entity {
    username: string;
    login: string;
    email: string;
    avatar?: AvatarDto;
    isActive: boolean;
    isAdmin: boolean;
    createdAt: string;
    updatedAt?: string;
}
