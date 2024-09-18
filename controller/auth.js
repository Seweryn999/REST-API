const User = require("../service/schema/user");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const gravatar = require("gravatar");
const Jimp = require("jimp");
const path = require("node:path");
const upload = require("../middlewares/upload");
const fs = require("fs").promises;
const { generateVerifyToken } = require("../config/verify");
const { sendVerificationEmail } = require("../config/verify");

const responseSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const login = async (req, res) => {
  const value = await responseSchema.validate(req.body);
  if (value.error) {
    return res.json({
      message: value.error.message,
      status: 400,
    });
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !user.validPassword(password)) {
    return res.status(401).json({
      status: "error",
      code: 401,
      message: "Incorrect login or password",
      data: "Bad request",
    });
  }

  const payload = {
    id: user.id,
    username: user.email,
  };

  const secret = process.env.SECRET;
  const token = jwt.sign(payload, secret, { expiresIn: "1h" });
  user.token = token;
  await user.save();

  return res.json({
    status: "success",
    code: 200,
    data: {
      token,
    },
  });
};

const signup = async (req, res, next) => {
  const value = await responseSchema.validate(req.body);
  if (value.error) {
    return res.json({
      message: value.error.message,
      status: 400,
    });
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email }).lean();
  if (user) {
    return res.status(409).json({
      status: "error",
      code: 409,
      message: "Email is already in use",
      data: "Conflict",
    });
  }
  try {
    const newUser = new User({ email });
    newUser.setPassword(password);
    const avatarURL = gravatar.url(newUser.email, {
      protocol: "https",
      s: "100",
    });
    newUser.avatarURL = avatarURL;
    const verifyToken = generateVerifyToken();
    newUser.verificationToken = verifyToken;
    sendVerificationEmail(email, verifyToken);

    await newUser.save();
    return res.status(201).json({
      status: "success",
      code: 201,
      data: {
        message: "Registration successful",
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  const user = req.user;
  try {
    if (!user) {
      return res.status(401).json({
        status: "error",
        code: 401,
        ResponseBody: {
          message: "Unauthorized",
        },
      });
    }
    user.token = null;
    await user.save();
    return res.status(204).json({
      status: "success",
      code: 204,
      ResponseBody: {
        message: "Logout successful",
      },
    });
  } catch (error) {
    next(error);
  }
};

const currentUser = async (req, res, next) => {
  const user = req.user;
  try {
    if (!user) {
      return res.status(401).json({
        status: "error",
        code: 401,
        ResponseBody: {
          message: "Unauthorized",
        },
      });
    }
    return res.status(200).json({
      status: "OK",
      code: 200,
      ResponseBody: {
        email: user.email,
        subscription: user.subscription,
        avatar: user.avatarURL,
        verify: user.verify,
        verificationToken: user.verificationToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

const uploadAvatar = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await User.findOne({ _id });
    if (!user) {
      return res.status(401).json({
        status: "error",
        code: 401,
        ResponseBody: {
          message: "Unauthorized",
        },
      });
    }

    const file = req.file;
    if (!file)
      return res
        .status(400)
        .json({ status: false, code: 400, message: "Missing file" });

    const avatarPath = file.path;
    Jimp.read(avatarPath)
      .then((image) => {
        return image.resize(250, 250);
      })
      .catch((error) => console.log(error));

    const now = new Date();
    const newAvatarName = `${now.getTime()}_${user._id}_${file.originalname}`;
    const destinationPath = path.join(upload.storeImageDir, newAvatarName);
    try {
      await fs.rename(avatarPath, destinationPath);
    } catch (error) {
      await fs.unlink(avatarPath);
      return next(error);
    }

    user.avatarURL = `/avatars/${newAvatarName}`;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Avatar uploaded successfully",
      ResponseBody: {
        avatarURL: user.avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  signup,
  logout,
  currentUser,
  uploadAvatar,
};
