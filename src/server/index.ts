import * as cors from "cors";
import * as express from "express";
import * as path from "path";

const app = express();
app.use(cors());

const { PORT = 8080 } = process.env;

// serve static files from the React app
app.use(express.static(path.join(__dirname, "/usr/client/build")));

// handle api endpoints
app.get("/", (req: express.Request, res: express.Response) => {
  res.send({
    message: "hello world",
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log("server started at http://localhost:" + PORT);
  });
}

export default app;
