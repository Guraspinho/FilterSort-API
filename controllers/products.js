const Product = require('../models/product');



const getAllProductsStatic = async (req,res) =>
{
    const products = await Product.find({});
    res.status(200).json({products, nbHits:products.length})
}




const getAllProducts = async (req,res) =>
{
    const
    {
        featured,
        company,
        name,
        sort,
        fields,
        numericFilters
    } = req.query;

    const queryObject = {};

    // Checks if the item is featured or not

    if(featured)
    {
        queryObject.featured = featured === 'true' ? true : false;
    }

    if(company)
    {
        queryObject.company = company;
    }

    // Looks for all the names that contain specific letter.    

    if(name)
    {
        queryObject.name = { $regex: name, $options: 'i'};
    }

    // filters data based on numeric values

    if (numericFilters)
    {
       // Defines a mapping between comparison operators and MongoDB equivalents
       const operatorMap = 
       {
           '>': '$gt',
           '>=': '$gte',
           '=': '$eq',
           '<': '$lt',
           '<=': '$lte',
       };
   
       // Defines a regular expression to match comparison operators

       const regEx = /\b(<|>|>=|=|<|<=)\b/g;
   
       // Replaces matched operators in the numericFilters string with their MongoDB equivalents

       let filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`);

       const options = ['price','rating'];
       filters = filters.split(',').forEach( (item) =>
       {
           const [field,operator,value] = item.split('-');
           
           if(options.includes(field))
           {
              queryObject[field] = {[operator] : +value};
           }
       });
   
       
   }
   console.log(queryObject);

    // Sorts data 

    let result = Product.find(queryObject);
    if(sort)
    {
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList);
    }
    else
    {
        result = result.sort('createdAt')
    }

    // Shows only the field that user requests like only name or name and price 

    if(fields)
    {
        const fieldList = fields.split(',').join(' ');
        result = result.select(fieldList);
    }
    


    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;  // Limiting data shown to 10(By default);
    const skip = (page-1) * limit;

    result = result.skip(skip).limit(limit);

    // Skip items for example if i have limit 4 and page 4 the first 4 will be skipped and the other 4 will be shown.


    const products = await result;
    res.status(200).json({products, nbHits:products.length});
}


module.exports =
{
    getAllProductsStatic,
    getAllProducts
}