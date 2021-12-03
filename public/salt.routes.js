const salt = require("../controllers/salt.controller");

const basepath = '/api/salt/'

module.exports = function(app){
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });



  app.get(basepath+"info",  salt.saltinfo);
  
};
