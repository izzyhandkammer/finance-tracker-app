import express from "express";
import morgan from "morgan";
import winston from "winston";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
app.use(express.json());
app.use(morgan("combined"));
app.use(cors());

// Define the path to the JSON data file
const DATA_FILE_PATH = path.resolve("./data/expense.json");

// Winston Logger Configuration
const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: "logs/combined.log" }),
        new winston.transports.Console({ format: winston.format.simple() }),
    ],
});

// Helper function to read the JSON data
const readexpenseData = () => {
    try {
        const data = fs.readFileSync(DATA_FILE_PATH, "utf8");
        return JSON.parse(data);
    } catch (err) {
        logger.error("Error reading expense data:", err);
        return [];
    }
};

// Helper function to write the JSON data
const writeexpenseData = (data) => {
    try {
        fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2));
    } catch (err) {
        logger.error("Error writing expense data:", err);
    }
};

// Route to get all expense entries
app.get("/expense", (req, res) => {
    const expenseEntries = readexpenseData();
    res.json(expenseEntries);
});

// Route to add a new expense entry
app.post("/expense", (req, res) => {
    const { amount, category, date } = req.body;
    if (!amount || !category || !date) {
        return res.status(400).send("All fields are required");
    }

    const expenseEntries = readexpenseData();
    const newEntry = { id: expenseEntries.length + 1, amount, category, date };
    expenseEntries.push(newEntry);
    writeexpenseData(expenseEntries);

    res.status(201).json(newEntry);
});

// Route to update a expense entry
app.put("/expense/:id", (req, res) => {
    const { id } = req.params;
    const { amount, category, date } = req.body;

    const expenseEntries = readexpenseData();
    const entryIndex = expenseEntries.findIndex((entry) => entry.id === parseInt(id));

    if (entryIndex === -1) {
        return res.status(404).send("expense entry not found");
    }

    expenseEntries[entryIndex] = { id: parseInt(id), amount, category, date };
    writeexpenseData(expenseEntries);

    res.json(expenseEntries[entryIndex]);
});

// Route to delete a expense entry
app.delete("/expense/:id", (req, res) => {
    const { id } = req.params;

    const expenseEntries = readexpenseData();
    const entryIndex = expenseEntries.findIndex((entry) => entry.id === parseInt(id));

    if (entryIndex === -1) {
        return res.status(404).send("expense entry not found");
    }

    const deletedEntry = expenseEntries.splice(entryIndex, 1);
    writeexpenseData(expenseEntries);

    res.json(deletedEntry);
});

// Start Server
const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
    logger.info(`expense Service running on port ${PORT}`);
});