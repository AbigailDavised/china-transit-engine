import {
  COUNTRIES,
  PORTS,
  POLICY_VERSION,
  EFFECTIVE_DATE,
  type CountryRule,
  type TransitPort,
  type VisaCategory,
} from './data.js';

export { COUNTRIES, PORTS, POLICY_VERSION, EFFECTIVE_DATE };
export type { CountryRule, TransitPort, VisaCategory };

export type EligibilityStatus = 'QUALIFIED' | 'NOT_QUALIFIED' | 'UNCERTAIN';

export interface MidnightClockResult {
  arrivalDate: string;
  arrivalTime: string;
  clockStartDate: string;
  clockStartTime: string;
  deadlineDate: string;
  deadlineTime: string;
  arrivalIsoCst: string;
  clockStartIsoCst: string;
  deadlineIsoCst: string;
  permittedHours: number;
  totalHoursFromArrival: number;
  bonusHoursOnArrivalDay: number;
}

export interface TransitEvaluationInput {
  /** ISO 3166-1 alpha-2 country code (e.g. "US", "GB", "SG") or country name */
  nationality: string;
  /** Origin country or customs territory before entering Mainland China */
  originCountry: string;
  /** Onward destination country or separate customs territory (e.g. "Japan", "Hong Kong SAR") */
  destinationCountry: string;
  /** Entry port id from PORTS (e.g. "shanghai-pudong", "beijing-capital") */
  entryPortId: string;
  /** Planned stay duration in calendar days (default: 4) */
  plannedDays?: number;
  /** Whether traveler holds a confirmed onward ticket with fixed seat and departure date */
  hasConfirmedTicket?: boolean;
  /** Whether passport has at least 3 months remaining validity */
  passportValidOver3Months?: boolean;
  /** Whether traveler has prior China immigration refusals or overstays */
  hasAdverseRecord?: boolean;
  /** Whether itinerary includes domestic flights/trains across provinces */
  hasDomesticConnection?: boolean;
  /** Optional arrival date in YYYY-MM-DD (China Standard Time) */
  arrivalDate?: string;
  /** Optional arrival time in HH:mm (China Standard Time, default 12:00) */
  arrivalTime?: string;
}

export interface TransitEvaluationResult {
  status: EligibilityStatus;
  policyApplied: VisaCategory | 'NONE';
  headline: string;
  summary: string;
  maxPermittedHours: number;
  allowableRegion: string;
  isRoundtrip: boolean;
  port: TransitPort;
  reasons: string[];
  recommendations: string[];
  checklist: string[];
  midnightClock?: MidnightClockResult;
  policyVersion: string;
}

export interface PortCorridorResult {
  allowed: boolean;
  samePort: boolean;
  sameRegion: boolean;
  entryPort: TransitPort;
  exitPort: TransitPort;
  corridorName: string;
  note: string;
}

const TERRITORY_ALIASES: Record<string, string> = {
  usa: 'united states',
  us: 'united states',
  'united states of america': 'united states',
  uk: 'united kingdom',
  gb: 'united kingdom',
  greatbritain: 'united kingdom',
  'hong kong': 'hong kong sar',
  'hong kong (hkg)': 'hong kong sar',
  hkg: 'hong kong sar',
  hk: 'hong kong sar',
  macau: 'macau sar',
  'macau (mfm)': 'macau sar',
  mfm: 'macau sar',
  mo: 'macau sar',
  taiwan: 'taiwan',
  'taiwan (tpe)': 'taiwan',
  tpe: 'taiwan',
  tw: 'taiwan',
  korea: 'south korea',
  'republic of korea': 'south korea',
  kr: 'south korea',
  jp: 'japan',
  sg: 'singapore',
  de: 'germany',
  fr: 'france',
  au: 'australia',
  ca: 'canada',
};

/**
 * Normalizes country/territory names and common airport/code aliases
 * so roundtrip traps (e.g. "USA" -> China -> "United States") are reliably caught.
 */
export function normalizeTerritory(value: string): string {
  const cleaned = value.trim().toLowerCase().replace(/\s+/g, ' ');
  return TERRITORY_ALIASES[cleaned] ?? cleaned;
}

/**
 * Looks up a country rule by ISO alpha-2 code (case-insensitive) or country name.
 */
export function findCountryRule(codeOrName: string): CountryRule | undefined {
  const q = codeOrName.trim().toLowerCase();
  if (!q) return undefined;
  return COUNTRIES.find(
    (c) => c.code.toLowerCase() === q || c.name.toLowerCase() === q
  );
}

/**
 * Looks up a port by id, IATA code in parentheses (e.g. "PVG"), or city name.
 */
