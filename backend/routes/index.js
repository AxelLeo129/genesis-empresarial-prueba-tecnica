const router = require('express').Router();

const clientRoutes = require('./client.routes');
const accountRoutes = require('./account.routes');
const transactionRoutes = require('./transaction.routes');
const dashboardRoutes = require('./dashboard.routes');
const externalRoutes = require('./external.routes');

// Mount routes
router.use('/clients', clientRoutes);
router.use('/accounts', accountRoutes);
router.use('/transactions', transactionRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/external', externalRoutes);

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Genesis Financial API',
    version: '1.0.0',
    endpoints: {
      clients: '/api/clients',
      accounts: '/api/accounts',
      transactions: '/api/transactions',
      dashboard: '/api/dashboard',
      external: '/api/external'
    }
  });
});

module.exports = router;
