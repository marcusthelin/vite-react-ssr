import type { UserConfig } from 'vite';
import react from '@vitejs/plugin-react';

const config: UserConfig = {
    plugins: [react()],
    build: {
        manifest: true,
    },
};

export default config;
