// ═══════════════════════════════════════════════════════════
// SELFTRUST - Role-Based Constitutional Drift Detector
// ═══════════════════════════════════════════════════════════

let scenarios = [];
let currentAnalysis = null;

// Load scenarios from JSON
fetch('data/scenarios.json')
  .then(response => {
    if (!response.ok) throw new Error('JSON not found');
    return response.json();
  })
  .then(data => {
    scenarios = data.scenarios;
    console.log(`✅ Loaded ${scenarios.length} scenarios from JSON`);
  })
  .catch(error => {
    console.warn('⚠️ Could not load scenarios.json');
    console.warn('Error:', error);
    alert('Could not load scenarios database. Please check that data/scenarios.json exists.');
  });

// Update context options based on domain (future feature)
function updateContext() {
  // Currently only River System implemented
  // Future: add Forest, Groundwater contexts
}

// Main analysis function with ROLE-BASED logic
function analyze() {
  const domain = document.getElementById("domain").value;
  const context = document.getElementById("context").value;
  const userRole = document.getElementById("userRole").value;
  const observation = document.getElementById("observation").value.trim();

  // Validation
  if (!observation) {
    alert('Please describe what you observed');
    return;
  }

  if (!context) {
    alert('Please select where this happened (context)');
    return;
  }

  // CRITICAL: Role validation
  if (!userRole) {
    alert('⚠️ Please select your role in this situation.\n\nThis is essential for providing appropriate guidance.\n\nYour role selection is confidential and used only for analysis.');
    return;
  }

  // Check if scenarios are loaded
  if (!scenarios || scenarios.length === 0) {
    alert('⚠️ Scenarios database is still loading.\n\nPlease wait a moment and try again.');
    return;
  }

  // Disable button during analysis
  const btn = document.getElementById('analyzeBtn');
  btn.disabled = true;
  btn.textContent = 'Analyzing...';

  // Small delay to show loading state
  setTimeout(() => {
    try {
      // Find matching scenario
      const matchedScenario = findMatchingScenario(observation, domain, context);

      if (!matchedScenario) {
        console.error('No scenario matched');
        alert('⚠️ Could not find matching scenario. Using fallback.');
        if (scenarios.length > 0) {
          displayAnalysis(scenarios[0], observation, userRole);
        }
        btn.disabled = false;
        btn.textContent = 'Analyze Another Situation';
        return;
      }

      console.log('✅ Matched scenario:', matchedScenario.id);
      console.log('👤 User role:', userRole);

      // Display ROLE-BASED analysis
      displayAnalysis(matchedScenario, observation, userRole);

      btn.disabled = false;
      btn.textContent = 'Analyze Another Situation';
      
    } catch (error) {
      console.error('❌ Analysis error:', error);
      console.error('Error stack:', error.stack);
      
      alert(`❌ Analysis Error\n\n${error.message}\n\nPlease check browser console (F12) for details.`);
      
      btn.disabled = false;
      btn.textContent = 'Analyze Situation';
    }
  }, 500);
}

