import express from "express";
import dotenv from "dotenv";
import postsRoutes from "./routes/posts.routes.js"; // default import
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

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${port}`);
});


app.get("/posts", async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        userId: true,
        title: true,
        body: true,
        createdAt: true
      },
      orderBy: {
        id: "desc"
      },
      take: 100
    });

    res.send(posts);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch posts");
  }
});



app.get("/getPosts", async (req, res) => {
  try {
    const result = await prisma.post.findMany({
      where: {
        userId: 1, // Filter criteria goes here
      },
      orderBy: {
        title: 'asc', // Sorting goes here
      },
      select: {
        title: true, // Specific fields to return go here
        id: true     // You can add more fields if needed
      },
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch posts **");
  }
});






  app.get("/getRecords", async (req, res) => {
    const fullUrl = `http://localhost:4001${req.originalUrl}`;
    console.log("URL:", fullUrl);
    console.log("Query:", req.query);

    const search = req.query.search ?? "";
    const page = Number(req.query.page ?? 0);
    const recordLimit = Number(req.query.recordLimit ?? 100);
    const offset = page * recordLimit;
    const flag = req.query.flag ?? "";

    try {

      const results = await prisma.$queryRaw`SELECT
          ste.id,
          ste.spanish,
          ste.english,
          ste.flag,
          GROUP_CONCAT(DISTINCT  sa.audio_file ORDER BY  sa.audio_file SEPARATOR ', ') AS audio_file,
          GROUP_CONCAT(DISTINCT sp.pos ORDER BY sp.pos SEPARATOR ', ') AS pos,
          GROUP_CONCAT(DISTINCT pd.description ORDER BY pd.description SEPARATOR ', ') AS description
        FROM spanish_to_english ste
        LEFT JOIN spanish_audio sa on sa.id = ste.id
        LEFT JOIN spanish_pos sp ON sp.id = ste.id
        LEFT JOIN pos_definitions pd ON pd.pos = sp.pos
        WHERE (
          ${search} = ''
          OR ste.spanish LIKE ${'%' + search + '%'}
          OR ste.english LIKE ${'%' + search + '%'}
        )
          AND 
          (
            ${flag} = ''
            OR ste.flag = ${ flag }
          )
        GROUP BY
          ste.id`;

      // ✅ BigInt-safe JSON serialization
      const serializedResults = JSON.parse(
        JSON.stringify(results, (_, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );

      res.json({
        page,
        recordLimit,
        count: serializedResults.length,
        data: serializedResults,
      });
    } catch (err) {
      console.error("Database Error:", err);
      res.status(500).json({ error: "Failed to fetch records" });
    }
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
