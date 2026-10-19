import { whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "@/components/site/icons";

export default function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Conversar no WhatsApp"
      className="fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-vallue-wine text-vallue-blush shadow-lg shadow-vallue-wine/30 ring-4 ring-vallue-bg transition hover:scale-105 hover:bg-vallue-plum"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
