import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPostDate, getAllPosts, getPost } from "@/lib/posts";
import { whatsappLink } from "@/lib/site";
import Markdown from "@/components/site/Markdown";
import PostCard, { PostCover } from "@/components/site/PostCard";
import { ArrowIcon, WhatsAppIcon } from "@/components/site/icons";

// Só existem os posts que estão em content/posts — qualquer outro slug é 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      ...(post.cover ? { images: [post.cover] } : {}),
    },
  };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = getAllPosts()
    .filter((other) => other.slug !== post.slug)
    .sort((a, b) => Number(b.category === post.category) - Number(a.category === post.category))
    .slice(0, 3);

  return (
    <article>
      <header className="bg-vallue-lilac">
        <div className="mx-auto max-w-3xl px-4 pt-10 pb-12 sm:px-6 md:pt-14">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-vallue-plum-light hover:text-vallue-wine">
            <ArrowIcon className="h-4 w-4 rotate-180" />
            Voltar para o blog
          </Link>
          <p className="mt-8 text-xs font-medium tracking-[0.3em] uppercase text-vallue-rose">{post.category}</p>
          <h1 className="mt-3 font-serif-display text-4xl font-medium leading-tight sm:text-5xl">{post.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-vallue-plum-light">{post.description}</p>
          <p className="mt-6 text-sm text-vallue-rose">
            <time dateTime={post.date}>{formatPostDate(post.date)}</time> · {post.readingMinutes} min de leitura
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <PostCover post={post} className="-mt-px aspect-[21/9] rounded-b-3xl" />
        <div className="py-6">
          <Markdown source={post.body} />
        </div>

        <aside className="mb-16 rounded-3xl bg-vallue-wine px-6 py-8 text-vallue-blush sm:px-10">
          <p className="font-serif-display text-3xl">Gostou do conteúdo?</p>
          <p className="mt-2 text-vallue-blush/80">
            Tire suas dúvidas ou agende seu horário direto comigo pelo WhatsApp.
          </p>
          <a
            href={whatsappLink(`Olá, Thainá! Li o post "${post.title}" no site e queria conversar.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-vallue-blush px-6 py-3 text-sm text-vallue-wine transition hover:bg-white"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Falar no WhatsApp
          </a>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="bg-vallue-blush/60 py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="font-serif-display text-3xl font-medium">Continue lendo</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {related.map((other) => (
                <PostCard key={other.slug} post={other} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
