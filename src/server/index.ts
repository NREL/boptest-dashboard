import express from "express";
import cors from "cors";
import path from "path";
import bodyParser from "body-parser";

import {getUsers, authDbConnection} from "./db";


const app: express.Application = express();
app.use(cors());
app.use(bodyParser.json());

const { PORT = 8080 } = process.env;

// serve static files from the React app
app.use(express.static(path.join(__dirname, "/usr/client/build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// handle api endpoints
app.get("/test", (req: express.Request, res: express.Response) => {
  res.send({
    message: "hello world!",
  });
});

// app.get("/accounts", async (req: Request, res: Response) => {
//   const users = await getUsers();

//   res.json(users);
// });

app.post("/user", async (req, res) => {
  console.log("direct access: " + req.body.name);
  console.log("array access: " + req.body["name"]);

  const name = req.body.name;
  //const user = await User.create({ name: name });

  //res.json(user);
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log("server started at http://localhost:" + PORT);
    authDbConnection();
  });
}

export default app;