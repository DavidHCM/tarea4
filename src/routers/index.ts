import { Router } from 'express';
const path = require('path');

const router = Router();


router.get('/', (req, res) => {
    const url = path.join(__dirname, '..', '..', 'public', 'views', 'index.html');
    res.sendFile(url);
});

router.get('/chat/:id', (req, res) => {
    const url = path.join(__dirname, '..', '..', 'public', 'views', 'chat.html');
    res.sendFile(url);
});

export default router;
