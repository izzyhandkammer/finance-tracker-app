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
const DATA_FILE_PATH = path.resolve("./data/income.json");

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
const readincomeData = () => {
    try {
        const data = fs.readFileSync(DATA_FILE_PATH, "utf8");
        return JSON.parse(data);
    } catch (err) {
        logger.error("Error reading income data:", err);
        return [];
    }
};

// Helper function to write the JSON data
const writeincomeData = (data) => {
    try {
        fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2));
    } catch (err) {
        logger.error("Error writing income data:", err);
    }
};

// Route to get all income entries
app.get("/income", (req, res) => {
    const incomeEntries = readincomeData();
    res.json(incomeEntries);
});

// Route to add a new income entry
app.post("/income", (req, res) => {
    const { amount, category, date } = req.body;
    if (!amount || !category || !date) {
        return res.status(400).send("All fields are required");
    }

    const incomeEntries = readincomeData();
    const newEntry = { id: incomeEntries.length + 1, amount, category, date };
    incomeEntries.push(newEntry);
    writeincomeData(incomeEntries);

    res.status(201).json(newEntry);
});

// Route to update a income entry
app.put("/income/:id", (req, res) => {
    const { id } = req.params;
    const { amount, category, date } = req.body;

    const incomeEntries = readincomeData();
    const entryIndex = incomeEntries.findIndex((entry) => entry.id === parseInt(id));

    if (entryIndex === -1) {
        return res.status(404).send("income entry not found");
    }

    incomeEntries[entryIndex] = { id: parseInt(id), amount, category, date };
    writeincomeData(incomeEntries);

    res.json(incomeEntries[entryIndex]);
});

// Route to delete a income entry
app.delete("/income/:id", (req, res) => {
    const { id } = req.params;

    const incomeEntries = readincomeData();
    const entryIndex = incomeEntries.findIndex((entry) => entry.id === parseInt(id));

    if (entryIndex === -1) {
        return res.status(404).send("income entry not found");
    }

    const deletedEntry = incomeEntries.splice(entryIndex, 1);
    writeincomeData(incomeEntries);

    res.json(deletedEntry);
});

// Start Server
const PORT = process.env.PORT || 4003;
app.listen(PORT, () => {
    logger.info(`income Service running on port ${PORT}`);
});