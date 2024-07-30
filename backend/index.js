const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models'); 
const financialRecords = require('./routes/financialRecords');
const userRoutes = require('./routes/user');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', financialRecords);
app.use('/api', userRoutes);

const PORT = process.env.PORT || 3010;

sequelize.authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
module.exports =app
