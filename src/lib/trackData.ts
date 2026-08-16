export interface TrackInfo {
  length: number;      // km per lap
  laps: number;        // race laps
  lapRecord: { time: string; driver: string; year: number };
  drsZones: number;
  firstGP: number;     // year of first F1 GP at this circuit
  type: "street" | "permanent" | "hybrid";
  turns: number;
  description: string;
}

export const TRACK_DATA: Record<string, TrackInfo> = {
  albert_park: {
    length: 5.278, laps: 58, drsZones: 4, firstGP: 1996, type: "hybrid", turns: 16,
    lapRecord: { time: "1:20.235", driver: "Charles Leclerc", year: 2022 },
    description: "A beautiful street-like circuit around Melbourne's Albert Park lake. Known for its flat-out sections and first-race drama. Cars handle very differently here after a winter break.",
  },
  bahrain: {
    length: 5.412, laps: 57, drsZones: 3, firstGP: 2004, type: "permanent", turns: 15,
    lapRecord: { time: "1:31.447", driver: "Pedro de la Rosa", year: 2005 },
    description: "The desert jewel of Sakhir. Hot conditions, an abrasive surface, and a unique setup challenge. The twilight race start makes for stunning visuals as the floodlights kick in.",
  },
  jeddah: {
    length: 6.174, laps: 50, drsZones: 3, firstGP: 2021, type: "street", turns: 27,
    lapRecord: { time: "1:30.734", driver: "Lewis Hamilton", year: 2021 },
    description: "The fastest street circuit on the calendar. Walls everywhere, barely any run-off — one of the most unforgiving venues. The 27-turn layout flows at relentless speed.",
  },
  suzuka: {
    length: 5.807, laps: 53, drsZones: 2, firstGP: 1987, type: "permanent", turns: 18,
    lapRecord: { time: "1:30.983", driver: "Lewis Hamilton", year: 2019 },
    description: "The most revered circuit on the calendar for any serious fan. The figure-of-eight layout with the legendary 130R, the Esses, and Spoon Curve makes it technically perfect. Drivers love it; mistakes are punished severely.",
  },
  shanghai: {
    length: 5.451, laps: 56, drsZones: 3, firstGP: 2004, type: "permanent", turns: 16,
    lapRecord: { time: "1:32.238", driver: "Michael Schumacher", year: 2004 },
    description: "Hermann Tilke's longest original design. The hairpin/snail complex in sector 1 is unique. Long straights reward power, but the final sector's medium-speed corners require a balanced setup.",
  },
  miami: {
    length: 5.412, laps: 57, drsZones: 3, firstGP: 2022, type: "street", turns: 19,
    lapRecord: { time: "1:29.708", driver: "Max Verstappen", year: 2023 },
    description: "Built around Hard Rock Stadium, this circuit is short on history but big on atmosphere. Multiple DRS zones and the marina section create good overtaking. A fan-favourite spectacle even if purists are split.",
  },
  imola: {
    length: 4.909, laps: 63, drsZones: 1, firstGP: 1980, type: "permanent", turns: 19,
    lapRecord: { time: "1:15.484", driver: "Rubens Barrichello", year: 2004 },
    description: "Steeped in history and heartbreak. The Autodromo Enzo e Dino Ferrari hosted legendary battles and the tragic 1994 San Marino weekend. Minimal overtaking opportunities create thrilling qualifying battles.",
  },
  monaco: {
    length: 3.337, laps: 78, drsZones: 1, firstGP: 1950, type: "street", turns: 19,
    lapRecord: { time: "1:12.909", driver: "Lewis Hamilton", year: 2021 },
    description: "The crown jewel of Formula 1. A street circuit where history drips from every barrier. Overtaking is near-impossible, so qualifying is everything. Winning Monaco means more to drivers than almost anything else.",
  },
  villeneuve: {
    length: 4.361, laps: 70, drsZones: 3, firstGP: 1978, type: "street", turns: 14,
    lapRecord: { time: "1:13.078", driver: "Valtteri Bottas", year: 2019 },
    description: "Named after the great Gilles Villeneuve on the Île Notre-Dame. Walls, chicanes, and a very low-grip surface. The famous Wall of Champions claims champions every few years. High-energy crowd and electrifying atmosphere.",
  },
  catalunya: {
    length: 4.675, laps: 66, drsZones: 2, firstGP: 1991, type: "permanent", turns: 16,
    lapRecord: { time: "1:18.149", driver: "Max Verstappen", year: 2021 },
    description: "Barcelona is the home of pre-season testing — teams know it inside out. A technically demanding circuit with very hard-wearing asphalt. Good barometer for overall car performance due to the variety of corner types.",
  },
  red_bull_ring: {
    length: 4.318, laps: 71, drsZones: 3, firstGP: 1970, type: "permanent", turns: 10,
    lapRecord: { time: "1:05.619", driver: "Carlos Sainz", year: 2020 },
    description: "A short, punchy circuit set in the stunning Styrian mountains. Only 10 corners but packed with drama. The steep gradient changes are unique and the fans — particularly the Dutch and German contingent — create festival atmosphere.",
  },
  silverstone: {
    length: 5.891, laps: 52, drsZones: 3, firstGP: 1950, type: "permanent", turns: 18,
    lapRecord: { time: "1:27.097", driver: "Max Verstappen", year: 2020 },
    description: "Home of the British Grand Prix and the birthplace of the World Championship. The high-speed Maggotts-Becketts-Chapel complex is among the most thrilling sequences anywhere in racing. Notoriously changeable weather.",
  },
  hungaroring: {
    length: 4.381, laps: 70, drsZones: 2, firstGP: 1986, type: "permanent", turns: 14,
    lapRecord: { time: "1:16.627", driver: "Lewis Hamilton", year: 2020 },
    description: "Once called 'Monaco without the barriers' — tight, twisty, and difficult to overtake. The 2021 race produced chaos from lap 1. Tyres degrade heavily here. Track position and pit strategy often decide the result.",
  },
  spa: {
    length: 7.004, laps: 44, drsZones: 3, firstGP: 1950, type: "hybrid", turns: 20,
    lapRecord: { time: "1:46.286", driver: "Valtteri Bottas", year: 2018 },
    description: "The greatest racing circuit in the world. Eau Rouge / Raidillon taken flat-out at 300+ km/h is the definitive F1 moment. The weather can change mid-lap — sun at La Source, rain at Pouhon. Pure, unfiltered motorsport.",
  },
  zandvoort: {
    length: 4.259, laps: 72, drsZones: 2, firstGP: 1952, type: "permanent", turns: 14,
    lapRecord: { time: "1:11.097", driver: "Lewis Hamilton", year: 2021 },
    description: "Returned to the calendar in 2021 after 36 years. Banked final corner is a masterpiece. The Dutch crowd turns the grandstands orange and the noise is extraordinary. Limited overtaking but intense wheel-to-wheel racing.",
  },
  monza: {
    length: 5.793, laps: 53, drsZones: 3, firstGP: 1950, type: "permanent", turns: 11,
    lapRecord: { time: "1:21.046", driver: "Rubens Barrichello", year: 2004 },
    description: "The Temple of Speed. The fastest race on the calendar with top speeds exceeding 350 km/h. Cars run near-zero downforce. Slipstreaming is a legitimate race strategy and qualifying laps are amongst the purest in motorsport.",
  },
  baku: {
    length: 6.003, laps: 51, drsZones: 2, firstGP: 2016, type: "street", turns: 20,
    lapRecord: { time: "1:43.009", driver: "Charles Leclerc", year: 2019 },
    description: "The Azerbaijan GP delivers drama like clockwork. The castle section is narrow and unforgiving; the long back straight allows massive DRS battles at 350+ km/h. Safety cars are almost guaranteed. Bizarre, chaotic, unmissable.",
  },
  marina_bay: {
    length: 4.940, laps: 62, drsZones: 3, firstGP: 2008, type: "street", turns: 19,
    lapRecord: { time: "1:41.905", driver: "Kevin Magnussen", year: 2018 },
    description: "The first ever night race. The city-state's skyline glittering under floodlights is iconic. Physical demands are extreme — heat, humidity, and 62 laps of wall-lined streets. The safety car appears almost every year.",
  },
  americas: {
    length: 5.513, laps: 56, drsZones: 2, firstGP: 2012, type: "permanent", turns: 20,
    lapRecord: { time: "1:36.169", driver: "Charles Leclerc", year: 2019 },
    description: "Circuit of the Americas, Austin. Turn 1 — a steep uphill blind apex — is one of the greatest corners in modern F1. The circuit blends elements of Maggotts, the Hockenheim stadium, and Istanbul's Turn 8. Great racing surface.",
  },
  rodriguez: {
    length: 4.304, laps: 71, drsZones: 3, firstGP: 1963, type: "permanent", turns: 17,
    lapRecord: { time: "1:17.774", driver: "Valtteri Bottas", year: 2021 },
    description: "High altitude (2,285m) means thin air, less engine power and aerodynamic grip. PU modes must be managed carefully. The stadium section and the final Peraltada-inspired corner provide spectacle. The passionate Mexican crowd is unmissable.",
  },
  interlagos: {
    length: 4.309, laps: 71, drsZones: 2, firstGP: 1973, type: "permanent", turns: 15,
    lapRecord: { time: "1:10.540", driver: "Rubens Barrichello", year: 2004 },
    description: "Interlagos runs counter-clockwise. The unpredictable São Paulo weather produces legendary races — 2008 and 2012 spring to mind immediately. The Senna S curves are a fitting tribute at a circuit where Senna was a god.",
  },
  las_vegas: {
    length: 6.201, laps: 50, drsZones: 2, firstGP: 2023, type: "street", turns: 17,
    lapRecord: { time: "1:35.490", driver: "Oscar Piastri", year: 2023 },
    description: "A night race down the Strip, past casinos and neon lights. The longest circuit on the 2024/2025 calendar. Critics questioned the spectacle; the racing actually delivered. Very fast with a slippery surface early in the weekend.",
  },
  losail: {
    length: 5.380, laps: 57, drsZones: 1, firstGP: 2021, type: "permanent", turns: 16,
    lapRecord: { time: "1:24.319", driver: "Max Verstappen", year: 2023 },
    description: "Qatar's floodlit Lusail circuit. A flowing, high-speed layout with relentless demands on front tyres. The 2021 debut race was chaotic with multiple tyre failures. Now a sprint weekend venue.",
  },
  yas_marina: {
    length: 5.281, laps: 58, drsZones: 3, firstGP: 2009, type: "hybrid", turns: 16,
    lapRecord: { time: "1:26.103", driver: "Max Verstappen", year: 2021 },
    description: "The season finale venue since 2009. The post-renovation layout (2021) removed the slow chicanes and produced proper racing. The backdrop of the Yas Viceroy hotel lit up at night is a stunning image to close the season.",
  },
};

export function getTrackInfo(circuitId: string): TrackInfo | null {
  return TRACK_DATA[circuitId] ?? null;
}
