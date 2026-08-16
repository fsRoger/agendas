import "server-only";

export interface PixEnvConfig {
  key: string;
  receiverName: string;
  receiverCity: string;
}

// Cada local tem sua própria chave Pix (pessoas/estúdios diferentes recebem
// o sinal). Variáveis esperadas: PIX_KEY_<sufixo>, PIX_RECEIVER_NAME_<sufixo>,
// PIX_RECEIVER_CITY_<sufixo> — o sufixo vem de LocationConfig.pixEnvSuffix.
export function getPixConfig(pixEnvSuffix: string): PixEnvConfig | null {
  const key = process.env[`PIX_KEY_${pixEnvSuffix}`];
  const receiverName = process.env[`PIX_RECEIVER_NAME_${pixEnvSuffix}`];
  const receiverCity = process.env[`PIX_RECEIVER_CITY_${pixEnvSuffix}`];

  if (!key || !receiverName || !receiverCity) return null;
  return { key, receiverName, receiverCity };
}
