import { getAuthedProfile } from "@/lib/auth";
import AppointmentsClient from "./AppointmentsClient";
import LogoutButton from "./LogoutButton";

const ROLE_LABELS: Record<string, string> = {
  master: "Master",
  adminC: "Admin · Cílios",
  adminU: "Admin · Unhas",
};

export default async function AdminPage() {
  const profile = await getAuthedProfile();

  if (!profile) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <p className="text-sm">
          Seu login funcionou, mas seu perfil de acesso ainda não foi cadastrado.
          <br />
          Peça para o admin master te cadastrar na tabela <code>profiles</code>.
        </p>
        <LogoutButton />
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col px-6 py-10 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs tracking-[0.3em] text-vallue-rose uppercase mb-1">
            Vallue Studio
          </p>
          <h1 className="font-serif-display text-2xl">Agendamentos</h1>
          <p className="text-sm text-vallue-plum-light mt-1">
            {ROLE_LABELS[profile.role] ?? profile.role}
          </p>
        </div>
        <LogoutButton />
      </div>

      <AppointmentsClient role={profile.role} />
    </main>
  );
}
