export function calculateCosineSimilarity(vectorA, vectorB) {
    const matchingValues = [
      vectorA.ipk >= vectorB.ipkRequirement,
      vectorA.semester >= vectorB.semester,
      vectorA.major.toLowerCase() === vectorB.major.toLowerCase(),
      vectorA.level.toLowerCase() === vectorB.level.toLowerCase(),
    ];
  
    const dotProduct = matchingValues.reduce((sum, value) => sum + (value ? 1 : 0), 0);
  
    const magnitudeVectorA = Math.sqrt(matchingValues.length);
    const magnitudeVectorB = Math.sqrt(Object.values(vectorB).length - 1); // Exclude 'id' from magnitude
  
    const cosineSimilarity = dotProduct / (magnitudeVectorA * magnitudeVectorB);
    return cosineSimilarity;
  }
  
  function calculateMatchingValues(userVector, beasiswa) {
    return [
      userVector.ipk >= beasiswa.ipkRequirement,
      userVector.semester >= beasiswa.semester,
      userVector.major.toLowerCase() === beasiswa.major.toLowerCase(),
      userVector.level.toLowerCase() === beasiswa.level.toLowerCase(),
    ];
  }
  