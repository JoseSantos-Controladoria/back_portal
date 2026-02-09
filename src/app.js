const express = require('express');
const cors = require('cors');
// const db = require('./config/database');

const app = express();

const index = require('./routes/index');
const login = require('./routes/login.routes');
const basicTableRoute = require('./routes/basictable.routes');
const userGroupRoute = require('./routes/usergroup.routes');
const reportGroupRoute = require('./routes/reportgroup.routes');
const reportRoute = require('./routes/report.routes'); 
const logRoute = require('./routes/log.routes');
const customerRoute = require('./routes/customer.routes');


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.json({ type: 'application/vnd.api+json' }));
app.use(cors());

app.use(index);
app.use('/api', index);
app.use('/api/', login);
app.use('/api/', basicTableRoute);
app.use('/api/', userGroupRoute);
app.use('/api/', reportGroupRoute);
app.use('/api/', reportRoute);
app.use('/api/', customerRoute);


app.use('/api/', logRoute);

global.aTableStructure = 'teste';

module.exports = app;