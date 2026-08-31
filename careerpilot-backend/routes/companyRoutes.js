const express = require("express");

const {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany
} = require("../controllers/companyController");

const {
  protect,
  authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/",
  protect,
  getAllCompanies
);

router.get(
  "/:id",
  protect,
  getCompanyById
);

router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createCompany
);

router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updateCompany
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteCompany
);

module.exports = router;
