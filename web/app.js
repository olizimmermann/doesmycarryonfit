'use strict';

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const RIMOWA_ORIGINAL_CABIN = { h: 55, w: 40, d: 23, weight: null };

// H x W x D in cm, weight in kg. null = not specified / N/A.
// Source: airline websites. Last verified: see GitHub issue tracker.
const AIRLINES = [
  { name: "Aegean Airlines",        h: 56,   w: 45,   d: 25,   sum: 126, ecoKg: 8,    bizKg: 13   },
  { name: "Aer Lingus",             h: 56,   w: 40,   d: 23,   sum: 119, ecoKg: 10,   bizKg: 13   },
  { name: "Aeroflot",               h: 55,   w: 40,   d: 25,   sum: 120, ecoKg: 10,   bizKg: 15   },
  { name: "Aerolineas Argentinas",  h: 55,   w: 35,   d: 25,   sum: 115, ecoKg: 8,    bizKg: 10   },
  { name: "Aeromexico",             h: 55,   w: 40,   d: 25,   sum: 120, ecoKg: 10,   bizKg: 15   },
  { name: "Air Canada",             h: 55,   w: 40,   d: 23,   sum: 118, ecoKg: null, bizKg: null },
  { name: "Air Caraïbes",           h: 55,   w: 35,   d: 25,   sum: 115, ecoKg: 12,   bizKg: null },
  { name: "Air China",              h: 55,   w: 40,   d: 20,   sum: 115, ecoKg: 5,    bizKg: 8    },
  { name: "Air Europa",             h: 55,   w: 35,   d: 25,   sum: 115, ecoKg: 10,   bizKg: 14   },
  { name: "Air France",             h: 55,   w: 35,   d: 25,   sum: 115, ecoKg: 12,   bizKg: 18   },
  { name: "Air India",              h: 55,   w: 40,   d: 20,   sum: 115, ecoKg: 7,    bizKg: 10   },
  { name: "Air New Zealand",        h: null, w: null, d: null, sum: 118, ecoKg: 7,    bizKg: 14   },
  { name: "Air Serbia",             h: 55,   w: 40,   d: 23,   sum: 118, ecoKg: 8,    bizKg: 8    },
  { name: "Air Transat",            h: 55,   w: 40,   d: 23,   sum: 118, ecoKg: null, bizKg: null },
  { name: "Alaska Airlines",        h: 56,   w: 36,   d: 23,   sum: 115, ecoKg: null, bizKg: null },
  { name: "All Nippon Airways",     h: 55,   w: 40,   d: 25,   sum: 115, ecoKg: 10,   bizKg: null },
  { name: "Allegiant Airlines",     h: 56,   w: 36,   d: 23,   sum: 115, ecoKg: null, bizKg: null },
  { name: "American Airlines",      h: 56,   w: 36,   d: 23,   sum: 115, ecoKg: null, bizKg: null },
  { name: "Arkia",                  h: 56,   w: 45,   d: 25,   sum: 126, ecoKg: 8,    bizKg: null },
  { name: "Asiana Airlines",        h: 55,   w: 40,   d: 20,   sum: 115, ecoKg: 10,   bizKg: 10   },
  { name: "Austrian",               h: 55,   w: 40,   d: 23,   sum: 118, ecoKg: 8,    bizKg: 8    },
  { name: "Avianca",                h: 55,   w: 35,   d: 25,   sum: 115, ecoKg: 10,   bizKg: 10   },
  { name: "Azul Airlines",          h: 55,   w: 35,   d: 25,   sum: 115, ecoKg: 10,   bizKg: 10   },
  { name: "Bamboo Airways",         h: 56,   w: 36,   d: 23,   sum: 115, ecoKg: 7,    bizKg: 7    },
  { name: "British Airways",        h: 56,   w: 45,   d: 25,   sum: 126, ecoKg: 23,   bizKg: null },
  { name: "Brussels Airlines",      h: 55,   w: 40,   d: 23,   sum: 118, ecoKg: 8,    bizKg: 8    },
  { name: "Cathay Pacific",         h: 56,   w: 36,   d: 23,   sum: 115, ecoKg: 7,    bizKg: 10   },
  { name: "Cebu Pacific",           h: 56,   w: 36,   d: 23,   sum: 115, ecoKg: 7,    bizKg: null },
  { name: "China Airlines",         h: 56,   w: 36,   d: 23,   sum: 115, ecoKg: 7,    bizKg: 7    },
  { name: "China Eastern",          h: 55,   w: 40,   d: 20,   sum: 115, ecoKg: 8,    bizKg: 10   },
  { name: "China Southern",         h: 55,   w: 40,   d: 20,   sum: 115, ecoKg: 8,    bizKg: 8    },
  { name: "Condor",                 h: 55,   w: 40,   d: 20,   sum: 115, ecoKg: 8,    bizKg: 10   },
  { name: "Copa Airlines",          h: 56,   w: 36,   d: 26,   sum: 118, ecoKg: 10,   bizKg: 10   },
  { name: "Corsair",                h: 55,   w: 40,   d: 20,   sum: 115, ecoKg: 12,   bizKg: 18   },
  { name: "Croatia Airlines",       h: 55,   w: 40,   d: 23,   sum: 115, ecoKg: 8,    bizKg: 8    },
  { name: "Czech Airlines",         h: 55,   w: 45,   d: 25,   sum: 125, ecoKg: 8,    bizKg: 8    },
  { name: "Delta Airlines",         h: 56,   w: 35,   d: 23,   sum: 114, ecoKg: null, bizKg: null },
  { name: "easyJet",                h: 56,   w: 45,   d: 25,   sum: 126, ecoKg: 15,   bizKg: 15   },
  { name: "Edelweiss",              h: 55,   w: 40,   d: 23,   sum: 118, ecoKg: 8,    bizKg: 8    },
  { name: "EgyptAir",               h: 55,   w: 40,   d: 23,   sum: 118, ecoKg: 8,    bizKg: 8    },
  { name: "El Al",                  h: 56,   w: 45,   d: 25,   sum: 115, ecoKg: 8,    bizKg: null },
  { name: "Emirates",               h: 55,   w: 38,   d: 22,   sum: 115, ecoKg: 7,    bizKg: 10   },
  { name: "Ethiopian Airlines",     h: 55,   w: 40,   d: 23,   sum: 118, ecoKg: 7,    bizKg: 7    },
  { name: "Etihad",                 h: 56,   w: 36,   d: 23,   sum: 115, ecoKg: 7,    bizKg: 12   },
  { name: "Eurowings",              h: 55,   w: 40,   d: 23,   sum: 118, ecoKg: 8,    bizKg: 8    },
  { name: "Eva Air",                h: 56,   w: 36,   d: 23,   sum: 115, ecoKg: 7,    bizKg: 7    },
  { name: "Fiji Airways",           h: 55,   w: 40,   d: 23,   sum: 118, ecoKg: 7,    bizKg: 7    },
  { name: "Finnair",                h: 55,   w: 40,   d: 23,   sum: 118, ecoKg: 8,    bizKg: 12   },
  { name: "flydubai",               h: 55,   w: 38,   d: 20,   sum: 113, ecoKg: 7,    bizKg: 7    },
  { name: "Garuda Indonesia",       h: 56,   w: 36,   d: 23,   sum: 115, ecoKg: 7,    bizKg: 7    },
  { name: "GOL",                    h: 55,   w: 35,   d: 25,   sum: 115, ecoKg: 10,   bizKg: null },
  { name: "Hainan Airlines",        h: 55,   w: 40,   d: 20,   sum: 115, ecoKg: 7,    bizKg: null },
  { name: "Hop!",                   h: 55,   w: 35,   d: 25,   sum: 115, ecoKg: 7,    bizKg: null },
  { name: "Iberia",                 h: 56,   w: 40,   d: 25,   sum: 121, ecoKg: 10,   bizKg: 14   },
  { name: "Icelandair",             h: 55,   w: 40,   d: 20,   sum: 115, ecoKg: 10,   bizKg: 10   },
  { name: "Isair",                  h: 50,   w: 40,   d: 20,   sum: 110, ecoKg: 8,    bizKg: null },
  { name: "ITA Airways",            h: 55,   w: 35,   d: 25,   sum: 115, ecoKg: 8,    bizKg: null },
  { name: "Japan Airlines",         h: 55,   w: 40,   d: 25,   sum: 120, ecoKg: 10,   bizKg: 10   },
  { name: "Jet2.com",               h: 56,   w: 45,   d: 25,   sum: 126, ecoKg: 10,   bizKg: null },
  { name: "JetBlue",                h: 56,   w: 36,   d: 23,   sum: 115, ecoKg: null, bizKg: null },
  { name: "KLM",                    h: 55,   w: 35,   d: 25,   sum: 115, ecoKg: 12,   bizKg: 12   },
  { name: "Korean Air",             h: 55,   w: 40,   d: 20,   sum: 115, ecoKg: 10,   bizKg: 18   },
  { name: "LATAM",                  h: 55,   w: 35,   d: 25,   sum: 115, ecoKg: 10,   bizKg: 16   },
  { name: "LOT",                    h: 55,   w: 40,   d: 23,   sum: 118, ecoKg: 8,    bizKg: null },
  { name: "Lufthansa",              h: 55,   w: 40,   d: 23,   sum: 118, ecoKg: 8,    bizKg: 8    },
  { name: "Malaysia Airlines",      h: 56,   w: 36,   d: 23,   sum: 115, ecoKg: 7,    bizKg: 7    },
  { name: "Middle East Airline",    h: 56,   w: 40,   d: 25,   sum: 121, ecoKg: 10,   bizKg: 10   },
  { name: "Norwegian",              h: 55,   w: 40,   d: 23,   sum: 118, ecoKg: 10,   bizKg: 15   },
  { name: "Olympic Air",            h: 55,   w: 40,   d: 23,   sum: 118, ecoKg: 10,   bizKg: 15   },
  { name: "Oman Air",               h: null, w: null, d: null, sum: 115, ecoKg: 7,    bizKg: 7    },
  { name: "Philippine Airlines",    h: 56,   w: 36,   d: 23,   sum: 115, ecoKg: 7,    bizKg: null },
  { name: "Porter Airlines",        h: 55,   w: 40,   d: 23,   sum: 118, ecoKg: null, bizKg: null },
  { name: "Qantas",                 h: 56,   w: 36,   d: 23,   sum: 115, ecoKg: 10,   bizKg: 10   },
  { name: "Qatar Airways",          h: 50,   w: 37,   d: 25,   sum: 112, ecoKg: 7,    bizKg: 15   },
  { name: "Royal Air Maroc",        h: 55,   w: 40,   d: 25,   sum: 120, ecoKg: 10,   bizKg: 12   },
  { name: "Ryanair",                h: 55,   w: 40,   d: 20,   sum: 115, ecoKg: 10,   bizKg: null },
  { name: "Saudia",                 h: 56,   w: 45,   d: 25,   sum: 126, ecoKg: 7,    bizKg: 12   },
  { name: "SAS",                    h: 55,   w: 40,   d: 23,   sum: 118, ecoKg: 8,    bizKg: 8    },
  { name: "Shenzhen Airlines",      h: 55,   w: 40,   d: 20,   sum: 115, ecoKg: 5,    bizKg: null },
  { name: "Singapore Airlines",     h: null, w: null, d: null, sum: 115, ecoKg: 7,    bizKg: 7    },
  { name: "South African Airways",  h: 56,   w: 36,   d: 23,   sum: 115, ecoKg: 8,    bizKg: 8    },
  { name: "Southwest Airlines",     h: 53,   w: 35,   d: 22,   sum: 110, ecoKg: null, bizKg: null },
  { name: "SWISS",                  h: 55,   w: 40,   d: 23,   sum: 118, ecoKg: 8,    bizKg: 8    },
  { name: "TAME",                   h: 55,   w: 35,   d: 25,   sum: 115, ecoKg: 8,    bizKg: null },
  { name: "TAP Air Portugal",       h: 55,   w: 40,   d: 25,   sum: 120, ecoKg: 10,   bizKg: 10   },
  { name: "Thai Airways",           h: 56,   w: 45,   d: 25,   sum: 126, ecoKg: 7,    bizKg: null },
  { name: "Transavia",              h: 55,   w: 35,   d: 25,   sum: 115, ecoKg: 10,   bizKg: 10   },
  { name: "TUI",                    h: 55,   w: 40,   d: 20,   sum: 115, ecoKg: 10,   bizKg: 10   },
  { name: "Turkish Airlines",       h: 55,   w: 40,   d: 23,   sum: 118, ecoKg: 8,    bizKg: 8    },
  { name: "United Airlines",        h: 55,   w: 35,   d: 23,   sum: 114, ecoKg: null, bizKg: null },
  { name: "Vietnam Airlines",       h: 56,   w: 36,   d: 23,   sum: 115, ecoKg: 12,   bizKg: 18   },
  { name: "Virgin Atlantic",        h: 56,   w: 36,   d: 23,   sum: 115, ecoKg: 10,   bizKg: null },
  { name: "Vueling",                h: 55,   w: 40,   d: 20,   sum: 115, ecoKg: 10,   bizKg: null },
  { name: "Wizz Air",               h: 55,   w: 40,   d: 23,   sum: 118, ecoKg: 10,   bizKg: null },
];

