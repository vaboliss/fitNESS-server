const Joi = require("@hapi/joi");

//Register Validation
const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

//Login Validation
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

const workoutValidation = (data) => {
  const schema = Joi.object({
    workoutName: Joi.string().min(3).required(),
    exercises: Joi.array()
      .min(1)
      .items(
        Joi.object({
          exerciseName: Joi.string().min(3).required(),
        })
      )
      .required(),
  });

  return schema.validate(data);
};

const workoutDayValidation = (data) => {
  const schema = Joi.object({
    date: Joi.date().required(),
    workout: Joi.object({
      workoutName: Joi.string().min(3).required(),
      exercises: Joi.array()
        .min(1)
        .items(
          Joi.object({
            exerciseName: Joi.string().min(3).required(),  
            reps: Joi.number().min(0).max(100).required(),
            sets: Joi.number().min(0).max(100).required(),
            weight: Joi.number().required(),
          })
        ),
    }).required(),
  });
  return schema.validate(data);
};

module.exports.workoutDayValidation = workoutDayValidation;
module.exports.workoutValidation = workoutValidation;
module.exports.loginValidation = loginValidation;
module.exports.registerValidation = registerValidation;
