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

// Winston Logger Configuration
const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: "logs/combined.log" }),
        new winston.transports.Console({ format: winston.format.simple() }),
    ],
});

// Define the path to the JSON file
const DATA_FILE_PATH = path.resolve('data/expense.json');

// Load existing expense data from the JSON file
let expenseEntries = [];
if (fs.existsSync(DATA_FILE_PATH)) {
    const data = fs.readFileSync(DATA_FILE_PATH, 'utf8');
    expenseEntries = JSON.parse(data);
}

// Function to save expense entries to the JSON file
const saveexpenseEntries = () => {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(expenseEntries, null, 2));
};

// Route to get all expense entries
app.get("/expense", (req, res) => {
    res.json(expenseEntries);
});

// Route to add a new expense entry
app.post("/expense", (req, res) => {
    const { amount, category, date } = req.body;
    if (!amount || !category || !date) {
        return res.status(400).send("All fields are required");
    }
    const newEntry = { id: expenseEntries.length + 1, amount, category, date };
    expenseEntries.push(newEntry);
    saveexpenseEntries(); // Save to JSON file
    res.status(201).json(newEntry);
});

// Route to update a expense entry
app.put("/expense/:id", (req, res) => {
    const { id } = req.params;
    const { amount, category, date } = req.body;
    const entryIndex = expenseEntries.findIndex(
        (entry) => entry.id === parseInt(id)
    );

    if (entryIndex === -1) {
        return res.status(404).send("expense entry not found");
    }

    expenseEntries[entryIndex] = { id: parseInt(id), amount, category, date };
    saveexpenseEntries(); // Save to JSON file
    res.json(expenseEntries[entryIndex]);
});

// Route to delete a expense entry
app.delete("/expense/:id", (req, res) => {
    const { id } = req.params;
    const entryIndex = expenseEntries.findIndex(
        (entry) => entry.id === parseInt(id)
    );

    if (entryIndex === -1) {
        return res.status(404).send("expense entry not found");
    }

    const deletedEntry = expenseEntries.splice(entryIndex, 1);
    saveexpenseEntries(); // Save to JSON file
    res.json(deletedEntry);
});

export default app;

// Start Server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    logger.info(`expense service running on port ${PORT}`);
});