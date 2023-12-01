import _ from "lodash";

/**
 * Creates a middleware function that checks
 * if the body of the request does contain specified attributes
 *
 * @param {string[]} mustAttributes - An array of attribute names that
 * must be present in the request body
 * @returns {Function} - A middleware function that checks the presence of the specified attributes
 * @throws {CustomError} - If any of the must attributes are not found in the request body
 */
function body_must_contain_attributes(mustAttributes) {
  /**
   * Middleware function that checks if the body of the request does contain the specified attributes
   *
   * @param {Object} req - The request object from the HTTP request
   * @param {Object} res - The response object from the HTTP response
   * @param {Function} next - The next function in the middleware chain
   * @throws {CustomError} - If any of the must attributes are not found in the request body
   */
  return function (req, res, next) {
    try {
      const bodyAttributes = Object.keys(req.body);

      const intersectedAttributes = _.intersection(
        bodyAttributes,
        mustAttributes
      );

      if (!_.isEqual(intersectedAttributes.sort(), mustAttributes.sort())) {
        const missingAttributes = _.difference(mustAttributes, bodyAttributes);
        return res.status(400).json({
          message: `The body is missing the following attributes: ${missingAttributes}`,
        });
      }

      return next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Middleware function that checks if the body of the request meets certain requirements
 * Requirements:
 * - The body must have an 'email' attribute.
 * - The 'email' attribute, if present, must be a valid email address
 *
 * @param {Object} req - The request object from the HTTP request
 * @param {Object} res - The response object from the HTTP response
 * @param {Function} next - The next function in the middleware chain
 * @throws {CustomError} If the body of the request doesn't meet the requirements
 */
function meetsWithEmailRequirements(req, res, next) {
  try {
    const email = req.body.email;

    if (!email) {
      return res.status(400).json({
        message: "An 'email' attribute is required",
      });
    }

    const emailRegularExpression = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegularExpression.test(email)) {
      return res.status(422).json({
        message: `The value of the 'email' attribute must be a valid email address`,
      });
    }

    return next();
  } catch (error) {
    next(error);
  }
}

/**
 * Middleware function that checks if the body of the request meets certain requirements
 * Requirements:
 * - The body must have an 'password' attribute.
 * - The 'password' attribute, if present, must be have
 * at least one lowercase letter, one uppercase letter,
 * one digit, one special character, and be 8 characters or longer
 *
 * @param {Object} req - The request object from the HTTP request
 * @param {Object} res - The response object from the HTTP response
 * @param {Function} next - The next function in the middleware chain
 * @throws {CustomError} If the body of the request doesn't meet the requirements
 */
function meetsWithPasswordRequirements(req, res, next) {
  try {
    const password = req.body.password;

    if (!password) {
      return res.status(400).json({
        message: "A 'password' attribute is required",
      });
    }

    const passwordRegularExpression =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegularExpression.test(password)) {
      return res.status(422).json({
        message:
          "The value of 'password' attribute must have at least one lowercase letter, one uppercase letter, one digit, one special character, and be 8 characters or longer.",
      });
    }

    return next();
  } catch (error) {
    next(error);
  }
}

//Exports

export {
  body_must_contain_attributes,
  meetsWithEmailRequirements,
  meetsWithPasswordRequirements,
};