// ---------------------------------------------------------------------------
// Check logic
// ---------------------------------------------------------------------------

/**
 * Check if a bag fits within an airline's limits.
 * Dimensions are orientation-agnostic: both arrays are sorted descending
 * so the bag can be placed in its most favorable orientation.
 *
 * @returns {{ dimFits: boolean, weightFits: boolean|null, weightLimit: number|null }}
 */
function checkAirline(bag, airline, cabinClass) {
  const bagDims = [bag.h, bag.w, bag.d].sort((a, b) => b - a);
  const bagSum  = bag.h + bag.w + bag.d;

  let dimFits;
  if (airline.h !== null) {
    const airDims = [airline.h, airline.w, airline.d].sort((a, b) => b - a);
    dimFits = bagDims[0] <= airDims[0] && bagDims[1] <= airDims[1] && bagDims[2] <= airDims[2];
  } else if (airline.sum !== null) {
    dimFits = bagSum <= airline.sum;
  } else {
    dimFits = true; // no data — assume pass
  }

  const weightLimit = cabinClass === 'business' ? airline.bizKg : airline.ecoKg;
  let weightFits = null; // null = unknown (no weight entered or no limit)
  if (bag.weight !== null && bag.weight > 0 && weightLimit !== null) {
    weightFits = bag.weight <= weightLimit;
  }

  return { dimFits, weightFits, weightLimit };
}

