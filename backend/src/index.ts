import express from "express";

const app = express();

app.get("/", (req, res) => {
  console.log("Hello world");
  res.json({ message: "working fine" });
});

app.listen(3000, () => {
  console.log("Your server had started");
});
