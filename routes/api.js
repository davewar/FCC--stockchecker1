/*
*
*
*       Complete the API routing below
*
*
*/
//   
'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');

// const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});
const fetch = require('node-fetch')

require('dotenv').config();
const connection = require('../config/database.js')
const Stock = connection.models.Stock

module.exports = function (app) {




  app.route('/api/stock-prices')
  // app.route('/a')
    .get(async function (req, res){

      let noStock = false;  // start with all stocks are valid

      // console.log("fdgg",req.query.stock)
      // console.log("dw..len", req.query.stock.length)
      // console.log("dw..likes", req.query.like)
      // console.log(Array.isArray(req.query.stock))
      // console.log("ippp", req.ip)
      
      let ip =  'dw111'  // req.ip  // 'dw111'   

      let resObj = {} 
      let newStock1 = ""
      let newStock2 = ""
      
      var twoStocks = [] 
      let manyStocks = false

      let x = 0;
      
      let replyObj = {}
      
      let countOfStocks = Array.isArray(req.query.stock)  // single item are not an array. compare =array
      // console.log(countOfStocks)
      let checkBox = req.query.like;    // is like ticked ?
           
      

    function likeStock(stockName,ipExists){
            let updateDoc;
      //  console.log("sdss",ipExists)
       
            if(checkBox && ipExists == true){
                // already updated, so exit
                resObj = 'Error: Only 1 Like per IP Allowed'
                  return res.json(resObj)

            }  else if (checkBox){
                    // not liked before, so update
                updateDoc = {$inc: {likes: 1}, $push: {ip: ip}}   // update like and IP
                return  udpateDB(stockName,updateDoc)

            } else{
              // no likes
                updateDoc = {}   // nothing to update
                return  udpateDB(stockName,updateDoc)
            }

      }
     

      let stockName;

      if (countOfStocks === false){  //<=== 1 stock
          
            
            stockName = req.query.stock            
            // console.log(getPrice(stockName))
            await getPrice(stockName)
            // console.log("dwd.1.", x)
            // console.log("respsose OB", resObj)

            // getprice found that stock does not exist - exit
            if(noStock === true){

              return res.json( {"error":"external source error","likes":0})

             } else {
               //check if ip address used before
               await getIp(stockName, ip)
             }         
        
      } 
      
      if (countOfStocks === true){

      manyStocks = true;

      let stock1 = req.query.stock[0]
      stockName = stock1
      await getPrice(stockName)
      if(noStock === true){ return res.json( {"error":"external source error","likes":0})  } 
      
      await getIp(stockName)      
      
        
      
      console.log("result",  newStock1)

      




      }  
      
                             


          
     
     async function getPrice(stock){
        // let url = "https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/msft/quote"
            let url = "https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/"

       try{
              let responseFetch = await fetch(url + stockName + "/quote" )
              let data = await responseFetch.json()
                        // console.log("data",data)
                        //clear
                      
                    if(data === "Invalid symbol"){  //invalid stock
                    console.log(data.symbol)
                       noStock = true 
                      //  console.log(noStock)
                                            
                    } else {

                     // console.log("dw...", data.symbol)
                     resObj["stock"] = data.symbol;
                     resObj["price"] = data.latestPrice;
                     
                // console.log("dwd..", resObj)
                  }
         
       }
       catch(err){
              console.log("dw1",err)
             res.send('DW 1:', err.message);   

       }
     }  //<end of getprice func



      // update DB
       async function udpateDB(stock, updates){
      
       try{
 
            Stock.findOneAndUpdate({stock: stock}, updates, {new: true, upsert: true}, (error, data) => {

                            if (error) {return res.send("dw err...." + err.message)};

                            resObj["likes"] = data.likes

                            if(!manyStocks){  // one stock
                                 
                               return res.json(resObj)

                            } 
                            console.log("here...", resObj)

                            newStock1 = resObj
                            return 
                            
                            




                      
              })
                  


            

         
       }
       catch(err){
              console.log("dw3",err)
             return res.send('DW3 Error:', err.message);   

       }
        
       

      } // <<end of update db
    
      // 
       async function updateMulty(resObj) {
                return twoStocks.push(resObj) 

      }  
      ///



      async function getIp(stock, ip){
      
       try{
 
            Stock.findOne({stock: stock}, (error, data) => {

              
                  if ( error) {return res.send("dw sss" + err.message)};
                  // console.log("dw findone", data)
                  if(!error && data && data.ip && data.ip.includes(ip)){
                    // console.log("dw ip exists")

                       likeStock(stock,true)

                  } else{

                     likeStock(stock, false)

                  }
                
                  
                 


            })

         
       }
       catch(error){
              console.log("dw2",error)
             res.send('DW2 Error:', error.message);   

       }
        
       

      } // <<end of update db

   

    
      

      
      
    });   // end of get function


    

    
};   /// <<<< end of exports function


//  {"stockData":{"stock":"MSFT","price":210.08,"likes":2}}

//  {"stockData":[{"stock":"MSFT","price":210.08,"rel_likes":-1},{"stock":"GOOG","price":1590.45,"rel_likes":1}]}

 