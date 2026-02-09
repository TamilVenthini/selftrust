console.log("SelfTrust engine loaded");

fetch("data/river_sand_incident.yml")
  .then(response => response.text())
  .then(text => {

    console.log("YAML CONTENT START");
    console.log(text);
    console.log("YAML CONTENT END");

    // Impact extraction
    const impactMatch = text.match(/impact_level:\s*\n\s*value:\s*"?(HIGH|MEDIUM|LOW)"?/);
    if (impactMatch) {
      console.log("IMPACT LEVEL DETECTED:", impactMatch[1]);
    }

    // Civic trust score extraction
    const scoreMatch = text.match(/final_score:\s*(\d+)/);
    if (scoreMatch) {
      console.log("CIVIC TRUST SCORE:", scoreMatch[1], "/ 100");
    }

    // Guidance logic
    let guidance = "";
    if (impactMatch && impactMatch[1] === "HIGH") {
      guidance =
        "HIGH impact detected. You are not the offender. " +
        "Silence contributes to normalization. " +
        "Next action: increase visibility without confrontation.";
    }

    console.log("NEXT ACTION GUIDANCE:", guidance);

    // UI Output
    const outputEl = document.getElementById("output");
    if (outputEl && guidance) {
      outputEl.textContent = guidance;
    }

  })
  .catch(error => {
    console.log("Error:", error);
  });