export function findPort(idOrQuery: string): TransitPort | undefined {
  const q = idOrQuery.trim().toLowerCase();
  if (!q) return undefined;
  return (
    PORTS.find((p) => p.id.toLowerCase() === q) ??
    PORTS.find((p) => p.name.toLowerCase().includes(`(${q})`)) ??
    PORTS.find((p) => p.city.toLowerCase() === q)
  );
}

/**
 * Lists all open 240h TWOV ports, optionally filtered by region substring.
 */
export function listPortsByRegion(regionFilter?: string): TransitPort[] {
  if (!regionFilter) return [...PORTS];
  const q = regionFilter.trim().toLowerCase();
  return PORTS.filter((p) => p.region.toLowerCase().includes(q));
}

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

function formatUtcDateParts(ms: number): { date: string; time: string; isoCst: string } {
  const d = new Date(ms);
  const year = d.getUTCFullYear();
  const month = pad2(d.getUTCMonth() + 1);
  const day = pad2(d.getUTCDate());
  const hour = pad2(d.getUTCHours());
  const minute = pad2(d.getUTCMinutes());
  return {
    date: `${year}-${month}-${day}`,
    time: `${hour}:${minute}`,
    isoCst: `${year}-${month}-${day}T${hour}:${minute}:00+08:00`,
  };
}

/**
 * Calculates the official National Immigration Administration (NIA) 00:00 next-day clock.
 * Pure calendar/UTC math is used so results never drift across user browser timezones or DST.
 */
export function calculateMidnightClock(
  arrivalDate: string,
  arrivalTime = '12:00',
  permittedHours = 240
): MidnightClockResult {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(arrivalDate.trim());
  if (!dateMatch) {
    throw new Error(`Invalid arrivalDate "${arrivalDate}". Expected YYYY-MM-DD.`);
  }
  const timeMatch = /^(\d{1,2}):(\d{2})$/.exec(arrivalTime.trim());
  if (!timeMatch) {
    throw new Error(`Invalid arrivalTime "${arrivalTime}". Expected HH:mm.`);
  }

  const year = Number(dateMatch[1]);
  const month = Number(dateMatch[2]);
  const day = Number(dateMatch[3]);
  const hour = Number(timeMatch[1]);
  const minute = Number(timeMatch[2]);

  if (month < 1 || month > 12 || day < 1 || day > 31 || hour > 23 || minute > 59) {
    throw new Error(`Out-of-range arrival date/time: ${arrivalDate} ${arrivalTime}`);
  }

  const arrivalMs = Date.UTC(year, month - 1, day, hour, minute, 0);
  const clockStartMs = Date.UTC(year, month - 1, day + 1, 0, 0, 0);
  const permittedDays = Math.max(1, Math.floor(permittedHours / 24));
  const deadlineMs = Date.UTC(year, month - 1, day + permittedDays, 23, 59, 0);

  const arrivalFmt = formatUtcDateParts(arrivalMs);
  const startFmt = formatUtcDateParts(clockStartMs);
  const deadlineFmt = formatUtcDateParts(deadlineMs);

  const bonusHoursOnArrivalDay = Number(
    ((clockStartMs - arrivalMs) / (1000 * 60 * 60)).toFixed(2)
  );
  const totalHoursFromArrival = Number(
    ((deadlineMs - arrivalMs) / (1000 * 60 * 60)).toFixed(2)
  );

  return {
    arrivalDate: arrivalFmt.date,
    arrivalTime: arrivalFmt.time,
    clockStartDate: startFmt.date,
    clockStartTime: startFmt.time,
    deadlineDate: deadlineFmt.date,
    deadlineTime: deadlineFmt.time,
    arrivalIsoCst: arrivalFmt.isoCst,
    clockStartIsoCst: startFmt.isoCst,
    deadlineIsoCst: deadlineFmt.isoCst,
    permittedHours,
    totalHoursFromArrival,
    bonusHoursOnArrivalDay,
  };
}

/**
 * Validates whether entering via one port and departing via another (Open-Jaw)
 * falls within the same designated provincial/regional 240h TWOV corridor.
 */
export function validatePortCorridor(
  entryPortId: string,
  exitPortId: string
): PortCorridorResult {
  const entryPort = findPort(entryPortId) ?? PORTS[0];
  const exitPort = findPort(exitPortId) ?? entryPort;
  const samePort = entryPort.id === exitPort.id;
  const sameRegion =
    samePort ||
    entryPort.region === exitPort.region ||
    (entryPort.region.includes('Yangtze River Delta') &&
      exitPort.region.includes('Yangtze River Delta'));

  return {
    allowed: samePort || sameRegion,
    samePort,
    sameRegion,
    entryPort,
    exitPort,
    corridorName: entryPort.region,
    note: samePort
      ? `Single-port entry and exit via ${entryPort.name}.`
      : sameRegion
        ? `Open-jaw transit permitted within ${entryPort.region}.`
        : `Cross-region exit (${entryPort.region} -> ${exitPort.region}) requires confirming 240h inter-provincial allowance or holding a standard visa.`,
  };
}

