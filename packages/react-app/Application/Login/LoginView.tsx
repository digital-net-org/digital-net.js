import React from 'react';
import { Box } from '../../../react-digital-ui';
import LoginForm from './components/LoginForm';
import './LoginView.styles.css';

export default function LoginPage() {
    return (
        <Box className="LoginView" mb={2}>
            <LoginForm />
        </Box>
    );
}
