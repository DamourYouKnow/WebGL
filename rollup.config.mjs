import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { babel } from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import { DEFAULT_EXTENSIONS } from '@babel/core';

export default function() {
    const prod = process.env.BUILD === 'production';
    console.log(`Building ${prod ? 'prod' : 'dev'} site`);

    return {
        input: './Source/Client/Core/App.ts',
        output: {
            exports: 'named',
            name: 'App',
            file: 'public/scripts/app.js',
            format: 'iife',
            sourcemap: prod ? undefined : 'inline'
        },
        plugins: [
            resolve({browser: true}),
            commonjs(),
            typescript({
                target: 'ESNext',
                sourceMap: !prod,
                inlineSourceMap: !prod,
                inlineSources: !prod
            }),
            babel({
                exclude: ['*.html', 'node_modules/core-js/**'],
                extensions: [
                    ...DEFAULT_EXTENSIONS,
                    '.ts',
                    '.tsx'
                ],
                babelHelpers: 'bundled'
            }),
            ...(prod ? [terser()] : [])
        ],
    };
}