// ---------------------------------------------------------------------------
// State & URL
// ---------------------------------------------------------------------------

function getState() {
  return {
    h:       parseFloat(document.getElementById('input-h').value)      || 55,
    w:       parseFloat(document.getElementById('input-w').value)      || 40,
    d:       parseFloat(document.getElementById('input-d').value)      || 23,
    weight:  parseFloat(document.getElementById('input-weight').value) || null,
    cls:     document.querySelector('.class-btn.active').dataset.cls,
    filter:  document.querySelector('.filter-tab.active').dataset.filter,
    search:  document.getElementById('airline-search').value.trim().toLowerCase(),
  };
}

function readFromURL() {
  const p = new URLSearchParams(window.location.search);
  if (p.has('h')) document.getElementById('input-h').value      = p.get('h');
  if (p.has('w')) document.getElementById('input-w').value      = p.get('w');
  if (p.has('d')) document.getElementById('input-d').value      = p.get('d');
  if (p.has('kg')) document.getElementById('input-weight').value = p.get('kg');
  if (p.has('cls')) {
    document.querySelectorAll('.class-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.cls === p.get('cls'));
    });
  }
  // Detect if custom size vs Rimowa default
  const isDefault = !p.has('h') && !p.has('w') && !p.has('d');
  if (!isDefault) {
    document.querySelector('[data-preset="rimowa"]').classList.remove('active');
    document.querySelector('[data-preset="custom"]').classList.add('active');
  }
}

