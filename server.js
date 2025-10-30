import express from "express";
import db from "./config/db.js";
import mroute from "./routes/menu.js";
import troute from "./routes/table.js";
import oroutes from "./routes/order.js";
import cors from "cors";
import croutes from "./routes/chef.js";
import dotenv from "dotenv";

dotenv.config();


db();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Correct CORS setup for multiple origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://usersappt.netlify.app",
  "https://restaurantpp.netlify.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // needed only if using cookies/auth headers
    allowedHeaders: ["Content-Type", "x-api-key"],
  })
);

app.use("/api/menu", mroute);
app.use("/api/table", troute);
app.use("/api/order", oroutes);
app.use("/api/chef",croutes);

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(3000, () => {
  console.log(`✅ Server running at http://localhost:3000`);
});
