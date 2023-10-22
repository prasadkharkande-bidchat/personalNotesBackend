const { Router } = require("express");
const notesController = require("../controller/notes");
let checkToken = require("../../backend/controller/auth/token_validation")

const router = Router();

router.post("/newNote", checkToken.checkToken, notesController.createNote);
router.get("/getNotes", checkToken.checkToken, notesController.getUserNotes);
router.delete("/deleteNote", checkToken.checkToken, notesController.deleteUserNotes);
router.patch("/updateNote", checkToken.checkToken, notesController.updateUserNotes);
router.get("/searchNote", checkToken.checkToken, notesController.searchUserNotes);
router.get("/mailNote", checkToken.checkToken, notesController.mailNote)

//search functionality
//sending the note via mail functionality

module.exports = router;