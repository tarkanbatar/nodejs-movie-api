const jwt = require('jsonwebtoken');

module.exports = (req,res,next) => {
    const token = req.headers['x-access-token'] || req.body.token || req.query.token ; //! bize token verisi burada belirtilen 3 sekilde de gelebilir. O yuzden tokenlari bu sekilde almamiz gerekir.
    
    if(token){
        jwt.verify(token,req.app.get('api_secret_key'),(err, decoded)=>{
            if(err){
                res.json({
                    status: false,
                    message: 'Authetication failed!'
                });
            } else{
                req.decode = decoded;
                next();
            }
        });
    } else {
        res.json({
            status: false,
            message: 'No token provided!'
        })
    }
};