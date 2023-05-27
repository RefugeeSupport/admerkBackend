const jwt = require("jsonwebtoken");
let ctx = {
  request: {
    body: { changeTicketNumber: "CH" }
  }
};
function checkAuth(req, res, next) {
  
  const auth_header = req.get("Authorization");

  if (!auth_header) {
    return res.json({ status: 401, message: "Please login to perform action" });
  }

  let decode_token;

  try {
    decode_token = jwt.verify(
      auth_header.split(" ")[1],
      process.env.SECRET_KEY
    );
  } catch (error) {
    return res.json({
      status: 500,
      message: "Oops something went wrong!",
    });
  }

  if (!decode_token) {
    return res.json({
      status: 401,
      message: "No authorization",
    });
  }

  let user_id = decode_token.user_data.id;
  knex("users")
    .where("id", user_id)
    .then(async (response) => {
      if (response.length > 0) {
        let current_user = response[0];
        if (current_user.status == 1) {
          req.user_data = current_user;
          next();
        } else {
          return res.json({
            status: 401,
            message: "Your account has been deactivated",
          });
        }
      }
    });
}

// Checks for auth, if auth is present validates and passes user data, else just passes the request
function softAuth(req, res, next) {
  const auth_header = req.get("Authorization");

  if (!auth_header) {
    return next();
  }

  let decode_token;

  try {
    decode_token = jwt.verify(
      auth_header.split(" ")[1],
      process.env.SECRET_KEY
    );
  } catch (error) {
    return res.json({
      status: 500,
      message: "Oops something went wrong!",
    });
  }

  if (!decode_token) {
    return res.json({
      status: 401,
      message: "No authorization",
    });
  }

  let user_id = decode_token.user_data.id;
  knex("users")
    .where("id", user_id)
    .then(async (response) => {
      if (response.length > 0) {
        let current_user = response[0];
        if (current_user.status == 1) {
          req.user_data = current_user;
          next();
        } else {
          return res.json({
            status: 401,
            message: "Your account has been deactivated",
          });
        }
      }
    });
}

module.exports = {
  checkAuth,
  softAuth,
};
