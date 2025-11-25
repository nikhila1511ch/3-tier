const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const Employee = require("./models/Employee");

dotenv.config();

const app = express();
app.use(cors({
  origin: "https://www.nikhilaapp.com",
  methods: ["GET", "POST", "DELETE"],
  credentials: true
}));
// app.use(cors({
//   origin: "https://fuzzy-space-couscous-wrj7wqqqpwpv3rgr-5173.app.github.dev",
//   methods: ["GET", "POST", "DELETE"],
//   credentials: true
// }));

app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Connect MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("Mongo error:", err));

// Routes

// Get all employees
app.get("/api/employees", async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add employee
app.post("/api/employees", async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: "Name and Email required" });
    }
    const emp = await Employee.create({ name, email });
    res.status(201).json(emp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete employee
app.delete("/api/employees/:id", async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
