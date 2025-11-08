// Known measurement units for ingredient amounts
// These units will be extracted from ingredient amounts for proper aggregation
export const UNITS = [
  // Volume
  'ml',
  'dl',
  'l',
  'litra',
  'litraa',
  
  // Weight
  'g',
  'kg',
  'grammaa',
  'kiloa',
  
  // Spoons
  'tl',
  'rkl',
  'tlk',
  'rlk',
  'teelusikka',
  'teelusikkaa',
  'ruokalusikka',
  'ruokalusikkaa',
  
  // Pieces/items
  'kpl',
  'pala',
  'palaa',
  'sipuli',
  'sipulia',
  'pussi',
  'pussia',
  'purkki',
  'purkkia',
  'pakkaus',
  'pakkausta',
  'nippu',
  'nippua',
  'viipale',
  'viipaletta',
  
  // Other
  'prk',
  'pss',
  'tlk',
  'rs',
  'ripaus',
  'ripausta',
  'hyppysellinen',
  'hyppysellista',
  'annos',
  'annosta'
];

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
  
  // Check if the remainder starts with a known unit
  const lowerRemainder = remainder.toLowerCase();
  for (const unit of UNITS) {
    // Check if remainder starts with this unit (word boundary)
    // e.g., "pala inkivääriä" starts with "pala"
    const unitRegex = new RegExp(`^${unit}(?:\\s|$)`, 'i');
    if (unitRegex.test(lowerRemainder)) {
      return {
        value,
        unit,
        fullText: text
      };
    }
  }
  
  // No known unit found, treat entire remainder as unit
  return {
    value,
    unit: remainder,
    fullText: text
  };
}