// Smart keyword matching with fuzzy fallback
function findMatchingScenario(observation, domain, context) {
  const lowerObs = observation.toLowerCase();

  // Filter by domain first
  let candidates = scenarios.filter(s => s.domain === domain);

  if (candidates.length === 0) {
    candidates = scenarios;
  }

  // Score each candidate
  let bestMatch = null;
  let bestScore = 0;

  for (const scenario of candidates) {
    let score = 0;
    
    // Check keywords
    if (scenario.keywords && Array.isArray(scenario.keywords)) {
      for (const keyword of scenario.keywords) {
        if (lowerObs.includes(keyword.toLowerCase())) {
          score += 2;
        }
      }
    }
    
    // Context match bonus
    if (scenario.context === context) {
      score += 3;
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = scenario;
    }
  }

  // Fuzzy matching fallback
  if (!bestMatch || bestScore === 0) {
    const commonWords = {
      'construction': 'river_bank_permanent',
      'building': 'river_bank_permanent',
      'sand': 'river_bed_night',
      'mining': 'river_bed_daytime',
      'tractor': 'river_bed_daytime',
      'water': 'river_bank_ongoing',
      'pump': 'river_bank_ongoing',
      'effluent': 'river_flow_night',
      'industrial': 'river_flow_night',
      'sewage': 'river_flow_allday',
      'waste': 'river_flow_allday'
    };

    for (const [word, scenarioId] of Object.entries(commonWords)) {
      if (lowerObs.includes(word)) {
        bestMatch = scenarios.find(s => s.id === scenarioId);
        if (bestMatch) break;
      }
    }
  }

  // Final fallback
  if (!bestMatch && context) {
    bestMatch = candidates.find(s => s.context === context);
  }

  if (!bestMatch) {
    bestMatch = scenarios[0];
  }

  console.log(`Matched: ${bestMatch ? bestMatch.id : 'none'} (score: ${bestScore})`);
  return bestMatch;
}

