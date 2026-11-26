// ============ EDIT ONLY THE TEXT INSIDE THE QUOTES AND THE NUMBERS ============
const CONFIG = {
  // Game title shown at the top
  gameTitle: "KRS — POLE OF WONDERS",

  // Team names (keep exactly 3). Playing order: 1 → 2 → 3 → 1 ...
  teamNames: [
    "Team 1",   // <-- Team 1 name
    "Team 2",   // <-- Team 2 name
    "Team 3"    // <-- Team 3 name
  ],

  // Chance of landing on each wheel result, in percent. TOTAL must be 100.
  // (The wheel always has 20 equal-size sectors; only the chances change.)
  wheelChances: {
    "50": 26,                 // 3 sectors, COMMON
    "100": 18,                // 3 sectors, UNCOMMON
    "300": 17,                // 3 sectors, RARE
    "500": 11,                // 2 sectors, LEGENDARY
    "0": 5,                   // 1 sector
    "BANKRUPT": 3,            // 3 sectors
    "+1 LETTER": 10,          // 3 sectors
    "+1 EXTRA CHANCE": 6,     // 1 sector
    "+2 EXTRA CHANCES": 4     // 1 sector
  }
};
