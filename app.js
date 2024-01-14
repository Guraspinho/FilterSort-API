require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();
const notFound = require('./middleware/not-found');
const errorHandler = require('./middleware/error-handler');
const connectDB = require('./db/connect');
const router = require('./routes/products');




// middlewares

app.use(express.json());

//routes


app.get('/', (req,res) =>
{
    res.send('<h3>Home Page<h3/> <a href="/api/v1/products">Products page<a/>');
})


app.use('/api/v1/products', router)

// error and not found

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;


const start = async () =>
{
    try
    {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, console.log(`Server listening on port ${port}...`));
    }
    catch (error)
    {
        console.log(error);
    }
}
start();