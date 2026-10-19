import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import PostCard from "@/components/site/PostCard";
import PageIntro from "@/components/site/PageIntro";

export const metadata: Metadata = {
  title: "Blog",
  description: "Cuidados, curiosidades e técnicas de extensão de cílios, pelo Vallue Studio.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <PageIntro
        eyebrow="Blog"
        title="Cuidados & curiosidades"
        description="Dicas para sua extensão durar mais, curiosidades sobre os cílios e tudo sobre cada técnica do estúdio."
      />
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        {posts.length === 0 ? (
          <p className="text-center text-vallue-plum-light">Em breve, novas publicações por aqui.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
