export interface Model {
  id: string
  name: string
  category: 'Fashion' | 'Commercial' | 'Influencer' | 'Acting'
  tagline: string
  height?: string
  bust?: string
  waist?: string
  hips?: string
  gradient: string
  featured?: boolean
}

export const models: Model[] = [
  {
    id: '1',
    name: 'Adaeze Okafor',
    category: 'Fashion',
    tagline: 'Runway & Editorial',
    height: "5'11\"",
    bust: '34"',
    waist: '24"',
    hips: '36"',
    gradient: 'linear-gradient(160deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    featured: true,
  },
  {
    id: '2',
    name: 'Tunde Abiodun',
    category: 'Commercial',
    tagline: 'Brand Campaigns & Print',
    height: "6'2\"",
    bust: '40"',
    waist: '32"',
    gradient: 'linear-gradient(160deg, #093028 0%, #237a57 100%)',
    featured: true,
  },
  {
    id: '3',
    name: 'Chisom Eze',
    category: 'Influencer',
    tagline: 'Digital Creator · 400K+',
    height: "5'8\"",
    gradient: 'linear-gradient(160deg, #200122 0%, #6f0000 100%)',
    featured: true,
  },
  {
    id: '4',
    name: 'Kemi Adeyemi',
    category: 'Acting',
    tagline: 'Film & Television',
    height: "5'7\"",
    gradient: 'linear-gradient(160deg, #005c97 0%, #363795 100%)',
  },
  {
    id: '5',
    name: 'Emeka Nwachukwu',
    category: 'Fashion',
    tagline: 'High Fashion & Couture',
    height: "6'1\"",
    bust: '38"',
    waist: '30"',
    gradient: 'linear-gradient(160deg, #12100e 0%, #2b4162 50%, #12100e 100%)',
  },
  {
    id: '6',
    name: 'Blessing Onyeka',
    category: 'Commercial',
    tagline: 'Print & Advertising',
    height: "5'9\"",
    bust: '36"',
    waist: '27"',
    hips: '38"',
    gradient: 'linear-gradient(160deg, #134e5e 0%, #71b280 100%)',
  },
  {
    id: '7',
    name: 'Fatima Musa',
    category: 'Influencer',
    tagline: 'Fashion Influencer · 600K+',
    height: "5'10\"",
    gradient: 'linear-gradient(160deg, #4a00e0 0%, #8e2de2 100%)',
  },
  {
    id: '8',
    name: 'Segun Olatunji',
    category: 'Acting',
    tagline: 'Film, TV & Presenting',
    height: "5'11\"",
    gradient: 'linear-gradient(160deg, #1f4037 0%, #99f2c8 100%)',
  },
  {
    id: '9',
    name: 'Ngozi Ibe',
    category: 'Fashion',
    tagline: 'Swimwear & Lifestyle',
    height: "5'9\"",
    bust: '34"',
    waist: '24"',
    hips: '35"',
    gradient: 'linear-gradient(160deg, #373b44 0%, #4286f4 100%)',
  },
  {
    id: '10',
    name: 'David Okeke',
    category: 'Commercial',
    tagline: 'Lifestyle & Brand Ambassador',
    height: "6'0\"",
    gradient: 'linear-gradient(160deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
  },
  {
    id: '11',
    name: 'Amara Obi',
    category: 'Influencer',
    tagline: 'Beauty & Lifestyle Creator',
    height: "5'6\"",
    gradient: 'linear-gradient(160deg, #3a1c71 0%, #d76d77 50%, #ffaf7b 100%)',
  },
  {
    id: '12',
    name: 'Chidi Aneke',
    category: 'Acting',
    tagline: 'Stage & Screen',
    height: "6'1\"",
    gradient: 'linear-gradient(160deg, #360033 0%, #0b8793 100%)',
  },
]
