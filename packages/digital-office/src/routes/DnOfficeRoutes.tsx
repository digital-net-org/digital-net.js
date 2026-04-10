import * as React from 'react';
import { Routes, Route } from 'react-router';
import { DnAppLayout } from '../layout';

function LoginPage() {
    return <h1>Login</h1>;
}

function HomePage() {
    return <h1>Home</h1>;
}

export interface DnOfficeRoutesProps {
    children?: React.ReactNode;
}

/**
 * Root route switch for the Office application.
 *
 * Built-in routes:
 * - `/`      — Home page
 * - `/login` — Login page
 *
 * Additional `<Route>` elements can be passed as `children`
 * and will be rendered alongside the built-in routes.
 */
export function DnOfficeRoutes({ children }: DnOfficeRoutesProps) {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
                path="/"
                element={
                    <DnAppLayout>
                        <HomePage />
                    </DnAppLayout>
                }
            />
            {children}
        </Routes>
    );
}
