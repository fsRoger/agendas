import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/lib/posts";
import { SITE, whatsappLink } from "@/lib/site";
import { CARE_TIPS, TECHNIQUES } from "@/lib/techniques";
import PostCard from "@/components/site/PostCard";
import GemIcon from "@/components/GemIcon";
import LotusMotif from "@/components/LotusMotif";
import { ArrowIcon, InstagramIcon, PetalIcon, PinIcon, WhatsAppIcon } from "@/components/site/icons";

export default function HomePage() {
  const latestPosts = getAllPosts().slice(0, 3);
  const gems = TECHNIQUES.filter((technique) => technique.gem);

  return (
    <>
      {/* Hero — fundo igual ao dos arquivos de logo, pra o emblema se fundir. */}
      <section className="relative overflow-hidden bg-vallue-lilac">
        <LotusMotif className="pointer-events-none absolute -left-32 -bottom-40 h-[28rem] w-[28rem] opacity-[0.07]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 sm:px-6 md:grid-cols-2 md:py-20">
          <div className="order-2 md:order-1 text-center md:text-left">
            <p className="text-xs font-medium tracking-[0.35em] uppercase text-vallue-rose">
              Extensão de cílios · Jandira/SP
            </p>
            <h1 className="mt-4 font-serif-display text-5xl font-medium leading-[1.05] sm:text-6xl">
              O valor está
              <br />
              <em className="text-vallue-wine">nos detalhes</em>
            </h1>
            <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-vallue-plum-light md:mx-0">
              Cuidados, curiosidades e os bastidores do Vallue Studio. Um cantinho para você
              acompanhar meu trabalho e cuidar do seu olhar todos os dias.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center md:justify-start">
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-vallue-wine px-6 py-3 text-sm text-vallue-blush shadow-lg shadow-vallue-wine/20 transition hover:bg-vallue-plum"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Agendar meu horário
              </a>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-full border border-vallue-plum/30 px-6 py-3 text-sm transition hover:border-vallue-wine hover:text-vallue-wine"
              >
                Ler o blog
                <ArrowIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="order-1 md:order-2 flex justify-center">
            <Image
              src="/vallue-logo-institucional.png"
              alt={`${SITE.name}`}
              width={1200}
              height={1200}
              priority
              sizes="(min-width: 768px) 420px, 280px"
              className="w-[280px] md:w-[420px]"
            />
          </div>
        </div>
      </section>

      {/* Sobre */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1fr_1.4fr] md:items-center">
          <div>
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-vallue-rose">Seja bem-vinda</p>
            <h2 className="mt-3 font-serif-display text-4xl font-medium leading-tight sm:text-5xl">
              Olá, eu sou a {SITE.owner}
            </h2>
            <div className="mt-6 flex gap-2 text-vallue-mauve">
              {Array.from({ length: 5 }, (_, i) => (
                <PetalIcon key={i} className={`h-5 w-4 ${i % 2 ? "text-vallue-wine" : ""}`} />
              ))}
            </div>
          </div>
          <div className="space-y-5 text-[1.0625rem] leading-relaxed text-vallue-plum-light">
            <p>
              Sou lash designer, e meu trabalho nasceu do desejo de valorizar a beleza de cada mulher com
              um olhar cuidadosamente personalizado.
            </p>
            <p>
              Cada atendimento é pensado de forma individual, considerando o formato dos olhos, a
              estrutura dos cílios naturais, sua rotina e o resultado que você deseja alcançar.
            </p>
            <p className="font-serif-display text-2xl italic leading-snug text-vallue-plum">
              “Cada técnica é como uma joia: os pequenos detalhes tornam cada olhar único e precioso.”
            </p>
          </div>
        </div>
      </section>

      {/* Últimos posts */}
      {latestPosts.length > 0 && (
        <section className="bg-vallue-blush/60 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-medium tracking-[0.3em] uppercase text-vallue-rose">Do blog</p>
                <h2 className="mt-3 font-serif-display text-4xl font-medium">Últimas publicações</h2>
              </div>
              <Link href="/blog" className="hidden sm:inline-flex items-center gap-2 text-sm text-vallue-wine hover:underline">
                Ver todas <ArrowIcon className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {latestPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
            <Link href="/blog" className="mt-8 inline-flex sm:hidden items-center gap-2 text-sm text-vallue-wine">
              Ver todas as publicações <ArrowIcon className="h-4 w-4" />
            </Link>
          </div>
        </section>
      )}

      {/* Técnicas */}
      <section className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
        <p className="text-xs font-medium tracking-[0.3em] uppercase text-vallue-rose">Técnicas</p>
        <h2 className="mt-3 font-serif-display text-4xl font-medium">Cada olhar, uma joia</h2>
        <p className="mx-auto mt-4 max-w-xl text-vallue-plum-light">
          Do efeito natural ao volume de impacto, cada técnica leva o nome de uma pedra preciosa.
        </p>
        <ul className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
          {gems.map((technique) => (
            <li key={technique.name} className="rounded-3xl border border-vallue-border bg-vallue-surface px-4 py-6">
              <GemIcon name={technique.gem!} size={40} className="mx-auto" />
              <p className="mt-3 font-serif-display text-2xl">{technique.gem}</p>
              <p className="text-xs tracking-[0.2em] uppercase text-vallue-rose">{technique.name}</p>
            </li>
          ))}
        </ul>
        <Link
          href="/tecnicas"
          className="mt-10 inline-flex items-center gap-2 rounded-full border border-vallue-plum/30 px-6 py-3 text-sm transition hover:border-vallue-wine hover:text-vallue-wine"
        >
          Conhecer todas as técnicas e valores
          <ArrowIcon className="h-4 w-4" />
        </Link>
      </section>

      {/* Cuidados */}
      <section className="relative overflow-hidden bg-vallue-wine py-20 text-vallue-blush">
        <LotusMotif className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 opacity-[0.08] [--color-vallue-plum:#e8dee2] [--color-vallue-rose:#e9b3a6]" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-xs font-medium tracking-[0.3em] uppercase text-vallue-gold">Cuidados com a extensão</p>
          <h2 className="mt-3 max-w-lg font-serif-display text-4xl font-medium">
            Pequenos cuidados mantêm a beleza e a retenção
          </h2>
          <ol className="mt-10 grid gap-x-10 md:grid-cols-2">
            {CARE_TIPS.map((tip, i) => (
              <li key={tip} className="flex gap-5 border-b border-vallue-blush/15 py-5">
                <span className="font-serif-display text-2xl text-vallue-gold tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="pt-1 text-vallue-blush/90">{tip}</span>
              </li>
            ))}
          </ol>
          <Link
            href="/blog/cuidados-com-a-extensao"
            className="mt-10 inline-flex items-center gap-2 text-sm text-vallue-gold hover:text-white"
          >
            Ler o guia completo de cuidados <ArrowIcon className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Contato */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="rounded-[2rem] bg-vallue-lilac px-6 py-12 text-center sm:px-12">
          <p className="text-xs font-medium tracking-[0.3em] uppercase text-vallue-wine">Seu olhar merece um cuidado único</p>
          <h2 className="mt-3 font-serif-display text-4xl font-medium sm:text-5xl">Agende seu horário</h2>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-vallue-wine px-6 py-3 text-sm text-vallue-blush transition hover:bg-vallue-plum"
            >
              <WhatsAppIcon className="h-4 w-4" />
              {SITE.whatsapp.display}
            </a>
            <a
              href={SITE.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-vallue-plum/30 px-6 py-3 text-sm transition hover:border-vallue-wine hover:text-vallue-wine"
            >
              <InstagramIcon className="h-4 w-4" />@{SITE.instagram.handle}
            </a>
          </div>
          <p className="mt-6 inline-flex items-center gap-2 text-sm text-vallue-plum-light">
            <PinIcon className="h-4 w-4" />
            {SITE.address.street} · {SITE.address.detail}
          </p>
          <p className="mt-6 text-sm">
            <Link href="/contato" className="text-vallue-wine underline underline-offset-4">
              Prefere mandar uma mensagem? Use o formulário
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
