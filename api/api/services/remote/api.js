const fetch = require('node-fetch')

// https://opentdb.com/api_config.php

const BASE_URL = 'https://opentdb.com/'

async function getJsonResponse(url){
   try{
      const response = await fetch(url)
      const json = await response.json()
      return json
   } catch(err){
      console.log(err)
   }

}

module.exports = {

   getSessionToken: async function(){
      const resp = await getJsonResponse('https://opentdb.com/api_token.php?command=request')
      return resp.token
   },

   getCategories: async function() {
      const resp = await getJsonResponse('https://opentdb.com/api_category.php')
      return resp.trivia_categories
   },

   getQuestions: async function(sessionToken, amount, categoryId, difficulty, type){
   
      const resp = await getJsonResponse('https://opentdb.com/api.php?amount=' + amount 
         + '&category=' + categoryId 
         + '&difficulty=' + difficulty 
         + '&type=' + type 
         + '&token=' + sessionToken
      )
      return resp.results
   }
}
