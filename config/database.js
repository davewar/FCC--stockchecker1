const mongoose = require('mongoose');
require('dotenv').config();


const conn = process.env.MONGO_URI;

const connection = mongoose.createConnection(conn,{
  useNewUrlParser: true,       // surpress warning messages
    useUnifiedTopology: true       // surpress warning messages
})

const StockSchema = new mongoose.Schema({
          stock: {type: String, trim:true},
              likes: {type: Number, trim:true, default:0},
          ip: [{type: String, trim:true}]
    
})


const Stock = connection.model('Stock', StockSchema);

module.exports = connection;