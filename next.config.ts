import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // O agendamento saiu da raiz para /agendamento — mantém os links antigos funcionando.
  async redirects() {
    return [
      { source: "/cilios", destination: "/agendamento/cilios", permanent: true },
      { source: "/unhas", destination: "/agendamento/unhas", permanent: true },
    ];
  },
};

export default nextConfig;
