'use strict';

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

// cm: official EU dimensions — in: official US dimensions (Rimowa rounds up)
const RIMOWA_ORIGINAL_CABIN = {
  cm: { h: 55,   w: 40,   d: 23  },
  in: { h: 21.7, w: 15.8, d: 9.1 },
};
const RIMOWA_CABIN_S = {
  cm: { h: 55,   w: 40,   d: 20  },
  in: { h: 21.7, w: 15.8, d: 7.9 },
};
const RIMOWA_CABIN_PLUS = {
  cm: { h: 57,   w: 44,   d: 25  },
  in: { h: 22.1, w: 17.8, d: 9.9 },
};

// ---------------------------------------------------------------------------
// Preset detection — runs synchronously before first paint
// ---------------------------------------------------------------------------
{
  const p = new URLSearchParams(location.search);
  const unit = p.get('unit') || 'cm';
  const h = parseFloat(p.get('h')), w = parseFloat(p.get('w')), d = parseFloat(p.get('d'));
  const PRESET_MAP = { rimowa: RIMOWA_ORIGINAL_CABIN, 'rimowa-s': RIMOWA_CABIN_S, 'rimowa-plus': RIMOWA_CABIN_PLUS };
  let active = 'rimowa';
  if (p.has('h') || p.has('w') || p.has('d')) {
    const match = Object.keys(PRESET_MAP).find(k => { const v = PRESET_MAP[k][unit]; return v.h === h && v.w === w && v.d === d; });
    active = match || 'custom';
  }
  document.querySelector(`[data-preset="${active}"]`).classList.add('active');
}

