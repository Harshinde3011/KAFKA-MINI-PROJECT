import { Router } from "express";
import UserController from "../controllers/userController.js";

const router = Router();

router.post("/register", UserController.registration);

router.post("/login", UserController.login);

export default router;