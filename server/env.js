/**
 * Loads .env into process.env.
 *
 * This lives in its own module because ESM hoists all imports: a
 * `process.loadEnvFile()` call written inside index.js would run *after* every
 * module it imports had already been evaluated. Importing this file first means
 * the variables are in place before anything reads them.
 */
try {
  process.loadEnvFile(new URL('../.env', import.meta.url));
} catch {
  // No .env is fine - the server falls back to password sign-in.
}
