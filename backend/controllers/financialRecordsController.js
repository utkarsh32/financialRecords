const { FinancialRecord, User } = require('../models');

const getFinancialRecords = async (req, res) => {
  try {
    const financialRecords = await FinancialRecord.findAll({
      where: { userId: req.user.id }
    });
    res.json(financialRecords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve financial records' });
  }
};

const createFinancialRecord = async (req, res) => {
  const { description, amount, date } = req.body;
  try {
    const financialRecord = await FinancialRecord.create({
      description,
      amount,
      date,
      userId: req.user.id
    });
    res.status(201).json(financialRecord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create financial record' });
  }
};

const updateFinancialRecord = async (req, res) => {
  const { id } = req.params;
  const { description, amount, date } = req.body;
  try {
    const financialRecord = await FinancialRecord.findOne({
      where: { id, userId: req.user.id }
    });
    if (!financialRecord) {
      return res.status(404).json({ error: 'Financial record not found' });
    }

    financialRecord.description = description;
    financialRecord.amount = amount;
    financialRecord.date = date;
    await financialRecord.save();

    res.json(financialRecord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update financial record' });
  }
};

const deleteFinancialRecord = async (req, res) => {
  const { id } = req.params;
  try {
    const financialRecord = await FinancialRecord.findOne({
      where: { id, userId: req.user.id }
    });
    if (!financialRecord) {
      return res.status(404).json({ error: 'Financial record not found' });
    }

    await financialRecord.destroy();
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete financial record' });
  }
};

module.exports = {
  getFinancialRecords,
  createFinancialRecord,
  updateFinancialRecord,
  deleteFinancialRecord
};
