const express = require('express');
const cors = require('cors');
// const db = require('./config/database');

const app = express();

// ==> Rotas da API:
const index = require('./routes/index');
const login = require('./routes/login.routes');
const basicTableRoute = require('./routes/basictable.routes');
const userGroupRoute = require('./routes/usergroup.routes');
const reportGroupRoute = require('./routes/reportgroup.routes');
// const posProjectRoute = require('./routes/posproject.routes');
// const profileFeatureRoute = require('./routes/profilefeature');
// const dashboardRoute = require('./routes/dashboard.routes');

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
// app.use('/api/', posProjectRoute);
// app.use('/api/', dashboardRoute);
// app.use('/api/', profileFeatureRoute);


global.aTableStructure = 'teste';

module.exports = app;
