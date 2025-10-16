const express = require('express');
const router = express.Router();
const dobuyController = require('../controllers/dovsbuyController');

/**
 * @swagger
 * /dovsbuy:
 *   get:
 *     summary: Retrieve Do Vs Buy data
 *     description: Returns a list of Do Vs Buy.
 *     tags:
 *       - DoVsBuy
 *     responses:
 *       200:
 *         description: A list of Do Vs Buy data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               
 */
router.get('/dovsbuyData', dobuyController.getDoVsBuyData);

module.exports = router;
