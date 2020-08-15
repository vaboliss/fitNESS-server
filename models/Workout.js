const mongoose = require("mongoose");

const workoutDaySchema = mongoose.Schema({
  workoutName: String,
  userId: String,
  exercises: [
    {
      exerciseName: String,
    },
  ],
});

module.exports = mongoose.model("Workout", workoutDaySchema);
