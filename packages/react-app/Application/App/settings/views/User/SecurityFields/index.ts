import { SecurityFields as SecurityWrapper } from './SecurityFields';
import { PasswordField } from './PasswordField';
import { EmailField } from './EmailField';

export const SecurityFields = Object.assign(SecurityWrapper, {
    Password: PasswordField,
    Email: EmailField,
});
