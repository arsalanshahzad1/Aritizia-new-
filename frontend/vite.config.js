import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
        define: {
            'process.env.PINATA_API_KEY': JSON.stringify(env.PINATA_API_KEY),
            'process.env.PINATA_API_SECRET': JSON.stringify(env.PINATA_API_SECRET),
            'process.env.VITE_NEXT_LEG_SECRET_KEY': JSON.stringify(env.VITE_NEXT_LEG_SECRET_KEY),
            'process.env.VITE_STABILITY_SECRET_KEY': JSON.stringify(env.VITE_STABILITY_SECRET_KEY),
            'process.env.SEPOLIA_RPC_ADDRESS': JSON.stringify(env.SEPOLIA_RPC_ADDRESS),
            'process.env.MATIC_RPC_ADDRESS': JSON.stringify(env.MATIC_RPC_ADDRESS),
            'process.env.PRIVATE_KEYS': JSON.stringify(env.PRIVATE_KEYS),
            'process.env.CHAIN_ID': JSON.stringify(env.CHAIN_ID),
            'process.env.SERVER_API': JSON.stringify(env.SERVER_API),
            // If you want to exposes all env variables, which is not recommended
            // 'process.env': env
        },
    };
});


