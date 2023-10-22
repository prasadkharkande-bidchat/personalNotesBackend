const pool = require("../config/database");
require("dotenv").config();
const sendmail = require('../utils/utils');


const createNote = async (req, res) => {
    try{
        //considering here after authentication, we will have user_id, title and description.
        if(!req.body.userId || !req.body.title || !req.body.description){ //These type of validation can be done using valiators (a seperate function defined in one file and used everywhere)
            return res.status(400).send({
                success: false,
                message: "userId, note title and note description are mandatory"
            })
        }

        query = `INSERT INTO notes (title, description, user_id) values ($1, $2, $3)`

        await pool.query(query, [req.body.title, req.body.description, req.body.userId], (err, result)=>{
            if(err){
                //throw err;
                res.status(401).send({
                    success:false,
                    message: "Note Already stored"
                })
            }
            res.status(200).send({
                success:true,
                message: "Notes added to personal notes successfully."
            })
        }) 

    }catch(err){
        console.log("Error: ", err);
        console.trace(err);

    }
}


const getUserNotes = (req, res) => {
    try{
        if(!req.body.userId){
            throw new Error("UserId is required to find the users notes")
        }

        let query = ` SELECT * from notes 
                    INNER JOIN users on  users.id = notes.user_id
                    where notes.user_id = $1         
                    `

        pool.query(query, [req.body.userId], (err, result)=>{
            if(err){
                throw err;
            }
            if(result.rowCount.length > 0)
                res.status(200).json(result.rows)
            else{
                return res.status(200).send({
                    success: true,
                    message: "No notes save so far."
                })
            }
        })           
        
    }catch(err){
        console.log("error: ", err);
        console.trace(err);
        return false;
    }
}

const deleteUserNotes = (req, res) =>{
    // get the note id from frontend and delete it from the db 
    try{
        if(!req.body.note_id){
            return res.status(401).send({
                success: false,
                message: "note_id is a mandatory fields."
            })
        }
        
        let query = `DELETE FROM notes WHERE id = $1 `;

        pool.query(query, [req.body.note_id],(err, result)=>{
            if(err){
                throw err;
            }
            console.log("-=-=-= result : ", result);
            if(result && result.rowCount >=1){
                return res.status(200).send({
                    success: false,
                    message: "Note Succesfully deleted."
                })
            }
        })

    }catch(err){
        console.log("Error: ", err);
        console.trace(err);
        throw err;
    }
    


}

const updateUserNotes = (req, res) =>{
    // get the note id from frontend and delete it from the db 
    try{
        if(!req.body.note_id || !req.body.description){
            return res.status(401).send({
                success: false,
                message: "note_id and note description are mandatory fields."
            })
        }
        
        let query = `UPDATE notes
                    SET description = $1, title = $2
                    WHERE notes.id = $3`;

        pool.query(query, [req.body.description, req.body.title, req.body.note_id],(err, result)=>{
            if(err){
                throw err;
            }
            console.log("-=-=-= result : ", result);
            if(result && result.rowCount >=1){
                return res.status(200).send({
                    success: false,
                    message: "Note Succesfully updated."
                })
            }
        })

    }catch(err){
        console.log("Error: ", err);
        console.trace(err);
        throw err;
    }
}

const searchUserNotes = (req, res) => {
    try{

        let qryCondition;
        if(req.body.note_title){
            qryCondition =` notes.title LIKE %${req.body.note_title}%`
        }else{
            qryCondition = 1
        }

        let query = ` SELECT * from notes 
                    INNER JOIN users on  users.id = notes.user_id
                    where users.id = ${req.body.user_id} AND notes.title LIKE '%${req.body.note_title}%'       
                    `
        console.log("-=-= query : ", query);
        pool.query(query, (err, result)=>{
            if(err){
                throw err;
            }
            if(result.rowCount > 0)
                res.status(200).json(result.rows)
            else{
                return res.status(200).send({
                    success: true,
                    message: `No notes found with the search request query.`
                })
            }
        })   
        
    }catch(err){
        console.log("error: ", err);
        console.trace(err);
        return false;
    }
}

const mailNote = async(req, res) => {
    try{
        //Taking note_id, receiver_mail_id
        if(!req.body.note_id || !req.body.receiver_mail_id){
            res.status(409).send({
                success: false, 
                message: "Note id and receicer ids are mandatory."
            })
        }

        //get note details.
        let query = ` SELECT * from notes 
        where notes.id = $1         
        `
        pool.query(query, [req.body.note_id], (err, result)=>{
            if(err){
                throw err;
            }
            if(result.rowCount > 0){
                //res.status(200).json(result.rows)
                let body= {
                    title: (result.rows[0].title).replace("  ", ""),
                    description: (result.rows[0].description).replace("  ", "")
                }
                sendmail.sendNoteViaMail(req.body.receiver_mail_id, body)
                return res.status(200).send({
                    success: true,
                    message: "Message sent successfully"
                })
            }
                
            else{
                return res.status(200).send({
                    success: true,
                    message: "No note found ."
                })
            }
        })     

    }catch{
        console.log("Error : ", err)
        return;
    }
} 

module.exports = {
    createNote,
    getUserNotes,
    deleteUserNotes,
    updateUserNotes, 
    searchUserNotes, 
    mailNote
};