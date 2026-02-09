console.log("SelfTrust engine loaded");

fetch("data/river_sand_incident.yml")
  .then(response => response.text())
  .then(text => {
    console.log("YAML CONTENT START");
    console.log(text);
    console.log("YAML CONTENT END");

const impactMatch = text.match(/impact_level:\s*\n\s*value:\s*"?(HIGH|MEDIUM|LOW)"?/);

if (impactMatch) {
  console.log("IMPACT LEVEL DETECTED:", impactMatch[1]);
} else {
  console.log("Impact level not detected");
}

const scoreMatch = text.match(/final_score:\s*(\d+)/);

if (scoreMatch) {
  console.log("CIVIC TRUST SCORE:", scoreMatch[1], "/ 100");
} else {
  console.log("Civic trust score not detected");
}

  })
  .catch(error => {
    console.log("Error reading YAML:", error);
  });
