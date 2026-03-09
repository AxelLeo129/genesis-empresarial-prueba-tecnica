const { Transaction, Account } = require('../models');
const { Op } = require('sequelize');
const { success, created, notFound, error } = require('../utils/response');
const { validateTransaction } = require('../utils/validators');

/**
 * Get all transactions
 */
const getAll = async (req, res, next) => {
  try {
    const { accountId, type, status, startDate, endDate, limit = 50 } = req.query;
    
    const where = {};
    if (accountId) where.accountId = accountId;
    if (type) where.type = type;
    if (status) where.status = status;
    if (startDate || endDate) {
      where.transactionDate = {};
      if (startDate) where.transactionDate[Op.gte] = new Date(startDate);
      if (endDate) where.transactionDate[Op.lte] = new Date(endDate);
    }
    
    const transactions = await Transaction.findAll({
      where,
      include: [{ model: Account, as: 'account' }],
      order: [['transactionDate', 'DESC']],
      limit: parseInt(limit)
    });
    
    return success(res, transactions);
  } catch (err) {
    next(err);
  }
};

/**
 * Get transaction by ID
 */
const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findByPk(id, {
      include: [{ model: Account, as: 'account' }]
    });
    
    if (!transaction) {
      return notFound(res, 'Transaction not found');
    }
    
    return success(res, transaction);
  } catch (err) {
    next(err);
  }
};

/**
 * Create a new transaction
 */
const create = async (req, res, next) => {
  try {
    const validationErrors = validateTransaction(req.body);
    if (validationErrors.length > 0) {
      return error(res, validationErrors.join(', '));
    }
    
    // Verify account exists
    const account = await Account.findByPk(req.body.accountId);
    if (!account) {
      return notFound(res, 'Account not found');
    }
    
    // Create transaction
    const transaction = await Transaction.create({
      ...req.body,
      transactionDate: req.body.transactionDate || new Date()
    });
    
    // Update account balance based on transaction type
    let balanceChange = parseFloat(req.body.amount);
    if (['withdrawal', 'purchase', 'service'].includes(req.body.type)) {
      balanceChange = -balanceChange;
    }
    
    await account.update({
      balance: parseFloat(account.balance) + balanceChange
    });
    
    return created(res, transaction, 'Transaction created successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Get recent transactions for an account
 */
const getRecent = async (req, res, next) => {
  try {
    const { accountId } = req.params;
    const { limit = 5 } = req.query;
    
    const transactions = await Transaction.findAll({
      where: { accountId },
      order: [['transactionDate', 'DESC']],
      limit: parseInt(limit)
    });
    
    return success(res, transactions);
  } catch (err) {
    next(err);
  }
};

/**
 * Get weekly activity (deposits and withdrawals by day)
 */
const getWeeklyActivity = async (req, res, next) => {
  try {
    const { accountId } = req.query;
    
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const where = {
      transactionDate: { [Op.gte]: startOfWeek }
    };
    if (accountId) where.accountId = accountId;
    
    const transactions = await Transaction.findAll({ where });
    
    // Group by day of week
    const days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
    const activity = days.map(day => ({
      day,
      deposits: 0,
      withdrawals: 0
    }));
    
    transactions.forEach(tx => {
      const dayIndex = new Date(tx.transactionDate).getDay();
      if (tx.type === 'deposit') {
        activity[dayIndex].deposits += parseFloat(tx.amount);
      } else {
        activity[dayIndex].withdrawals += Math.abs(parseFloat(tx.amount));
      }
    });
    
    return success(res, activity);
  } catch (err) {
    next(err);
  }
};

/**
 * Get expense statistics by category
 */
const getExpensesByCategory = async (req, res, next) => {
  try {
    const { accountId } = req.query;
    
    const where = {
      type: { [Op.in]: ['withdrawal', 'purchase', 'service'] }
    };
    if (accountId) where.accountId = accountId;
    
    const transactions = await Transaction.findAll({ where });
    
    // Group by category
    const categories = {
      entertainment: { label: 'Entretenimiento', amount: 0, color: '#3B5BDB' },
      bills: { label: 'Facturas', amount: 0, color: '#FFA94D' },
      investment: { label: 'Inversión', amount: 0, color: '#5C7CFA' },
      other: { label: 'Otros', amount: 0, color: '#20C997' }
    };
    
    let total = 0;
    transactions.forEach(tx => {
      const amount = Math.abs(parseFloat(tx.amount));
      total += amount;
      if (categories[tx.category]) {
        categories[tx.category].amount += amount;
      } else {
        categories.other.amount += amount;
      }
    });
    
    // Calculate percentages
    const result = Object.entries(categories).map(([key, value]) => ({
      category: key,
      label: value.label,
      amount: value.amount,
      percentage: total > 0 ? Math.round((value.amount / total) * 100) : 0,
      color: value.color
    }));
    
    return success(res, result);
  } catch (err) {
    next(err);
  }
};

/**
 * Get monthly balance history
 */
const getBalanceHistory = async (req, res, next) => {
  try {
    const { accountId, months = 6 } = req.query;
    
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - parseInt(months));
    
    const where = {
      transactionDate: {
        [Op.between]: [startDate, endDate]
      }
    };
    if (accountId) where.accountId = accountId;
    
    const transactions = await Transaction.findAll({
      where,
      order: [['transactionDate', 'ASC']]
    });
    
    // Group by month
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const history = {};
    
    transactions.forEach(tx => {
      const date = new Date(tx.transactionDate);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      const monthLabel = monthNames[date.getMonth()];
      
      if (!history[monthKey]) {
        history[monthKey] = { month: monthLabel, balance: 0 };
      }
      
      if (tx.type === 'deposit') {
        history[monthKey].balance += parseFloat(tx.amount);
      } else {
        history[monthKey].balance -= Math.abs(parseFloat(tx.amount));
      }
    });
    
    // Convert to array and accumulate running balance
    let runningBalance = 0;
    const result = Object.values(history).map(item => {
      runningBalance += item.balance;
      return { ...item, balance: runningBalance };
    });
    
    return success(res, result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  getRecent,
  getWeeklyActivity,
  getExpensesByCategory,
  getBalanceHistory
};
