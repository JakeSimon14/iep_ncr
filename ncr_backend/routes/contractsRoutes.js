const express = require('express');
const router = express.Router();
const contractsController = require('../controllers/contractController');

/**
 * @swagger
 * /api/contracts:
 *   get:
 *     summary: Get contract tree data
 *     description: Returns a hierarchical tree structure of contracts.
 *     tags:
 *       - Contracts
 *     responses:
 *       200:
 *         description: Successfully retrieved contract tree
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *              
 *       500:
 *         description: Server error while retrieving contract tree
 */
router.get('/contracts', contractsController.getContractTree);

module.exports = router;
