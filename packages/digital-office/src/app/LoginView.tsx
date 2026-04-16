import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Stack, Typography } from '@mui/material';
import { css, styled } from '@mui/material/styles';
import { DnInput, DnButton } from '@digital-net-org/digital-ui';
import { useDnApp } from './DnAppProvider';
import { useDnApi } from '../api';

const IS_LOCKED_KEY = 'dn_is_locked';
const PING_KEY = 'dn_ping';
const PING_INTERVAL_MS = 30000;

export function LoginView() {
    const { AppLogo } = useDnApp();
    const api = useDnApi();
    const queryClient = useQueryClient();

    const [loginInput, setLoginInput] = React.useState('');
    const [passwordInput, setPasswordInput] = React.useState('');

    const { data: online, isLoading: isPingLoading } = useQuery<boolean>({
        queryKey: [PING_KEY],
        queryFn: () => api.catalog.application.ping(),
        refetchInterval: PING_INTERVAL_MS,
        refetchIntervalInBackground: true,
    });

    const { data: locked, isLoading: isLockedLoading } = useQuery<boolean>({
        queryKey: [IS_LOCKED_KEY],
        queryFn: async () => Boolean((await api.catalog.auth.isLocked()).value),
        enabled: online === true,
    });

    const invalidateLocked = React.useCallback(
        async () => (async () => await queryClient.invalidateQueries({ queryKey: [IS_LOCKED_KEY] }))(),
        [queryClient]
    );

    const { mutate, isPending: isLoginLoading } = useMutation({
        mutationFn: async () => {
            await api.catalog.auth.login(
                { password: passwordInput, login: loginInput },
                {
                    onStatus: {
                        429: () => invalidateLocked(),
                    },
                }
            );
        },
    });

    const isLoading = React.useMemo(
        () => isPingLoading || isLockedLoading || isLoginLoading,
        [isPingLoading, isLockedLoading, isLoginLoading]
    );

    const isDisabled = online === false || locked || isLoading;

    const errorMessage = React.useMemo(() => {
        if (online === false) {
            return "L'application est actuellement indisponible. Contactez un administrateur.";
        }
        if (locked) {
            return 'Vous avez effectué un trop grand nombre de tentatives de connexion. Par mesure de sécurité, votre accès est temporairement bloqué pendant 15 minutes.';
        }
        return null;
    }, [online, locked]);

    const handleSubmit = React.useCallback(
        (e: React.SubmitEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (isLoading) {
                return;
            }
            mutate();
        },
        [isLoading, mutate]
    );

    return (
        <Stack alignItems="center">
            <Layout>
                <Stack>{AppLogo}</Stack>
                <Stack component="form" onSubmit={handleSubmit} gap={2} mt={2}>
                    <DnInput
                        label="Identifiant"
                        name="login"
                        inputProps={{ maxLength: 48 }}
                        value={loginInput}
                        onChange={e => setLoginInput(e.target.value)}
                        disabled={isDisabled}
                        required
                    />
                    <DnInput
                        label="Mot de passe"
                        name="password"
                        inputProps={{ maxLength: 256, autocomplete: 'off' }}
                        value={passwordInput}
                        onChange={e => setPasswordInput(e.target.value)}
                        disabled={isDisabled}
                        type="password"
                        required
                    />
                    <DnButton type="submit" disabled={isDisabled} loading={isLoading}>
                        Connexion
                    </DnButton>
                </Stack>
                {errorMessage ? (
                    <Typography color="error" fontSize="small" fontStyle="italic" mt={2}>
                        {errorMessage}
                    </Typography>
                ) : null}
            </Layout>
        </Stack>
    );
}

const Layout = styled(Stack)(
    ({ theme }) => css`
        border-radius: ${theme.shape.borderRadius};
        padding: 2rem;
        background-color: ${theme.palette.background.paper};
        max-width: 320px;
        margin-top: 9rem;
    `
);
