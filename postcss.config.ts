const projectRoot = process.cwd();

const config = {
    plugins: {
        // `base` is where Tailwind scans content and resolves `tailwindcss` / `@import`; default is cwd and breaks when cwd ≠ app root.
        '@tailwindcss/postcss': {
            base: projectRoot,
        },
    },
};

export default config;
