const pool = require("../config/database")
const jwt = require("jsonwebtoken");

const getUsers = (req, res) => {
    pool.query("SELECT * FROM USERS", (err, result) => {
        if (err) {
            throw err;
        }
        res.status(200).json({
            success: true,
            data: result.rows
        })
    })
}

const createNewUser = (req, res) => {
    // check if all the required data is present or not. Phone is important. 
    // if number is present, check if that user is already registered or not. 
    //if not then create a new user and inform him to login after sign up. 
    try {
        if (!req.body.phone || !req.body.password) {
            return res.status(401).send({
                success: false,
                message: "Phone number and password are mandatory fields."
            })
        }

        console.log("(req.body.phone).length ", (req.body.phone).length);

        if ((req.body.phone).length != 10) {
            return res.status(401).send({
                success: false,
                message: "Incorrect Phone number."
            })
        }

        //checking if user is already present or not. 
        let userExistQry = `
            SELECT * FROM users as u
            WHERE u.phone = $1
            `

        let phoneNumber = parseInt(req.body.phone);
        pool.query(userExistQry, [phoneNumber], (err, result) => {
            if (err) {
                throw err;
            }
            console.log("-=-=-= result : ", result);
            if (result && result.rowCount >= 1) {
                let message = `Hi, this number is already registered. Please proceed with login or try using another number.`;
                return res.status(400).send({
                    success: false,
                    message: message
                })
            }
        })

        //The user doesnt exist in the db, creating a new user. 
        let firstname = req.body.firstname ? req.body.firstname : null;
        let lastname = req.body.lastname ? req.body.lastname : null;
        let password = req.body.password ? (req.body.password).replace(/^[ ]+/g, "") : null;

        //we can encrypt the password and store it in the db. For now I have stored the password as it is. 
        if (!password) {
            throw new Error("Please enter a valid strong password.")
        }

        let insertUserQry = 'INSERT INTO users (firstname, lastname, phone, password) values ($1, $2, $3, $4)';
        pool.query(insertUserQry, [firstname, lastname, phoneNumber, password], (err, result) => {
            if (err) {
                console.log("error : ", err);
                return res.status(400).send({
                    success: false,
                    message: "Opps! unable to sign up. Please try checking the entered details and try again."
                })
            }
            
            if (result && result.rowCount >= 1) {
                let message = `Hi, You have successfully signed up. Please login and happy noting.`;
                return res.status(200).send({
                    success: true,
                    message: message
                })
            }
        })

    } catch (err) {
        console.log("Error: ", err);
        console.trace(err);
        throw err;
    }

}


const login = (req, res) => {

    try {
        if (!req.body.phone || !req.body.password) {
            return res.status(400).send({
                success: false,
                message: "Invalid / Missing userId or Password."
            })
        }

        let phoneNumber = parseInt(req.body.phone);
        let checkifUserPresent = `
            SELECT * FROM users as u
            WHERE u.phone = $1
            `

        pool.query(checkifUserPresent, [phoneNumber], (err, result) => {
            if (err) {
                throw err;
            }
            
            if (result && result.rowCount >= 1) {
                let originalPassword = result.rows[0].password;
                originalPassword = originalPassword.replace(/^[ ]+/g, "");

                if(originalPassword.replace(" ", '') == req.body.password.replace(" ", '')){ 
                    let jsonToken = jwt.sign(originalPassword, process.env.SECRET_TOKEN);
                    return res.json({
                        success: true,
                        message: "Login successfull.",
                        jsonToken
                    })
                } else {
                    return res.status(401).send({
                        success: false,
                        message: "Invalid user name or password"
                    })
                }
            }
        })
        
    } catch (err) {
        console.log("ERROR: ", err);
        console.trace(err);
        res.status(400).send({
            success: false,
            message: "Invalid userId or password."
        })
    }
}

module.exports = {
    getUsers,
    createNewUser,
    login
};