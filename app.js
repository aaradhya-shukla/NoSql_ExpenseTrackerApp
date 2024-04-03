const express = require('express');

require('dotenv').config();

const bodyParser = require('body-parser');

var cors = require('cors');

const helmet = require('helmet');

const morgan = require('morgan');

const fs = require('fs');

const signUp = require('./routes/signUp');

const expenseManager = require('./routes/expense');

const razorpayHandler = require('./routes/purchase');

const passwordManager = require('./routes/passwordReset');

const path = require('path');

const app = express();

const mongoose = require('mongoose');

const accessLogStream = fs.createWriteStream(path.join(__dirname,'access.logs'),{flags:'a'});

app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", 'data:', 'blob:'],
 
      fontSrc: ["'self'", 'https:', 'data:'],

      scriptSrc: ["'self'", 'unsafe-inline'],
 
      scriptSrc: ["'self'", 'https://*.cloudflare.com'],
 
      scriptSrcElem: ["'self'",'https:', 'https://*.cloudflare.com'],
 
      styleSrc: ["'self'", 'https:', 'unsafe-inline'],
 
      connectSrc: ["'self'", 'data', 'https://*.cloudflare.com']
    },
  }));

app.use(morgan('combined',{stream:accessLogStream}));

app.use(bodyParser.json());

app.use(cors());

app.use('/user',signUp);

app.use('/expense',expenseManager);

app.use('/purchase',razorpayHandler)

app.use('/password',passwordManager);

const { expressCspHeader, INLINE, NONE, SELF } = require('express-csp-header')
// other app.use() options ...
app.use(expressCspHeader({ 
    policies: { 
        'default-src': [expressCspHeader.NONE], 
        'img-src': [expressCspHeader.SELF], 
    } 
})); 

app.use((req,res)=>{
    res.sendFile(path.join(__dirname,`public/${req.url}`))
})
mongoose.connect('mongodb+srv://aaradhya:az75yvTFpQm9TAMM@aaradhya.mwglytc.mongodb.net/Expense_Tracker_App?retryWrites=true&w=majority&appName=Aaradhya')
.then(result =>{
    console.log('connected with mongoose');
    app.listen(3000);
})