/**
 * All 25 EuroPython editions, ordered by year.
 * Shared between the bingo card component, OG pages, and PNG generator.
 */

export interface Edition {
  year: number;
  city: string;
}

export const EDITIONS: Edition[] = [
  { year: 2002, city: "Charleroi" },
  { year: 2003, city: "Charleroi" },
  { year: 2004, city: "Gothenburg" },
  { year: 2005, city: "Gothenburg" },
  { year: 2006, city: "CERN, Geneva" },
  { year: 2007, city: "Vilnius" },
  { year: 2008, city: "Vilnius" },
  { year: 2009, city: "Birmingham" },
  { year: 2010, city: "Birmingham" },
  { year: 2011, city: "Florence" },
  { year: 2012, city: "Florence" },
  { year: 2013, city: "Florence" },
  { year: 2014, city: "Berlin" },
  { year: 2015, city: "Bilbao" },
  { year: 2016, city: "Bilbao" },
  { year: 2017, city: "Rimini" },
  { year: 2018, city: "Edinburgh" },
  { year: 2019, city: "Basel" },
  { year: 2020, city: "Online" },
  { year: 2021, city: "Online" },
  { year: 2022, city: "Dublin" },
  { year: 2023, city: "Prague" },
  { year: 2024, city: "Prague" },
  { year: 2025, city: "Prague" },
  { year: 2026, city: "Kraków" },
];

export const EDITION_COUNT = EDITIONS.length;
export const UNIQUE_CITIES = new Set(EDITIONS.map((e) => e.city)).size;
