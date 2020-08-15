const express = require("express");
const router = express.Router();
const Workout = require("../models/Workout");
const verify = require("./UsersVerification/verifyToken");
const validation = require("../validation/validation");
const { count } = require("../models/Workout");

router.use(verify);

//Get all workouts
router.get("/", async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.user._id });
    res.json(workouts);
  } catch (err) {
    res.status(404).json({ message: err }).send();
  }
});
//Get workout by Id
router.get("/:workoutId", async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.workoutId);
    res.json(workout);
  } catch (err) {
    res.json({ message: err }).status(404).send();
  }
});
// Delete workout
router.delete("/:workoutId", async (req, res) => {
  try {
    const removedPost = await Workout.deleteOne({ _id: req.params.workoutId });
    res.status(200).send();
  } catch (err) {
    res.json({ message: err }).status(500).send();
  }
});
// Create new workout
router.post("/", async (req, res) => {
  //Validate
  const { error } = validation.workoutValidation(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }

  const DoesWorkoutExist = await Workout.find({
    workoutName: req.body.workoutName,
    userId: req.user._id,
  });

  if (DoesWorkoutExist.length !== 0) {
    res.status(400).json({ message: "Workout name is already taken" });
    return;
  }

  const workout = new Workout({
    workoutName: req.body.workoutName,
    userId: req.user._id,
    exercises: req.body.exercises,
  });

  try {
    const savedWorkout = await workout.save();
    res.json(savedWorkout);
  } catch (err) {
    res.json({ message: err });
  }
});
//Update workout
router.patch("/:workoutId", async (req, res) => {
  try {
    var ex = req.body.exercises;
    
    ex.forEach((element) => {
      delete element._id;
    });
    const { error } = validation.workoutValidation(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }
    const count = await Workout.count({
      workoutName: req.body.workoutName,
      userId: req.user._id,
    });
    console.log(count);
    if (count > 1) {
      res.status(400).json({ message: "Workout name already exists" });
      return;
    }
    const updatedWorkout = await Workout.updateOne(
      { _id: req.params.workoutId, userId: req.user._id },
      {
        $set: {
          workoutName: req.body.workoutName,
          exercises: ex,
        },
      }
    );
    res.status(200).json({message: 'Ok'});
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

module.exports = router;