/**
 * Evaluates traveler eligibility across Mutual 30-Day, Unilateral 15-Day,
 * and 240-Hour Transit Without Visa (TWOV) frameworks.
 */
export function evaluateTransitEligibility(
  input: TransitEvaluationInput
): TransitEvaluationResult {
  const port = findPort(input.entryPortId) ?? PORTS[0];
  const country = findCountryRule(input.nationality);
  const plannedDays = input.plannedDays ?? 4;
  const hasConfirmedTicket = input.hasConfirmedTicket ?? true;
  const passportValidOver3Months = input.passportValidOver3Months ?? true;
  const hasAdverseRecord = input.hasAdverseRecord ?? false;
  const hasDomesticConnection = input.hasDomesticConnection ?? false;

  const normOrigin = normalizeTerritory(input.originCountry);
  const normDest = normalizeTerritory(input.destinationCountry);
  const isRoundtrip =
    normOrigin !== '' && normDest !== '' && normOrigin === normDest;

  if (hasAdverseRecord) {
    return {
      status: 'UNCERTAIN',
      policyApplied: 'NONE',
      headline: 'Consular Pre-Clearance Required',
      summary:
        'Prior Chinese visa refusals, overstays, or border violations are subject to border officer discretion.',
      maxPermittedHours: 0,
      allowableRegion: 'Subject to Consular Approval',
      isRoundtrip,
      port,
      reasons: ['Adverse immigration history flagged by traveler.'],
      recommendations: [
        'Apply for a standard visa at a Chinese Embassy or Visa Application Center prior to departure.',
      ],
      checklist: ['Consult local Chinese Consulate for pre-clearance'],
      policyVersion: POLICY_VERSION,
    };
  }

  if (!passportValidOver3Months) {
    return {
      status: 'NOT_QUALIFIED',
      policyApplied: 'NONE',
      headline: 'Passport Validity Insufficient (< 3 Months)',
      summary:
        'Chinese border inspection requires at least 3 months of remaining passport validity for temporary entry permits.',
      maxPermittedHours: 0,
      allowableRegion: 'None',
      isRoundtrip,
      port,
      reasons: ['Passport has less than 3 months remaining validity.'],
      recommendations: [
        'Renew your passport before booking international travel to China.',
      ],
      checklist: ['Renew passport to achieve >= 3 months validity'],
      policyVersion: POLICY_VERSION,
    };
  }

  // Tier 1: Bilateral 30-Day Mutual Visa Exemption
  if (country?.visaCategory === 'MUTUAL_VISA_FREE') {
    const qualified = plannedDays <= 30;
    return {
      status: qualified ? 'QUALIFIED' : 'NOT_QUALIFIED',
      policyApplied: 'MUTUAL_VISA_FREE',
      headline: qualified
        ? 'Eligible: 30-Day Bilateral Mutual Visa Exemption'
        : 'Planned Stay Exceeds 30-Day Mutual Exemption',
      summary: qualified
        ? `Citizens of ${country.name} enjoy 30-day visa-free entry. Direct roundtrips are permitted without a third country.`
        : `Planned stay (${plannedDays} days) exceeds the 30-day bilateral limit for ${country.name}.`,
      maxPermittedHours: 720,
      allowableRegion: 'All Provinces Across Mainland China (Nationwide)',
      isRoundtrip,
      port,
      reasons: qualified
        ? []
        : [`Planned stay (${plannedDays} days) exceeds 30 days.`],
      recommendations: qualified
        ? [
            'Direct roundtrips are permitted; no third-country ticket needed.',
            'Nationwide travel across Mainland China is allowed.',
          ]
        : ['Shorten visit to <= 30 days or apply for a Tourist (L) Visa.'],
      checklist: qualified
        ? [
            'Valid passport (>= 3 months validity)',
            'Return or onward ticket within 30 days',
            'Hotel reservation or accommodation address',
          ]
        : [],
      policyVersion: POLICY_VERSION,
    };
  }

  // Tier 2: Unilateral 15-Day Visa-Free Scheme
  if (country?.visaCategory === 'UNILATERAL_VISA_FREE') {
    const qualified = plannedDays <= 15;
    return {
      status: qualified ? 'QUALIFIED' : 'NOT_QUALIFIED',
      policyApplied: 'UNILATERAL_VISA_FREE',
      headline: qualified
        ? 'Eligible: 15-Day Unilateral Visa-Free Entry'
        : 'Planned Stay Exceeds 15-Day Unilateral Limit',
      summary: qualified
        ? `Citizens of ${country.name} qualify for unilateral 15-day visa-free entry. Roundtrips are permitted.`
        : `Planned stay (${plannedDays} days) exceeds the 15-day unilateral limit for ${country.name}.`,
      maxPermittedHours: 360,
      allowableRegion: 'All Provinces Across Mainland China (Nationwide)',
      isRoundtrip,
      port,
      reasons: qualified
        ? []
        : [`Planned stay (${plannedDays} days) exceeds 15 days.`],
      recommendations: qualified
        ? [
            'Direct roundtrips are permitted; no third-country transit required.',
            'Nationwide travel across Mainland China is allowed.',
          ]
        : ['Shorten visit to <= 15 days or apply for an L/M Visa.'],
      checklist: qualified
        ? [
            'Valid passport (>= 3 months validity)',
            'Return or onward ticket within 15 days',
            'Hotel reservation or accommodation address',
          ]
        : [],
      policyVersion: POLICY_VERSION,
    };
  }

  // Tier 3: 240-Hour (10-Day) Transit Without Visa (TWOV)
  const reasons: string[] = [];
  const recommendations: string[] = [];

  if (!country) {
    reasons.push(
      `Nationality "${input.nationality}" is not on the 54-country 240-Hour TWOV list.`
    );
    recommendations.push(
      'Apply for a standard Chinese Tourist (L) or Transit (G) Visa in advance.'
    );
  }

  if (!hasConfirmedTicket) {
    reasons.push(
      'A confirmed onward passenger ticket with reserved seat and fixed departure date is mandatory.'
    );
    recommendations.push(
      'Book a confirmed onward flight, cruise, or rail ticket to a third country/region before check-in.'
    );
  } else if (isRoundtrip) {
    reasons.push(
      `Roundtrip trap detected (${input.originCountry} -> China -> ${input.destinationCountry}). 240h TWOV requires transit to a separate third country or territory (e.g. Hong Kong SAR, Macau SAR, Taiwan).`
    );
    recommendations.push(
      'Route onward to a third country/territory (such as Hong Kong or Tokyo) before returning home.'
    );
  }

  if (plannedDays > 10) {
    reasons.push(
      `Planned stay (${plannedDays} days) exceeds the 240-hour (10-day) statutory limit.`
    );
    recommendations.push(
      'Shorten layover to <= 10 days or apply for a Tourist (L) Visa.'
    );
  }

  if (hasDomesticConnection && plannedDays > 1) {
    reasons.push(
      `Multi-stop domestic transit over ${plannedDays} days requires verifying that both ports sit inside the 240h inter-provincial allowance.`
    );
    recommendations.push(
      'Prefer non-stop international departure from the arrival corridor or verify 240h cross-province port pairing.'
    );
  }

  const qualified = reasons.length === 0;
  const midnightClock =
    qualified && input.arrivalDate
      ? calculateMidnightClock(input.arrivalDate, input.arrivalTime ?? '12:00', 240)
      : undefined;

  return {
    status: qualified ? 'QUALIFIED' : 'NOT_QUALIFIED',
    policyApplied: country ? 'TWOV_ONLY' : 'NONE',
    headline: qualified
      ? 'Eligible: 240-Hour (10-Day) Transit Without Visa'
      : 'Not Eligible for 240-Hour Transit Without Visa',
    summary: qualified
      ? `Passport (${country!.name}) and third-country route (${input.originCountry} -> ${port.city} -> ${input.destinationCountry}) satisfy 240-Hour TWOV requirements.`
      : reasons[0] ?? 'Itinerary does not satisfy 240-Hour TWOV rules.',
    maxPermittedHours: country ? 240 : 0,
    allowableRegion: port.allowableStayArea,
    isRoundtrip,
    port,
    reasons,
    recommendations: qualified
      ? [
          `Stay within permitted area: ${port.allowableStayArea}.`,
          'Stay clock starts at 00:00 on the day following entry.',
        ]
      : recommendations,
    checklist: qualified
      ? [
          'Valid passport (>= 3 months validity)',
          `Confirmed onward ticket from ${port.city} to ${input.destinationCountry} within 240 hours`,
          'Blue Arrival Card for Temporary Entry Foreigners',
          'Hotel reservation or accommodation address in China',
        ]
      : [],
    midnightClock,
    policyVersion: POLICY_VERSION,
  };
}
