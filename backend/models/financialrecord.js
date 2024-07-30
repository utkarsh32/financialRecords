'use strict';
module.exports = (sequelize, DataTypes) => {
  const FinancialRecord = sequelize.define('FinancialRecord', {
    description: DataTypes.STRING,
    amount: DataTypes.FLOAT,
    date: DataTypes.DATE,
  }, {});

  FinancialRecord.associate = function(models) {
    FinancialRecord.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };
  
  return FinancialRecord;
};
