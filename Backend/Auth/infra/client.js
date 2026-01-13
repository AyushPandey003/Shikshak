import { Kafka } from "kafkajs";

// Support both local (no SSL) and Aiven (SSL with certs)
const sslConfig = process.env.KAFKA_SSL_CA ? {
  ca: Buffer.from(process.env.KAFKA_SSL_CA, "base64").toString(),
  key: Buffer.from(process.env.KAFKA_SSL_KEY, "base64").toString(),
  cert: Buffer.from(process.env.KAFKA_SSL_CERT, "base64").toString(),
} : undefined;

export const kafka = new Kafka({
  clientId: "shiksha",
  brokers: process.env.KAFKA_BROKERS?.split(",") || ["localhost:9092"],
  ssl: sslConfig,
});
