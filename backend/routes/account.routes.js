const router = require('express').Router();
const accountController = require('../controllers/account.controller');

// GET /api/accounts - Get all accounts (optionally filtered by clientId)
router.get('/', accountController.getAll);

// GET /api/accounts/:id - Get account by ID
router.get('/:id', accountController.getById);

// POST /api/accounts - Create a new account
router.post('/', accountController.create);

// PUT /api/accounts/:id - Update an account
router.put('/:id', accountController.update);

// DELETE /api/accounts/:id - Delete an account
router.delete('/:id', accountController.remove);

// GET /api/accounts/client/:clientId/summary - Get balance summary for a client
router.get('/client/:clientId/summary', accountController.getBalanceSummary);

module.exports = router;
