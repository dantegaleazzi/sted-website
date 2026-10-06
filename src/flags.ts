/** Feature flags shared by the site shell, the footer and pages. Kept in its own module so
 *  small consumers (the footer, the 4c landing) don't pull in pages.tsx and the content tunnel. */
export const SHOW_BUILD_IN_PUBLIC = false

/** The old guides stay reachable by direct link (Shipaton submission), noindex and
 *  unlinked: see src/archive-paths.ts. Independent of SHOW_BUILD_IN_PUBLIC, which would link them. */
export const SHOW_SHIPATON_ARCHIVE = true

/** The comparison pages (/compare, /vs, /alternatives, /best): built and checked, off until Dante
 *  approves them. Off, they're not routed, served, prerendered, in the sitemap or linked. */
export const SHOW_COMPARE_PAGES = false
