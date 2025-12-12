import { groq } from 'next-sanity'

// Programs
export const programsQuery = groq`
  *[_type == "program"] | order(order asc) {
    _id,
    title,
    slug,
    description,
    icon,
    color,
    image
  }
`

export const programBySlugQuery = groq`
  *[_type == "program" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    content,
    icon,
    color,
    image
  }
`

// Team Members
export const teamMembersQuery = groq`
  *[_type == "teamMember"] | order(order asc) {
    _id,
    name,
    role,
    bio,
    photo
  }
`

// Camp Dates
export const campDatesQuery = groq`
  *[_type == "campDate"] | order(startDate asc) {
    _id,
    title,
    startDate,
    endDate,
    capacity,
    registrationUrl,
    status,
    price,
    program->{title, slug}
  }
`

export const upcomingCampDatesQuery = groq`
  *[_type == "campDate" && startDate >= now()] | order(startDate asc) {
    _id,
    title,
    startDate,
    endDate,
    capacity,
    registrationUrl,
    status,
    price,
    program->{title, slug}
  }
`

// FAQ
export const faqsQuery = groq`
  *[_type == "faq"] | order(order asc) {
    _id,
    question,
    answer,
    category
  }
`

// Partners
export const partnersQuery = groq`
  *[_type == "partner"] | order(order asc) {
    _id,
    name,
    description,
    logo,
    url
  }
`

// Site Settings
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    heroHeadline,
    heroSubheadline,
    waitlistMode,
    contactEmail,
    contactPhone,
    hwlabAddress,
    hwlabMapUrl,
    socialFacebook,
    socialInstagram,
    ddmUrl
  }
`
