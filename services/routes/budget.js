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
const DATA_FILE_PATH = path.resolve('data/budget.json');

// Load existing budget data from the JSON file
let budgetEntries = [];
if (fs.existsSync(DATA_FILE_PATH)) {
    const data = fs.readFileSync(DATA_FILE_PATH, 'utf8');
    budgetEntries = JSON.parse(data);
}

// Function to save budget entries to the JSON file
const saveBudgetEntries = () => {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(budgetEntries, null, 2));
};

// Route to get all budget entries
app.get("/budget", (req, res) => {
    res.json(budgetEntries);
});

// Route to add a new budget entry
app.post("/budget", (req, res) => {
    const { amount, category, date } = req.body;
    if (!amount || !category || !date) {
        return res.status(400).send("All fields are required");
    }
    const newEntry = { id: budgetEntries.length + 2, amount, category, date };
    budgetEntries.push(newEntry);
    saveBudgetEntries(); // Save to JSON file
    res.status(201).json(newEntry);
});

// Route to update a budget entry
app.put("/budget/:id", (req, res) => {
    const { id } = req.params;
    const { amount, category, date } = req.body;
    const entryIndex = budgetEntries.findIndex(
        (entry) => entry.id === parseInt(id)
    );

    if (entryIndex === -1) {
        return res.status(404).send("Budget entry not found");
    }

    budgetEntries[entryIndex] = { id: parseInt(id), amount, category, date };
    saveBudgetEntries(); // Save to JSON file
    res.json(budgetEntries[entryIndex]);
});

// Route to delete a budget entry
app.delete("/budget/:id", (req, res) => {
    const { id } = req.params;
    const entryIndex = budgetEntries.findIndex(
        (entry) => entry.id === parseInt(id)
    );

    if (entryIndex === -1) {
        return res.status(404).send("Budget entry not found");
    }

    const deletedEntry = budgetEntries.splice(entryIndex, 1);
    saveBudgetEntries(); // Save to JSON file
    res.json(deletedEntry);
});

export default app;

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    logger.info(`Budget service running on port ${PORT}`);
});