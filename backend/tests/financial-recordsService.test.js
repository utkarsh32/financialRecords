const { getFinancialRecords, createFinancialRecord, updateFinancialRecord, deleteFinancialRecord } = 
require('../controllers/financialRecordsController');
const { FinancialRecord } = require('../models');

jest.mock('../models');

describe('FinancialRecords Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { id: 1 },
      body: {},
      params: {},
      headers: {}
    };
    res = {
      json: jest.fn().mockReturnValue(res),
      status: jest.fn().mockReturnValue(res),
      send: jest.fn().mockReturnValue(res)
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getFinancialRecords', () => {
    it('should return all financial records for the user', async () => {
      const financialRecords = [
        { id: 1, description: 'Test 1', amount: 100, date: '2024-07-28', userId: 1 },
        { id: 2, description: 'Test 2', amount: 200, date: '2024-07-29', userId: 1 },
      ];
      FinancialRecord.findAll.mockResolvedValue(financialRecords);

      try {
        await getFinancialRecords(req, res);
        expect(FinancialRecord.findAll).toHaveBeenCalledWith({ where: { userId: req.user.id } });
        expect(res.json).toHaveBeenCalledWith(financialRecords);
      } catch (error) {
        console.error(error);
      }
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to retrieve financial records');
      FinancialRecord.findAll.mockRejectedValue(error);

      try {
        await getFinancialRecords(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Failed to retrieve financial records' });
      } catch (error) {
        console.error(error);
      }
    });
  });

  describe('createFinancialRecord', () => {
    it('should create a new financial record', async () => {
      const newRecord = { id: 3, description: 'Test 3', amount: 300, date: '2024-07-30', userId: 1 };
      req.body = { description: 'Test 3', amount: 300, date: '2024-07-30' };
      FinancialRecord.create.mockResolvedValue(newRecord);

      try {
        await createFinancialRecord(req, res);
        expect(FinancialRecord.create).toHaveBeenCalledWith({ ...req.body, userId: req.user.id });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(newRecord);
      } catch (error) {
        console.error(error);
      }
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to create financial record');
      FinancialRecord.create.mockRejectedValue(error);

      try {
        await createFinancialRecord(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Failed to create financial record' });
      } catch (error) {
        console.error(error);
      }
    });
  });

  describe('updateFinancialRecord', () => {
    it('should update an existing financial record', async () => {
      const existingRecord = { id: 1, description: 'Test 1', amount: 100, date: '2024-07-28', userId: 1 };
      const updatedRecord = { id: 1, description: 'Updated Test 1', amount: 150, date: '2024-08-01', userId: 1 };
      req.params.id = 1;
      req.body = { description: 'Updated Test 1', amount: 150, date: '2024-08-01' };

      FinancialRecord.findOne.mockResolvedValue(existingRecord);
      existingRecord.save = jest.fn().mockResolvedValue(updatedRecord);

      try {
        await updateFinancialRecord(req, res);
        expect(FinancialRecord.findOne).toHaveBeenCalledWith({ where: { id: req.params.id, userId: req.user.id } });
        expect(existingRecord.save).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(updatedRecord);
      } catch (error) {
        console.error(error);
      }
    });

    it('should return 404 if the financial record does not exist', async () => {
      req.params.id = 1;
      FinancialRecord.findOne.mockResolvedValue(null);

      try {
        await updateFinancialRecord(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Financial record not found' });
      } catch (error) {
        console.error(error);
      }
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to update financial record');
      FinancialRecord.findOne.mockRejectedValue(error);

      try {
        await updateFinancialRecord(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Failed to update financial record' });
      } catch (error) {
        console.error(error);
      }
    });
  });

  describe('deleteFinancialRecord', () => {
    it('should delete a financial record', async () => {
      const existingRecord = { id: 1, description: 'Test 1', amount: 100, date: '2024-07-28', userId: 1 };
      req.params.id = 1;

      FinancialRecord.findOne.mockResolvedValue(existingRecord);
      existingRecord.destroy = jest.fn().mockResolvedValue();

      try {
        await deleteFinancialRecord(req, res);
        expect(FinancialRecord.findOne).toHaveBeenCalledWith({ where: { id: req.params.id, userId: req.user.id } });
        expect(existingRecord.destroy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(204);
      } catch (error) {
        console.error(error);
      }
    });

    it('should return 404 if the financial record does not exist', async () => {
      req.params.id = 1;
      FinancialRecord.findOne.mockResolvedValue(null);

      try {
        await deleteFinancialRecord(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Financial record not found' });
      } catch (error) {
        console.error(error);
      }
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to delete financial record');
      FinancialRecord.findOne.mockRejectedValue(error);

      try {
        await deleteFinancialRecord(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Failed to delete financial record' });
      } catch (error) {
        console.error(error);
      }
    });
  });
});
