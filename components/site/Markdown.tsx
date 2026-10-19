import type { ReactNode } from "react";
import Link from "next/link";

// Renderizador de Markdown enxuto para os posts do blog — cobre só o que os
// posts usam: ## e ### títulos, parágrafos, listas (- e 1.), citações (>),
// **negrito**, *itálico* e [links](url). Gera elementos React, nunca HTML cru.

type Block =
  | { type: "h2" | "h3" | "p" | "quote"; text: string }
  | { type: "ul" | "ol"; items: string[] };

function parseBlocks(source: string): Block[] {
  const blocks: Block[] = [];
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  let paragraph: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length) blocks.push({ type: "p", text: paragraph.join(" ") });
    paragraph = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    const last = blocks[blocks.length - 1];

    if (!line) {
      flushParagraph();
      continue;
    }

    const heading = line.match(/^(#{2,3})\s+(.*)$/);
    const bullet = line.match(/^[-*]\s+(.*)$/);
    const numbered = line.match(/^\d+[.)]\s+(.*)$/);
    const quote = line.match(/^>\s?(.*)$/);

    if (heading) {
      flushParagraph();
      blocks.push({ type: heading[1].length === 2 ? "h2" : "h3", text: heading[2] });
    } else if (bullet || numbered) {
      flushParagraph();
      const type = bullet ? "ul" : "ol";
      const text = (bullet ?? numbered)![1];
      if (last && last.type === type) last.items.push(text);
      else blocks.push({ type, items: [text] });
    } else if (quote) {
      flushParagraph();
      if (last && last.type === "quote") last.text += ` ${quote[1]}`;
      else blocks.push({ type: "quote", text: quote[1] });
    } else {
      paragraph.push(line);
    }
  }
  flushParagraph();
  return blocks;
}

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /\*\*(.+?)\*\*|\*(.+?)\*|\[(.+?)\]\((.+?)\)/g;
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text))) {
    if (match.index > cursor) nodes.push(text.slice(cursor, match.index));
    const key = match.index;

    if (match[1] !== undefined) {
      nodes.push(<strong key={key} className="font-semibold text-vallue-plum">{renderInline(match[1])}</strong>);
    } else if (match[2] !== undefined) {
      nodes.push(<em key={key}>{renderInline(match[2])}</em>);
    } else {
      const href = match[4];
      const className = "text-vallue-wine underline decoration-vallue-rose-light underline-offset-4 hover:decoration-vallue-wine";
      nodes.push(
        href.startsWith("/") ? (
          <Link key={key} href={href} className={className}>{match[3]}</Link>
        ) : (
          <a key={key} href={href} target="_blank" rel="noopener noreferrer" className={className}>
            {match[3]}
          </a>
        ),
      );
    }
    cursor = match.index + match[0].length;
  }

  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}

export default function Markdown({ source }: { source: string }) {
  return (
    <div className="text-[1.0625rem] leading-relaxed text-vallue-plum-light">
      {parseBlocks(source).map((block, i) => {
        switch (block.type) {
          case "h2":
            return (
              <h2 key={i} className="font-serif-display text-3xl font-medium text-vallue-plum mt-12 mb-4">
                {renderInline(block.text)}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} className="font-serif-display text-2xl font-medium text-vallue-plum mt-8 mb-3">
                {renderInline(block.text)}
              </h3>
            );
          case "quote":
            return (
              <blockquote
                key={i}
                className="my-8 border-l-2 border-vallue-wine bg-vallue-blush/60 rounded-r-2xl px-6 py-5 font-serif-display text-xl italic text-vallue-plum"
              >
                {renderInline(block.text)}
              </blockquote>
            );
          case "ul":
            return (
              <ul key={i} className="my-5 space-y-2.5">
                {block.items.map((item, j) => (
                  <li key={j} className="flex gap-3">
                    <span aria-hidden="true" className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rotate-45 bg-vallue-mauve" />
                    <span>{renderInline(item)}</span>
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="my-5 space-y-3">
                {block.items.map((item, j) => (
                  <li key={j} className="flex gap-4">
                    <span className="font-serif-display text-xl leading-snug text-vallue-wine tabular-nums">
                      {String(j + 1).padStart(2, "0")}
                    </span>
                    <span>{renderInline(item)}</span>
                  </li>
                ))}
              </ol>
            );
          default:
            return (
              <p key={i} className="my-5">
                {renderInline(block.text)}
              </p>
            );
        }
      })}
    </div>
  );
}
