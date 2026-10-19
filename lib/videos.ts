// Vídeos da página /videos. Cole aqui o link do YouTube ou do Instagram
// (post ou reel) — a página detecta o tipo e incorpora o player sozinha.
// Enquanto a lista estiver vazia, a página mostra um aviso de "em breve".
//
// Exemplo:
//   { title: "Aplicação Fox Eyes", url: "https://www.youtube.com/watch?v=XXXXXXXXXXX" },
//   { title: "Antes e depois 4D", url: "https://www.instagram.com/reel/XXXXXXXXX/" },

export interface Video {
  title: string;
  url: string;
}

export const VIDEOS: Video[] = [];

export type VideoEmbed =
  | { kind: "youtube"; src: string }
  | { kind: "instagram"; src: string }
  | { kind: "link" };

export function getVideoEmbed(url: string): VideoEmbed {
  const youtube = url.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/,
  );
  if (youtube) {
    return { kind: "youtube", src: `https://www.youtube-nocookie.com/embed/${youtube[1]}` };
  }

  const instagram = url.match(/instagram\.com\/(?:p|reel|reels|tv)\/([\w-]+)/);
  if (instagram) {
    return { kind: "instagram", src: `https://www.instagram.com/p/${instagram[1]}/embed` };
  }

  return { kind: "link" };
}
