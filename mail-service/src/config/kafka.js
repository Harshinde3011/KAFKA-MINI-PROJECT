import { Kafka } from "kafkajs";

export const kafka = new Kafka({
    clientId: "mail-service",
    brokers: ["localhost:9092"],
});

export const consumer = kafka.consumer({
    groupId: "mail-group"
});