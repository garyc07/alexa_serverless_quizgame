class APIError extends Error {
   constructor(statusCode, errorMsg, ...params) {
      super(...params)

      if (Error.captureStackTrace) {
         Error.captureStackTrace(this, APIError)
      }

      this.statusCode = statusCode
      this.errorMsg = errorMsg
   }
}


module.exports = APIError