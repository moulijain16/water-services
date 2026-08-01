const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const customerRoutes = require("./routes/customerRoutes");
const authRoutes = require("./routes/authRoutes");
const protect = require("./middleware/auth");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/customers", protect, customerRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;