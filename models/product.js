const mongoose = require('mongoose');


const schema = new mongoose.Schema(
    {
        name: 
        {
            type: String,
            required: [true,'You must provide product name']
        },

        price: 
        {
            type: Number,
            required: [true,'You must provide product price']
        },

        featured: 
        {
            type: Boolean,
            default: false
        },

        rating:
        {
            type: Number,
            default: 4.5
        },

        createdAt:
        {
            type: Date,
            default: Date.now()
        },

        company:
        {
            type: String,
            enum:
            {
                values: ['ikea','liddy','caressa','marcos']
            },
            message: '{VALUE} is not supported'

            
        },
    }
)

module.exports = mongoose.model('Product',schema);