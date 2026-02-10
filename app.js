// Load scenarios from JSON
let scenarios = [];
let currentAnalysis = null;

// Embedded fallback scenario (in case JSON loading fails due to CORS)
const fallbackScenarios = [
  {
    "id": "night_sand_manual",
    "keywords": ["sand", "night", "bullock", "மண்", "இரவு", "extraction", "cart", "manual"],
    "title": "இரவு நேர ஆற்றுமண் கொள்ளை",
    "title_en": "Night-time Sand Extraction",
    "nature": "Low-visibility, socially normalized environmental violation",
    "domain": "River System",
    "context": "River Bed – Night-time",
    "law_intent": [
      "Natural resources are held in public trust by the State (Public Trust Doctrine)",
      "Environmental damage can be delayed but cumulative (Article 21 - Right to Life)",
      "Silence does not imply consent (73rd Amendment - Community Participation)"
    ],
    "law_intent_tamil": [
      "இயற்கை வளங்கள் அரசு நம்பிக்கையில் பாதுகாக்கப்பட வேண்டும்",
      "சுற்றுச்சூழல் பாதிப்பு மெதுவாக சேரும் ஆனால் கூட்டுத்தொகை ஆபத்தானது",
      "மௌனம் சம்மதம் அல்ல"
    ],
    "trust_drift": [
      "Citizen ↔ River: Silent witnessing normalized, environmental dependency invisibilized",
      "State ↔ Commons: Trust obligation exists in law but not in ground enforcement",
      "Community ↔ Silence: Social cohesion prioritized over commons protection",
      "Law ↔ Enforcement: Regulatory intent undermined by operational gaps"
    ],
    "trust_drift_tamil": [
      "குடிமகன் – மௌனம் பழக்கமாகிறது, சுற்றுச்சூழல் சார்பு மறைக்கப்படுகிறது",
      "அரசு – நம்பிக்கைக் கடமை சட்டத்தில் உள்ளது ஆனால் நடைமுறையில் இல்லை",
      "சமூகம் – சமூக நல்லிணக்கம் பொது வள பாதுகாப்பை விட முக்கியமாக்கப்படுகிறது",
      "சட்டம் – ஒழுங்குமுறை நோக்கம் செயல்பாட்டு இடைவெளிகளால் குறைமதிப்பிடப்படுகிறது"
    ],
    "ppdtf": {
      "people": {
        "offender": {
          "role": "Local individual extracting river sand",
          "intent": "Livelihood or convenience",
          "law_break": ["Violates regulated extraction intent", "Bypasses public trust obligation"]
        },
        "facilitator": {
          "role": "Transport helper (bullock cart handler)",
          "intent": "Routine income",
          "law_break": ["Enables unregulated mineral movement"]
        },
        "witness": {
          "role": "Local residents observing activity",
          "intent": "Avoid conflict, normalize behavior",
          "law_break": ["Fails community-level commons protection duty"]
        },
        "local_authority": {
          "role": "Panchayat / Village representatives",
          "intent": "Local governance",
          "law_break": ["Does not escalate repeated violations", "Allows social normalization"]
        },
        "enforcement_authority": {
          "role": "Revenue / Mining / Environmental officers",
          "intent": "Enforce permit-based control",
          "law_break": ["Relies on visibility-dependent enforcement", "No proactive detection mechanism"]
        },
        "state": {
          "role": "Trustee of natural resources",
          "intent": "Protect environment and public interest",
          "law_break": ["Trust obligation weakly operationalized at ground level"]
        },
        "environment": {
          "role": "Silent stakeholder",
          "intent": "Maintain river equilibrium",
          "law_break": ["No representation in enforcement feedback loop"]
        }
      },
      "process": {
        "expected": "Permit-based sand extraction with quantity limits",
        "expected_intent": ["Control cumulative environmental impact", "Maintain riverbed stability"],
        "observed": "Repeated night-time manual extraction without permits",
        "breaks": ["Permit system bypassed", "Quantity regulation nullified", "Supervision avoided"]
      },
      "data": {
        "expected": ["Extraction volume records", "Permit issuance logs", "Transport tracking"],
        "expected_intent": ["Enable enforcement through evidence", "Detect cumulative harm"],
        "observed": "Data absent",
        "breaks": ["No volume tracking", "No incident reporting", "No historical pattern visibility"]
      },
      "technology": {
        "expected": ["Surveillance cameras", "GPS tracking", "Automated alerts"],
        "expected_intent": ["Reduce reliance on human complaint", "Increase detection certainty"],
        "observed": "Technology not deployed",
        "breaks": ["Enforcement depends on chance visibility", "Night-time activity remains undetected"]
      },
      "facility": {
        "asset": "River (Shared natural resource / commons)",
        "expected": "State as trustee, Public as beneficiaries",
        "expected_intent": ["Preserve ecological balance", "Protect long-term water security"],
        "observed": "Commons treated as ownerless at night",
        "breaks": ["Individual benefit overrides collective interest"]
      }
    },
    "impact_level": "HIGH",
    "impact_factors": {
      "facility_damage": true,
      "data_absence": true,
      "repeated_occurrence": true,
      "social_normalization": true,
      "threshold_crossed": 4
    },
    "trust_score": 60,
    "trust_deductions": {
      "silent_witnessing": 20,
      "normalization_acceptance": 20
    },
    "user_role": "witness",
    "next_actions": {
      "witness": {
        "low": ["Recognize this as commons degradation, not individual activity", "Do not normalize as 'small thing'", "Share factual awareness in conversations"],
        "medium": ["Anonymous reporting to Revenue/Environmental authorities", "Create community signal (information, not complaint)", "Document pattern if repeated"],
        "high": ["Trigger authority attention through formal channels", "Connect with local environmental groups", "Request surveillance/monitoring at site"]
      },
      "authority": {
        "immediate": ["Log incident in official records", "Issue notice to enforcement department", "Convene community awareness meeting"],
        "systematic": ["Request periodic monitoring", "Establish incident reporting channel", "Document cumulative impact evidence"]
      }
    },
    "next_actions_tamil": {
      "witness": {
        "low": ["இதை பொது வள சீரழிவாக அங்கீகரிக்கவும், தனிநபர் செயலாக அல்ல", "'சிறிய விஷயம்' என இயல்பாக்க வேண்டாம்", "உரையாடல்களில் உண்மை விழிப்புணர்வைப் பகிர்ந்து கொள்ளுங்கள்"],
        "medium": ["வருவாய்/சுற்றுச்சூழல் அதிகாரிகளுக்கு அநாமதேய அறிக்கை", "சமூக சமிக்ஞையை உருவாக்குங்கள் (தகவல், புகார் அல்ல)", "மீண்டும் நடந்தால் வடிவத்தை ஆவணப்படுத்துங்கள்"],
        "high": ["முறையான வழிகள் மூலம் அதிகாரத்தின் கவனத்தைத் தூண்டுங்கள்", "உள்ளூர் சுற்றுச்சூழல் குழுக்களுடன் இணைக்கவும்", "தளத்தில் கண்காணிப்பு கோருங்கள்"]
      },
      "authority": {
        "immediate": ["உத்தியோகபூர்வ பதிவுகளில் சம்பவத்தை பதிவு செய்யுங்கள்", "அமலாக்கத் துறைக்கு அறிவிப்பு வெளியிடுங்கள்", "சமூக விழிப்புணர்வு கூட்டத்தை கூட்டுங்கள்"],
        "systematic": ["அவ்வப்போது கண்காணிப்பு கோருங்கள்", "சம்பவ அறிக்கை சேனலை நிறுவவும்", "ஒட்டுமொத்த தாக்க சான்றுகளை ஆவணப்படுத்துங்கள்"]
      }
    }
  }
];

