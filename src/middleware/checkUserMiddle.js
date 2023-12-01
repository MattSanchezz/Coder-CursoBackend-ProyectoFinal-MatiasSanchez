function isAdmin(req, res, next) {
    if (req.user.role === "admin") {
      next();
    } else {
      res.redirect("http://localhost:8080/products");
    }
  }
  
  export default isAdmin;