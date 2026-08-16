export interface Driver {
  driverId: string;
  permanentNumber: string;
  code: string;
  givenName: string;
  familyName: string;
  dateOfBirth: string;
  nationality: string;
  url: string;
}

export interface Constructor {
  constructorId: string;
  name: string;
  nationality: string;
  url: string;
}

export interface DriverStanding {
  position: string;
  points: string;
  wins: string;
  Driver: Driver;
  Constructors: Constructor[];
}

export interface ConstructorStanding {
  position: string;
  points: string;
  wins: string;
  Constructor: Constructor;
}

export interface Circuit {
  circuitId: string;
  circuitName: string;
  Location: { lat: string; long: string; locality: string; country: string };
}

export interface Race {
  season: string;
  round: string;
  raceName: string;
  Circuit: Circuit;
  date: string;
  time?: string;
  Results?: RaceResult[];
  FirstPractice?: { date: string; time: string };
  SecondPractice?: { date: string; time: string };
  ThirdPractice?: { date: string; time: string };
  Qualifying?: { date: string; time: string };
  Sprint?: { date: string; time: string };
  SprintQualifying?: { date: string; time: string };
}

export interface RaceResult {
  number: string;
  position: string;
  positionText: string;
  points: string;
  Driver: Driver;
  Constructor: Constructor;
  laps: string;
  status: string;
  Time?: { millis: string; time: string };
  FastestLap?: {
    rank: string;
    lap: string;
    Time: { time: string };
    AverageSpeed: { units: string; speed: string };
  };
}

export interface ChampionSeason {
  season: string;
  round: string;
  DriverStandings: DriverStanding[];
}

export interface ConstructorChampionSeason {
  season: string;
  round: string;
  ConstructorStandings: ConstructorStanding[];
}

// OpenF1 types
export interface OF1Session {
  session_key: number;
  session_name: string;
  session_type: string;
  date_start: string;
  date_end: string;
  circuit_short_name: string;
  country_name: string;
  year: number;
  meeting_key: number;
  gmt_offset: string;
}

export interface OF1Driver {
  driver_number: number;
  broadcast_name: string;
  full_name: string;
  name_acronym: string;
  team_name: string;
  team_colour: string;
  headshot_url: string | null;
  country_code: string;
  session_key: number;
}

export interface OF1Position {
  driver_number: number;
  position: number;
  date: string;
  session_key: number;
}

export interface OF1Interval {
  driver_number: number;
  gap_to_leader: number | null;
  interval: number | null;
  date: string;
  session_key: number;
}

export interface OF1Stint {
  driver_number: number;
  stint_number: number;
  compound: string;
  lap_start: number;
  lap_end: number | null;
  tyre_age_at_start: number;
  session_key: number;
}

export interface OF1Lap {
  driver_number: number;
  lap_number: number;
  lap_duration: number | null;
  duration_sector_1: number | null;
  duration_sector_2: number | null;
  duration_sector_3: number | null;
  is_pit_out_lap: boolean;
  session_key: number;
}

export interface OF1RaceControl {
  date: string;
  driver_number: number | null;
  flag: string;
  lap_number: number;
  message: string;
  scope: string;
  sector: number | null;
  session_key: number;
}

export interface LiveTimingRow {
  position: number;
  driverNumber: number;
  driverCode: string;
  fullName: string;
  teamName: string;
  teamColour: string;
  gapToLeader: string;
  interval: string;
  compound: string;
  tyreAge: number;
  lapTime: string | null;
}
