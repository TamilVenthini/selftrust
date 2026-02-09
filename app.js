// Load scenarios from JSON
let scenarios = [];
let currentAnalysis = null;

// Load scenarios on page load
fetch('data/scenarios.json')
  .then(response => response.json())
  .then(data => {
    scenarios = data.scenarios;
    console.log(`Loaded ${scenarios.length} scenarios`);
  })
  .catch(error => {
    console.error('Error loading scenarios:', error);
    alert('Could not load scenarios database. Please check that scenarios.json exists in the data folder.');
  });

// Update context options based on domain
function updateContext() {
  const domain = document.getElementById('domain').value;
  const contextSelect = document.getElementById('context');
  
  // For now, only River System is implemented
  // Future: add different contexts for Forest, Groundwater, etc.
}

// Main analysis function
function analyze() {
  const domain = document.getElementById("domain").value;
  const context = document.getElementById("context").value;
  const observation = document.getElementById("observation").value.trim();

  if (!observation) {
    alert('Please describe what you observed');
    return;
  }

  // Disable button during analysis
  const btn = document.getElementById('analyzeBtn');
  btn.disabled = true;
  btn.textContent = 'Analyzing...';

  // Find matching scenario
  const matchedScenario = findMatchingScenario(observation, domain, context);

  if (!matchedScenario) {
    alert('No matching scenario found. Using default river violation analysis.');
    btn.disabled = false;
    btn.textContent = 'Analyze Situation / சம்பவத்தை பகுப்பாய்வு செய்க';
    return;
  }

  // Display analysis
  displayAnalysis(matchedScenario, observation);

  // Re-enable button
  btn.disabled = false;
  btn.textContent = 'Analyze Another Situation';
}

