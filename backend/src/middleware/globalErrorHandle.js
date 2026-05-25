const { validationResult } = require("express-validator");
class GlobalErrorHandle {
  static errorHandle(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = { message: errors.array()[0].msg, status: 400 };
      next(err);
    }
    return next();
  }
}
module.exports = GlobalErrorHandle;
