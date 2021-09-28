const Joi = require("joi");
const createError = require("http-errors");
const express = require("express");
const app = express();
let cors = require("cors");

app.use(express.json()); // middleware to convert body to json
app.use(cors());

app.post("/api/login", (req, res) => {
  const loginSchema = Joi.object({
    body: Joi.object({
      email: Joi.string().min(3).required(),
      password: Joi.string().min(8).required(),
    }),
  });

  const result = loginSchema.validate(req, { stripUnknown: true });

  // example !res.ok
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  // example throw error
  if (req.body.email === "eehong@gmail.com") {
    throw createError(401, "User not authorised");
  }

  // happy path
  const user = {
    email: req.body.email,
    displayName: "eehong",
    token: "s3cr3t",
    cash: 1000,
  };

  res.send(user);
});

app.listen(3001, () => console.log("Listening on port 3001..."));
