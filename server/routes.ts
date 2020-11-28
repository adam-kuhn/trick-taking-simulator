import express from 'express';
import cards from "./controllers/cards"

const router = express.Router();

router.get('/cards/deal', cards.dealCards);

export default router;