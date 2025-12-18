import express from "express";
import dotenv from "dotenv";
import postsRoutes from "./routes/posts.routes.js"; // default import
import { PrismaClient } from "@prisma/client";
import cors from "cors";


dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

/*app.use(cors({
  origin: "http://localhost:3000",
}));*/

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
      take: 10
    });

    res.send(posts);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch posts");
  }
});
