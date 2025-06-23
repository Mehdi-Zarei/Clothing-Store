const {
  removeData,
  getOtpInfo,
  saveData,
  getData,
} = require("../../helpers/redis");

const {
  errorResponse,
  successResponse,
} = require("../../helpers/responseMessages");

const User = require("../../models/User");
const crypto = require("crypto");
const sentSms = require("../../service/sms");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../../helpers/jwt");

const { hashData, comparHashedData } = require("../../helpers/bcrypt");

const { Op } = require("sequelize");

exports.send = async (req, res, next) => {
  try {
    const { phone } = req.body;

    const isUserExist = await User.findOne({ phone });

    if (isUserExist?.isRestrict) {
      return errorResponse(
        res,
        403,
        "این شماره تلفن به علت تخلف مسدود گردیده است."
      );
    }

    const { remainingTime, expired } = await getOtpInfo(phone);

    if (!expired) {
      return errorResponse(
        res,
        409,
        `کد یکبارمصرف قبلا برای شما ارسال گردیده است.لطفا پس از ${remainingTime} مجدد تلاش کنید.`
      );
    }

    const otpCode = crypto.randomInt(10000, 99999);
    await saveData(`otp:${phone}`, otpCode, 60);

    const smsResult = await sentSms(
      phone,
      process.env.OTP_PATTERN,
      process.env.OTP_VARIABLE,
      otpCode
    );

    if (smsResult.success) {
      return successResponse(
        res,
        200,
        "کد ورود به شماره موبایل وارد شده باموفقیت ارسال گردید."
      );
    } else {
      await removeData(`otp:${phone}`);

      return errorResponse(
        res,
        500,
        "خطا در ارسال کد یکبار مصرف،لطفا مجدد تلاش فرمائید."
      );
    }
  } catch (error) {
    next(error);
  }
};

exports.verify = async (req, res, next) => {
  try {
    const { otpCode, phone } = req.body;

    const storedOtp = await getData(`otp:${phone}`);

    if (storedOtp.expired || storedOtp !== otpCode) {
      return errorResponse(
        res,
        403,
        "کد وارد شده صحیح نمی باشد و یا مدت زمان آن به پایان رسیده است."
      );
    }

    const isUserExist = await User.findOne({ phone });

    if (isUserExist) {
      if (isUserExist?.isRestrict) {
        return errorResponse(res, 403, "حساب کاربری شما مسدود شده است.");
      }

      const accessToken = await generateAccessToken(
        isUserExist.id,
        isUserExist.role
      );

      const refreshToken = await generateRefreshToken(
        isUserExist.id,
        isUserExist.role
      );

      const encryptRefreshToken = await hashData(refreshToken);

      await saveData(
        `refreshToken:${isUserExist.id}`,
        encryptRefreshToken,
        2592000
      );

      await removeData(`otp:${phone}`);

      return successResponse(
        res,
        200,
        "شما با موفقیت وارد حساب کاربری خود شدید.",
        { accessToken, refreshToken }
      );
    } else {
      return errorResponse(res, 404, "Redirect To Register Page.");
    }
  } catch (error) {
    next(error);
  }
};

exports.register = async (req, res, next) => {
  try {
    const { name, phone, email, password } = req.body;

    const isUserExist = await User.findOne({ where: { phone } });

    if (isUserExist) {
      return errorResponse(res, 409, "حساب کاربری از قبل وجود دارد.");
    }

    const isFirstUser = (await User.count()) === 0;

    const newUser = await User.create({
      name,
      phone,
      email,
      password: password ? await hashData(password) : password,
      role: isFirstUser ? "ADMIN" : "USER",
      isRestrict: false,
    });

    const accessToken = await generateAccessToken(newUser.id, newUser.role);

    const refreshToken = await generateRefreshToken(newUser.id, newUser.role);

    const encryptRefreshToken = await hashData(refreshToken);

    await saveData(`refreshToken:${newUser.id}`, encryptRefreshToken, 2592000);

    return successResponse(res, 201, "حساب کاربری با موفقت ساخته شد", {
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    const isUserExist = await User.findOne({
      where: {
        [Op.or]: [{ phone: identifier }, { email: identifier }],
      },
    });

    if (!isUserExist?.password) {
      return errorResponse(
        res,
        403,
        "لطفا از طریق کد یکبارمصرف وارد حساب کاربری خود شوید."
      );
    }

    const comparePassword = await comparHashedData(
      password,
      isUserExist.password
    );

    if (!comparePassword) {
      return errorResponse(res, 403, "نام کاربری یا کلمه عبور اشتباه می باشد.");
    }

    const accessToken = await generateAccessToken(
      isUserExist.id,
      isUserExist.role
    );

    const refreshToken = await generateRefreshToken(
      isUserExist.id,
      isUserExist.role
    );

    return successResponse(
      res,
      200,
      "شما با موفقیت وارد حساب کاربری خود شدید.",
      { accessToken, refreshToken }
    );
  } catch (error) {
    next(error);
  }
};

exports.me = async (req, res, next) => {
  try {
    const user = req.user;

    return successResponse(res, 200, user);
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const user = req.user;

    await removeData(`refreshToken:${user.id}`);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return successResponse(
      res,
      200,
      "شما با موفقیت از حساب کاربری خود خارج شدید."
    );
  } catch (error) {
    next(error);
  }
};

exports.refreshAccessToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return errorResponse(res, 401, "رفرش توکن یافت نشد.");
    }

    const verifyToken = await verifyRefreshToken(refreshToken);
    if (!verifyToken) {
      return errorResponse(res, 401, "رفرش توکن نامعتبر یا منقضی شده است.");
    }

    const storedToken = await getData(`refreshToken:${verifyToken.id}`);
    if (!storedToken) {
      return errorResponse(res, 403, "رفرش توکن نامعتبر است.");
    }

    const isValidToken = await comparHashedData(refreshToken, storedToken);
    if (!isValidToken) {
      return errorResponse(
        res,
        403,
        "رفرش توکن با مقدار ذخیره شده مطابقت ندارد."
      );
    }

    const accessToken = await generateAccessToken(
      verifyToken.id,
      verifyToken.role
    );

    return successResponse(res, 200, accessToken);
  } catch (error) {
    next(error);
  }
};
