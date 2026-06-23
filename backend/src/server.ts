import { createApp } from "./app";
import { env } from "@/config/env";

const app = createApp();

app.listen(env.port, () => {
  console.log(`🚀 Back-End Mídia Kit rodando na porta ${env.port}`);
  console.log(`   Ambiente: ${env.nodeEnv}`);
});