function buildShareURL(state) {
  const base = window.location.origin + window.location.pathname;
  const p = new URLSearchParams();
  p.set('h',   state.h);
  p.set('w',   state.w);
  p.set('d',   state.d);
  if (state.weight) p.set('kg', state.weight);
  if (state.cls !== 'economy') p.set('cls', state.cls);
  return `${base}?${p.toString()}`;
}

function pushURL(state) {
  const url = buildShareURL(state);
  window.history.replaceState(null, '', url);
}

// ---------------------------------------------------------------------------
// Render
// ---------------------------------------------------------------------------

function formatDims(airline) {
  if (airline.h !== null) {
    return `${airline.h} × ${airline.w} × ${airline.d}`;
  }
  return `≤ ${airline.sum} cm total`;
}

function renderTable(state) {
  const tbody = document.getElementById('results-body');
  const bag   = { h: state.h, w: state.w, d: state.d, weight: state.weight };

  let passCount = 0, failCount = 0;
  const rows = [];

  for (const airline of AIRLINES) {
    if (state.search && !airline.name.toLowerCase().includes(state.search)) continue;

    const { dimFits, weightFits, weightLimit } = checkAirline(bag, airline, state.cls);
    const overallFail = !dimFits || weightFits === false;

    if (overallFail) failCount++; else passCount++;

    if (state.filter === 'pass' && overallFail)  continue;
    if (state.filter === 'fail' && !overallFail) continue;

    const statusClass = overallFail ? 'status-fail' : 'status-pass';
    const statusText  = overallFail ? 'No' : 'Yes';
    const statusIcon  = overallFail ? '✕' : '✓';

    let weightCell;
    if (weightLimit === null) {
      weightCell = '<span class="muted">—</span>';
    } else {
      const cls = weightFits === false ? 'weight-fail' : (weightFits === true ? 'weight-pass' : '');
      weightCell = `<span class="${cls}">${weightLimit} kg</span>`;
    }

    rows.push(`
      <tr class="${overallFail ? 'row-fail' : 'row-pass'}">
        <td class="col-airline">${airline.name}</td>
        <td class="col-dims">${formatDims(airline)}</td>
        <td class="col-weight">${weightCell}</td>
        <td class="col-status"><span class="status-badge ${statusClass}"><span class="status-icon">${statusIcon}</span>${statusText}</span></td>
      </tr>`);
  }

  tbody.innerHTML = rows.join('');

  const total = passCount + failCount;
  document.getElementById('count-all').textContent  = total;
  document.getElementById('count-pass').textContent = passCount;
  document.getElementById('count-fail').textContent = failCount;

  // Summary bar
  const pct = total > 0 ? Math.round((passCount / total) * 100) : 0;
  document.getElementById('summary-text').textContent =
    `${passCount} of ${total} airlines accept these dimensions${bag.weight ? ' and weight' : ''}`;
  document.getElementById('summary-bar-fill').style.width = `${pct}%`;
  document.getElementById('summary-bar-fill').className =
    `bar-fill ${pct >= 80 ? 'bar-green' : pct >= 50 ? 'bar-amber' : 'bar-red'}`;
}

