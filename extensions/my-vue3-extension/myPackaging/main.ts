const { buildSync } = require('esbuild');
const { resolve } = require("path");

function pathResolve(dir: string) {
    return resolve(process.cwd(), '.', dir);
}

buildSync({
    entryPoints: [pathResolve('./src/main.ts')],
    entryNames: '[name]',
    bundle: true,
    outdir: pathResolve('./dist'),
    minify: false,
    format: 'cjs',
})
