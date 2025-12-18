import prisma from "../db.js";

export const getPosts = async (req, res) => {
  const posts = await prisma.post.findMany();
  res.json(posts);
};
