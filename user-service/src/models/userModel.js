import mongoose, { model, Schema } from "mongoose";

const userSchema = new Schema({
    username: { type: String, required: true, unique: [ true, "User with this name already exists" ] },
    email: { type: String, required: true, unique: [ true, "Email already taken" ] },
    mobileNo: { type: String, required: true, unique: [ true, "User with this mobileNo already exists" ] },
    password: { type: String, required: true }
},{
    timestamps: true
})

const User = mongoose.model("User", userSchema);

export default User;