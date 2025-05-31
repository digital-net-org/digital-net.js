import React from 'react';
import { Button, Box, InputText, Form } from '@digital-net/react-digital-ui';
import { useApplicationUser } from '../../User';
import { Localization } from '../../Localization';
import { AppLogo } from '../../Application/AppLogo';
import './LoginPage.styles.css';

export function LoginPage() {
    const [body, setBody] = React.useState({ login: '', password: '' });
    const { authenticate: login, isLoading } = useApplicationUser();

    return (
        <Box className="LoginPage" mb={2}>
            <Box className="DigitalUi-LoginForm" p={3} fullWidth>
                <AppLogo />
                <Form id="login" onSubmit={() => login({ body })} fullWidth>
                    {['login', 'password'].map(item => (
                        <React.Fragment key={item}>
                            <InputText
                                label={Localization.translate(`login:form.${item}`)}
                                onChange={v => setBody({ ...body, [item]: v })}
                                value={body[item as keyof typeof body]}
                                type={item === 'password' ? 'password' : 'text'}
                                focusOnMount={item === 'login'}
                                required
                                fullWidth
                            />
                        </React.Fragment>
                    ))}
                    <Button loading={isLoading} type="submit" fullWidth>
                        {Localization.translate('login:form.submit')}
                    </Button>
                </Form>
            </Box>
        </Box>
    );
}
