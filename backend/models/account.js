const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Account = sequelize.define('Account', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'client_id',
    references: {
      model: 'clients',
      key: 'id'
    }
  },
  cardNumber: {
    type: DataTypes.STRING(16),
    allowNull: false,
    unique: true,
    field: 'card_number'
  },
  balance: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  holderName: {
    type: DataTypes.STRING(150),
    allowNull: false,
    field: 'holder_name'
  },
  expirationDate: {
    type: DataTypes.STRING(5),
    allowNull: false,
    field: 'expiration_date'
  },
  cardType: {
    type: DataTypes.ENUM('credit', 'debit'),
    allowNull: false,
    defaultValue: 'debit',
    field: 'card_type'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active'
  }
}, {
  tableName: 'accounts',
  timestamps: true
});

module.exports = Account;
