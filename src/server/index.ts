import * as cors from "cors";
import * as express from "express";
import * as path from "path";
import * as bodyParser from "body-parser";

import { Sequelize } from "sequelize";
import { User } from "./models/user";

const app = express();
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
    message: "hello world",
  });
});

app.get("/users", async (req: express.Request, res: express.Response) => {
  const users = await User.findAll();

  res.json(users);
});

app.post("/user", async (req, res) => {
  console.log("direct access: " + req.body.name);
  console.log("array access: " + req.body["name"]);

  const name = req.body.name;
  const user = await User.create({ name: name });

  res.json(user);
});

var models = require("./models");
models.sequelize.sync().then(function () {
  if (require.main === module) {
    app.listen(PORT, () => {
      console.log("server started at http://localhost:" + PORT);
    });
  }
});

// if (require.main === module) {
//   app.listen(PORT, () => {
//     console.log("server started at http://localhost:" + PORT);
//   });
// }

export default app;
