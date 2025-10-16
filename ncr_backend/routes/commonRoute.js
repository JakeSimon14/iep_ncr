const express = require('express');
const router = express.Router();
const commonController = require('../controllers/commonController');

/**
 * @swagger
 * /api/officestree:
 *   get:
 *     summary: Get office tree data
 *     description: Returns a hierarchical tree structure of offices.
 *     tags:
 *       - Contracts
 *     responses:
 *       200:
 *         description: Successfully retrieved office tree
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *              
 *       500:
 *         description: Server error while retrieving office tree
 */
router.get('/officestreedata', commonController.getOfficesTree);

module.exports = router;
