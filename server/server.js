const express = require("express");
const cors = require("cors");
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require("./config/db");
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const alertRoutes = require("./routes/alertRoutes");



dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
// app.use("/api/auth", require("./server/routes/authRoutes"));
app.use("/api/alerts", alertRoutes);
app.use('/api/contacts', contactRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
