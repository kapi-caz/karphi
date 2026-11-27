/** Base path the site is served under (e.g. '/karphi' on GitHub Pages). */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** Prefixes site-absolute paths ('/foo.png') with the base path; leaves full URLs alone. */
export const asset = (src: string) => (src.startsWith('/') && !src.startsWith('//') ? `${BASE_PATH}${src}` : src);
