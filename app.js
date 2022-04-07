require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();
app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));

app.use(express.json());

// Logic goes here

module.exports = app;