// Try to load scenarios from JSON, fallback to embedded if fails
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
    console.warn('⚠️ Could not load scenarios.json, using embedded fallback');
    console.warn('To fix: Run a local server instead of opening file:// directly');
    console.warn('Error:', error);
    scenarios = fallbackScenarios;
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

  // Validation
  if (!observation) {
    alert('Please describe what you observed');
    return;
  }

  if (!context) {
    alert('Please select where this happened (context)');
    return;
  }

  // Check if scenarios are loaded
  if (!scenarios || scenarios.length === 0) {
    alert('⚠️ Scenarios database is still loading.\n\nPlease wait a moment and try again.\n\nIf this persists, you may be experiencing CORS issues.\nSolution: Run a local server (see QUICKSTART.txt)');
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

      // Double-check we have a valid scenario
      if (!matchedScenario) {
        console.error('No scenario matched. This should not happen due to fallbacks.');
        alert('⚠️ Could not find matching scenario.\n\nUsing default river violation analysis.');
        
        // Try to use first scenario as absolute fallback
        if (scenarios.length > 0) {
          displayAnalysis(scenarios[0], observation);
        } else {
          throw new Error('No scenarios available in database');
        }
        
        btn.disabled = false;
        btn.textContent = 'Analyze Another Situation';
        return;
      }

      console.log('✅ Matched scenario:', matchedScenario.id, matchedScenario.title_en);

      // Display analysis
      displayAnalysis(matchedScenario, observation);

      // Re-enable button
      btn.disabled = false;
      btn.textContent = 'Analyze Another Situation';
      
    } catch (error) {
      console.error('❌ Analysis error:', error);
      console.error('Error stack:', error.stack);
      
      // Show detailed error to user
      alert(`❌ Analysis Error\n\n${error.message}\n\nPlease:\n1. Check browser console (F12) for details\n2. Refresh the page\n3. Try a different observation\n\nIf issue persists, see QUICKSTART.txt for troubleshooting.`);
      
      btn.disabled = false;
      btn.textContent = 'Analyze Situation / சம்பவத்தை பகுப்பாய்வு செய்க';
    }
  }, 500);
}

