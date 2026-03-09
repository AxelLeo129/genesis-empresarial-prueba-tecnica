const router = require('express').Router();
const transactionController = require('../controllers/transaction.controller');

// GET /api/transactions - Get all transactions (with optional filters)
router.get('/', transactionController.getAll);

// GET /api/transactions/weekly-activity - Get weekly activity stats
router.get('/weekly-activity', transactionController.getWeeklyActivity);

// GET /api/transactions/expenses-by-category - Get expenses grouped by category
router.get('/expenses-by-category', transactionController.getExpensesByCategory);

// GET /api/transactions/balance-history - Get monthly balance history
router.get('/balance-history', transactionController.getBalanceHistory);

// GET /api/transactions/:id - Get transaction by ID
router.get('/:id', transactionController.getById);

// POST /api/transactions - Create a new transaction
router.post('/', transactionController.create);

// GET /api/transactions/account/:accountId/recent - Get recent transactions for an account
router.get('/account/:accountId/recent', transactionController.getRecent);

module.exports = router;