// cm/in: official airline dimensions. kg/lbs: official weight limits. null = N/A.
// Source: airline websites. Last verified: see GitHub issue tracker.
const AIRLINES = [
  { name: "Aegean Airlines",       h:56,  w:45,  d:25,  sum:126, hIn:22.0, wIn:17.7, dIn:9.8,  sumIn:49.6, ecoKg:8,    bizKg:13,   ecoLbs:17.6, bizLbs:28.6 },
  { name: "Aer Lingus",            h:56,  w:40,  d:23,  sum:119, hIn:22.0, wIn:15.7, dIn:9.0,  sumIn:46.8, ecoKg:10,   bizKg:13,   ecoLbs:22,   bizLbs:28.6 },
  { name: "Aeroflot",              h:55,  w:40,  d:25,  sum:120, hIn:21.5, wIn:15.7, dIn:9.8,  sumIn:47.2, ecoKg:10,   bizKg:15,   ecoLbs:22,   bizLbs:33   },
  { name: "Aerolineas Argentinas", h:55,  w:35,  d:25,  sum:115, hIn:21.5, wIn:13.7, dIn:9.8,  sumIn:45.2, ecoKg:8,    bizKg:10,   ecoLbs:17.6, bizLbs:22   },
  { name: "Aeromexico",            h:55,  w:40,  d:25,  sum:120, hIn:21.5, wIn:15.7, dIn:9.8,  sumIn:47.2, ecoKg:10,   bizKg:15,   ecoLbs:22,   bizLbs:33   },
  { name: "Air Canada",            h:55,  w:40,  d:23,  sum:118, hIn:21.5, wIn:15.7, dIn:9.0,  sumIn:46.4, ecoKg:null, bizKg:null, ecoLbs:null, bizLbs:null },
  { name: "Air Caraïbes",          h:55,  w:35,  d:25,  sum:115, hIn:21.5, wIn:13.7, dIn:9.8,  sumIn:45.2, ecoKg:12,   bizKg:null, ecoLbs:26.4, bizLbs:null },
  { name: "Air China",             h:55,  w:40,  d:20,  sum:115, hIn:21.5, wIn:15.7, dIn:7.8,  sumIn:45.2, ecoKg:5,    bizKg:8,    ecoLbs:11,   bizLbs:17.6 },
  { name: "Air Europa",            h:55,  w:35,  d:25,  sum:115, hIn:21.5, wIn:13.7, dIn:9.8,  sumIn:45.2, ecoKg:10,   bizKg:14,   ecoLbs:22,   bizLbs:30.8 },
  { name: "Air France",            h:55,  w:35,  d:25,  sum:115, hIn:21.5, wIn:13.7, dIn:9.8,  sumIn:45.2, ecoKg:12,   bizKg:18,   ecoLbs:26.4, bizLbs:39.6 },
  { name: "Air India",             h:55,  w:40,  d:20,  sum:115, hIn:21.5, wIn:15.7, dIn:7.8,  sumIn:45.2, ecoKg:7,    bizKg:10,   ecoLbs:15.4, bizLbs:22   },
  { name: "Air New Zealand",       h:null,w:null,d:null,sum:118, hIn:null, wIn:null, dIn:null, sumIn:46.4, ecoKg:7,    bizKg:14,   ecoLbs:15.4, bizLbs:30.8 },
  { name: "Air Serbia",            h:55,  w:40,  d:23,  sum:118, hIn:21.5, wIn:15.7, dIn:9.0,  sumIn:46.4, ecoKg:8,    bizKg:8,    ecoLbs:17.6, bizLbs:17.6 },
  { name: "Air Transat",           h:55,  w:40,  d:23,  sum:118, hIn:21.5, wIn:15.7, dIn:9.0,  sumIn:46.4, ecoKg:null, bizKg:null, ecoLbs:null, bizLbs:null },
  { name: "Alaska Airlines",       h:56,  w:36,  d:23,  sum:115, hIn:22.0, wIn:14.1, dIn:9.0,  sumIn:45.2, ecoKg:null, bizKg:null, ecoLbs:null, bizLbs:null },
  { name: "All Nippon Airways",    h:55,  w:40,  d:25,  sum:115, hIn:21.5, wIn:15.7, dIn:9.8,  sumIn:45.2, ecoKg:10,   bizKg:null, ecoLbs:22,   bizLbs:null },
  { name: "Allegiant Airlines",    h:56,  w:36,  d:23,  sum:115, hIn:22.0, wIn:14.1, dIn:9.0,  sumIn:45.2, ecoKg:null, bizKg:null, ecoLbs:null, bizLbs:null },
  { name: "American Airlines",     h:56,  w:36,  d:23,  sum:115, hIn:22.0, wIn:14.1, dIn:9.0,  sumIn:45.2, ecoKg:null, bizKg:null, ecoLbs:null, bizLbs:null },
  { name: "Arkia",                 h:56,  w:45,  d:25,  sum:126, hIn:22.0, wIn:17.7, dIn:9.8,  sumIn:49.6, ecoKg:8,    bizKg:null, ecoLbs:17.6, bizLbs:null },
  { name: "Asiana Airlines",       h:55,  w:40,  d:20,  sum:115, hIn:21.5, wIn:15.7, dIn:7.8,  sumIn:45.2, ecoKg:10,   bizKg:10,   ecoLbs:22,   bizLbs:22   },
  { name: "Austrian",              h:55,  w:40,  d:23,  sum:118, hIn:21.5, wIn:15.7, dIn:9.0,  sumIn:46.4, ecoKg:8,    bizKg:8,    ecoLbs:17.6, bizLbs:17.6 },
  { name: "Avianca",               h:55,  w:35,  d:25,  sum:115, hIn:21.5, wIn:13.7, dIn:9.8,  sumIn:45.2, ecoKg:10,   bizKg:10,   ecoLbs:22,   bizLbs:22   },
  { name: "Azul Airlines",         h:55,  w:35,  d:25,  sum:115, hIn:21.5, wIn:13.7, dIn:9.8,  sumIn:45.2, ecoKg:10,   bizKg:10,   ecoLbs:22,   bizLbs:22   },
  { name: "Bamboo Airways",        h:56,  w:36,  d:23,  sum:115, hIn:22.0, wIn:14.1, dIn:9.0,  sumIn:45.2, ecoKg:7,    bizKg:7,    ecoLbs:15.4, bizLbs:15.4 },
  { name: "British Airways",       h:56,  w:45,  d:25,  sum:126, hIn:22.0, wIn:17.7, dIn:9.8,  sumIn:49.6, ecoKg:23,   bizKg:null, ecoLbs:50.7, bizLbs:null },
  { name: "Brussels Airlines",     h:55,  w:40,  d:23,  sum:118, hIn:21.5, wIn:15.7, dIn:9.0,  sumIn:46.4, ecoKg:8,    bizKg:8,    ecoLbs:17.6, bizLbs:17.6 },
  { name: "Cathay Pacific",        h:56,  w:36,  d:23,  sum:115, hIn:22.0, wIn:14.1, dIn:9.0,  sumIn:45.2, ecoKg:7,    bizKg:10,   ecoLbs:15.4, bizLbs:22   },
  { name: "Cebu Pacific",          h:56,  w:36,  d:23,  sum:115, hIn:22.0, wIn:14.1, dIn:9.0,  sumIn:45.2, ecoKg:7,    bizKg:null, ecoLbs:15.4, bizLbs:null },
  { name: "China Airlines",        h:56,  w:36,  d:23,  sum:115, hIn:22.0, wIn:14.1, dIn:9.0,  sumIn:45.2, ecoKg:7,    bizKg:7,    ecoLbs:15.4, bizLbs:15.4 },
  { name: "China Eastern",         h:55,  w:40,  d:20,  sum:115, hIn:21.5, wIn:15.7, dIn:7.8,  sumIn:45.2, ecoKg:8,    bizKg:10,   ecoLbs:17.6, bizLbs:22   },
  { name: "China Southern",        h:55,  w:40,  d:20,  sum:115, hIn:21.5, wIn:15.7, dIn:7.8,  sumIn:45.2, ecoKg:8,    bizKg:8,    ecoLbs:17.6, bizLbs:17.6 },
  { name: "Condor",                h:55,  w:40,  d:20,  sum:115, hIn:21.5, wIn:15.7, dIn:7.8,  sumIn:45.2, ecoKg:8,    bizKg:10,   ecoLbs:17.6, bizLbs:22   },
  { name: "Copa Airlines",         h:56,  w:36,  d:26,  sum:118, hIn:22.0, wIn:14.1, dIn:10.2, sumIn:46.4, ecoKg:10,   bizKg:10,   ecoLbs:22,   bizLbs:22   },
  { name: "Corsair",               h:55,  w:40,  d:20,  sum:115, hIn:21.5, wIn:15.7, dIn:7.8,  sumIn:45.2, ecoKg:12,   bizKg:18,   ecoLbs:26.4, bizLbs:39.6 },
  { name: "Croatia Airlines",      h:55,  w:40,  d:23,  sum:115, hIn:21.5, wIn:15.7, dIn:9.0,  sumIn:45.2, ecoKg:8,    bizKg:8,    ecoLbs:17.6, bizLbs:17.6 },
  { name: "Czech Airlines",        h:55,  w:45,  d:25,  sum:125, hIn:21.5, wIn:17.7, dIn:9.8,  sumIn:49.2, ecoKg:8,    bizKg:8,    ecoLbs:17.6, bizLbs:17.6 },
  { name: "Delta Airlines",        h:56,  w:35,  d:23,  sum:114, hIn:22.0, wIn:13.7, dIn:9.0,  sumIn:44.8, ecoKg:null, bizKg:null, ecoLbs:null, bizLbs:null },
  { name: "easyJet",               h:56,  w:45,  d:25,  sum:126, hIn:22.0, wIn:17.7, dIn:9.8,  sumIn:49.6, ecoKg:15,   bizKg:15,   ecoLbs:33,   bizLbs:33   },
  { name: "Edelweiss",             h:55,  w:40,  d:23,  sum:118, hIn:21.5, wIn:15.7, dIn:9.0,  sumIn:46.4, ecoKg:8,    bizKg:8,    ecoLbs:17.6, bizLbs:17.6 },
  { name: "EgyptAir",              h:55,  w:40,  d:23,  sum:118, hIn:21.5, wIn:15.7, dIn:9.0,  sumIn:46.4, ecoKg:8,    bizKg:8,    ecoLbs:17.6, bizLbs:17.6 },
  { name: "El Al",                 h:56,  w:45,  d:25,  sum:115, hIn:22.0, wIn:17.7, dIn:9.8,  sumIn:45.2, ecoKg:8,    bizKg:null, ecoLbs:17.6, bizLbs:null },
  { name: "Emirates",              h:55,  w:38,  d:22,  sum:115, hIn:21.5, wIn:14.9, dIn:8.6,  sumIn:45.2, ecoKg:7,    bizKg:10,   ecoLbs:15.4, bizLbs:22   },
  { name: "Ethiopian Airlines",    h:55,  w:40,  d:23,  sum:118, hIn:21.5, wIn:15.7, dIn:9.0,  sumIn:46.4, ecoKg:7,    bizKg:7,    ecoLbs:15.4, bizLbs:15.4 },
  { name: "Etihad",                h:56,  w:36,  d:23,  sum:115, hIn:22.0, wIn:14.1, dIn:9.0,  sumIn:45.2, ecoKg:7,    bizKg:12,   ecoLbs:15.4, bizLbs:26.4 },
  { name: "Eurowings",             h:55,  w:40,  d:23,  sum:118, hIn:21.5, wIn:15.7, dIn:9.0,  sumIn:46.4, ecoKg:8,    bizKg:8,    ecoLbs:17.6, bizLbs:17.6 },
  { name: "Eva Air",               h:56,  w:36,  d:23,  sum:115, hIn:22.0, wIn:14.1, dIn:9.0,  sumIn:45.2, ecoKg:7,    bizKg:7,    ecoLbs:15.4, bizLbs:15.4 },
  { name: "Fiji Airways",          h:55,  w:40,  d:23,  sum:118, hIn:21.5, wIn:15.7, dIn:9.0,  sumIn:46.4, ecoKg:7,    bizKg:7,    ecoLbs:15.4, bizLbs:15.4 },
  { name: "Finnair",               h:55,  w:40,  d:23,  sum:118, hIn:21.5, wIn:15.7, dIn:9.0,  sumIn:46.4, ecoKg:8,    bizKg:12,   ecoLbs:17.6, bizLbs:26.4 },
  { name: "flydubai",              h:55,  w:38,  d:20,  sum:113, hIn:21.5, wIn:14.9, dIn:7.8,  sumIn:44.4, ecoKg:7,    bizKg:7,    ecoLbs:15.4, bizLbs:15.4 },
  { name: "Garuda Indonesia",      h:56,  w:36,  d:23,  sum:115, hIn:22.0, wIn:14.1, dIn:9.0,  sumIn:45.2, ecoKg:7,    bizKg:7,    ecoLbs:15.4, bizLbs:15.4 },
  { name: "GOL",                   h:55,  w:35,  d:25,  sum:115, hIn:21.5, wIn:13.7, dIn:9.8,  sumIn:45.2, ecoKg:10,   bizKg:null, ecoLbs:22,   bizLbs:null },
  { name: "Hainan Airlines",       h:55,  w:40,  d:20,  sum:115, hIn:21.5, wIn:15.7, dIn:7.8,  sumIn:45.2, ecoKg:7,    bizKg:null, ecoLbs:15.4, bizLbs:null },
  { name: "Hop!",                  h:55,  w:35,  d:25,  sum:115, hIn:21.5, wIn:13.7, dIn:9.8,  sumIn:45.2, ecoKg:7,    bizKg:null, ecoLbs:15.4, bizLbs:null },
  { name: "Iberia",                h:56,  w:40,  d:25,  sum:121, hIn:22.0, wIn:15.7, dIn:9.8,  sumIn:47.6, ecoKg:10,   bizKg:14,   ecoLbs:22,   bizLbs:30.8 },
  { name: "Icelandair",            h:55,  w:40,  d:20,  sum:115, hIn:21.5, wIn:15.7, dIn:7.8,  sumIn:45.2, ecoKg:10,   bizKg:10,   ecoLbs:22,   bizLbs:22   },
  { name: "Isair",                 h:50,  w:40,  d:20,  sum:110, hIn:19.6, wIn:15.7, dIn:7.8,  sumIn:43.3, ecoKg:8,    bizKg:null, ecoLbs:17.6, bizLbs:null },
  { name: "ITA Airways",           h:55,  w:35,  d:25,  sum:115, hIn:21.5, wIn:13.7, dIn:9.8,  sumIn:45.2, ecoKg:8,    bizKg:null, ecoLbs:17.6, bizLbs:null },
  { name: "Japan Airlines",        h:55,  w:40,  d:25,  sum:120, hIn:21.5, wIn:15.7, dIn:9.8,  sumIn:47.2, ecoKg:10,   bizKg:10,   ecoLbs:22,   bizLbs:22   },
  { name: "Jet2.com",              h:56,  w:45,  d:25,  sum:126, hIn:22.0, wIn:17.7, dIn:9.8,  sumIn:49.6, ecoKg:10,   bizKg:null, ecoLbs:22,   bizLbs:null },
  { name: "JetBlue",               h:56,  w:36,  d:23,  sum:115, hIn:22.0, wIn:14.1, dIn:9.0,  sumIn:45.2, ecoKg:null, bizKg:null, ecoLbs:null, bizLbs:null },
  { name: "KLM",                   h:55,  w:35,  d:25,  sum:115, hIn:21.5, wIn:13.7, dIn:9.8,  sumIn:45.2, ecoKg:12,   bizKg:12,   ecoLbs:26.4, bizLbs:26.4 },
  { name: "Korean Air",            h:55,  w:40,  d:20,  sum:115, hIn:21.5, wIn:15.7, dIn:7.8,  sumIn:45.2, ecoKg:10,   bizKg:18,   ecoLbs:22,   bizLbs:39.6 },
  { name: "LATAM",                 h:55,  w:35,  d:25,  sum:115, hIn:21.5, wIn:13.7, dIn:9.8,  sumIn:45.2, ecoKg:10,   bizKg:16,   ecoLbs:22,   bizLbs:35.2 },
  { name: "LOT",                   h:55,  w:40,  d:23,  sum:118, hIn:21.5, wIn:15.7, dIn:9.0,  sumIn:46.4, ecoKg:8,    bizKg:null, ecoLbs:17.6, bizLbs:null },
  { name: "Lufthansa",             h:55,  w:40,  d:23,  sum:118, hIn:21.5, wIn:15.7, dIn:9.0,  sumIn:46.4, ecoKg:8,    bizKg:8,    ecoLbs:17.6, bizLbs:17.6 },
  { name: "Malaysia Airlines",     h:56,  w:36,  d:23,  sum:115, hIn:22.0, wIn:14.1, dIn:9.0,  sumIn:45.2, ecoKg:7,    bizKg:7,    ecoLbs:15.4, bizLbs:15.4 },
  { name: "Middle East Airline",   h:56,  w:40,  d:25,  sum:121, hIn:22.0, wIn:15.7, dIn:9.8,  sumIn:47.6, ecoKg:10,   bizKg:10,   ecoLbs:22,   bizLbs:22   },
  { name: "Norwegian",             h:55,  w:40,  d:23,  sum:118, hIn:21.5, wIn:15.7, dIn:9.0,  sumIn:46.4, ecoKg:10,   bizKg:15,   ecoLbs:22,   bizLbs:33   },
  { name: "Olympic Air",           h:55,  w:40,  d:23,  sum:118, hIn:21.5, wIn:15.7, dIn:9.0,  sumIn:46.4, ecoKg:10,   bizKg:15,   ecoLbs:17.6, bizLbs:17.6 },
  { name: "Oman Air",              h:null,w:null,d:null,sum:115, hIn:null, wIn:null, dIn:null, sumIn:45.2, ecoKg:7,    bizKg:7,    ecoLbs:15.4, bizLbs:15.4 },
  { name: "Philippine Airlines",   h:56,  w:36,  d:23,  sum:115, hIn:22.0, wIn:14.1, dIn:9.0,  sumIn:45.2, ecoKg:7,    bizKg:null, ecoLbs:15.4, bizLbs:null },
  { name: "Porter Airlines",       h:55,  w:40,  d:23,  sum:118, hIn:21.5, wIn:15.7, dIn:9.0,  sumIn:46.4, ecoKg:null, bizKg:null, ecoLbs:null, bizLbs:null },
  { name: "Qantas",                h:56,  w:36,  d:23,  sum:115, hIn:22.0, wIn:14.1, dIn:9.0,  sumIn:45.2, ecoKg:10,   bizKg:10,   ecoLbs:22,   bizLbs:22   },
  { name: "Qatar Airways",         h:50,  w:37,  d:25,  sum:112, hIn:19.6, wIn:14.5, dIn:9.8,  sumIn:44.0, ecoKg:7,    bizKg:15,   ecoLbs:15.4, bizLbs:33   },
  { name: "Royal Air Maroc",       h:55,  w:40,  d:25,  sum:120, hIn:21.5, wIn:15.7, dIn:9.8,  sumIn:47.2, ecoKg:10,   bizKg:12,   ecoLbs:22,   bizLbs:26.4 },
  { name: "Ryanair",               h:55,  w:40,  d:20,  sum:115, hIn:21.5, wIn:15.7, dIn:7.8,  sumIn:45.2, ecoKg:10,   bizKg:null, ecoLbs:22,   bizLbs:null },
  { name: "Saudia",                h:56,  w:45,  d:25,  sum:126, hIn:22.0, wIn:17.7, dIn:9.8,  sumIn:49.6, ecoKg:7,    bizKg:12,   ecoLbs:15.4, bizLbs:26.4 },
  { name: "SAS",                   h:55,  w:40,  d:23,  sum:118, hIn:21.5, wIn:15.7, dIn:9.0,  sumIn:46.4, ecoKg:8,    bizKg:8,    ecoLbs:17.6, bizLbs:17.6 },
  { name: "Shenzhen Airlines",     h:55,  w:40,  d:20,  sum:115, hIn:21.5, wIn:15.7, dIn:7.8,  sumIn:45.2, ecoKg:5,    bizKg:null, ecoLbs:11,   bizLbs:null },
  { name: "Singapore Airlines",    h:null,w:null,d:null,sum:115, hIn:null, wIn:null, dIn:null, sumIn:45.2, ecoKg:7,    bizKg:7,    ecoLbs:15.4, bizLbs:15.4 },
  { name: "South African Airways", h:56,  w:36,  d:23,  sum:115, hIn:22.0, wIn:14.1, dIn:9.0,  sumIn:45.2, ecoKg:8,    bizKg:8,    ecoLbs:17.6, bizLbs:17.6 },
  { name: "Southwest Airlines",    h:53,  w:35,  d:22,  sum:110, hIn:20.8, wIn:13.7, dIn:8.6,  sumIn:43.3, ecoKg:null, bizKg:null, ecoLbs:null, bizLbs:null },
  { name: "SWISS",                 h:55,  w:40,  d:23,  sum:118, hIn:21.5, wIn:15.7, dIn:9.0,  sumIn:46.4, ecoKg:8,    bizKg:8,    ecoLbs:17.6, bizLbs:17.6 },
  { name: "TAME",                  h:55,  w:35,  d:25,  sum:115, hIn:21.5, wIn:13.7, dIn:9.8,  sumIn:45.2, ecoKg:8,    bizKg:null, ecoLbs:17.6, bizLbs:null },
  { name: "TAP Air Portugal",      h:55,  w:40,  d:25,  sum:120, hIn:21.5, wIn:15.7, dIn:9.8,  sumIn:47.2, ecoKg:10,   bizKg:10,   ecoLbs:22,   bizLbs:22   },
  { name: "Thai Airways",          h:56,  w:45,  d:25,  sum:126, hIn:22.0, wIn:17.7, dIn:9.8,  sumIn:49.6, ecoKg:7,    bizKg:null, ecoLbs:15.4, bizLbs:null },
  { name: "Transavia",             h:55,  w:35,  d:25,  sum:115, hIn:21.5, wIn:13.7, dIn:9.8,  sumIn:45.2, ecoKg:10,   bizKg:10,   ecoLbs:22,   bizLbs:22   },
  { name: "TUI",                   h:55,  w:40,  d:20,  sum:115, hIn:21.5, wIn:15.7, dIn:7.8,  sumIn:45.2, ecoKg:10,   bizKg:10,   ecoLbs:22,   bizLbs:22   },
  { name: "Turkish Airlines",      h:55,  w:40,  d:23,  sum:118, hIn:21.5, wIn:15.7, dIn:9.0,  sumIn:46.4, ecoKg:8,    bizKg:8,    ecoLbs:17.6, bizLbs:17.6 },
  { name: "United Airlines",       h:55,  w:35,  d:23,  sum:114, hIn:22.0, wIn:13.7, dIn:9.0,  sumIn:44.8, ecoKg:null, bizKg:null, ecoLbs:null, bizLbs:null },
  { name: "Vietnam Airlines",      h:56,  w:36,  d:23,  sum:115, hIn:22.0, wIn:14.1, dIn:9.0,  sumIn:45.2, ecoKg:12,   bizKg:18,   ecoLbs:26.4, bizLbs:39.6 },
  { name: "Virgin Atlantic",       h:56,  w:36,  d:23,  sum:115, hIn:22.0, wIn:14.1, dIn:9.0,  sumIn:45.2, ecoKg:10,   bizKg:null, ecoLbs:22,   bizLbs:null },
  { name: "Vueling",               h:55,  w:40,  d:20,  sum:115, hIn:21.5, wIn:15.7, dIn:7.8,  sumIn:45.2, ecoKg:10,   bizKg:null, ecoLbs:22,   bizLbs:null },
  { name: "Wizz Air",              h:55,  w:40,  d:23,  sum:118, hIn:21.5, wIn:15.7, dIn:9.0,  sumIn:46.4, ecoKg:10,   bizKg:null, ecoLbs:22,   bizLbs:null },
];

