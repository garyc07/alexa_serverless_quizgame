
const BASE_URL = 'http://localhost:3000/dev/'

const API = {

   postTest: function(data, url, next){
      $.ajax({
         url: 'http://localhost:3003/' + url,
         method: 'POST',
         data: data
      })
      .done(res => {
         next(res)
      })
   },


   post: function(data, url, next){
      $.ajax({
         url: BASE_URL + url,
         method: 'POST',
         data: data
      })
      .done(res => {
         next(res)
      })
   },

   get: function(url, next){
      $.ajax({
         url: BASE_URL + url,
         method: 'GET'
      })
      .done(res => {
         next(res)
      })
   },


   getWithToken: function(url, token, next){
      $.ajax({
         url: BASE_URL + url,
         method: 'GET',
         headers: { "Authorization": 'Bearer ' + token }
      })
      .done(res => {
         next(res)
      })
   },

   postWithToken: function(data, url, token, next){
      $.ajax({
         url: BASE_URL + url,
         method: 'POST',
         data: data,
         headers: { "Authorization": 'Bearer ' + token }
      })
      .done(res => {
         next(res)
      })
   }
}