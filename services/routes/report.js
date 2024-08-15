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
const DATA_FILE_PATH = path.resolve('data/report.json');

// Load existing report data from the JSON file
let reportEntries = [];
if (fs.existsSync(DATA_FILE_PATH)) {
    const data = fs.readFileSync(DATA_FILE_PATH, 'utf8');
    reportEntries = JSON.parse(data);
}

// Function to save report entries to the JSON file
const savereportEntries = () => {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(reportEntries, null, 2));
};

// Route to get all report entries
app.get("/report", (req, res) => {
    res.json(reportEntries);
});

// Route to add a new report entry
app.post("/report", (req, res) => {
    const { amount, category, date } = req.body;
    if (!amount || !category || !date) {
        return res.status(400).send("All fields are required");
    }
    const newEntry = { id: reportEntries.length + 1, amount, category, date };
    reportEntries.push(newEntry);
    savereportEntries(); // Save to JSON file
    res.status(201).json(newEntry);
});

// Route to update a report entry
app.put("/report/:id", (req, res) => {
    const { id } = req.params;
    const { amount, category, date } = req.body;
    const entryIndex = reportEntries.findIndex(
        (entry) => entry.id === parseInt(id)
    );

    if (entryIndex === -1) {
        return res.status(404).send("report entry not found");
    }

    reportEntries[entryIndex] = { id: parseInt(id), amount, category, date };
    savereportEntries(); // Save to JSON file
    res.json(reportEntries[entryIndex]);
});

// Route to delete a report entry
app.delete("/report/:id", (req, res) => {
    const { id } = req.params;
    const entryIndex = reportEntries.findIndex(
        (entry) => entry.id === parseInt(id)
    );

    if (entryIndex === -1) {
        return res.status(404).send("report entry not found");
    }

    const deletedEntry = reportEntries.splice(entryIndex, 1);
    savereportEntries(); // Save to JSON file
    res.json(deletedEntry);
});

export default app;

// Start Server
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
    logger.info(`report service running on port ${PORT}`);
});