// ---------------------------------------------------------------------------
// Unit conversion
// ---------------------------------------------------------------------------

// Floor to 1 decimal so converted values never exceed the original cm size
// when converted back. e.g. 55cm → 21.6in (not 21.7) → 54.9cm ≤ 55cm ✓
function cmToIn(cm) { return Math.floor(cm / 2.54 * 10) / 10; }
function inToCm(inches) { return Math.round(inches * 2.54 * 10) / 10; }

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
function checkAirline(bag, airline, cabinClass, unit) {
  const bagDims = [bag.h, bag.w, bag.d].sort((a, b) => b - a);
  const bagSum  = bag.h + bag.w + bag.d;

  let dimFits;
  if (unit === 'in') {
    if (airline.hIn !== null) {
      const airDims = [airline.hIn, airline.wIn, airline.dIn].sort((a, b) => b - a);
      dimFits = bagDims[0] <= airDims[0] && bagDims[1] <= airDims[1] && bagDims[2] <= airDims[2];
    } else if (airline.sumIn !== null) {
      dimFits = bagSum <= airline.sumIn;
    } else {
      dimFits = true;
    }
  } else {
    if (airline.h !== null) {
      const airDims = [airline.h, airline.w, airline.d].sort((a, b) => b - a);
      dimFits = bagDims[0] <= airDims[0] && bagDims[1] <= airDims[1] && bagDims[2] <= airDims[2];
    } else if (airline.sum !== null) {
      dimFits = bagSum <= airline.sum;
    } else {
      dimFits = true; // no data — assume pass
    }
  }

  const weightLimit = unit === 'in'
    ? (cabinClass === 'business' ? airline.bizLbs : airline.ecoLbs)
    : (cabinClass === 'business' ? airline.bizKg  : airline.ecoKg);
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
  const unit = document.querySelector('.unit-btn.active')?.dataset.unit || 'cm';
  return {
    h:       parseFloat(document.getElementById('input-h').value)      || RIMOWA_ORIGINAL_CABIN[unit].h,
    w:       parseFloat(document.getElementById('input-w').value)      || RIMOWA_ORIGINAL_CABIN[unit].w,
    d:       parseFloat(document.getElementById('input-d').value)      || RIMOWA_ORIGINAL_CABIN[unit].d,
    weight:  parseFloat(document.getElementById('input-weight').value) || null,
    cls:     document.querySelector('.class-btn.active').dataset.cls,
    filter:  document.querySelector('.filter-tab.active').dataset.filter,
    search:  document.getElementById('airline-search').value.trim().toLowerCase(),
    unit,
  };
}

