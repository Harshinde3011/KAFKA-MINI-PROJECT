import User from "../models/userModel.js";
import bcrypt from "bcrypt"
import JWT from "jsonwebtoken";
import { publishUserRegistered } from "../services/kafkaService.js";

class UserController {

    async registration(req, res, next) {
        try {

            const { username, email, password, mobileNo } = req.body;

            if (!username || !mobileNo || !password) {
                throw new Error("Please provide valid data");
            }

            const isUserExists = await User.findOne({
                mobileNo: mobileNo
            });

            if (isUserExists) {
                return res.status(401).json({
                    status: 401,
                    message: "User already exists"
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await User.create({
                username,
                mobileNo,
                email,
                password: hashedPassword
            });
            console.log("user logged in successfully...");
            
            // 🔥 Publish Kafka Event AFTER DB success
            await publishUserRegistered({
                userId: user._id.toString(),
                username: user.username,
                email: user.email,
                mobileNo: user.mobileNo
            })

            if (user) {
                res.status(201).json({
                    _id: user._id,
                    email: user.email,
                    message: "User created successfully",
                })
            } else {
                throw new Error("User data is not valid")
            }

        } catch (error) {
            console.log("Error in UserController.registration");
            next(error)
        }
    }

    async login(req, res, next) {
        try {

            const { password, mobileNo } = req.body;

            if (!mobileNo || !password) {
                throw new Error("Please provide valid data");
            }

            const isUserExists = await User.findOne({
                mobileNo: mobileNo
            });

            if (isUserExists && (await bcrypt.compare(password, isUserExists.password))) {
                const user = {
                    _id: isUserExists._id,
                    username: isUserExists.username,
                    email: isUserExists.email,
                }

                const accesToken = JWT.sign(user, process.env.ACCESS_TOKEN_KEY, { expiresIn: "15m" });

                res.status(200).json({
                    accesToken
                })
            }else{
                throw new Error("Invalid credentails provided") 
            }

        } catch (error) {
            console.log("Error in UserController.registration");
            next(error)
        }
    }

}

export default new UserController();