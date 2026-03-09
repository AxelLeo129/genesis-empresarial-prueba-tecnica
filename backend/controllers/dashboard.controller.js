const { Client, Account, Transaction, ScheduledPayment, Contact } = require('../models');
const { Op } = require('sequelize');
const { success } = require('../utils/response');

/**
 * Get complete dashboard data for home page
 */
const getHomeData = async (req, res, next) => {
  try {
    const { clientId } = req.query;
    
    // Get client with accounts
    const client = clientId 
      ? await Client.findByPk(clientId, {
          include: [
            { model: Account, as: 'accounts' },
            { model: Contact, as: 'contacts' }
          ]
        })
      : await Client.findOne({
          include: [
            { model: Account, as: 'accounts' },
            { model: Contact, as: 'contacts' }
          ]
        });
    
    if (!client) {
      return success(res, { cards: [], recentTransactions: [], contacts: [] });
    }
    
    // Get recent transactions across all accounts
    const accountIds = client.accounts.map(a => a.id);
    const recentTransactions = await Transaction.findAll({
      where: { accountId: { [Op.in]: accountIds } },
      order: [['transactionDate', 'DESC']],
      limit: 5
    });
    
    // Get weekly activity
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - 7);
    
    const weeklyTransactions = await Transaction.findAll({
      where: {
        accountId: { [Op.in]: accountIds },
        transactionDate: { [Op.gte]: startOfWeek }
      }
    });
    
    const days = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
    const weeklyActivity = days.map(day => ({ day, deposits: 0, withdrawals: 0 }));
    
    weeklyTransactions.forEach(tx => {
      let dayIndex = new Date(tx.transactionDate).getDay();
      dayIndex = dayIndex === 0 ? 6 : dayIndex - 1; // Convert to Monday-based
      
      if (tx.type === 'deposit') {
        weeklyActivity[dayIndex].deposits += parseFloat(tx.amount);
      } else {
        weeklyActivity[dayIndex].withdrawals += Math.abs(parseFloat(tx.amount));
      }
    });
    
    // Get expense statistics
    const expenseTransactions = await Transaction.findAll({
      where: {
        accountId: { [Op.in]: accountIds },
        type: { [Op.in]: ['withdrawal', 'purchase', 'service'] }
      }
    });
    
    const categories = {
      entertainment: { label: 'Entretenimiento', amount: 0, percentage: 30 },
      bills: { label: 'Facturas', amount: 0, percentage: 15 },
      investment: { label: 'Inversión', amount: 0, percentage: 20 },
      other: { label: 'Otros', amount: 0, percentage: 35 }
    };
    
    let totalExpenses = 0;
    expenseTransactions.forEach(tx => {
      const amount = Math.abs(parseFloat(tx.amount));
      totalExpenses += amount;
      if (categories[tx.category]) {
        categories[tx.category].amount += amount;
      } else {
        categories.other.amount += amount;
      }
    });
    
    Object.keys(categories).forEach(key => {
      categories[key].percentage = totalExpenses > 0 
        ? Math.round((categories[key].amount / totalExpenses) * 100)
        : 0;
    });
    
    // Get balance history (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyTransactions = await Transaction.findAll({
      where: {
        accountId: { [Op.in]: accountIds },
        transactionDate: { [Op.gte]: sixMonthsAgo }
      },
      order: [['transactionDate', 'ASC']]
    });
    
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const balanceHistory = [];
    const monthlyData = {};
    
    monthlyTransactions.forEach(tx => {
      const date = new Date(tx.transactionDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthNames[date.getMonth()],
          balance: 0
        };
      }
      
      if (tx.type === 'deposit') {
        monthlyData[monthKey].balance += parseFloat(tx.amount);
      } else {
        monthlyData[monthKey].balance -= Math.abs(parseFloat(tx.amount));
      }
    });
    
    let runningBalance = client.accounts.reduce((sum, acc) => sum + parseFloat(acc.balance), 0) * 0.5;
    Object.keys(monthlyData).sort().forEach(key => {
      runningBalance += monthlyData[key].balance;
      balanceHistory.push({
        month: monthlyData[key].month,
        balance: Math.max(0, runningBalance)
      });
    });
    
    return success(res, {
      client: {
        id: client.id,
        name: `${client.firstName} ${client.lastName}`,
        avatar: client.avatarUrl
      },
      cards: client.accounts.map(acc => ({
        id: acc.id,
        balance: parseFloat(acc.balance),
        holderName: acc.holderName,
        cardNumber: acc.cardNumber,
        expirationDate: acc.expirationDate,
        cardType: acc.cardType
      })),
      recentTransactions: recentTransactions.map(tx => ({
        id: tx.id,
        description: tx.description,
        type: tx.type,
        amount: parseFloat(tx.amount),
        date: tx.transactionDate,
        status: tx.status
      })),
      weeklyActivity,
      expenseStats: Object.values(categories),
      contacts: client.contacts.map(c => ({
        id: c.id,
        name: c.name,
        relationship: c.relationship,
        avatar: c.avatarUrl
      })),
      balanceHistory
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get accounts page data with summary
 */
const getAccountsData = async (req, res, next) => {
  try {
    const { clientId } = req.query;
    
    const client = clientId
      ? await Client.findByPk(clientId, { include: [{ model: Account, as: 'accounts' }] })
      : await Client.findOne({ include: [{ model: Account, as: 'accounts' }] });
    
    if (!client) {
      return success(res, { summary: {}, transactions: [], card: null, scheduledPayments: [] });
    }
    
    const accountIds = client.accounts.map(a => a.id);
    
    // Summary statistics
    const allTransactions = await Transaction.findAll({
      where: { accountId: { [Op.in]: accountIds } }
    });
    
    let totalIncome = 0;
    let totalExpenses = 0;
    
    allTransactions.forEach(tx => {
      if (tx.type === 'deposit') {
        totalIncome += parseFloat(tx.amount);
      } else {
        totalExpenses += Math.abs(parseFloat(tx.amount));
      }
    });
    
    const totalBalance = client.accounts.reduce((sum, acc) => sum + parseFloat(acc.balance), 0);
    const totalSavings = totalIncome - totalExpenses;
    
    // Recent transactions with details
    const recentTransactions = await Transaction.findAll({
      where: { accountId: { [Op.in]: accountIds } },
      include: [{ model: Account, as: 'account' }],
      order: [['transactionDate', 'DESC']],
      limit: 10
    });
    
    // Monthly credit/debit summary
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyTransactions = await Transaction.findAll({
      where: {
        accountId: { [Op.in]: accountIds },
        transactionDate: { [Op.gte]: sixMonthsAgo }
      }
    });
    
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const monthlyData = {};
    
    monthlyTransactions.forEach(tx => {
      const date = new Date(tx.transactionDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthNames[date.getMonth()],
          credit: 0,
          debit: 0
        };
      }
      
      if (tx.type === 'deposit') {
        monthlyData[monthKey].credit += parseFloat(tx.amount);
      } else {
        monthlyData[monthKey].debit += Math.abs(parseFloat(tx.amount));
      }
    });
    
    const creditDebitSummary = Object.keys(monthlyData).sort().map(key => monthlyData[key]);
    
    // Scheduled payments
    const scheduledPayments = await ScheduledPayment.findAll({
      where: { accountId: { [Op.in]: accountIds }, isActive: true },
      order: [['scheduledDate', 'ASC']],
      limit: 5
    });
    
    // Primary card
    const primaryCard = client.accounts[0];
    
    return success(res, {
      summary: {
        totalBalance,
        totalIncome,
        totalExpenses,
        totalSavings: Math.max(0, totalSavings)
      },
      transactions: recentTransactions.map(tx => ({
        id: tx.id,
        description: tx.description,
        date: tx.transactionDate,
        type: tx.type,
        cardNumber: tx.account?.cardNumber || '',
        status: tx.status,
        amount: parseFloat(tx.amount)
      })),
      card: primaryCard ? {
        id: primaryCard.id,
        balance: parseFloat(primaryCard.balance),
        holderName: primaryCard.holderName,
        cardNumber: primaryCard.cardNumber,
        expirationDate: primaryCard.expirationDate
      } : null,
      creditDebitSummary,
      scheduledPayments: scheduledPayments.map(sp => ({
        id: sp.id,
        description: sp.description,
        amount: parseFloat(sp.amount),
        date: sp.scheduledDate,
        icon: sp.icon
      }))
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getHomeData,
  getAccountsData
};
