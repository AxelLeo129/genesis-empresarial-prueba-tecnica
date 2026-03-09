const axios = require('axios');
const { success, error } = require('../utils/response');

const USERS_URL = 'https://jsonplaceholder.typicode.com/users';
const TODOS_URL = 'https://jsonplaceholder.typicode.com/todos';

/**
 * Get merged data from external APIs
 * Combines users with their todos as per Part 2 requirement
 * 
 * Returns format:
 * [
 *   {
 *     "user": "Leanne Graham",
 *     "email": "Sincere@april.biz",
 *     "id": 1,
 *     "title": "delectus aut autem",
 *     "completed": false
 *   },
 *   ...
 * ]
 */
const getMergedData = async (req, res, next) => {
  try {
    // Fetch both APIs in parallel for better performance
    const [usersResponse, todosResponse] = await Promise.all([
      axios.get(USERS_URL),
      axios.get(TODOS_URL)
    ]);
    
    const users = usersResponse.data;
    const todos = todosResponse.data;
    
    // Validate responses
    if (!Array.isArray(users) || !Array.isArray(todos)) {
      return error(res, 'Invalid response from external APIs', 502);
    }
    
    // Create a map of users by ID for efficient lookup
    const usersMap = new Map();
    users.forEach(user => {
      usersMap.set(user.id, {
        name: user.name,
        email: user.email
      });
    });
    
    // Transform todos with user information
    const mergedData = todos.map(todo => {
      const user = usersMap.get(todo.userId);
      
      return {
        user: user ? user.name : 'Unknown User',
        email: user ? user.email : '',
        id: todo.id,
        title: todo.title,
        completed: todo.completed
      };
    });
    
    return success(res, mergedData, 'Data fetched and merged successfully');
  } catch (err) {
    console.error('Error fetching external APIs:', err.message);
    
    if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
      return error(res, 'Unable to connect to external services', 503);
    }
    
    if (err.response) {
      return error(res, `External API error: ${err.response.status}`, 502);
    }
    
    next(err);
  }
};

/**
 * Get users only
 */
const getUsers = async (req, res, next) => {
  try {
    const response = await axios.get(USERS_URL);
    return success(res, response.data);
  } catch (err) {
    console.error('Error fetching users:', err.message);
    return error(res, 'Unable to fetch users from external API', 502);
  }
};

/**
 * Get todos only
 */
const getTodos = async (req, res, next) => {
  try {
    const response = await axios.get(TODOS_URL);
    return success(res, response.data);
  } catch (err) {
    console.error('Error fetching todos:', err.message);
    return error(res, 'Unable to fetch todos from external API', 502);
  }
};

/**
 * Get todos for a specific user
 */
const getTodosByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    const [userResponse, todosResponse] = await Promise.all([
      axios.get(`${USERS_URL}/${userId}`),
      axios.get(`${TODOS_URL}?userId=${userId}`)
    ]);
    
    const user = userResponse.data;
    const todos = todosResponse.data;
    
    const result = todos.map(todo => ({
      user: user.name,
      email: user.email,
      id: todo.id,
      title: todo.title,
      completed: todo.completed
    }));
    
    return success(res, result);
  } catch (err) {
    if (err.response?.status === 404) {
      return error(res, 'User not found', 404);
    }
    console.error('Error fetching user todos:', err.message);
    return error(res, 'Unable to fetch data from external API', 502);
  }
};

module.exports = {
  getMergedData,
  getUsers,
  getTodos,
  getTodosByUser
};