function readFromURL() {
  const p = new URLSearchParams(window.location.search);

  // Unit must be applied first so labels and inputs are consistent
  if (p.has('unit')) {
    const unit = p.get('unit');
    document.querySelectorAll('.unit-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.unit === unit);
    });
    document.querySelectorAll('.dim-unit').forEach(el => { el.textContent = unit; });
  }

  if (p.has('h'))   document.getElementById('input-h').value      = p.get('h');
  if (p.has('w'))   document.getElementById('input-w').value      = p.get('w');
  if (p.has('d'))   document.getElementById('input-d').value      = p.get('d');
  if (p.has('kg'))  document.getElementById('input-weight').value = p.get('kg');
  if (p.has('lbs')) document.getElementById('input-weight').value = p.get('lbs');

  // Sync weight-unit label after unit is set
  const activeUnit = document.querySelector('.unit-btn.active')?.dataset.unit || 'cm';
  document.querySelectorAll('.weight-unit').forEach(el => { el.textContent = activeUnit === 'in' ? 'lbs' : 'kg'; });
  if (p.has('cls')) {
    document.querySelectorAll('.class-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.cls === p.get('cls'));
    });
  }

  const isDefault = !p.has('h') && !p.has('w') && !p.has('d');
  if (!isDefault) {
    const unit = document.querySelector('.unit-btn.active')?.dataset.unit || 'cm';
    const h = parseFloat(p.get('h')), w = parseFloat(p.get('w')), d = parseFloat(p.get('d'));
    const PRESETS = { 'rimowa': RIMOWA_ORIGINAL_CABIN, 'rimowa-s': RIMOWA_CABIN_S, 'rimowa-plus': RIMOWA_CABIN_PLUS };
    const matched = Object.entries(PRESETS).find(([, v]) => v[unit].h === h && v[unit].w === w && v[unit].d === d);
    document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`[data-preset="${matched ? matched[0] : 'custom'}"]`).classList.add('active');
  }
}

