const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const bahanBakuRoutes = require("./routes/bahanBakuRoutes");
const login = require("./routes/loginRoutes");
const menuManagement = require("./routes/menuManagement");
const detailMenuRoutes = require("./routes/detailMenuRoutes");
const pesananDetailRoutes = require("./routes/pesananDetailRoutes");
const detailPenjualanRoutes = require("./routes/detailPenjualanRoutes");
const mainPenjualanRoutes = require("./routes/mainPenjualanRoutes");
const laporanKeuanganRoutes = require("./routes/laporanKeuanganRoutes");
const historyRoutes = require("./routes/historyRoutes");

const { connectMongoDB } = require("./config/sequelize");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* =========================
   CONNECT DB ONCE (CACHE)
========================= */
let isConnected = false;

async function connectDBOnce() {
  if (isConnected) return;

  await connectMongoDB();
  isConnected = true;
}

/* =========================
   MIDDLEWARE DB
========================= */
app.use(async (req, res, next) => {
  try {
    await connectDBOnce();
    next();
  } catch (err) {
    console.error("DB connect failed:", err.message);
    res.status(500).json({ message: "DB connection failed" });
  }
});

/* =========================
   ROUTES
========================= */
app.use("/api/login", login);
app.use("/api/decrypt", login);
app.use("/api/menu_management", menuManagement);
app.use("/api/menu_management/detail", detailMenuRoutes);
app.use("/api/bahan_Baku", bahanBakuRoutes);
app.use("/api/pesanan_detail/detail", pesananDetailRoutes);
app.use("/api/detail_penjualan", detailPenjualanRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/main_penjualan", mainPenjualanRoutes);
app.use("/api/laporan_keuangan", laporanKeuanganRoutes);

/* =========================
   EXPORT (PENTING)
========================= */
module.exports = app;
