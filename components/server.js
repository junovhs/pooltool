const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/tempmail', { useNewUrlParser: true, useUnifiedTopology: true });

const emailSchema = new mongoose.Schema({
    address: String,
    messages: Array,
});
const Email = mongoose.model('Email', emailSchema);

app.get('/api/get-email', async (req, res) => {
    const email = await Email.findOne().sort({ createdAt: -1 });
    res.json({ email: email.address });
});

app.get('/api/refresh-email', async (req, res) => {
    const email = await Email.findOne().sort({ createdAt: -1 });
    res.json({ email: email.address });
});

app.get('/api/change-email', async (req, res) => {
    const newEmail = `${uuidv4()}@tempmail.com`;
    const email = new Email({ address: newEmail, messages: [] });
    await email.save();
    res.json({ email: newEmail });
});

app.delete('/api/delete-email', async (req, res) => {
    await Email.deleteOne({ address: req.body.email });
    res.sendStatus(200);
});

app.get('/api/get-messages', async (req, res) => {
    const email = await Email.findOne({ address: req.query.email });
    res.json({ messages: email ? email.messages : [] });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
