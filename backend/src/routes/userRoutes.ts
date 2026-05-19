import { Router } from "express";
import { getUsers, deleteUser } from "../controllers/usersController";
import { protect, restrictTo } from "../middlewares/auth";

const router = Router();

router.use(protect, restrictTo("admin"));

router.get("/", getUsers);
router.delete("/:id", deleteUser);

export default router;
