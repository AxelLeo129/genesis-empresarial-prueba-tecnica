const { Client, Account, Contact } = require('../models');
const { success, created, notFound, error } = require('../utils/response');
const { validateClient } = require('../utils/validators');

/**
 * Get all clients
 */
const getAll = async (req, res, next) => {
  try {
    const clients = await Client.findAll({
      include: [
        { model: Account, as: 'accounts' },
        { model: Contact, as: 'contacts' }
      ],
      order: [['createdAt', 'DESC']]
    });
    return success(res, clients);
  } catch (err) {
    next(err);
  }
};

/**
 * Get client by ID
 */
const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const client = await Client.findByPk(id, {
      include: [
        { model: Account, as: 'accounts' },
        { model: Contact, as: 'contacts' }
      ]
    });
    
    if (!client) {
      return notFound(res, 'Client not found');
    }
    
    return success(res, client);
  } catch (err) {
    next(err);
  }
};

/**
 * Create a new client
 */
const create = async (req, res, next) => {
  try {
    const validationErrors = validateClient(req.body);
    if (validationErrors.length > 0) {
      return error(res, validationErrors.join(', '));
    }
    
    const client = await Client.create(req.body);
    return created(res, client, 'Client created successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Update a client
 */
const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const client = await Client.findByPk(id);
    
    if (!client) {
      return notFound(res, 'Client not found');
    }
    
    await client.update(req.body);
    return success(res, client, 'Client updated successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a client
 */
const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const client = await Client.findByPk(id);
    
    if (!client) {
      return notFound(res, 'Client not found');
    }
    
    await client.destroy();
    return success(res, null, 'Client deleted successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
