const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  accountId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'account_id',
    references: {
      model: 'accounts',
      key: 'id'
    }
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('deposit', 'withdrawal', 'purchase', 'service', 'transfer'),
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('entertainment', 'bills', 'investment', 'other', 'income'),
    allowNull: false,
    defaultValue: 'other'
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed'),
    allowNull: false,
    defaultValue: 'completed'
  },
  recipientCard: {
    type: DataTypes.STRING(16),
    allowNull: true,
    field: 'recipient_card'
  },
  recipientName: {
    type: DataTypes.STRING(150),
    allowNull: true,
    field: 'recipient_name'
  },
  transactionDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'transaction_date'
  }
}, {
  tableName: 'transactions',
  timestamps: true
});

module.exports = Transaction;
