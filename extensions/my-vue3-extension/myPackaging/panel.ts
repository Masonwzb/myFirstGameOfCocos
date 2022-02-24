import type { ConfigEnv, UserConfig  } from "vite";
import { defineConfig } from "vite";
import { readdirSync } from "fs-extra";
import { resolve } from "path";
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

function pathResolve(dir: string) {
    return resolve(process.cwd(), '.', dir);
}

export default defineConfig(({command, mode}: ConfigEnv): UserConfig => {
    console.log('command ? ', command);
    console.log('mode ? ', mode);
    console.log('theDirname ? ', __dirname);
    console.log('theFilename ? ', __filename);
    console.log('process ? ', process.cwd());

    try {
        const files = readdirSync(pathResolve('./src'));
        for (const file of files)
            console.log(file);
    } catch (err) {
        console.error(err);
    }

    return {
        plugins: [vue(), vueJsx()],
        build: {
            rollupOptions: {
                input: pathResolve('./src/panels/default/script/index.ts'),
                output: {
                    format: 'cjs',
                    entryFileNames: '[name].js',
                    chunkFileNames: '[name].js'
                }
            },
            outDir: pathResolve('./dist/panels'),
            minify: false,
        },
        resolve: {
            alias: [{
                find: /@\//,
                replacement: pathResolve('src/panels') + '/'
            }]
        }
    }
})
