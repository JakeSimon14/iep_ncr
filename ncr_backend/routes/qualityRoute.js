const express = require('express');
const router = express.Router();
const qualityController = require('../controllers/qualityController');

/**
 * @swagger
 * /quality:
 *   get:
 *     summary: Retrieve Quality Activity data
 *     description: Returns a list of NCR activities based on selected contracts.
 *     tags:
 *       - Quality
 *     responses:
 *       200:
 *         description: A list of activity data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               
 */
router.get('/activityData', qualityController.getActivityData);

/**
 * @swagger
 * /ecn:
 *   get:
 *     summary: Retrieve ECN Activity data
 *     description: Returns a list of ECN activities based on selected contracts.
 *     tags:
 *       - ECN
 *     responses:
 *       200:
 *         description: A list of activity data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               
 */
router.get('/ecnactivityData', qualityController.getECNActivityData);

module.exports = router;
