const multer = require("multer");
const express = require("express");
require("dotenv").config({ path: ".env" });

const { getObject, putObject } = require("./s3");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({
  storage: multer.memoryStorage(),
});

app.get("/", function (req, res) {
  return res.status(200).send("Hello World");
});

app.get("/get/:key", async function (req, res) {
  try {
    const url = await getObject(req.params.key);
    return res.status(200).json({ url });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
});

app.post("/upload", upload.single("file"), async function (req, res) {
  try {
    const body = req.file.buffer;
    const mimetype = req.file.mimetype;

    if (!body) {
      return res.status(400).send("File is required");
    }

    const key = req.body.key + "." + mimetype.split("/")[1];
    await putObject(key, body, mimetype);

    const url = await getObject(key);
    return res.status(200).json({ url });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
});

app.listen(process.env.PORT, function () {
  console.log("Server is running on port " + process.env.PORT);
});
