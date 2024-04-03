const express = require('express');

const jwt = require('jsonwebtoken');

const router = express.Router();

const expenseAdmin = require('../controllers/expenseAdmin');

router.post('/add-expense',expenseAdmin.authenticate,expenseAdmin.postAddExpense);

router.post('/get-expense',expenseAdmin.authenticate,expenseAdmin.getExpense);

router.get('/delete-expense/:id',expenseAdmin.authenticate,expenseAdmin.getDeleteExpense);

router.get('/download-report',expenseAdmin.authenticate,expenseAdmin.getDownloadLink);

router.get('/download-history',expenseAdmin.authenticate,expenseAdmin.getDownloadHistory);

module.exports = router;