function buildShareURL(state) {
  const base = window.location.origin + window.location.pathname;
  const p = new URLSearchParams();
  p.set('h', state.h);
  p.set('w', state.w);
  p.set('d', state.d);
  if (state.weight) p.set(state.unit === 'in' ? 'lbs' : 'kg', state.weight);
  if (state.cls !== 'economy') p.set('cls', state.cls);
  if (state.unit !== 'cm') p.set('unit', state.unit);
  return `${base}?${p.toString()}`;
}

function pushURL(state) {
  const url = buildShareURL(state);
  window.history.replaceState(null, '', url);
}

// ---------------------------------------------------------------------------
// Render
// ---------------------------------------------------------------------------

function formatDims(airline, unit) {
  if (unit === 'in') {
    if (airline.hIn !== null) return `${airline.hIn} × ${airline.wIn} × ${airline.dIn}`;
    return `≤ ${airline.sumIn} in total`;
  }
  if (airline.h !== null) return `${airline.h} × ${airline.w} × ${airline.d}`;
  return `≤ ${airline.sum} cm total`;
}

function renderTable(state) {
  const tbody = document.getElementById('results-body');
  const bag = { h: state.h, w: state.w, d: state.d, weight: state.weight };
  const weightUnit = state.unit === 'in' ? 'lbs' : 'kg';

  let passCount = 0, failCount = 0;
  const rows = [];

  for (const airline of AIRLINES) {
    if (state.search && !airline.name.toLowerCase().includes(state.search)) continue;

    const { dimFits, weightFits, weightLimit } = checkAirline(bag, airline, state.cls, state.unit);
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
      weightCell = `<span class="${cls}">${weightLimit} ${weightUnit}</span>`;
    }

    rows.push(`
      <tr class="${overallFail ? 'row-fail' : 'row-pass'}">
        <td class="col-airline">${airline.name}</td>
        <td class="col-dims">${formatDims(airline, state.unit)}</td>
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
  const PRESETS = {
    'rimowa':       RIMOWA_ORIGINAL_CABIN,
    'rimowa-s':     RIMOWA_CABIN_S,
    'rimowa-plus':  RIMOWA_CABIN_PLUS,
  };
  const data = PRESETS[preset];
  if (data) {
    const unit = document.querySelector('.unit-btn.active')?.dataset.unit || 'cm';
    const r = data[unit];
    document.getElementById('input-h').value = r.h;
    document.getElementById('input-w').value = r.w;
    document.getElementById('input-d').value = r.d;
    document.getElementById('input-weight').value = '';
  }
}

function setUnit(unit) {
  const prev = document.querySelector('.unit-btn.active')?.dataset.unit || 'cm';
  if (unit === prev) return;

  // Convert dimension inputs
  ['input-h', 'input-w', 'input-d'].forEach(id => {
    const val = parseFloat(document.getElementById(id).value);
    if (!val) return;
    document.getElementById(id).value = unit === 'in' ? cmToIn(val) : Math.round(inToCm(val));
  });

  // Convert weight input
  const wEl = document.getElementById('input-weight');
  const wVal = parseFloat(wEl.value);
  if (wVal) {
    wEl.value = unit === 'in'
      ? Math.round(wVal * 2.20462 * 10) / 10   // kg → lbs
      : Math.round(wVal / 2.20462 * 10) / 10;  // lbs → kg
  }

  // Update labels and toggle state
  document.querySelectorAll('.dim-unit').forEach(el => { el.textContent = unit; });
  document.querySelectorAll('.weight-unit').forEach(el => { el.textContent = unit === 'in' ? 'lbs' : 'kg'; });
  document.querySelectorAll('.unit-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.unit === unit);
  });
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

  // Unit toggle
  document.querySelectorAll('.unit-btn').forEach(btn => {
    btn.addEventListener('click', () => { setUnit(btn.dataset.unit); update(); });
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
      document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
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
