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
const DATA_FILE_PATH = path.resolve("./data/budget.json");

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
const readBudgetData = () => {
    try {
        const data = fs.readFileSync(DATA_FILE_PATH, "utf8");
        return JSON.parse(data);
    } catch (err) {
        logger.error("Error reading budget data:", err);
        return [];
    }
};

// Helper function to write the JSON data
const writeBudgetData = (data) => {
    try {
        fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2));
    } catch (err) {
        logger.error("Error writing budget data:", err);
    }
};

// Route to get all budget entries
app.get("/budget", (req, res) => {
    const budgetEntries = readBudgetData();
    res.json(budgetEntries);
});

// Route to add a new budget entry
app.post("/budget", (req, res) => {
    const { amount, category, date } = req.body;
    if (!amount || !category || !date) {
        return res.status(400).send("All fields are required");
    }

    const budgetEntries = readBudgetData();
    const newEntry = { id: budgetEntries.length + 1, amount, category, date };
    budgetEntries.push(newEntry);
    writeBudgetData(budgetEntries);

    res.status(201).json(newEntry);
});

// Route to update a budget entry
app.put("/budget/:id", (req, res) => {
    const { id } = req.params;
    const { amount, category, date } = req.body;

    const budgetEntries = readBudgetData();
    const entryIndex = budgetEntries.findIndex((entry) => entry.id === parseInt(id));

    if (entryIndex === -1) {
        return res.status(404).send("Budget entry not found");
    }

    budgetEntries[entryIndex] = { id: parseInt(id), amount, category, date };
    writeBudgetData(budgetEntries);

    res.json(budgetEntries[entryIndex]);
});

// Route to delete a budget entry
app.delete("/budget/:id", (req, res) => {
    const { id } = req.params;

    const budgetEntries = readBudgetData();
    const entryIndex = budgetEntries.findIndex((entry) => entry.id === parseInt(id));

    if (entryIndex === -1) {
        return res.status(404).send("Budget entry not found");
    }

    const deletedEntry = budgetEntries.splice(entryIndex, 1);
    writeBudgetData(budgetEntries);

    res.json(deletedEntry);
});

// Start Server
const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
    logger.info(`Budget Service running on port ${PORT}`);
});