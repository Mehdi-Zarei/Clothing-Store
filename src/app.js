const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//* Builtin Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "..", "public")));
app.use(cookieParser(process.env.COOKIE_SECRET));

//* Import Files
const { corsOptions } = require("./middlewares/corsOptions");
app.use(cors(corsOptions));
const { errorHandler } = require("./middlewares/errorHandler");
const authRoutes = require("./modules/auth/auth.routes");

//* Import Routes
app.use("/api/auth", authRoutes);

//* 404 Error Handler
app.use((req, res) => {
  return res.status(404).json({ message: "OoPss!Page Not Found !!" });
});

//* Global Error Handler
app.use(errorHandler);
module.exports = app;
