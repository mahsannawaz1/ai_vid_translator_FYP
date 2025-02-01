require('dotenv').config({path:'./env'})
import express from 'express';
import prisma from './db/db.js';

const app = express();
app.use(express.json());

app.get('/users', async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));