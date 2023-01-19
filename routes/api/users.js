const express = require("express");
const Joi = require("joi");
var Jimp = require("jimp");
const fs = require("fs").promises;
const gravatar = require("gravatar");
const { hashPassword, comparePassword } = require("../../password");
const {
  addUser,
  findByEmail,
  findById,
  updateUser,
} = require("../../servicess/users");
const { generateToken } = require("../../token");
const userMiddleware = require("../../middleware/middleware");
const uploads = require("../../middleware/uploads");

const router = express.Router();

const signupSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().email().required(),
}).required();

const validator = (schema, message) => (req, res, next) => {
  const body = req.body;
  console.log("body", body);
  const validation = schema.validate(body);

  if (validation.error) {
    res.status(400).json({ message });
    return;
  }

  return next();
};

router.post(
  "/signup",
  validator(signupSchema, "Bad Ошибка от Joi или другой библиотеки валидации"),
  async (req, res) => {
    const user = req.body;

    user.avatarURL = gravatar.url(user.email);

    user.password = await hashPassword(user.password);

    try {
      const { email, subscription } = await addUser(user);

      res.status(201).json({ user: { email, subscription } }).end();
    } catch (err) {
      if (err.code === 11000) {
        res
          .status(409)
          .json({
            message: "Email in use",
          })
          .end();
      } else {
        throw err;
      }
    }
  }
);

router.post(
  "/login",
  validator(signupSchema, "Ошибка от Joi или другой библиотеки валидации"),
  async (req, res) => {
    const { email, password } = req.body;

    const user = await findByEmail(email);

    const passwordMatches = await comparePassword(password, user.password);

    if (passwordMatches) {
      const token = await generateToken({ id: user._id });
      updateUser(user._id, { token });
      res
        .json({
          token,
          user: {
            email: user.email,
            subscription: user.subscription,
            id: user._id,
          },
        })
        .end();
    } else {
      res
        .status(401)
        .json({
          message: "Email or password is wrong",
        })
        .end();
    }
  }
);

router.post("/logout", userMiddleware, async (req, res) => {
  const { _id } = req.user;
  await updateUser(user._id, { token: "" });
  res.status(204).end();
});

router.get("/current", userMiddleware, async (req, res) => {
  const { _id } = req.user;
  const { email, subscription } = await findById(_id);

  res.json({ email, subscription }).end();
});

router.patch(
  "/avatars",
  userMiddleware,
  uploads.single("userAvatar"),
  async (req, res) => {
    const { id } = req.user;
    const avatar = req.file.path;
    const [, fileExtention] = req.file.mimetype.split("/");
    const uploadsPath = `public/avatars/${id}.${fileExtention}`;

    try {
      Jimp.read(avatar)
        .then((avatar) => {
          return avatar.resize(250, 250).write(uploadsPath);
        })
        .catch((error) => {
          next(error);
        });

      await fs.unlink(avatar);
      await updateUser(id, { avatarURL: uploadsPath });

      res.status(200).json({ avatarURL: uploadsPath });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
