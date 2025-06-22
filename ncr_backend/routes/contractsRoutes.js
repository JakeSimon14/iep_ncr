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
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: Contract A
 *                   children:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 2
 *                         name:
 *                           type: string
 *                           example: Subcontract A1
 *       500:
 *         description: Server error while retrieving contract tree
 */
router.get('/', contractsController.getContractTree);

module.exports = router;
