import express from "express";
import Grades from "../modules/model.js";

const router =  new express.Router();

import { ObjectId } from "mongodb";


// Create a single grade entry
router.post("/", async (req, res) => {
  try {
    const newUser = await Grades.create(req.body);
  
    let user = newUser.toObject(); 
    if (user.student_id) {
      user.learner_id = user.student_id;
      delete user.student_id;
    }
    
    res.send(newUser);
  } catch (error) {
    console.log(error);
  }
});

// Get a single grade entry
router.get("/:id", async (req, res) => {
  try{
    const user = await Grades.findById(req.params.id);
    if(!user){
      return res.status(404).send("User not found");
    }
  res.send(user); 
  } catch(error){
    console.log(error);
    res.status(500).send({ error: "Error, invalid data, check id" });  
  }
});

// Add a score to a grade entry
router.patch("/:id/add", async (req, res) => {
try{
  const userTaken = await Grades.findOne({_id: req.body.id});
  if(userTaken){
    return res.send('Username is not avalible')
  }
  const updatedUser = await Grades.findByIdAndUpdate(req.params.id, req.body, {new: true});
  res.send(updatedUser);

} catch (error){
  console.log(error);
  res.send({error: 'Error, invalid data'});

}
});

// Remove a score from a grade entry
router.patch("/:id/remove", async (req, res) => {
  try {
    const gradeEntry = await Grades.findById(req.params.id);
    if (!gradeEntry) {
      return res.status(404).send('Grade entry not found');
    }

    gradeEntry.scores = undefined; 
    await gradeEntry.save();

    res.send(gradeEntry);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Error, invalid data!" });
  }
});


// Delete a single grade entry
router.delete("/:id", async (req, res) => {
  try {
      const deletedUser = await Grades.findByIdAndDelete(req.params.id);

      res.send({
          deletedUser: deletedUser,
          message: 'User deleted!'
      });
  } catch (error) {
      console.log(error);
      res.send({error: 'Error, invalid data'});
  }
});


// Get route for backwards compatibility
router.get("/student/:id", async (req, res) => {
  res.redirect(`learner/${req.params.id}`);
});




// Get a learner's grade data
router.get("/learner/:id", async (req, res) => {
  try{
    const gradeData = await Grades.findById(req.params.id);
    
    if (!gradeData) {
      return res.status(404).send("Grade data not found for the learner ID");
    }

    const learnerId = gradeData.learner_id;

  res.send({ learner_id: learnerId });
  } catch(error){
    console.log(error);
    res.status(500).send({ error: "Error, invalid data, check id" });  
  }

});


//  Delete a learner's grade data
router.delete("/learner/:id", async (req, res) => {
  try {
    const deletedUserByLearnerId = await Grades.findOneAndDelete({ learner_id: Number (req.params.id) });

    if (!deletedUserByLearnerId) {
      return res.status(404).send("User not found");
    }

    res.send({
      message: 'User deleted!'
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});



// Get a class's grade data
router.get("/class/:id", async (req, res) => {
  try {
    const gradeData = await Grades.findOne({ class_id: req.params.id });

    if (!gradeData || gradeData.length === 0) {
      return res.status(404).send("Grade data not found for the provided class ID");
    }

    res.send(gradeData);
  } catch (error){
    console.log(error);
    res.send({error: 'Error, invalid data'});
  }
});


// Update a class id
router.patch("/class/:id", async (req, res) => {
  try {
    const classExists = await Grades.findOne({ class_id: req.body.class_id });

    if (classExists) {
      return res.status(400).send("New class ID is not available");
    }

    const updatedUser = await Grades.findByIdAndUpdate(
      req.params.id, 
      { class_id: req.body.class_id }, 
      { new: true } 
    );

    if (!updatedUser) {
      return res.status(404).send("Grade data not found for the provided ID");
    }

    res.send(updatedUser);

  } catch (error){
    console.log(error);
    res.send({error: 'Error, invalid data'});
  
  }
});



// Delete a class
router.delete("/class/:id", async (req, res) => {
  try {
    const deletedClass = await Grades.findOneAndDelete({ class_id: Number(req.params.id) });

    if (!deletedClass) {
      return res.status(404).send("Class not found for the provided ID");
    }

    res.send({
      message: 'Class deleted successfully!'
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }

});
export default router;
