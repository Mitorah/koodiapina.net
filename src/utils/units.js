// Known measurement units for ingredient amounts
// Format: { singular: 'base form', plural: ['plural forms'] }
export const UNIT_MAPPINGS = {
  // Volume
  'ml': { singular: 'ml', plural: [] },
  'dl': { singular: 'dl', plural: [] },
  'l': { singular: 'l', plural: [] },
  'litra': { singular: 'litra', plural: ['litraa'] },
  
  // Weight
  'g': { singular: 'g', plural: [] },
  'kg': { singular: 'kg', plural: [] },
  'gramma': { singular: 'gramma', plural: ['grammaa'] },
  'kilo': { singular: 'kilo', plural: ['kiloa'] },
  
  // Spoons
  'tl': { singular: 'tl', plural: [] },
  'rkl': { singular: 'rkl', plural: [] },
  'tlk': { singular: 'tlk', plural: [] },
  'rlk': { singular: 'rlk', plural: [] },
  'teelusikka': { singular: 'teelusikka', plural: ['teelusikkaa'] },
  'ruokalusikka': { singular: 'ruokalusikka', plural: ['ruokalusikkaa'] },
  
  // Pieces/items
  'kpl': { singular: 'kpl', plural: [] },
  'pala': { singular: 'pala', plural: ['palaa'] },
  'sipuli': { singular: 'sipuli', plural: ['sipulia'] },
  'pussi': { singular: 'pussi', plural: ['pussia'] },
  'purkki': { singular: 'purkki', plural: ['purkkia'] },
  'pakkaus': { singular: 'pakkaus', plural: ['pakkausta'] },
  'nippu': { singular: 'nippu', plural: ['nippua'] },
  'viipale': { singular: 'viipale', plural: ['viipaletta'] },
  
  // Other
  'prk': { singular: 'prk', plural: [] },
  'pss': { singular: 'pss', plural: [] },
  'rs': { singular: 'rs', plural: [] },
  'ripaus': { singular: 'ripaus', plural: ['ripausta'] },
  'hyppysellinen': { singular: 'hyppysellinen', plural: ['hyppysellista'] },
  'annos': { singular: 'annos', plural: ['annosta'] }
};

// Create a flat list of all units (both singular and plural) for matching
const ALL_UNITS = [];
const UNIT_TO_SINGULAR = new Map(); // Maps any form (singular/plural) to the singular form

Object.entries(UNIT_MAPPINGS).forEach(([key, mapping]) => {
  const singular = mapping.singular;
  
  // Add singular form
  ALL_UNITS.push(singular);
  UNIT_TO_SINGULAR.set(singular.toLowerCase(), singular);
  
  // Add plural forms and map them to singular
  mapping.plural.forEach(plural => {
    ALL_UNITS.push(plural);
    UNIT_TO_SINGULAR.set(plural.toLowerCase(), singular);
  });
});

/**
 * Normalize a unit to its singular form
 * @param {string} unit - e.g., "palaa", "pala", "kg"
 * @returns {string} - The singular/base form, e.g., "pala", "pala", "kg"
 */
export function normalizeUnit(unit) {
  if (!unit) return unit;
  const normalized = UNIT_TO_SINGULAR.get(unit.toLowerCase());
  return normalized || unit;
}

/**
 * Get the appropriate form (singular/plural) of a unit based on amount
 * @param {string} unit - The normalized (singular) unit, e.g., "pala"
 * @param {number} amount - The amount, e.g., 1, 2, 3.5
 * @returns {string} - The correct form: "pala" for 1, "palaa" for 2+
 */
export function getUnitForm(unit, amount) {
  if (!unit) return unit;
  
  // Find the mapping for this unit
  const mapping = UNIT_MAPPINGS[unit];
  if (!mapping) return unit; // Unknown unit, return as-is
  
  // If amount is 1 (or between 0 and 2), use singular
  // Otherwise use plural (if available)
  if (amount === 1 || (amount > 0 && amount < 2)) {
    return mapping.singular;
  } else if (mapping.plural && mapping.plural.length > 0) {
    return mapping.plural[0]; // Use first plural form
  } else {
    return mapping.singular; // No plural form (e.g., "kg"), use singular
  }
}

/**
 * Extract unit from an amount string
 * @param {string} amountText - e.g., "1 pala inkivääriä", "100g", "2 kpl"
 * @returns {object|null} - { value: number, unit: string, fullText: string } or null if can't parse
 */
export function parseAmountWithUnit(amountText) {
  if (!amountText || typeof amountText !== 'string') {
    return null;
  }
  
  const text = amountText.trim();
  
  // Match number at the start (with optional comma/decimal)
  const match = text.match(/^([\d,./-]+)\s*(.*)$/);
  if (!match) {
    return null;
  }
  
  const numberPart = match[1].replace(',', '.');
  const value = parseFloat(numberPart);
  
  if (isNaN(value)) {
    return null;
  }
  
  const remainder = match[2].trim();
  
  // If no remainder, it's just a number
  if (!remainder) {
    return null;
  }
  
  // Check if the remainder starts with a known unit (singular or plural)
  const lowerRemainder = remainder.toLowerCase();
  for (const unit of ALL_UNITS) {
    // Check if remainder starts with this unit (word boundary)
    // e.g., "palaa inkivääriä" starts with "palaa"
    const unitRegex = new RegExp(`^${unit}(?:\\s|$)`, 'i');
    if (unitRegex.test(lowerRemainder)) {
      // Normalize to singular form
      const normalizedUnit = normalizeUnit(unit);
      return {
        value,
        unit: normalizedUnit,
        fullText: text
      };
    }
  }
  
  // No known unit found
  return null;
}
