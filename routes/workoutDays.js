const express = require("express");
const router = express.Router();
const WorkoutDay = require("../models/WorkoutDay");
const validation = require("../validation/validation");
const verify = require("../routes/UsersVerification/verifyToken");

//router.use(verify);

router.get("/month/:date", async (req, res) => {
  const date = Date.parse(req.params.date);
  if (date === NaN) {
    res.status(400).json("Bad request");
    return;
  }
  const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  try {
    const workoutDays = await WorkoutDay.find({
      userId: req.user._id,
      date: { $gte: startDate, $lte: lastDate },
    });
    res.json(workoutDays);
  } catch (err) {
    res.status(404).json({ message: err }).status("500").send();
  }
});
//Get WorkoutDay by date
router.get("/day/:date", async (req, res) => {
  const date = Date.parse(req.params.date);
  if (date === NaN) {
    res.status(400).json("Bad request");
    return;
  }

  try {
    const workoutDay = await WorkoutDay.find({
      UserId: req.user._id,
      date: date,
    });
    res.json(workoutDay);
  } catch (err) {
    res.json({ message: err }).status("404").send();
  }
});
//Get ALL
router.get("/all", async (req, res) => {
  console.log('find');
  try {
    const workoutDays = await WorkoutDay.find({
      UserId: req.user._id,
    });
    console.log(workoutDays);
    res.json(workoutDays).send();
  } catch (err) {
    console.log(err);
    res.json({ message: err }).status("404").send();
  }
});

// Delete workoutDay
router.delete("/Day/:date", async (req, res) => {
  const date = Date.parse(req.params.date);
  if (date === NaN) {
    res.status(400).json("Bad request");
    return;
  }
  try {
    const removedWorkoutDay = await WorkoutDay.deleteOne({
      userId: req.user._id,
      date: date,
    });
    res.status(200).send();
  } catch (err) {
    res.json({ message: err }).status("500").send();
  }
});
// Create new workoutDay
router.post("/Day", async (req, res) => {
  const { error } = validation.workoutDayValidation(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }
  const workoutDay = new WorkoutDay({
    userId: null,//req.user._id,
    date: req.body.date,
    workout: req.body.workout,
  });

  try {
    const savedWorkoutDay = await workoutDay.save();
    res.status(200).send();
  } catch (err) {
    res.status(400).json({ message: err });
  }
});
//Update workout
router.patch("/Day/:date", async (req, res) => {
  try {
    const updatedWorkout = await WorkoutDay.findOneAndUpdate(
      { _id: req.params.workoutId, userId: req.user._id },
      {
        $set: {
          workout: req.body.workout,
        },
      }
    );
    res.status(200);
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

module.exports = router;
