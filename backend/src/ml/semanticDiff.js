import { pipeline } from "@xenova/transformers";

// Singleton embedder (VERY important for performance)
let embedder;

async function getEmbedder() {
  if (!embedder) {
    embedder = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
  }
  return embedder;
}

// Cosine similarity
function cosineSimilarity(vecA, vecB) {
  const dot = vecA.reduce((sum, v, i) => sum + v * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, v) => sum + v * v, 0));
  const magB = Math.sqrt(vecB.reduce((sum, v) => sum + v * v, 0));
  return dot / (magA * magB);
}

export async function semanticDiff(oldClauses, newClauses) {
  const model = await getEmbedder();

  // Generate embeddings
  const oldEmbeddings = await model(
    oldClauses.map(c => c.text),
    { pooling: "mean", normalize: true }
  );

  const newEmbeddings = await model(
    newClauses.map(c => c.text),
    { pooling: "mean", normalize: true }
  );

  const results = [];
  const matchedNew = new Set();

  for (let i = 0; i < oldClauses.length; i++) {
    let bestMatch = { score: -1, index: -1 };

    for (let j = 0; j < newClauses.length; j++) {
      const score = cosineSimilarity(
        oldEmbeddings[i].data,
        newEmbeddings[j].data
      );

      if (score > bestMatch.score) {
        bestMatch = { score, index: j };
      }
    }

    if (bestMatch.score >= 0.9) {
      matchedNew.add(bestMatch.index);
      results.push({
        oldClause: oldClauses[i],
        newClause: newClauses[bestMatch.index],
        change_type: "unchanged",
        similarity: Number(bestMatch.score.toFixed(2))
      });
    } else if (bestMatch.score >= 0.6) {
      matchedNew.add(bestMatch.index);
      results.push({
        oldClause: oldClauses[i],
        newClause: newClauses[bestMatch.index],
        change_type: "modified",
        similarity: Number(bestMatch.score.toFixed(2))
      });
    } else {
      results.push({
        oldClause: oldClauses[i],
        newClause: null,
        change_type: "removed",
        similarity: Number(bestMatch.score.toFixed(2))
      });
    }
  }

  // Detect added clauses
  newClauses.forEach((clause, index) => {
    if (!matchedNew.has(index)) {
      results.push({
        oldClause: null,
        newClause: clause,
        change_type: "added",
        similarity: null
      });
    }
  });

  return results;
}
