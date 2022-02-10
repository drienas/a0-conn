if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

if (!process.env.MONGO_DB) {
  console.error(`No MongoDB variable set.`);
  process.exit(0);
}

const MONGO_DB = process.env.MONGO_DB;
const mongoUrl = `${MONGO_DB}/auth`;

const app = express();
app.use(cors());
app.use(bodyParser.json());

const { verifyUser } = require('./User');

app.post('/login', (req, res) => {
  let body = req.body;
  let email = body.email;
  let tpw = body.password;
  verifyUser(email, tpw)
    .then(({ valid, data }) => {
      if (valid) {
        res.status(200).json({
          success: true,
          data: {
            username: data.username,
            id: data._id,
            fullName: data.fullName,
          },
        });
      } else {
        res.status(401).send({
          success: false,
          message: 'Fehlerhafte Login-Daten',
        });
      }
    })
    .catch((err) => res.json(err));
});

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

mongoose.connection.on('error', (err) => {
  console.error(err);
  process.exit(0);
});

mongoose.connection.on('disconnected', (msg) => {
  console.error(msg);
  process.exit(0);
});

mongoose.connection.on('connected', async (err) => {
  console.log(`Connceted to MongoDB`);
  app.listen(3334, () => console.log(`App runnning on port 3334`));
});