// ROLE-BASED display analysis
function displayAnalysis(scenario, userObservation, userRole) {
  if (!scenario) {
    console.error('Cannot display: scenario is null');
    alert('Error: No scenario data available');
    return;
  }

  console.log('📊 Displaying analysis for:', scenario.id, '| Role:', userRole);
  
  currentAnalysis = { scenario, userObservation, userRole };
  
  // Show all sections
  document.getElementById('lawSection').classList.remove('hidden');
  document.getElementById('driftSection').classList.remove('hidden');
  document.getElementById('ppdtfSection').classList.remove('hidden');
  document.getElementById('impactSection').classList.remove('hidden');
  document.getElementById('actionsSection').classList.remove('hidden');
  document.getElementById('resultSection').classList.remove('hidden');

  // === LAW INTENT ===
  const lawList = document.getElementById('lawList');
  lawList.innerHTML = '';
  if (scenario.law_intent && Array.isArray(scenario.law_intent)) {
    scenario.law_intent.forEach(law => {
      const li = document.createElement('li');
      li.textContent = law;
      lawList.appendChild(li);
    });
  }

  if (scenario.law_intent_tamil && Array.isArray(scenario.law_intent_tamil)) {
    let tamilHTML = '';
    scenario.law_intent_tamil.forEach(law => {
      tamilHTML += `• ${law}<br>`;
    });
    document.getElementById('lawTamil').innerHTML = tamilHTML;
  }

  // === TRUST DRIFT ===
  const driftList = document.getElementById('driftList');
  driftList.innerHTML = '';
  if (scenario.trust_drift && Array.isArray(scenario.trust_drift)) {
    scenario.trust_drift.forEach(drift => {
      const li = document.createElement('li');
      li.textContent = drift;
      driftList.appendChild(li);
    });
  }

  if (scenario.trust_drift_tamil && Array.isArray(scenario.trust_drift_tamil)) {
    let tamilHTML = '';
    scenario.trust_drift_tamil.forEach(drift => {
      tamilHTML += `• ${drift}<br>`;
    });
    document.getElementById('driftTamil').innerHTML = tamilHTML;
  }

  // === PPDTF BREAKDOWN ===
  displayPPDTF(scenario);

  // === IMPACT EVALUATION ===
  displayImpact(scenario);

  // === ROLE-BASED TRUST SCORE ===
  displayRoleBasedTrustScore(scenario, userRole);

  // === ROLE-BASED ACTIONS (CRITICAL NEW FEATURE) ===
  displayRoleBasedActions(scenario, userRole);

  // === PRINTABLE REPORT ===
  try {
    const reportText = generatePrintableReport(scenario, userObservation, userRole);
    document.getElementById('result').textContent = reportText;
  } catch (error) {
    console.error('Error generating report:', error);
    document.getElementById('result').textContent = 'Error generating report.';
  }

  document.getElementById('printBtn').classList.remove('hidden');
  document.getElementById('lawSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
  
  console.log('✅ Analysis displayed successfully');
}

// Display PPDTF breakdown
function displayPPDTF(scenario) {
  const container = document.getElementById('ppdtfBreakdown');
  container.innerHTML = '';

  if (!scenario.ppdtf) {
    container.innerHTML = '<p style="color: #f87171;">PPDTF data not available</p>';
    return;
  }

  // PEOPLE
  if (scenario.ppdtf.people) {
    const peopleSection = document.createElement('div');
    let peopleHTML = '<h4 style="color: #60a5fa; margin-bottom: 10px;">👥 PEOPLE / மக்கள்</h4>';
    
    for (const [roleKey, roleData] of Object.entries(scenario.ppdtf.people)) {
      if (!roleData) continue;
      
      peopleHTML += `
        <div style="background: #0f172a; padding: 12px; margin-bottom: 10px; border-left: 3px solid #22d3ee; border-radius: 4px;">
          <div style="color: #22d3ee; font-weight: bold; margin-bottom: 5px; text-transform: capitalize;">
            ${roleKey.replace('_', ' ')}
          </div>
          <div style="color: #94a3b8; font-size: 0.9em; margin-bottom: 5px;">
            <strong>Role:</strong> ${roleData.role || 'N/A'}
          </div>
          <div style="color: #94a3b8; font-size: 0.9em; margin-bottom: 5px;">
            <strong>Intent:</strong> ${roleData.intent || 'N/A'}
          </div>
          <div style="color: #f87171; font-size: 0.9em;">
            <strong>Law Intent Break:</strong>
            <ul style="margin: 5px 0 0 20px; padding: 0;">
              ${roleData.law_break && Array.isArray(roleData.law_break) ? roleData.law_break.map(b => `<li>${b}</li>`).join('') : '<li>N/A</li>'}
            </ul>
          </div>
        </div>
      `;
    }
    
    peopleSection.innerHTML = peopleHTML;
    container.appendChild(peopleSection);
  }

  // PROCESS, DATA, TECHNOLOGY, FACILITY (abbreviated for space)
  // Full implementation would include all layers
}

// Display impact evaluation
function displayImpact(scenario) {
  const impactBadge = document.getElementById('impactBadge');
  impactBadge.textContent = scenario.impact_level || 'UNKNOWN';
  impactBadge.className = 'impact-badge impact-' + (scenario.impact_level || 'low').toLowerCase().replace(' ', '-').replace('_', '-');

  if (scenario.impact_factors && scenario.impact_factors.threshold_crossed) {
    const factorsText = document.getElementById('impactFactors');
    if (factorsText) {
      factorsText.textContent = `${scenario.impact_factors.threshold_crossed} out of 4 critical factors crossed`;
    }
  }
}

// ROLE-BASED trust score calculation
function displayRoleBasedTrustScore(scenario, userRole) {
  // Role-specific scoring rules
  const roleScoring = {
    witness: {
      baseline: 100,
      deductions: {
        'silent_witnessing': 20,
        'normalization_acceptance': 20,
        'repeated_inaction': 30
      }
    },
    offender: {
      baseline: 100,
      deductions: {
        'direct_violation': 50,
        'repeated_offense': 30,
        'deliberate_concealment': 20
      }
    },
    facilitator: {
      baseline: 100,
      deductions: {
        'active_enablement': 40,
        'position_abuse': 30,
        'profit_from_harm': 20
      }
    },
    local_authority: {
      baseline: 100,
      deductions: {
        'governance_failure': 40,
        'inaction_despite_knowledge': 30,
        'normalization_allowance': 20
      }
    },
    enforcement: {
      baseline: 100,
      deductions: {
        'enforcement_vacuum': 50,
        'selective_action': 30,
        'regulatory_capture': 20
      }
    }
  };

  const scoring = roleScoring[userRole] || roleScoring.witness;
  let score = scoring.baseline;

  // Apply role-specific deductions
  const appliedDeductions = [];
  
  if (userRole === 'offender') {
    score -= scoring.deductions.direct_violation;
    appliedDeductions.push(['Direct violation', scoring.deductions.direct_violation]);
    
    if (scenario.impact_level === 'HIGH' || scenario.impact_level === 'CRITICAL') {
      score -= scoring.deductions.repeated_offense;
      appliedDeductions.push(['Repeated offense', scoring.deductions.repeated_offense]);
    }
  } else if (userRole === 'witness') {
    score -= scoring.deductions.silent_witnessing;
    score -= scoring.deductions.normalization_acceptance;
    appliedDeductions.push(['Silent witnessing', scoring.deductions.silent_witnessing]);
    appliedDeductions.push(['Normalization acceptance', scoring.deductions.normalization_acceptance]);
  } else if (userRole === 'facilitator') {
    score -= scoring.deductions.active_enablement;
    score -= scoring.deductions.position_abuse;
    appliedDeductions.push(['Active enablement', scoring.deductions.active_enablement]);
    appliedDeductions.push(['Position abuse', scoring.deductions.position_abuse]);
  } else if (userRole === 'local_authority') {
    score -= scoring.deductions.governance_failure;
    score -= scoring.deductions.inaction_despite_knowledge;
    appliedDeductions.push(['Governance failure', scoring.deductions.governance_failure]);
    appliedDeductions.push(['Inaction despite knowledge', scoring.deductions.inaction_despite_knowledge]);
  } else if (userRole === 'enforcement') {
    score -= scoring.deductions.enforcement_vacuum;
    score -= scoring.deductions.selective_action;
    appliedDeductions.push(['Enforcement vacuum', scoring.deductions.enforcement_vacuum]);
    appliedDeductions.push(['Selective action', scoring.deductions.selective_action]);
  }

  score = Math.max(0, score);

  // Display score
  document.getElementById('trustScore').textContent = score;
  
  const status = score >= 80 ? 'Healthy / ஆரோக்கியமான' : 
                 score >= 60 ? 'Declining / சரிவு' : 
                 score >= 40 ? 'Degraded / சீரழிந்த' :
                 'Critical / நெருக்கடி';
  document.getElementById('scoreStatus').textContent = status;

  // Show deductions
  const deductionsList = document.getElementById('deductionsList');
  if (deductionsList) {
    deductionsList.innerHTML = '';
    appliedDeductions.forEach(([reason, points]) => {
      const li = document.createElement('li');
      li.innerHTML = `${reason}: <span style="color: #f87171;">-${points} points</span>`;
      deductionsList.appendChild(li);
    });
  }
}

// ROLE-BASED actions display (CRITICAL NEW FEATURE)
function displayRoleBasedActions(scenario, userRole) {
  const roleText = getRoleDisplayName(userRole);
  document.getElementById('userRoleDisplay').textContent = roleText;

  // Show responsibility context
  const responsibilityDiv = document.getElementById('responsibilityContext');
  const actionsList = document.getElementById('actionsList');
  actionsList.innerHTML = '';

  // Get role-specific actions
  if (scenario.next_actions && scenario.next_actions[userRole]) {
    const actionsData = scenario.next_actions[userRole];
    
    // Show responsibility and trust impact
    if (actionsData.responsibility || actionsData.trust_impact) {
      responsibilityDiv.classList.remove('hidden');
      document.getElementById('responsibilityText').textContent = actionsData.responsibility || 'N/A';
      document.getElementById('trustImpactText').textContent = actionsData.trust_impact || 'N/A';
    } else {
      responsibilityDiv.classList.add('hidden');
    }

    // Display actions
    for (const [level, actions] of Object.entries(actionsData)) {
      if (level === 'responsibility' || level === 'trust_impact') continue;
      if (!Array.isArray(actions)) continue;
      
      const levelHeader = document.createElement('li');
      levelHeader.innerHTML = `<strong style="color: #22d3ee; text-transform: uppercase;">${level.replace('_', ' ')}:</strong>`;
      levelHeader.style.marginTop = '15px';
      actionsList.appendChild(levelHeader);

      actions.forEach(action => {
        const li = document.createElement('li');
        li.textContent = `• ${action}`;
        li.style.marginLeft = '20px';
        li.style.color = '#cbd5e1';
        actionsList.appendChild(li);
      });
    }
  } else {
    // Fallback if role-specific actions not available
    actionsList.innerHTML = `<li style="color: #f59e0b;">Role-specific guidance not yet available for this scenario. This scenario is being updated.</li>`;
  }

  // Tamil actions
  if (scenario.next_actions_tamil && scenario.next_actions_tamil[userRole]) {
    const actionsTamilData = scenario.next_actions_tamil[userRole];
    let tamilHTML = '<br><strong style="color: #60a5fa;">நீங்கள் என்ன செய்யலாம்:</strong><br>';
    
    for (const [level, actions] of Object.entries(actionsTamilData)) {
      if (!Array.isArray(actions)) continue;
      tamilHTML += `<br><strong>${level.toUpperCase()}:</strong><br>`;
      actions.forEach(action => {
        tamilHTML += `• ${action}<br>`;
      });
    }
    document.getElementById('actionsTamil').innerHTML = tamilHTML;
  }
}

// Helper: Get role display name
function getRoleDisplayName(role) {
  const roleNames = {
    'witness': '👁️ You are a WITNESS (சாட்சி)',
    'offender': '⚠️ You are an OFFENDER (குற்றவாளி)',
    'facilitator': '🤝 You are a FACILITATOR (உதவியாளர்)',
    'local_authority': '🏛️ You are a LOCAL AUTHORITY (உள்ளூர் அதிகாரி)',
    'enforcement': '⚖️ You are an ENFORCEMENT AUTHORITY (அமலாக்க அதிகாரி)'
  };
  return roleNames[role] || 'Your Role: ' + role;
}

// Generate printable report with ROLE context
function generatePrintableReport(scenario, observation, userRole) {
  const date = new Date().toLocaleDateString('en-IN');
  const time = new Date().toLocaleTimeString('en-IN');
  
  let report = "";
  
  report += "═══════════════════════════════════════════════════════════════\n";
  report += "                    SELFTRUST ANALYSIS REPORT                   \n";
  report += "         Constitutional Drift Detector for Commons Systems       \n";
  report += "═══════════════════════════════════════════════════════════════\n\n";
  
  report += `Date: ${date}\n`;
  report += `Time: ${time}\n`;
  report += `Report ID: ST-${Date.now()}\n`;
  report += `User Role: ${userRole.toUpperCase()}\n\n`;
  
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
  report += "ROLE-BASED RESPONSIBILITY\n";
  report += "───────────────────────────────────────────────────────────────\n";
  if (scenario.next_actions && scenario.next_actions[userRole]) {
    const roleData = scenario.next_actions[userRole];
    report += `Responsibility: ${roleData.responsibility || 'N/A'}\n`;
    report += `Trust Impact: ${roleData.trust_impact || 'N/A'}\n\n`;
  }
  
  // ... rest of report content (abbreviated for space)
  
  report += "═══════════════════════════════════════════════════════════════\n";
  report += "END OF REPORT\n";
  report += "═══════════════════════════════════════════════════════════════\n";
  
  return report;
}

// Print function
function printReport() {
  if (!currentAnalysis) {
    alert('No analysis available to print');
    return;
  }
  
  const reportText = generatePrintableReport(
    currentAnalysis.scenario, 
    currentAnalysis.userObservation,
    currentAnalysis.userRole
  );
  
  const printWindow = window.open('', '_blank');
  printWindow.document.write('<html><head><title>SelfTrust Analysis Report</title>');
  printWindow.document.write('<style>body { font-family: "Courier New", monospace; white-space: pre-wrap; padding: 20px; }</style>');
  printWindow.document.write('</head><body>');
  printWindow.document.write(reportText);
  printWindow.document.write('</body></html>');
  printWindow.document.close();
  printWindow.print();
}
