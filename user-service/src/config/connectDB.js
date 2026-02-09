import mongoose from "mongoose";

const connectDB = async() => {
    try {
        const connect = await mongoose.connect(`${process.env.MONGODB_URI}`);
        console.log(`MONGODB CONNECTED: ${connect.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

export default connectDB;