import LotusMotif from "@/components/LotusMotif";

export default function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-vallue-lilac">
      <LotusMotif className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 opacity-[0.08]" />
      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-20">
        <p className="text-xs font-medium tracking-[0.35em] uppercase text-vallue-rose">{eyebrow}</p>
        <h1 className="mt-3 font-serif-display text-5xl font-medium leading-tight">{title}</h1>
        {description && (
          <p className="mt-4 max-w-xl text-base leading-relaxed text-vallue-plum-light">{description}</p>
        )}
      </div>
    </section>
  );
}
