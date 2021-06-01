const httpStatus = require('http-status');
const User = require('@models/auth/user.model');
const { omit } = require('lodash');
const APIError = require('@utils/APIError');


exports.userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const { clientIp } = req
    const { user, accessToken } = await User.findAndGenerateToken({ email, password, ip: clientIp })
    res.status(httpStatus.OK).json({ user, accessToken })
  } catch (error) {
    return next(User.checkDuplicateEmail(error));
  }
}