import { Kafka } from "kafkajs";

export const kafka = new Kafka({
  clientId: "shiksha",
  brokers: ["localhost:9092"],
});
