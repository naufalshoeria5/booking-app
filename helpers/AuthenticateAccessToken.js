import "dotenv/config";
import jwt from "jsonwebtoken";

export function AuthenticateAccessToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    res.status(404).send({meta : {code: 404, status: 'not found', message: 'Invalid access token'}});
  } else {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        res.status(500).send({meta : {code: 500, status: 'error', message: err}});
      } else {
        next();
      }
    });
  }
}
