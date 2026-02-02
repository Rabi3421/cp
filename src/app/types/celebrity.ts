export type Celebrity = {
  id: string
  name: string
  image: string
  category: string
  occupation: string
  birthDate: string
  birthPlace: string
  height?: string
  nationality: string
  biography: string
  introduction?: string
  earlyLife: string
  career: string
  personalLife: string
  awards: Award[]
  filmography: Film[]
  socialMedia?: SocialMedia
}

export type Award = {
  year: string
  title: string
  category: string
  work?: string
}

export type Film = {
  year: string
  title: string
  role: string
  type: 'Movie' | 'TV Show' | 'Web Series'
}

export type SocialMedia = {
  instagram?: string
  twitter?: string
  facebook?: string
}