// Smart keyword matching
function findMatchingScenario(observation, domain, context) {
  const lowerObs = observation.toLowerCase();

  // Filter by domain first
  let candidates = scenarios.filter(s => s.domain === domain);

  // If no matches, use all scenarios as candidates
  if (candidates.length === 0) {
    candidates = scenarios;
  }

  // Score each candidate by keyword matches
  let bestMatch = null;
  let bestScore = 0;

  for (const scenario of candidates) {
    let score = 0;
    
    // Check keywords
    for (const keyword of scenario.keywords) {
      if (lowerObs.includes(keyword.toLowerCase())) {
        score += 2; // Keyword match worth 2 points
      }
    }
    
    // Check if context matches (bonus points)
    if (scenario.context === context) {
      score += 3; // Context match worth 3 points
    }
    
    // Check title for partial matches
    if (scenario.title_en && lowerObs.includes(scenario.title_en.toLowerCase().split(' ')[0])) {
      score += 1;
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = scenario;
    }
  }

  // If still no match, try fuzzy matching on common words
  if (!bestMatch || bestScore === 0) {
    const commonWords = {
      'construction': 'bank_construction',
      'building': 'bank_construction',
      'encroachment': 'bank_construction',
      'sand': 'night_sand_manual',
      'mining': 'mechanized_mining',
      'tractor': 'mechanized_mining',
      'water': 'agri_pumping',
      'pump': 'agri_pumping',
      'effluent': 'industrial_effluent',
      'pollution': 'industrial_effluent',
      'sewage': 'sewage_dumping',
      'waste': 'sewage_dumping'
    };

    for (const [word, scenarioId] of Object.entries(commonWords)) {
      if (lowerObs.includes(word)) {
        bestMatch = scenarios.find(s => s.id === scenarioId);
        if (bestMatch) break;
      }
    }
  }

  // Final fallback: return first scenario that matches context
  if (!bestMatch && context) {
    bestMatch = candidates.find(s => s.context === context);
  }

  // Ultimate fallback: return first scenario in database
  if (!bestMatch) {
    bestMatch = scenarios[0];
  }

  console.log(`Matched scenario: ${bestMatch ? bestMatch.id : 'none'} (score: ${bestScore})`);
  return bestMatch;
}

