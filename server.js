const fs = require('fs');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;
const expensesFile = './data/expenses.json';
const backupFile = './data/backup.json';

app.use(cors());
app.use(bodyParser.json());

// Read expenses
app.get('/expenses', (req, res) => {
    fs.readFile(expensesFile, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ message: 'Error reading file' });
        res.json(JSON.parse(data));
    });
});

// Add new expense
app.post('/expenses', (req, res) => {
    const newExpense = req.body;
    fs.readFile(expensesFile, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ message: 'Error reading file' });
        let expenses = JSON.parse(data);
        expenses.push(newExpense);
        fs.writeFile(expensesFile, JSON.stringify(expenses, null, 2), (err) => {
            if (err) return res.status(500).json({ message: 'Error saving expense' });
            res.json({ message: 'Expense added', data: newExpense });
        });
    });
});

// Backup Data
app.get('/backup', (req, res) => {
    fs.copyFile(expensesFile, backupFile, (err) => {
        if (err) return res.status(500).json({ message: 'Error creating backup' });
        res.download(backupFile);
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
