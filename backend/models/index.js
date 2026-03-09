const sequelize = require('../config/db');
const Client = require('./client');
const Account = require('./account');
const Transaction = require('./transaction');
const ScheduledPayment = require('./scheduled-payment');
const Contact = require('./contact');

// Define associations

// Client has many Accounts
Client.hasMany(Account, {
  foreignKey: 'clientId',
  as: 'accounts'
});
Account.belongsTo(Client, {
  foreignKey: 'clientId',
  as: 'client'
});

// Account has many Transactions
Account.hasMany(Transaction, {
  foreignKey: 'accountId',
  as: 'transactions'
});
Transaction.belongsTo(Account, {
  foreignKey: 'accountId',
  as: 'account'
});

// Account has many Scheduled Payments
Account.hasMany(ScheduledPayment, {
  foreignKey: 'accountId',
  as: 'scheduledPayments'
});
ScheduledPayment.belongsTo(Account, {
  foreignKey: 'accountId',
  as: 'account'
});

// Client has many Contacts
Client.hasMany(Contact, {
  foreignKey: 'clientId',
  as: 'contacts'
});
Contact.belongsTo(Client, {
  foreignKey: 'clientId',
  as: 'client'
});

module.exports = {
  sequelize,
  Client,
  Account,
  Transaction,
  ScheduledPayment,
  Contact
};
