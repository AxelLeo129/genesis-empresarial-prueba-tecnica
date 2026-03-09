const { Account, Client, Transaction, ScheduledPayment } = require('../models');
const { success, created, notFound, error } = require('../utils/response');
const { validateAccount } = require('../utils/validators');

/**
 * Get all accounts
 */
const getAll = async (req, res, next) => {
  try {
    const { clientId } = req.query;
    const where = clientId ? { clientId } : {};
    
    const accounts = await Account.findAll({
      where,
      include: [
        { model: Client, as: 'client' }
      ],
      order: [['createdAt', 'DESC']]
    });
    return success(res, accounts);
  } catch (err) {
    next(err);
  }
};

/**
 * Get account by ID
 */
const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const account = await Account.findByPk(id, {
      include: [
        { model: Client, as: 'client' },
        { model: Transaction, as: 'transactions', limit: 10, order: [['transactionDate', 'DESC']] },
        { model: ScheduledPayment, as: 'scheduledPayments' }
      ]
    });
    
    if (!account) {
      return notFound(res, 'Account not found');
    }
    
    return success(res, account);
  } catch (err) {
    next(err);
  }
};

/**
 * Create a new account
 */
const create = async (req, res, next) => {
  try {
    const validationErrors = validateAccount(req.body);
    if (validationErrors.length > 0) {
      return error(res, validationErrors.join(', '));
    }
    
    // Verify client exists
    const client = await Client.findByPk(req.body.clientId);
    if (!client) {
      return notFound(res, 'Client not found');
    }
    
    const account = await Account.create({
      ...req.body,
      balance: req.body.balance || 0
    });
    
    return created(res, account, 'Account created successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Update an account
 */
const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const account = await Account.findByPk(id);
    
    if (!account) {
      return notFound(res, 'Account not found');
    }
    
    // Don't allow direct balance updates through this endpoint
    const { balance, ...updateData } = req.body;
    
    await account.update(updateData);
    return success(res, account, 'Account updated successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Delete an account
 */
const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const account = await Account.findByPk(id);
    
    if (!account) {
      return notFound(res, 'Account not found');
    }
    
    await account.destroy();
    return success(res, null, 'Account deleted successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Get account balance summary
 */
const getBalanceSummary = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    
    const accounts = await Account.findAll({
      where: { clientId },
      include: [
        { 
          model: Transaction, 
          as: 'transactions',
          attributes: ['type', 'amount', 'category']
        }
      ]
    });
    
    let totalBalance = 0;
    let totalIncome = 0;
    let totalExpenses = 0;
    
    accounts.forEach(account => {
      totalBalance += parseFloat(account.balance);
      account.transactions.forEach(tx => {
        if (tx.type === 'deposit' || tx.type === 'transfer' && tx.amount > 0) {
          totalIncome += parseFloat(tx.amount);
        } else {
          totalExpenses += Math.abs(parseFloat(tx.amount));
        }
      });
    });
    
    const totalSavings = totalIncome - totalExpenses;
    
    return success(res, {
      totalBalance,
      totalIncome,
      totalExpenses,
      totalSavings
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  getBalanceSummary
};
