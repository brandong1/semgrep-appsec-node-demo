"use strict";

const express = require("express");
const { execFile } = require("child_process");

const router = express.Router();

router.get("/ci-logs", (req, res) => {
  const { branch } = req.query;

  if (!branch) {
    return res.status(400).json({ error: "branch query parameter is required" });
  }

  execFile(
    "git",
    ["log", "--oneline", "-10", branch],
    { cwd: process.cwd() },
    (err, stdout, stderr) => {
      if (err) {
        return res.status(500).json({ error: "Failed to retrieve git log", details: stderr });
      }

      const entries = stdout.trim().split("\n").filter(Boolean).map((line) => {
        const [hash, ...rest] = line.split(" ");
        return { hash, message: rest.join(" ") };
      });

      res.json({ branch, entries });
    }
  );
});

module.exports = router;
