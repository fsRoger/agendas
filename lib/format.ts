export function centsToBRL(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

const WEEKDAY_LABELS = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

export function formatDateLabel(iso: string, weekday: number): string {
  const [, month, day] = iso.split("-");
  return `${WEEKDAY_LABELS[weekday]}, ${day}/${month}`;
}
