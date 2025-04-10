import express from "express";
import userRoutes from "./UserRoutes";
import teamRoutes from "./TeamRoutes";
const router = express.Router();

router.use("/users", userRoutes);
router.use("/teams", teamRoutes);

export default router;
