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
const DATA_FILE_PATH = path.resolve("./data/report.json");

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
const readreportData = () => {
    try {
        const data = fs.readFileSync(DATA_FILE_PATH, "utf8");
        return JSON.parse(data);
    } catch (err) {
        logger.error("Error reading report data:", err);
        return [];
    }
};

// Helper function to write the JSON data
const writereportData = (data) => {
    try {
        fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2));
    } catch (err) {
        logger.error("Error writing report data:", err);
    }
};

// Route to get all report entries
app.get("/report", (req, res) => {
    const reportEntries = readreportData();
    res.json(reportEntries);
});

// Route to add a new report entry
app.post("/report", (req, res) => {
    const { amount, category, date } = req.body;
    if (!amount || !category || !date) {
        return res.status(400).send("All fields are required");
    }

    const reportEntries = readreportData();
    const newEntry = { id: reportEntries.length + 1, amount, category, date };
    reportEntries.push(newEntry);
    writereportData(reportEntries);

    res.status(201).json(newEntry);
});

// Route to update a report entry
app.put("/report/:id", (req, res) => {
    const { id } = req.params;
    const { amount, category, date } = req.body;

    const reportEntries = readreportData();
    const entryIndex = reportEntries.findIndex((entry) => entry.id === parseInt(id));

    if (entryIndex === -1) {
        return res.status(404).send("report entry not found");
    }

    reportEntries[entryIndex] = { id: parseInt(id), amount, category, date };
    writereportData(reportEntries);

    res.json(reportEntries[entryIndex]);
});

// Route to delete a report entry
app.delete("/report/:id", (req, res) => {
    const { id } = req.params;

    const reportEntries = readreportData();
    const entryIndex = reportEntries.findIndex((entry) => entry.id === parseInt(id));

    if (entryIndex === -1) {
        return res.status(404).send("report entry not found");
    }

    const deletedEntry = reportEntries.splice(entryIndex, 1);
    writereportData(reportEntries);

    res.json(deletedEntry);
});

// Start Server
const PORT = process.env.PORT || 4004;
app.listen(PORT, () => {
    logger.info(`report Service running on port ${PORT}`);
});