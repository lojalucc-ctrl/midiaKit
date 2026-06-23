import crypto from "crypto";
import { env } from "@/config/env";

// Criptografia em repouso dos tokens sociais (Instagram/YouTube) — AES-256-CBC.
// Os tokens NUNCA são salvos em texto puro no banco (requisito crítico do spec).

const ALGORITHM = "aes-256-cbc";
const IV_LENGTH = 16;

// Deriva uma chave de exatamente 32 bytes a partir da ENCRYPTION_KEY informada.
function getKey(): Buffer {
  return crypto.createHash("sha256").update(env.encryptionKey).digest();
}

export function encrypt(plainText: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(plainText, "utf8"),
    cipher.final()
  ]);
  // Formato armazenado: "<iv-hex>:<ciphertext-hex>"
  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
}

export function decrypt(payload: string): string {
  const [ivHex, dataHex] = payload.split(":");
  if (!ivHex || !dataHex) {
    throw new Error("Payload criptografado inválido");
  }
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(dataHex, "hex")),
    decipher.final()
  ]);
  return decrypted.toString("utf8");
}
