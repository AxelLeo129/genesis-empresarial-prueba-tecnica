const router = require('express').Router();
const dashboardController = require('../controllers/dashboard.controller');

// GET /api/dashboard/home - Get all data for home page
router.get('/home', dashboardController.getHomeData);

// GET /api/dashboard/accounts - Get all data for accounts page
router.get('/accounts', dashboardController.getAccountsData);

module.exports = router;
