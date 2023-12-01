function errorHandlerMiddleware(err, req, res, next) {
    console.log(err)
    const message = {
      Error: err.message
        ? `Something went wrong. Error: ${err.message}`
        : "Unknown error",
    };
  
    res.status(500).json(message);
  }
  
  export default errorHandlerMiddleware; 