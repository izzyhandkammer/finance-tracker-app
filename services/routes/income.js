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
const DATA_FILE_PATH = path.resolve('data/income.json');

// Load existing income data from the JSON file
let incomeEntries = [];
if (fs.existsSync(DATA_FILE_PATH)) {
    const data = fs.readFileSync(DATA_FILE_PATH, 'utf8');
    incomeEntries = JSON.parse(data);
}

// Function to save income entries to the JSON file
const saveincomeEntries = () => {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(incomeEntries, null, 2));
};

// Route to get all income entries
app.get("/income", (req, res) => {
    res.json(incomeEntries);
});

// Route to add a new income entry
app.post("/income", (req, res) => {
    const { amount, category, date } = req.body;
    if (!amount || !category || !date) {
        return res.status(400).send("All fields are required");
    }
    const newEntry = { id: incomeEntries.length + 1, amount, category, date };
    incomeEntries.push(newEntry);
    saveincomeEntries(); // Save to JSON file
    res.status(201).json(newEntry);
});

// Route to update a income entry
app.put("/income/:id", (req, res) => {
    const { id } = req.params;
    const { amount, category, date } = req.body;
    const entryIndex = incomeEntries.findIndex(
        (entry) => entry.id === parseInt(id)
    );

    if (entryIndex === -1) {
        return res.status(404).send("income entry not found");
    }

    incomeEntries[entryIndex] = { id: parseInt(id), amount, category, date };
    saveincomeEntries(); // Save to JSON file
    res.json(incomeEntries[entryIndex]);
});

// Route to delete a income entry
app.delete("/income/:id", (req, res) => {
    const { id } = req.params;
    const entryIndex = incomeEntries.findIndex(
        (entry) => entry.id === parseInt(id)
    );

    if (entryIndex === -1) {
        return res.status(404).send("income entry not found");
    }

    const deletedEntry = incomeEntries.splice(entryIndex, 1);
    saveincomeEntries(); // Save to JSON file
    res.json(deletedEntry);
});

export default app;

// Start Server
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    logger.info(`income service running on port ${PORT}`);
});