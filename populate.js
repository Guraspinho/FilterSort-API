require('dotenv').config();

const connectDB = require('./db/connect');
const Products = require('./models/product');

const jsonProducts = require('./products.json');

const start = async () =>
{
    try
    {
        await connectDB(process.env.MONGO_URI);
        console.log('Connected to the DB...');
        await Products.deleteMany();
        await Products.create(jsonProducts)
        console.log('Interacted with a DB');
        process.exit(0);
        
    }
    catch (error)
    {
        console.log(error);
        process.exit(1);
    }

}

start();