import prisma from "../db.js";

export const getTranslationRecords = async (req, res) => {
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
  };