// ---------------------------------------------------------------------------
// Event wiring
// ---------------------------------------------------------------------------

function setPreset(preset) {
  document.querySelectorAll('.preset-btn').forEach(b => b.classList.toggle('active', b.dataset.preset === preset));
  if (preset === 'rimowa') {
    document.getElementById('input-h').value = RIMOWA_ORIGINAL_CABIN.h;
    document.getElementById('input-w').value = RIMOWA_ORIGINAL_CABIN.w;
    document.getElementById('input-d').value = RIMOWA_ORIGINAL_CABIN.d;
    document.getElementById('input-weight').value = '';
  }
}

function update() {
  const state = getState();
  pushURL(state);
  renderTable(state);
}

function init() {
  readFromURL();

  // Preset buttons
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => { setPreset(btn.dataset.preset); update(); });
  });

  // Class toggle
  document.querySelectorAll('.class-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.class-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      update();
    });
  });

  // Dimension / weight inputs — switch to custom preset on any manual edit
  ['input-h', 'input-w', 'input-d', 'input-weight'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
      document.querySelector('[data-preset="rimowa"]').classList.remove('active');
      document.querySelector('[data-preset="custom"]').classList.add('active');
      update();
    });
  });

  // Filter tabs
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      update();
    });
  });

  // Search
  document.getElementById('airline-search').addEventListener('input', update);

  // Copy link
  document.getElementById('copy-link-btn').addEventListener('click', () => {
    const state = getState();
    const url   = buildShareURL(state);
    navigator.clipboard.writeText(url).then(() => {
      const btn = document.getElementById('copy-link-btn');
      btn.textContent = 'Copied!';
      btn.classList.add('copied');
      setTimeout(() => { btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy link'; btn.classList.remove('copied'); }, 2000);
    }).catch(() => {
      // Fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = url;
      ta.style.position = 'fixed';
      ta.style.opacity  = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    });
  });

  update();
}

document.addEventListener('DOMContentLoaded', init);
