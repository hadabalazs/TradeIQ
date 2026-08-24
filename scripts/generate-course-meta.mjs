// Emits public/course-meta.json — the metadata the social-meta edge function
// needs to build a link preview for a built-in course.
//
// The edge function runs on Deno at the CDN and cannot import the app's source:
// it would have to resolve Vite aliases, JSX and the whole React tree just to
// read two strings. Generating a small JSON at build time keeps the edge
// function trivial while leaving src/lib/courses.js the single source of truth —
// nothing is retyped here, so the two cannot drift.
//
// Uploaded courses are not in the bundle. The edge function reads those straight
// from Supabase at request time.
import { createServer } from 'vite';
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(root, 'public/course-meta.json');

// Loading through Vite resolves the "@/" alias exactly as the app does, so this
// reads the real registry rather than a parallel copy of it.
const server = await createServer({
  root,
  configFile: resolve(root, 'vite.config.js'),
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'warn',
});

try {
  const { COURSES } = await server.ssrLoadModule('/src/lib/courses.js');

  const meta = {};
  for (const c of COURSES) {
    meta[c.id] = {
      title: c.title,
      // The intro is written for exactly this job — explaining the course to
      // somebody who has not seen it before. Falls back to the catalog blurb.
      description: c.intro || c.description || c.subtitle || '',
      category: c.category || '',
      modules: (c.modules || []).length,
      lessons: (c.modules || []).reduce((n, m) => n + (m.topics || []).length, 0),
    };
  }

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(meta, null, 2));
  console.log(`course-meta.json — ${Object.keys(meta).length} built-in course(s)`);
} finally {
  await server.close();
}
