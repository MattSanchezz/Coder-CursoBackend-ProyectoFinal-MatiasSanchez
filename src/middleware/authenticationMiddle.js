function isAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
      res.redirect("http://localhost:8080/login");
    } else {
      next();
    }
  }
  
  function isNotAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
      next();
    } else {
      res.redirect("http://localhost:8080/products");
    }
  }
  
  export { isAuthenticated, isNotAuthenticated };