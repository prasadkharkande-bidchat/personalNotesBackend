const {verify} = require('jsonwebtoken')

module.exports = {
    checkToken: (req, res, next) => {
        let token = req.get("authorization");
        if(!token){
            return res.json({
                success: false,
                message: "Access denied! unauthorized user."
            })
        }

        token = token.slice(7); // removing bearer_ friom the the actual bearer tokem
        verify(token, process.env.SECRET_TOKEN, (err, message) => {
            if(err){
                res.json({
                    success: false,
                    message: "Invalid token."
                })
            }else{
                next();
            }
        } )
    }
}