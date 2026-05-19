import { Router } from "express";
import { body } from "express-validator";
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  exportLeadsCSV,
} from "../controllers/leadsController";
import { protect, restrictTo } from "../middlewares/auth";
import { validate } from "../middlewares/validate";

const router = Router();

router.use(protect);

const leadBodyValidation = [
  body("name").trim().isLength({ min: 2, max: 100 }).withMessage("Name must be 2-100 characters"),
  body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
  body("source")
    .isIn(["Website", "Instagram", "Referral"])
    .withMessage("Source must be Website, Instagram, or Referral"),
  body("status")
    .optional()
    .isIn(["New", "Contacted", "Qualified", "Lost"])
    .withMessage("Invalid status value"),
];

router.get("/export", exportLeadsCSV);
router.get("/", getLeads);
router.post("/", leadBodyValidation, validate, createLead);
router.get("/:id", getLeadById);

router.put(
  "/:id",
  [
    body("name").optional().trim().isLength({ min: 2, max: 100 }).withMessage("Name must be 2-100 characters"),
    body("email").optional().isEmail().normalizeEmail().withMessage("Valid email"),
    body("source").optional().isIn(["Website", "Instagram", "Referral"]),
    body("status").optional().isIn(["New", "Contacted", "Qualified", "Lost"]),
  ],
  validate,
  updateLead
);

router.delete("/:id", restrictTo("admin"), deleteLead);

export default router;
