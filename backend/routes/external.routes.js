const router = require('express').Router();
const externalController = require('../controllers/external.controller');

// GET /api/external/merged-data - Get merged users and todos (Part 2 requirement)
router.get('/merged-data', externalController.getMergedData);

// GET /api/external/users - Get all users
router.get('/users', externalController.getUsers);

// GET /api/external/todos - Get all todos
router.get('/todos', externalController.getTodos);

// GET /api/external/users/:userId/todos - Get todos for a specific user
router.get('/users/:userId/todos', externalController.getTodosByUser);

module.exports = router;
