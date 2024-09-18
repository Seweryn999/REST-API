const User = require("../service/schema/user");
const Joi = require("joi");
const { sendVerificationEmail } = require("../config/verify");

const responseSchema = Joi.object({
  email: Joi.string().email().required(),
});

const verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });

    if (!user) {
      return res.status(404).json({
        status: "error",
        code: 401,
        ResponseBody: {
          message: "Bad user verification token",
        },
      });
    }

    if (user.verify === true) {
      return res.status(404).json({
        status: "error",
        code: 404,
        ResponseBody: {
          message: `User ${user.email} already confirmed`,
        },
      });
    }

    user.verify = true;
    user.verificationToken = null;
    await user.save();

    return res.status(200).json({
      status: "OK",
      code: 200,
      ResponseBody: {
        message: "Verification has already been passed",
        verification: user.verify,
      },
    });
  } catch (err) {
    next(err);
  }
};

const resendVerifyEmai = async (req, res, next) => {
  const value = await responseSchema.validate(req.body);
  if (value.error) {
    return res.json({
      message: value.error.message,
      status: 400,
    });
  }

  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        status: "error",
        code: 401,
        ResponseBody: {
          message: "Unauthorized",
        },
      });
    }

    const email = req.body;
    if (!email) {
      return res.status(400).json({
        status: "error",
        code: 400,
        ResponseBody: {
          message: "missing required field email",
        },
      });
    }

    if (user.verify === true) {
      return res.status(404).json({
        status: "error",
        code: 404,
        ResponseBody: {
          message: "Verification has already been passed",
        },
      });
    }

    const token = user.verificationToken;
    sendVerificationEmail(email, token);

    return res.status(200).json({
      status: "OK",
      code: 200,
      ResponseBody: {
        message: "Verification email resend successfully",
        verification: user.verify,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  verifyEmail,
  resendVerifyEmai,
};
