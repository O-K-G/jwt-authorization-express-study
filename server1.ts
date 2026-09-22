import dotenv from "dotenv";
dotenv.config();
import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import bcrypt from "bcrypt";

const app: Express = express();
const PORT = 3001;
const isProduction = process.env.NODE_ENV === "production";

const allowedOrigins = isProduction ? [""] : ["http://localhost:3001"];

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

const users: { name: string; password: string }[] = [];

app.get("/users", (req: Request, res: Response) => {
  res.json(users);
});

// Call with a user: curl -i -X POST http://localhost:3001/users -H "Content-Type: application/json" -H "Origin: http://localhost:3001" -d '{"name":"Mike","password":"yourpassword"}'
app.post("/users", async (req: Request, res: Response) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = { name: req.body.name, password: hashedPassword };
    users.push(user);
    console.log(users);
    res.status(201).send();
  } catch {
    res.sendStatus(500);
  }
});

// Call with a user + password: curl -i -X POST http://localhost:3001/users/login -H "Content-Type: application/json" -H "Origin: http://localhost:3001" -d '{"name":"Mike","password":"yourpassword"}'
app.post("/users/login", async (req: Request, res: Response) => {
  const user = users.find((user) => (user.name = req.body.name));
  if (!user) {
    return res.sendStatus(400).send("Can not find user");
  }

  try {
    // Use this instead of comparing manually. More secure.)
    if (await bcrypt.compare(req.body.password, user.password)) {
      console.log("Success");
      res.send("Success");
    } else {
      res.send("Not allowed");
    }
  } catch {
    res.sendStatus(500).send();
  }
});

app.listen(PORT, () => {
  console.log(
    `Example app listening on port ${PORT}, env: ${process.env.NODE_ENV}`,
  );
});
