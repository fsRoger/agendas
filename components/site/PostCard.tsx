import Link from "next/link";
import Image from "next/image";
import type { PostMeta } from "@/lib/posts";
import { formatPostDate } from "@/lib/posts";
import GemIcon from "@/components/GemIcon";
import LotusMotif from "@/components/LotusMotif";

/** Capa do post: foto, se houver; senão uma capa da marca com a pedra do post. */
export function PostCover({ post, className = "" }: { post: PostMeta; className?: string }) {
  if (post.cover) {
    return (
      <div className={`relative overflow-hidden bg-vallue-lilac ${className}`}>
        <Image src={post.cover} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
      </div>
    );
  }

  return (
    <div className={`relative flex items-center justify-center overflow-hidden bg-vallue-lilac ${className}`}>
      <LotusMotif className="absolute -right-10 -bottom-12 h-48 w-48 opacity-[0.12]" />
      <LotusMotif className="absolute -left-8 -top-10 h-28 w-28 opacity-[0.08]" />
      <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-vallue-surface/70 ring-1 ring-vallue-surface">
        {post.gem ? (
          <GemIcon name={post.gem} size={40} />
        ) : (
          <LotusMotif className="h-10 w-10" />
        )}
      </span>
    </div>
  );
}

export default function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-vallue-border bg-vallue-surface transition hover:-translate-y-1 hover:shadow-xl hover:shadow-vallue-plum/5">
      <Link href={`/blog/${post.slug}`} className="flex flex-1 flex-col">
        <PostCover post={post} className="aspect-[16/10]" />
        <div className="flex flex-1 flex-col p-6">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-vallue-rose">{post.category}</p>
          <h3 className="mt-2 font-serif-display text-2xl font-medium leading-tight text-vallue-plum group-hover:text-vallue-wine">
            {post.title}
          </h3>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-vallue-plum-light">{post.description}</p>
          <p className="mt-5 text-xs text-vallue-rose">
            <time dateTime={post.date}>{formatPostDate(post.date)}</time> · {post.readingMinutes} min de leitura
          </p>
        </div>
      </Link>
    </article>
  );
}
