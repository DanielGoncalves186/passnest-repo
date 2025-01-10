const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express();
const authRouters = require('./routes/authenticationRoute.js')
const noteRouters = require('./routes/noteRoute.js')


require('dotenv').config()

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())
app.use('/auth', authRouters);
app.use('/notes', noteRouters);



app.listen(8080, () => {
    console.log('Express started at http://localhost:8080')
})

