import express from "express";
import dotenv from "dotenv";
import postsRoutes from "./routes/posts.routes.js"; // default import
import { PrismaClient } from "@prisma/client";
import cors from "cors";


dotenv.config();
const app = express();
app.use(express.json());
// app.use(cors()); //# un-block cors for all

//# un-block cors for selected urls
app.use(cors({
  origin: "http://localhost:300",
}));

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
  try {
    const results = await prisma.$queryRaw`
      select
        ste.id, ste.spanish, ste.english, ste.flag,
        #sa.audio_file,
        sp.pos,
        pd.description
      from 
        spanish_to_english as ste
      #left join 
       # spanish_audio sa on sa.id = ste.id
      left join 
        spanish_pos sp on sp.id = ste.id
      left join 
        pos_definitions pd on pd.pos = sp.pos;
    `;

    // 2025 Fix: Handle BigInt serialization for res.json()
    const serializedResults = JSON.parse(
      JSON.stringify(results, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    );

    res.json(serializedResults);
  } catch (err) {
    console.error("Database Error:", err);
    res.status(500).json({ error: "Failed to fetch records" });
  }
});


