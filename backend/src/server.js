import express from "express";
import dotenv from "dotenv";
import postsRoutes from "./routes/posts.routes.js";
import translationRoutes from "./routes/translationRecords.routes.js";

import { PrismaClient } from "@prisma/client";
import cors from "cors";


dotenv.config();
const app = express();
app.use(express.json());
app.use(cors()); //# un-block cors for all

//# un-block cors for selected urls
// app.use(cors({
//   origin: "http://localhost:3000",
// }));

const prisma = new PrismaClient();
const port = process.env.PORT || 4001;

app.use("/api/posts", postsRoutes);
app.use("/api/records", translationRoutes);

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${port}`);
});

  app.get("/api/pos", async (req, res) => {
    const fullUrl = `http://localhost:4001${req.originalUrl}`;
    console.log("URL:", fullUrl);
    console.log("Query:", req.query);

      console.log("API HIT:", Date.now());

    try {

      const results = await prisma.$queryRaw`SELECT
        DISTINCT pos , description from pos_definitions    
      `;

      const serializedResults = JSON.parse(
        JSON.stringify(results, (_, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );

      res.json({
        data: serializedResults
      });
    } catch (err) {
      console.error("Database Error:", err);
      res.status(500).json({ error: "Failed to fetch records" });
    }
  });


app.post("/api/addrecords", async (req, res) => {
  const { spanish, english, flag, pos = [] } = req.body;

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1️⃣ Insert main record
      const insertResult = await tx.$queryRaw`
        INSERT INTO spanish_to_english (spanish, english, flag, created, updated)
        VALUES (${spanish}, ${english}, ${flag}, NOW(), NOW())
      `;

      // 2️⃣ Get last inserted ID
      const [{ id }] = await tx.$queryRaw`
        SELECT LAST_INSERT_ID() as id
      `;

      // 3️⃣ Insert POS values
      for (const p of pos) {
        await tx.$queryRaw`
          INSERT INTO spanish_pos (id, pos, created, updated)
          VALUES (${id}, ${p}, NOW(), NOW())
        `;
      }

      return { id };
    });

    res.status(201).json({
      message: "Record created successfully",
      data: result,
    });
  } catch (err) {
    console.error("Database Error:", err);
    res.status(500).json({ error: "Failed to add record" });
  }
});
