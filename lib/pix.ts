import "server-only";
import QRCode from "qrcode";

// Gera o payload PIX "copia e cola" (padrão EMV / BR Code do Banco Central)
// e o QR correspondente, tudo localmente — sem chamar nenhuma API de
// pagamento. O valor sempre vem calculado no servidor (nunca do cliente).

function tlv(id: string, value: string): string {
  const length = value.length.toString().padStart(2, "0");
  return `${id}${length}${value}`;
}

// CRC-16/CCITT-FALSE — único formato aceito pelo Bacen para o payload PIX.
function crc16(payload: string): string {
  let crc = 0xffff;
  const polynomial = 0x1021;

  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x8000) !== 0 ? ((crc << 1) ^ polynomial) & 0xffff : (crc << 1) & 0xffff;
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function sanitizeAscii(value: string, maxLength: number): string {
  const normalized = value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // remove acentos
    .replace(/[^\x20-\x7E]/g, ""); // só ASCII imprimível
  return normalized.slice(0, maxLength) || " ";
}

function sanitizeTxid(value: string): string {
  const cleaned = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 25);
  return cleaned || "***";
}

export interface PixPayloadInput {
  key: string;
  receiverName: string;
  receiverCity: string;
  amountCents: number;
  txid: string;
}

export function buildPixPayload({
  key,
  receiverName,
  receiverCity,
  amountCents,
  txid,
}: PixPayloadInput): string {
  const merchantAccountInfo = tlv("00", "br.gov.bcb.pix") + tlv("01", key);
  const amount = (amountCents / 100).toFixed(2);

  const payload =
    tlv("00", "01") + // Payload Format Indicator
    tlv("01", "11") + // Point of Initiation Method (estático)
    tlv("26", merchantAccountInfo) + // Merchant Account Info — PIX
    tlv("52", "0000") + // Merchant Category Code
    tlv("53", "986") + // Moeda: BRL
    tlv("54", amount) + // Valor da transação
    tlv("58", "BR") + // País
    tlv("59", sanitizeAscii(receiverName, 25)) + // Nome do recebedor
    tlv("60", sanitizeAscii(receiverCity, 15)) + // Cidade do recebedor
    tlv("62", tlv("05", sanitizeTxid(txid))); // Additional Data Field (txid)

  const payloadWithCrcId = `${payload}6304`;
  return `${payloadWithCrcId}${crc16(payloadWithCrcId)}`;
}

export async function pixPayloadToQrDataUrl(payload: string): Promise<string> {
  return QRCode.toDataURL(payload, { margin: 1, width: 280 });
}