// Smart keyword matching
function findMatchingScenario(observation, domain, context) {
  const lowerObs = observation.toLowerCase();

  // Filter by domain and context first
  let candidates = scenarios.filter(s => 
    s.domain === domain && s.context === context
  );

  // If no exact context match, broaden to all in domain
  if (candidates.length === 0) {
    candidates = scenarios.filter(s => s.domain === domain);
  }

  // Score each candidate by keyword matches
  let bestMatch = null;
  let bestScore = 0;

  for (const scenario of candidates) {
    let score = 0;
    for (const keyword of scenario.keywords) {
      if (lowerObs.includes(keyword.toLowerCase())) {
        score++;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = scenario;
    }
  }

  // If no keyword matches, return first scenario in domain
  return bestMatch || candidates[0] || scenarios[0];
}

// Display full analysis
function displayAnalysis(scenario, userObservation) {
  currentAnalysis = { scenario, userObservation };
  
  // Show all hidden sections
  document.getElementById('lawSection').classList.remove('hidden');
  document.getElementById('driftSection').classList.remove('hidden');
  document.getElementById('ppdtfSection').classList.remove('hidden');
  document.getElementById('impactSection').classList.remove('hidden');
  document.getElementById('actionsSection').classList.remove('hidden');
  document.getElementById('resultSection').classList.remove('hidden');

  // === LAW INTENT ===
  const lawList = document.getElementById('lawList');
  lawList.innerHTML = '';
  scenario.law_intent.forEach(law => {
    const li = document.createElement('li');
    li.textContent = law;
    lawList.appendChild(li);
  });

  // Tamil law intent
  if (scenario.law_intent_tamil) {
    let tamilHTML = '';
    scenario.law_intent_tamil.forEach(law => {
      tamilHTML += `• ${law}<br>`;
    });
    document.getElementById('lawTamil').innerHTML = tamilHTML;
  }

  // === TRUST DRIFT ===
  const driftList = document.getElementById('driftList');
  driftList.innerHTML = '';
  scenario.trust_drift.forEach(drift => {
    const li = document.createElement('li');
    li.textContent = drift;
    driftList.appendChild(li);
  });

  // Tamil trust drift
  if (scenario.trust_drift_tamil) {
    let tamilHTML = '';
    scenario.trust_drift_tamil.forEach(drift => {
      tamilHTML += `• ${drift}<br>`;
    });
    document.getElementById('driftTamil').innerHTML = tamilHTML;
  }

  // === PPDTF DETAILED BREAKDOWN ===
  const ppdtfContainer = document.getElementById('ppdtfBreakdown');
  ppdtfContainer.innerHTML = '';

  // PEOPLE Section
  if (scenario.ppdtf.people) {
    const peopleSection = document.createElement('div');
    peopleSection.className = 'ppdtf-category';
    
    let peopleHTML = '<h4 style="color: #60a5fa; margin-bottom: 10px;">👥 PEOPLE / மக்கள்</h4>';
    
    for (const [roleKey, roleData] of Object.entries(scenario.ppdtf.people)) {
      peopleHTML += `
        <div style="background: #0f172a; padding: 12px; margin-bottom: 10px; border-left: 3px solid #22d3ee; border-radius: 4px;">
          <div style="color: #22d3ee; font-weight: bold; margin-bottom: 5px; text-transform: capitalize;">
            ${roleKey.replace('_', ' ')}
          </div>
          <div style="color: #94a3b8; font-size: 0.9em; margin-bottom: 5px;">
            <strong>Role:</strong> ${roleData.role}
          </div>
          <div style="color: #94a3b8; font-size: 0.9em; margin-bottom: 5px;">
            <strong>Intent:</strong> ${roleData.intent}
          </div>
          <div style="color: #f87171; font-size: 0.9em;">
            <strong>Law Intent Break:</strong>
            <ul style="margin: 5px 0 0 20px; padding: 0;">
              ${roleData.law_break.map(b => `<li>${b}</li>`).join('')}
            </ul>
          </div>
        </div>
      `;
    }
    
    peopleSection.innerHTML = peopleHTML;
    ppdtfContainer.appendChild(peopleSection);
  }

  // PROCESS Section
  if (scenario.ppdtf.process) {
    const processSection = document.createElement('div');
    processSection.className = 'ppdtf-category';
    
    processSection.innerHTML = `
      <h4 style="color: #60a5fa; margin-bottom: 10px; margin-top: 20px;">📋 PROCESS / நடைமுறை</h4>
      <div style="background: #0f172a; padding: 12px; border-radius: 4px;">
        <div style="margin-bottom: 10px;">
          <strong style="color: #22d3ee;">Expected:</strong>
          <div style="color: #94a3b8; font-size: 0.9em;">${scenario.ppdtf.process.expected}</div>
          <div style="color: #64748b; font-size: 0.85em; margin-top: 3px;">
            Intent: ${scenario.ppdtf.process.expected_intent.join(', ')}
          </div>
        </div>
        <div style="margin-bottom: 10px;">
          <strong style="color: #f59e0b;">Observed:</strong>
          <div style="color: #94a3b8; font-size: 0.9em;">${scenario.ppdtf.process.observed}</div>
        </div>
        <div>
          <strong style="color: #f87171;">Breaks:</strong>
          <ul style="margin: 5px 0 0 20px; padding: 0; color: #f87171; font-size: 0.9em;">
            ${scenario.ppdtf.process.breaks.map(b => `<li>${b}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
    
    ppdtfContainer.appendChild(processSection);
  }

  // DATA Section
  if (scenario.ppdtf.data) {
    const dataSection = document.createElement('div');
    dataSection.className = 'ppdtf-category';
    
    dataSection.innerHTML = `
      <h4 style="color: #60a5fa; margin-bottom: 10px; margin-top: 20px;">📊 DATA / தரவு</h4>
      <div style="background: #0f172a; padding: 12px; border-radius: 4px;">
        <div style="margin-bottom: 10px;">
          <strong style="color: #22d3ee;">Expected:</strong>
          <div style="color: #94a3b8; font-size: 0.9em;">${scenario.ppdtf.data.expected.join(', ')}</div>
          <div style="color: #64748b; font-size: 0.85em; margin-top: 3px;">
            Intent: ${scenario.ppdtf.data.expected_intent.join(', ')}
          </div>
        </div>
        <div style="margin-bottom: 10px;">
          <strong style="color: #f59e0b;">Observed:</strong>
          <div style="color: #94a3b8; font-size: 0.9em;">${scenario.ppdtf.data.observed}</div>
        </div>
        <div>
          <strong style="color: #f87171;">Breaks:</strong>
          <ul style="margin: 5px 0 0 20px; padding: 0; color: #f87171; font-size: 0.9em;">
            ${scenario.ppdtf.data.breaks.map(b => `<li>${b}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
    
    ppdtfContainer.appendChild(dataSection);
  }

  // TECHNOLOGY Section
  if (scenario.ppdtf.technology) {
    const techSection = document.createElement('div');
    techSection.className = 'ppdtf-category';
    
    techSection.innerHTML = `
      <h4 style="color: #60a5fa; margin-bottom: 10px; margin-top: 20px;">💻 TECHNOLOGY / தொழில்நுட்பம்</h4>
      <div style="background: #0f172a; padding: 12px; border-radius: 4px;">
        <div style="margin-bottom: 10px;">
          <strong style="color: #22d3ee;">Expected:</strong>
          <div style="color: #94a3b8; font-size: 0.9em;">${scenario.ppdtf.technology.expected.join(', ')}</div>
          <div style="color: #64748b; font-size: 0.85em; margin-top: 3px;">
            Intent: ${scenario.ppdtf.technology.expected_intent.join(', ')}
          </div>
        </div>
        <div style="margin-bottom: 10px;">
          <strong style="color: #f59e0b;">Observed:</strong>
          <div style="color: #94a3b8; font-size: 0.9em;">${scenario.ppdtf.technology.observed}</div>
        </div>
        <div>
          <strong style="color: #f87171;">Breaks:</strong>
          <ul style="margin: 5px 0 0 20px; padding: 0; color: #f87171; font-size: 0.9em;">
            ${scenario.ppdtf.technology.breaks.map(b => `<li>${b}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
    
    ppdtfContainer.appendChild(techSection);
  }

  // FACILITY Section
  if (scenario.ppdtf.facility) {
    const facilitySection = document.createElement('div');
    facilitySection.className = 'ppdtf-category';
    
    facilitySection.innerHTML = `
      <h4 style="color: #60a5fa; margin-bottom: 10px; margin-top: 20px;">🏛️ FACILITY / வசதி</h4>
      <div style="background: #0f172a; padding: 12px; border-radius: 4px;">
        <div style="margin-bottom: 10px;">
          <strong style="color: #22d3ee;">Asset:</strong>
          <div style="color: #94a3b8; font-size: 0.9em;">${scenario.ppdtf.facility.asset}</div>
        </div>
        <div style="margin-bottom: 10px;">
          <strong style="color: #22d3ee;">Expected Governance:</strong>
          <div style="color: #94a3b8; font-size: 0.9em;">${scenario.ppdtf.facility.expected}</div>
          <div style="color: #64748b; font-size: 0.85em; margin-top: 3px;">
            Intent: ${scenario.ppdtf.facility.expected_intent.join(', ')}
          </div>
        </div>
        <div style="margin-bottom: 10px;">
          <strong style="color: #f59e0b;">Observed:</strong>
          <div style="color: #94a3b8; font-size: 0.9em;">${scenario.ppdtf.facility.observed}</div>
        </div>
        <div>
          <strong style="color: #f87171;">Breaks:</strong>
          <ul style="margin: 5px 0 0 20px; padding: 0; color: #f87171; font-size: 0.9em;">
            ${scenario.ppdtf.facility.breaks.map(b => `<li>${b}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
    
    ppdtfContainer.appendChild(facilitySection);
  }

  // === IMPACT EVALUATION ===
  const impactBadge = document.getElementById('impactBadge');
  impactBadge.textContent = scenario.impact_level;
  impactBadge.className = 'impact-badge impact-' + scenario.impact_level.toLowerCase();

  // Show impact factors
  if (scenario.impact_factors) {
    const factorsText = document.getElementById('impactFactors');
    factorsText.textContent = `${scenario.impact_factors.threshold_crossed} out of 4 critical factors crossed`;
  }

  // === TRUST SCORE ===
  document.getElementById('trustScore').textContent = scenario.trust_score;
  const status = scenario.trust_score >= 80 ? 'Healthy / ஆரோக்கியமான' : 
                 scenario.trust_score >= 60 ? 'Declining / சரிவு' : 'Degraded / சீரழிந்த';
  document.getElementById('scoreStatus').textContent = status;

  // Show deductions if available
  if (scenario.trust_deductions) {
    const deductionsList = document.getElementById('deductionsList');
    deductionsList.innerHTML = '';
    for (const [reason, points] of Object.entries(scenario.trust_deductions)) {
      const li = document.createElement('li');
      li.innerHTML = `${reason.replace('_', ' ')}: <span style="color: #f87171;">-${points} points</span>`;
      deductionsList.appendChild(li);
    }
  }

  // === ROLE-BASED ACTIONS ===
  const userRole = scenario.user_role || 'witness';
  const actionsData = scenario.next_actions[userRole];
  const actionsTamilData = scenario.next_actions_tamil ? scenario.next_actions_tamil[userRole] : null;

  document.getElementById('userRole').textContent = userRole === 'witness' ? 
    'You are a WITNESS (சாட்சி)' : 
    userRole === 'authority' ? 'You are an AUTHORITY (அதிகாரி)' : 
    'Your Role';

  const actionsList = document.getElementById('actionsList');
  actionsList.innerHTML = '';

  if (actionsData) {
    for (const [level, actions] of Object.entries(actionsData)) {
      const levelHeader = document.createElement('li');
      levelHeader.innerHTML = `<strong style="color: #22d3ee; text-transform: uppercase;">${level} ${level === 'low' ? 'Risk' : level === 'medium' ? 'Risk' : 'Effort'}:</strong>`;
      levelHeader.style.marginTop = '10px';
      actionsList.appendChild(levelHeader);

      actions.forEach(action => {
        const li = document.createElement('li');
        li.textContent = `• ${action}`;
        li.style.marginLeft = '20px';
        li.style.color = '#cbd5e1';
        actionsList.appendChild(li);
      });
    }
  }

  // Tamil actions
  if (actionsTamilData) {
    let tamilHTML = '<br><strong style="color: #60a5fa;">நீங்கள் என்ன செய்யலாம்:</strong><br>';
    for (const [level, actions] of Object.entries(actionsTamilData)) {
      tamilHTML += `<br><strong>${level.toUpperCase()}:</strong><br>`;
      actions.forEach(action => {
        tamilHTML += `• ${action}<br>`;
      });
    }
    document.getElementById('actionsTamil').innerHTML = tamilHTML;
  }

  // === SYSTEM INTERPRETATION (PRINTABLE) ===
  const resultText = generatePrintableReport(scenario, userObservation);
  document.getElementById('result').textContent = resultText;

  // Add print button
  document.getElementById('printBtn').classList.remove('hidden');

  // Scroll to law section
  document.getElementById('lawSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Generate printable report
function generatePrintableReport(scenario, observation) {
  const date = new Date().toLocaleDateString('en-IN');
  const time = new Date().toLocaleTimeString('en-IN');
  
  let report = "";
  
  report += "═══════════════════════════════════════════════════════════════\n";
  report += "                    SELFTRUST ANALYSIS REPORT                   \n";
  report += "         Constitutional Drift Detector for Commons Systems       \n";
  report += "═══════════════════════════════════════════════════════════════\n\n";
  
  report += `Date: ${date}\n`;
  report += `Time: ${time}\n`;
  report += `Report ID: ST-${Date.now()}\n\n`;
  
  report += "───────────────────────────────────────────────────────────────\n";
  report += "OBSERVATION\n";
  report += "───────────────────────────────────────────────────────────────\n";
  report += observation + "\n\n";
  
  report += "───────────────────────────────────────────────────────────────\n";
  report += "SCENARIO CLASSIFICATION\n";
  report += "───────────────────────────────────────────────────────────────\n";
  report += `Title (EN): ${scenario.title_en}\n`;
  report += `Title (TA): ${scenario.title}\n`;
  report += `Nature: ${scenario.nature}\n`;
  report += `Domain: ${scenario.domain}\n`;
  report += `Context: ${scenario.context}\n\n`;
  
  report += "───────────────────────────────────────────────────────────────\n";
  report += "LAW INTENT ANALYSIS\n";
  report += "───────────────────────────────────────────────────────────────\n";
  scenario.law_intent.forEach((law, i) => {
    report += `${i + 1}. ${law}\n`;
  });
  report += "\n";
  
  report += "───────────────────────────────────────────────────────────────\n";
  report += "TRUST BOUNDARY DRIFT DETECTION\n";
  report += "───────────────────────────────────────────────────────────────\n";
  scenario.trust_drift.forEach((drift, i) => {
    report += `${i + 1}. ${drift}\n`;
  });
  report += "\n";
  
  report += "───────────────────────────────────────────────────────────────\n";
  report += "PPDTF FRAMEWORK ANALYSIS\n";
  report += "───────────────────────────────────────────────────────────────\n\n";
  
  // PEOPLE
  report += "PEOPLE (மக்கள்):\n";
  report += "────────────────\n";
  for (const [roleKey, roleData] of Object.entries(scenario.ppdtf.people)) {
    report += `\n${roleKey.toUpperCase().replace('_', ' ')}:\n`;
    report += `  Role: ${roleData.role}\n`;
    report += `  Intent: ${roleData.intent}\n`;
    report += `  Law Intent Breaks:\n`;
    roleData.law_break.forEach(b => {
      report += `    • ${b}\n`;
    });
  }
  report += "\n";
  
  // PROCESS
  report += "PROCESS (நடைமுறை):\n";
  report += "────────────────\n";
  report += `Expected: ${scenario.ppdtf.process.expected}\n`;
  report += `Expected Intent: ${scenario.ppdtf.process.expected_intent.join(', ')}\n`;
  report += `Observed: ${scenario.ppdtf.process.observed}\n`;
  report += `Breaks:\n`;
  scenario.ppdtf.process.breaks.forEach(b => {
    report += `  • ${b}\n`;
  });
  report += "\n";
  
  // DATA
  report += "DATA (தரவு):\n";
  report += "────────────────\n";
  report += `Expected: ${scenario.ppdtf.data.expected.join(', ')}\n`;
  report += `Expected Intent: ${scenario.ppdtf.data.expected_intent.join(', ')}\n`;
  report += `Observed: ${scenario.ppdtf.data.observed}\n`;
  report += `Breaks:\n`;
  scenario.ppdtf.data.breaks.forEach(b => {
    report += `  • ${b}\n`;
  });
  report += "\n";
  
  // TECHNOLOGY
  report += "TECHNOLOGY (தொழில்நுட்பம்):\n";
  report += "────────────────\n";
  report += `Expected: ${scenario.ppdtf.technology.expected.join(', ')}\n`;
  report += `Expected Intent: ${scenario.ppdtf.technology.expected_intent.join(', ')}\n`;
  report += `Observed: ${scenario.ppdtf.technology.observed}\n`;
  report += `Breaks:\n`;
  scenario.ppdtf.technology.breaks.forEach(b => {
    report += `  • ${b}\n`;
  });
  report += "\n";
  
  // FACILITY
  report += "FACILITY (வசதி):\n";
  report += "────────────────\n";
  report += `Asset: ${scenario.ppdtf.facility.asset}\n`;
  report += `Expected Governance: ${scenario.ppdtf.facility.expected}\n`;
  report += `Expected Intent: ${scenario.ppdtf.facility.expected_intent.join(', ')}\n`;
  report += `Observed: ${scenario.ppdtf.facility.observed}\n`;
  report += `Breaks:\n`;
  scenario.ppdtf.facility.breaks.forEach(b => {
    report += `  • ${b}\n`;
  });
  report += "\n";
  
  report += "───────────────────────────────────────────────────────────────\n";
  report += "IMPACT EVALUATION\n";
  report += "───────────────────────────────────────────────────────────────\n";
  report += `Impact Level: ${scenario.impact_level}\n`;
  if (scenario.impact_factors) {
    report += `Factors Crossed: ${scenario.impact_factors.threshold_crossed} / 4\n`;
    report += `  • Facility Damage: ${scenario.impact_factors.facility_damage ? 'YES' : 'NO'}\n`;
    report += `  • Data Absence: ${scenario.impact_factors.data_absence ? 'YES' : 'NO'}\n`;
    report += `  • Repeated Occurrence: ${scenario.impact_factors.repeated_occurrence ? 'YES' : 'NO'}\n`;
    report += `  • Social Normalization: ${scenario.impact_factors.social_normalization ? 'YES' : 'NO'}\n`;
  }
  report += "\n";
  
  report += "───────────────────────────────────────────────────────────────\n";
  report += "CIVIC TRUST EVALUATION\n";
  report += "───────────────────────────────────────────────────────────────\n";
  report += `Baseline Score: 100\n`;
  if (scenario.trust_deductions) {
    for (const [reason, points] of Object.entries(scenario.trust_deductions)) {
      report += `Deduction (${reason.replace('_', ' ')}): -${points}\n`;
    }
  }
  report += `Final Civic Trust Score: ${scenario.trust_score} / 100\n`;
  const status = scenario.trust_score >= 80 ? 'Healthy' : 
                 scenario.trust_score >= 60 ? 'Declining' : 'Degraded';
  report += `Status: ${status}\n\n`;
  
  report += "───────────────────────────────────────────────────────────────\n";
  report += "RECOMMENDED ACTIONS (Role-Based)\n";
  report += "───────────────────────────────────────────────────────────────\n";
  const userRole = scenario.user_role || 'witness';
  report += `Your Role: ${userRole.toUpperCase()}\n\n`;
  
  const actionsData = scenario.next_actions[userRole];
  if (actionsData) {
    for (const [level, actions] of Object.entries(actionsData)) {
      report += `${level.toUpperCase()} ${level === 'low' || level === 'medium' || level === 'high' ? 'RISK' : 'PRIORITY'}:\n`;
      actions.forEach(action => {
        report += `  • ${action}\n`;
      });
      report += "\n";
    }
  }
  
  report += "───────────────────────────────────────────────────────────────\n";
  report += "SYSTEM INTERPRETATION\n";
  report += "───────────────────────────────────────────────────────────────\n";
  report += "This situation represents a constitutional drift where legal intent\n";
  report += "(protection of commons) diverges from ground reality (normalized\n";
  report += "violation). The silence of witnesses and weak enforcement create\n";
  report += "conditions for systematic degradation of shared natural resources.\n\n";
  
  report += "Trust boundaries have eroded across multiple levels:\n";
  report += "  • Citizen-River relationship invisibilized\n";
  report += "  • State trusteeship weakly operationalized\n";
  report += "  • Community silence prioritized over commons protection\n";
  report += "  • Law-enforcement gap enables continued violations\n\n";
  
  report += "Recovery is possible through:\n";
  report += "  • Increased visibility (data creation and reporting)\n";
  report += "  • Breaking normalization (civic awareness campaigns)\n";
  report += "  • Strengthening trust boundaries (governance reform)\n";
  report += "  • Proactive detection mechanisms (technology deployment)\n\n";
  
  report += "═══════════════════════════════════════════════════════════════\n";
  report += "END OF REPORT\n";
  report += "═══════════════════════════════════════════════════════════════\n";
  report += `\nGenerated by SelfTrust v1.0 | Law Version: 2025-02-08\n`;
  report += "Constitution of India + Tamil Nadu State Laws\n";
  report += "\nThis report is for civic awareness and governance analysis.\n";
  report += "It is NOT a legal complaint or FIR.\n";
  
  return report;
}

// Print function
function printReport() {
  if (!currentAnalysis) {
    alert('No analysis available to print');
    return;
  }
  
  const reportText = generatePrintableReport(currentAnalysis.scenario, currentAnalysis.userObservation);
  
  // Create print window
  const printWindow = window.open('', '_blank');
  printWindow.document.write('<html><head><title>SelfTrust Analysis Report</title>');
  printWindow.document.write('<style>');
  printWindow.document.write('body { font-family: "Courier New", monospace; white-space: pre-wrap; padding: 20px; }');
  printWindow.document.write('</style></head><body>');
  printWindow.document.write(reportText);
  printWindow.document.write('</body></html>');
  printWindow.document.close();
  printWindow.print();
}

