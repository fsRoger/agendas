import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { VIDEOS, getVideoEmbed } from "@/lib/videos";
import PageIntro from "@/components/site/PageIntro";
import { ArrowIcon, InstagramIcon } from "@/components/site/icons";

export const metadata: Metadata = {
  title: "Vídeos",
  description: "Vídeos do Vallue Studio: aplicações, resultados e dicas de cuidados com os cílios.",
};

export default function VideosPage() {
  return (
    <>
      <PageIntro
        eyebrow="Vídeos"
        title="Bastidores do estúdio"
        description="Aplicações, resultados e dicas em vídeo."
      />

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        {VIDEOS.length === 0 ? (
          <div className="mx-auto max-w-lg rounded-3xl border border-vallue-border bg-vallue-surface px-6 py-12 text-center">
            <p className="font-serif-display text-3xl">Em breve por aqui</p>
            <p className="mt-3 text-vallue-plum-light">
              Enquanto isso, acompanhe os trabalhos mais recentes no Instagram.
            </p>
            <a
              href={SITE.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-vallue-wine px-6 py-3 text-sm text-vallue-blush transition hover:bg-vallue-plum"
            >
              <InstagramIcon className="h-4 w-4" />@{SITE.instagram.handle}
            </a>
          </div>
        ) : (
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {VIDEOS.map((video) => {
              const embed = getVideoEmbed(video.url);
              return (
                <li key={video.url} className="overflow-hidden rounded-3xl border border-vallue-border bg-vallue-surface">
                  {embed.kind === "link" ? (
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex aspect-video items-center justify-center gap-2 bg-vallue-lilac text-sm text-vallue-wine"
                    >
                      Assistir vídeo <ArrowIcon className="h-4 w-4" />
                    </a>
                  ) : (
                    <iframe
                      src={embed.src}
                      title={video.title}
                      loading="lazy"
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className={`w-full border-0 ${embed.kind === "youtube" ? "aspect-video" : "aspect-[4/5]"}`}
                    />
                  )}
                  <p className="px-5 py-4 font-serif-display text-xl">{video.title}</p>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}
