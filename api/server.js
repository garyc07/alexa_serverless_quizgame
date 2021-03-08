const serverless = require('serverless-http')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const router = require('./api/router')

const corsOptions = {
   origin: [
      'https://localhost:3000',
      'https://outlook-static-dev.tdsdevapis.com',
      'https://outlook.tdscloud.ie',
      'http://192.168.0.45:3000',
      'http://quiz-app-public.s3-website.eu-west-1.amazonaws.com'
   ],
   exposedHeaders: ['Content-Type', 'Location', 'x-amzn-requestid'],
   optionsSuccessStatus: 200 
}

app.use(cors(corsOptions))
app.use(express.json())


app.use(bodyParser.urlencoded({
   extended: true
}));

app.use(bodyParser.json());
app.use(router);


app.use(function(err, req, res, next) {

   try{
      if(err.errorMsg) {
         res.status(err.statusCode).send({error_msg:err.errorMsg})
         return;
      }
   } catch(e){
      console.log(e)
   }

   if(err.name === 'UnauthorizedError') {
      res.status(err.status).send({message:err.message})
      return;
   }   

   console.log("Uncaught Error")
   console.log(err)
   return res.sendStatus(500)

})

module.exports.handler = serverless(app)

