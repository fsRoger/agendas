import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import WhatsAppFloat from "@/components/site/WhatsAppFloat";
import { VIDEOS } from "@/lib/videos";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  // O link "Vídeos" só aparece no menu quando houver vídeos cadastrados.
  const showVideos = VIDEOS.length > 0;

  return (
    <>
      <Header showVideos={showVideos} />
      <main className="flex-1">{children}</main>
      <Footer showVideos={showVideos} />
      <WhatsAppFloat />
    </>
  );
}
