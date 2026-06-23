"use strict";

const express = require("express");
const { authMiddleware } = require("./middleware/auth");
const healthRouter = require("./routes/health");
const meRouter     = require("./routes/me");
const tasksRouter  = require("./routes/tasks");

const app = express();
app.use(express.json());
app.use(authMiddleware);

app.use("/health", healthRouter);
app.use("/me",     meRouter);
app.use("/tasks",  tasksRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Demo app running on http://localhost:${PORT}`);
});

module.exports = app;

const authCallbackRouter = require("./routes/auth-callback");
app.use("/", authCallbackRouter);
