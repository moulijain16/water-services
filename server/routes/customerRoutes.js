const express = require("express");
const router = express.Router();
const {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  addServiceRecord,
  getDashboardStats,
} = require("../controllers/customerController");

router.get("/stats/summary", getDashboardStats);

router.route("/").post(createCustomer).get(getCustomers);

router.route("/:id").get(getCustomerById).put(updateCustomer).delete(deleteCustomer);

router.post("/:id/service", addServiceRecord);

module.exports = router;