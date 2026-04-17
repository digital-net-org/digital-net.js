import * as React from 'react';
import { useNavigate } from 'react-router';
import { css, styled } from '@mui/material/styles';
import { LinearProgress, Stack, Typography } from '@mui/material';
import { DnView } from '../views';

const REDIRECT_DELAY_MS = 5000;
const TICK_MS = 100;

export function NotFoundView() {
    const navigate = useNavigate();
    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
        const startTime = Date.now();
        const interval = setInterval(() => {
            const pct = Math.min(100, ((Date.now() - startTime) / REDIRECT_DELAY_MS) * 100);
            setProgress(pct);
            if (pct >= 100) clearInterval(interval);
        }, TICK_MS);

        const redirect = setTimeout(() => navigate('/'), REDIRECT_DELAY_MS);

        return () => {
            clearInterval(interval);
            clearTimeout(redirect);
        };
    }, [navigate]);

    return (
        <DnView title="Erreur 404" description="Cette page n'existe pas, vous allez etre redirigé à l'accueil.">
            <Center>
                <BigCode>404</BigCode>
                <LinearProgress variant="determinate" value={progress} sx={{ width: '60%', maxWidth: 480 }} />
            </Center>
        </DnView>
    );
}

const Center = styled(Stack)(
    () => css`
        flex: 1;
        align-items: center;
        justify-content: center;
        gap: 2rem;
    `
);

const BigCode = styled(Typography)(
    () => css`
        font-size: 8rem;
        font-weight: 700;
        line-height: 1;
    `
);
