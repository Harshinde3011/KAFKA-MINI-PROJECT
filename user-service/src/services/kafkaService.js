import { producer } from "../config/kafka.js";

export const publishUserRegistered = async (data) => {
    console.log("publishing the event...");
    
    await producer.connect();

    await producer.send({
        topic: "user-registered",
        messages: [
            {
                key: data.userId,
                value: JSON.stringify({
                    event: "USER_RESISTERED",
                    data,
                    timestamp: new Date().toDateString()
                })
            }
        ]
    })
    console.log("🚀 Publishing USER_REGISTERED event");

}