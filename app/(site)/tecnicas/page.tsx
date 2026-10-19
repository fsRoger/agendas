import type { Metadata } from "next";
import { MAINTENANCE_DAYS, REMOVAL, TECHNIQUES } from "@/lib/techniques";
import { whatsappLink } from "@/lib/site";
import GemIcon from "@/components/GemIcon";
import LotusMotif from "@/components/LotusMotif";
import PageIntro from "@/components/site/PageIntro";
import { WhatsAppIcon } from "@/components/site/icons";

export const metadata: Metadata = {
  title: "Técnicas e valores",
  description: "Conheça as técnicas de extensão de cílios do Vallue Studio: Brasileiro, Ametista, Safira, Rubi, Diamante, Sirena e Fox Eyes.",
};

function brl(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

export default function TecnicasPage() {
  return (
    <>
      <PageIntro
        eyebrow="Técnicas e valores"
        title="Escolha o efeito que combina com você"
        description="Cada técnica é como uma joia: os pequenos detalhes tornam cada olhar único e precioso."
      />

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TECHNIQUES.map((technique) => (
            <li
              key={technique.name}
              className="flex flex-col overflow-hidden rounded-3xl border border-vallue-border bg-vallue-surface"
            >
              <div className="h-1.5 bg-vallue-wine" />
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-serif-display text-3xl font-medium leading-none">
                      {technique.gem ?? technique.name}
                    </h2>
                    <p className="mt-2 text-xs font-medium tracking-[0.2em] uppercase text-vallue-rose">
                      {technique.gem ? technique.name : technique.subtitle ?? "Efeito"}
                    </p>
                  </div>
                  {technique.gem ? (
                    <GemIcon name={technique.gem} size={36} className="shrink-0" />
                  ) : (
                    <LotusMotif className="h-9 w-9 shrink-0 opacity-80" />
                  )}
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-vallue-plum-light">{technique.description}</p>
                <dl className="mt-6 space-y-1.5 border-t border-vallue-border pt-4 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-vallue-plum-light">Aplicação</dt>
                    <dd className="font-medium">{brl(technique.applicationBRL)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-vallue-plum-light">Manutenção</dt>
                    <dd className="font-medium">{brl(technique.maintenanceBRL)}</dd>
                  </div>
                </dl>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-8 rounded-2xl bg-vallue-wine px-6 py-4 text-center text-sm text-vallue-blush">
          Manutenção válida em até {MAINTENANCE_DAYS} dias após a aplicação. Após esse prazo, o serviço é
          considerado nova aplicação.
        </p>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-4 pb-20 sm:px-6 md:grid-cols-2">
        <div className="rounded-3xl border border-vallue-border bg-vallue-blush/60 p-8">
          <h2 className="font-serif-display text-3xl font-medium text-vallue-wine">Manutenção</h2>
          <p className="mt-4 leading-relaxed text-vallue-plum-light">
            A manutenção repõe as extensões que se soltaram naturalmente durante o ciclo de renovação dos
            cílios e recupera o preenchimento do olhar. Para um resultado bonito e uniforme, faça em até{" "}
            {MAINTENANCE_DAYS} dias após a aplicação anterior.
          </p>
        </div>
        <div className="rounded-3xl bg-vallue-wine p-8 text-vallue-blush">
          <h2 className="font-serif-display text-3xl font-medium">Remoção profissional</h2>
          <p className="mt-4 leading-relaxed text-vallue-blush/85">
            Feita com produto profissional para soltar o adesivo com cuidado e preservar os cílios naturais.
            Não puxe nem tente retirar as extensões em casa.
          </p>
          <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-vallue-blush/20 pt-4 text-sm">
            <div>
              <dt className="text-vallue-blush/70">Com nova aplicação</dt>
              <dd className="mt-1 text-lg font-medium text-vallue-gold">{brl(REMOVAL.withNewApplicationBRL)}</dd>
            </div>
            <div>
              <dt className="text-vallue-blush/70">Avulsa</dt>
              <dd className="mt-1 text-lg font-medium text-vallue-gold">{brl(REMOVAL.standaloneBRL)}</dd>
            </div>
          </dl>
        </div>

        <div className="md:col-span-2 mt-4 text-center">
          <p className="font-serif-display text-3xl">Ficou na dúvida sobre qual escolher?</p>
          <p className="mt-2 text-vallue-plum-light">Me conta como você quer seu olhar que eu te ajudo.</p>
          <a
            href={whatsappLink("Olá, Thainá! Vi as técnicas no site e queria ajuda para escolher a minha.")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-vallue-wine px-6 py-3 text-sm text-vallue-blush transition hover:bg-vallue-plum"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Conversar no WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
