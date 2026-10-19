import "server-only";
import fs from "node:fs";
import path from "node:path";

// Os posts ficam em content/posts/<slug>.md. O nome do arquivo vira a URL
// (/blog/<slug>). Cabeçalho no topo de cada arquivo, entre linhas "---":
//
//   ---
//   title: Título do post
//   description: Resumo curto que aparece nos cards e no Google
//   date: 2026-10-17
//   category: Cuidados
//   gem: Rubi            (opcional — pedra do ícone na capa)
//   cover: /blog/foto.jpg (opcional — foto de capa em /public)
//   draft: true          (opcional — esconde o post do site)
//   ---

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  category: string;
  gem: string | null;
  cover: string | null;
  readingMinutes: number;
}

export interface Post extends PostMeta {
  body: string;
}

function parseFrontmatter(raw: string): { data: Record<string, string>; body: string } {
  const match = raw.replace(/\r\n/g, "\n").match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: raw };

  const data: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const separator = line.indexOf(":");
    if (separator === -1) continue;
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim().replace(/^["']|["']$/g, "");
    if (key) data[key] = value;
  }
  return { data, body: match[2] };
}

/** Lê um post publicado (rascunhos com `draft: true` contam como inexistentes). */
function readPost(slug: string): Post | null {
  const file = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;

  const { data, body } = parseFrontmatter(fs.readFileSync(file, "utf8"));
  if (data.draft === "true") return null;
  const words = body.split(/\s+/).filter(Boolean).length;

  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? "",
    date: data.date ?? "1970-01-01",
    category: data.category ?? "Blog",
    gem: data.gem || null,
    cover: data.cover || null,
    readingMinutes: Math.max(1, Math.round(words / 200)),
    body,
  };
}

function allSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}

/** Posts publicados, do mais recente para o mais antigo (sem o corpo). */
export function getAllPosts(): PostMeta[] {
  return allSlugs()
    .map(readPost)
    .filter((post): post is Post => post !== null)
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((post) => ({ ...post, body: undefined }));
}

export function getPost(slug: string): Post | null {
  // Só aceita slugs simples — evita ler arquivos fora de content/posts.
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  return readPost(slug);
}

export function formatPostDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
