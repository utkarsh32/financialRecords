const express = require('express');
const router = express.Router();
const financialRecordsController = require('../controllers/financialRecordsController');
const {authenticateToken} = require('../middlewares/auth');

router.post('/financial-records',authenticateToken, financialRecordsController.createFinancialRecord);
router.get('/financial-records',authenticateToken, financialRecordsController.getFinancialRecords);
router.put('/financial-records/:id',authenticateToken, financialRecordsController.updateFinancialRecord);
router.delete('/financial-records/:id',authenticateToken, financialRecordsController.deleteFinancialRecord);

module.exports = router;

