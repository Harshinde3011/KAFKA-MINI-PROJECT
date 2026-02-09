import { consumer } from "../config/kafka.js";
import { sendWelcomMail } from "../services/mailService.js";

export const startUserRegisteredConsumer = async () => {
  await consumer.connect();

  await consumer.subscribe({
    topic: "user-registered",
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      console.log("RAW MESSAGE:", message.value?.toString());

      if (!message.value) return;

      const payload = JSON.parse(message.value.toString());
      const { email, username } = payload.data;

      console.log("📩 User registered event received:", payload.data);

      await sendWelcomMail(email, username);
    },
  });
};
