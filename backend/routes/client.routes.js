const router = require('express').Router();
const clientController = require('../controllers/client.controller');

// GET /api/clients - Get all clients
router.get('/', clientController.getAll);

// GET /api/clients/:id - Get client by ID
router.get('/:id', clientController.getById);

// POST /api/clients - Create a new client
router.post('/', clientController.create);

// PUT /api/clients/:id - Update a client
router.put('/:id', clientController.update);

// DELETE /api/clients/:id - Delete a client
router.delete('/:id', clientController.remove);

module.exports = router;
