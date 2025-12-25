import { QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { RouterProvider } from 'react-router';
import routes from './routes/routes';
import { queryClient } from './services/queryClient';
import { useAuth } from './stores/auth/authSelectore';

function App() {
    const { hydrateAuth } = useAuth();

    useEffect(() => {
        hydrateAuth();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={routes} />
                <Toaster
                    position="top-center"
                    toastOptions={{
                        duration: 4000,
                    }}
                />
            </QueryClientProvider>
        </>
    );
}

export default App;
