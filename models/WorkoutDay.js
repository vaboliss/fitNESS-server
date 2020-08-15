const mongoose = require('mongoose');

const workoutDaySchema = mongoose.Schema({
    userId: String,
    date: {
        type: Date,
        require: true
    },
    workout: {
        workoutName: String,
        exercises : 
        [{
            exerciseName: String,
            reps: Number,
            sets: Number,
            weight: Number
        }]
    }
});

module.exports = mongoose.model('WorkoutDay', workoutDaySchema);