// Display full analysis
function displayAnalysis(scenario, userObservation) {
  // Defensive check
  if (!scenario) {
    console.error('Cannot display analysis: scenario is null');
    alert('Error: No scenario data available');
    return;
  }

  console.log('📊 Displaying analysis for:', scenario.id);
  
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
  if (scenario.law_intent && Array.isArray(scenario.law_intent)) {
    scenario.law_intent.forEach(law => {
      const li = document.createElement('li');
      li.textContent = law;
      lawList.appendChild(li);
    });
  }

  // Tamil law intent
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

  // Tamil trust drift
  if (scenario.trust_drift_tamil && Array.isArray(scenario.trust_drift_tamil)) {
    let tamilHTML = '';
    scenario.trust_drift_tamil.forEach(drift => {
      tamilHTML += `• ${drift}<br>`;
    });
    document.getElementById('driftTamil').innerHTML = tamilHTML;
  }

  // === PPDTF DETAILED BREAKDOWN ===
  const ppdtfContainer = document.getElementById('ppdtfBreakdown');
  ppdtfContainer.innerHTML = '';

  if (!scenario.ppdtf) {
    ppdtfContainer.innerHTML = '<p style="color: #f87171;">PPDTF data not available for this scenario</p>';
  } else {
    // PEOPLE Section
    if (scenario.ppdtf.people) {
      const peopleSection = document.createElement('div');
      peopleSection.className = 'ppdtf-category';
      
      let peopleHTML = '<h4 style="color: #60a5fa; margin-bottom: 10px;">👥 PEOPLE / மக்கள்</h4>';
      
      for (const [roleKey, roleData] of Object.entries(scenario.ppdtf.people)) {
        if (!roleData) continue; // Skip if roleData is null/undefined
        
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
      ppdtfContainer.appendChild(peopleSection);
    }

    // PROCESS Section
    if (scenario.ppdtf.process) {
      const proc = scenario.ppdtf.process;
      const processSection = document.createElement('div');
      processSection.className = 'ppdtf-category';
      
      processSection.innerHTML = `
        <h4 style="color: #60a5fa; margin-bottom: 10px; margin-top: 20px;">📋 PROCESS / நடைமுறை</h4>
        <div style="background: #0f172a; padding: 12px; border-radius: 4px;">
          <div style="margin-bottom: 10px;">
            <strong style="color: #22d3ee;">Expected:</strong>
            <div style="color: #94a3b8; font-size: 0.9em;">${proc.expected || 'N/A'}</div>
            ${proc.expected_intent && Array.isArray(proc.expected_intent) ? `
            <div style="color: #64748b; font-size: 0.85em; margin-top: 3px;">
              Intent: ${proc.expected_intent.join(', ')}
            </div>` : ''}
          </div>
          <div style="margin-bottom: 10px;">
            <strong style="color: #f59e0b;">Observed:</strong>
            <div style="color: #94a3b8; font-size: 0.9em;">${proc.observed || 'N/A'}</div>
          </div>
          <div>
            <strong style="color: #f87171;">Breaks:</strong>
            <ul style="margin: 5px 0 0 20px; padding: 0; color: #f87171; font-size: 0.9em;">
              ${proc.breaks && Array.isArray(proc.breaks) ? proc.breaks.map(b => `<li>${b}</li>`).join('') : '<li>N/A</li>'}
            </ul>
          </div>
        </div>
      `;
      
      ppdtfContainer.appendChild(processSection);
    }

    // Similar defensive checks for DATA, TECHNOLOGY, FACILITY...
    // (continuing in next replacement due to length)
  }

  // === IMPACT EVALUATION ===
  const impactBadge = document.getElementById('impactBadge');
  impactBadge.textContent = scenario.impact_level || 'UNKNOWN';
  impactBadge.className = 'impact-badge impact-' + (scenario.impact_level || 'low').toLowerCase();

  // Show impact factors
  if (scenario.impact_factors && scenario.impact_factors.threshold_crossed) {
    const factorsText = document.getElementById('impactFactors');
    if (factorsText) {
      factorsText.textContent = `${scenario.impact_factors.threshold_crossed} out of 4 critical factors crossed`;
    }
  }

  // === TRUST SCORE ===
  const trustScore = scenario.trust_score || 0;
  document.getElementById('trustScore').textContent = trustScore;
  const status = trustScore >= 80 ? 'Healthy / ஆரோக்கியமான' : 
                 trustScore >= 60 ? 'Declining / சரிவு' : 'Degraded / சீரழிந்த';
  document.getElementById('scoreStatus').textContent = status;

  // Show deductions if available
  if (scenario.trust_deductions) {
    const deductionsList = document.getElementById('deductionsList');
    if (deductionsList) {
      deductionsList.innerHTML = '';
      for (const [reason, points] of Object.entries(scenario.trust_deductions)) {
        const li = document.createElement('li');
        li.innerHTML = `${reason.replace('_', ' ')}: <span style="color: #f87171;">-${points} points</span>`;
        deductionsList.appendChild(li);
      }
    }
  }

  // === ROLE-BASED ACTIONS ===
  const userRole = scenario.user_role || 'witness';
  const roleText = userRole === 'witness' ? 'You are a WITNESS (சாட்சி)' : 
                   userRole === 'authority' ? 'You are an AUTHORITY (அதிகாரி)' : 
                   'Your Role: ' + userRole;
  document.getElementById('userRole').textContent = roleText;

  const actionsList = document.getElementById('actionsList');
  actionsList.innerHTML = '';

  if (scenario.next_actions && scenario.next_actions[userRole]) {
    const actionsData = scenario.next_actions[userRole];
    
    for (const [level, actions] of Object.entries(actionsData)) {
      if (!Array.isArray(actions)) continue;
      
      const levelHeader = document.createElement('li');
      levelHeader.innerHTML = `<strong style="color: #22d3ee; text-transform: uppercase;">${level} ${level === 'low' || level === 'medium' || level === 'high' ? 'Risk' : 'Effort'}:</strong>`;
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

  // === SYSTEM INTERPRETATION (PRINTABLE) ===
  try {
    const resultText = generatePrintableReport(scenario, userObservation);
    document.getElementById('result').textContent = resultText;
  } catch (error) {
    console.error('Error generating report:', error);
    document.getElementById('result').textContent = 'Error generating printable report. Please check console.';
  }

  // Add print button
  const printBtn = document.getElementById('printBtn');
  if (printBtn) {
    printBtn.classList.remove('hidden');
  }

  // Scroll to law section
  document.getElementById('lawSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
  
  console.log('✅ Analysis displayed successfully');
}
  
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
