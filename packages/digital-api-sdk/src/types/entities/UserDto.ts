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
