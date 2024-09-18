const User = require("../service/schema/user");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const responseSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().email().required(),
});

const login = async (req, res) => {
  const value = await responseSchema.validate(req.body);
  if (value.error) {
    return res.send(400).json({ error: error.message });
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
    return res.send(400).json({ error: error.message });
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
        token: user.token,
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
};
