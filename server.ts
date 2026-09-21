// Authentication with JWT.
// Does not include authorization.
// Only authenticates already authorized users.
// Refresh token can be added.


//[ Client Request ]
//       │  (Headers: Authorization: Bearer <token>)
//       ▼
// 1. authenticateToken Middleware
//       │  • Reads the token from the header.
//       │  • Verifies it using the secret key.
//       │  • Attaches the user payload to the request object: (req as JwtReq).user = user;
//       │  • Calls next() to hand control over to the next function.
//       ▼
// 2. /posts Route Handler Function
//       │  • Casts the request safely: const jwtReq = req as JwtReq;
//       │  • Filters the `posts` array to find matches: post.username === jwtReq.user.name
//       ▼
// 3. res.json(...)
//          • Sends only the matching posts back to the client as JSON.

import dotenv from "dotenv";
dotenv.config();
import express, {
  NextFunction,
  type Express,
  type Request,
  type Response,
} from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import cors from "cors";

const app: Express = express();
const port = 3000;
const isProduction = process.env.NODE_ENV === "production";

const allowedOrigins = isProduction ? [""] : ["http://localhost:3000"];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Blocked by CORS policy (Unauthorized Origin)"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

const posts = [
  { username: "Jim", title: "Post 1" },
  { username: "Jane", title: "Post 2" },
];

interface JwtReq extends Request {
  user?: string | JwtPayload;
}

// If you don't use Postman, curl should suffice.
// 1. Generate JWT: curl -H "Content-Type: application/json" -X POST -d '{"username": "Jim"}' http://localhost:3000/login
// 2. Use the generated token to get a specific user's data: curl -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_ACTUAL_JWT_STRING" -X GET http://localhost:3000/posts

function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET || "fallback_secret",
    (err, user) => {
      if (err) {
        console.log(err);
        return res.sendStatus(403);
      }

      // Attach user payload to request safely
      (req as JwtReq).user = user;
      next();
    },
  );
}

app.get("/posts", authenticateToken, (req: Request, res: Response) => {
  const jwtReq = req as JwtReq;

  res.json(
    posts.filter((post) => {
      if (jwtReq.user && typeof jwtReq.user !== "string") {
        return post.username === jwtReq.user.name;
      }
      return false;
    }),
  );
});

app.post("/login", (req: Request, res: Response) => {
  const accessToken = jwt.sign(
    { name: req.body.username },
    process.env.ACCESS_TOKEN_SECRET || "fallback_secret",
    { expiresIn: "10m" },
  );
  res.json({ accessToken });
});

app.listen(port, () => {
  console.log(
    `Example app listening on port ${port}, env: ${process.env.NODE_ENV}`,
  );
});
