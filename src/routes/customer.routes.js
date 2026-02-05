// src/routes/customer.routes.js
const router = require('express-promise-router')();
const verifyAuthorization = require('../config/middleware');
const customerController = require('../controllers/customer.controller');

// A rota final será /api/customers (pois o app.js monta em /api)
router.get('/customers', verifyAuthorization, customerController.getCustomers);

module.exports = router;