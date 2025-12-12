import { client } from './client'
import {
  programsQuery,
  programBySlugQuery,
  teamMembersQuery,
  campDatesQuery,
  upcomingCampDatesQuery,
  faqsQuery,
  partnersQuery,
  siteSettingsQuery,
} from './queries'

// Programs
export async function getPrograms() {
  return client.fetch(programsQuery)
}

export async function getProgramBySlug(slug: string) {
  return client.fetch(programBySlugQuery, { slug })
}

// Team Members
export async function getTeamMembers() {
  return client.fetch(teamMembersQuery)
}

// Camp Dates
export async function getCampDates() {
  return client.fetch(campDatesQuery)
}

export async function getUpcomingCampDates() {
  return client.fetch(upcomingCampDatesQuery)
}

// FAQ
export async function getFaqs() {
  return client.fetch(faqsQuery)
}

// Partners
export async function getPartners() {
  return client.fetch(partnersQuery)
}

// Site Settings
export async function getSiteSettings() {
  return client.fetch(siteSettingsQuery)
}
