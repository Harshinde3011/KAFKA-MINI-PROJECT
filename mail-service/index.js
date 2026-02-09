import { startUserRegisteredConsumer } from "./src/consumer/userRegisteredConsumer.js";
import dotenv from "dotenv";
dotenv.config();

startUserRegisteredConsumer()
.then(() => console.log("📧 Mail Service running"))
.catch(console.error)