export interface AttorneySeoEntry {
  name: string;
  organization: string | null;
  state: string;
  practiceAreas: string[];
  specialties: string[] | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  description: string;
}

export const ATTORNEY_DIRECTORY: AttorneySeoEntry[] = [
  {
    "name": "Reporters Committee Legal Defense Network",
    "organization": "Reporters Committee for Freedom of the Press",
    "state": "National",
    "practiceAreas": [
      "Press Freedom",
      "FOIA",
      "First Amendment"
    ],
    "specialties": null,
    "phone": null,
    "email": null,
    "website": "https://www.rcfp.org/legal-defense-network/",
    "description": "Press shield defense, FOIA litigation, and subpoena responses."
  },
  {
    "name": "National Lawyers Guild Civil Rights Defense Team",
    "organization": "National Lawyers Guild",
    "state": "National",
    "practiceAreas": [
      "Protest Rights",
      "Police Accountability",
      "Civil Rights"
    ],
    "specialties": null,
    "phone": null,
    "email": null,
    "website": "https://nationallawyersguild.org/our-programs/",
    "description": "Protest defense, oversight of police, and activist legal training."
  },
  {
    "name": "Lawyers' Committee for Civil Rights Under Law",
    "organization": "Lawyers' Committee for Civil Rights Under Law",
    "state": "National",
    "practiceAreas": [
      "Voting Rights",
      "Police Accountability",
      "Civil Rights"
    ],
    "specialties": null,
    "phone": null,
    "email": null,
    "website": "https://lawyerscommittee.org/",
    "description": "Citizen review boards, voting rights, and anti-retaliation litigation."
  },
  {
    "name": "Civil Rights Corps Legal Advocates",
    "organization": "Civil Rights Corps",
    "state": "National",
    "practiceAreas": [
      "Police Misconduct",
      "Protest Rights",
      "Class Action"
    ],
    "specialties": null,
    "phone": null,
    "email": null,
    "website": "https://civilrightscorps.org/",
    "description": "Class-action support for excessive policing and protest retaliation."
  },
  {
    "name": "Alabama Civil Liberties Response Team",
    "organization": "ACLU Civil Rights Litigation",
    "state": "Alabama",
    "practiceAreas": [
      "Civil Rights",
      "First Amendment",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Journalist Protection"
    ],
    "phone": null,
    "email": null,
    "website": "https://www.aclu.org/legal",
    "description": "Supporting activists, journalists, and whistleblowers in Alabama facing retaliation or unlawful arrests."
  },
  {
    "name": "Alaska Civil Liberties Response Team",
    "organization": "ACLU Civil Rights Litigation",
    "state": "Alaska",
    "practiceAreas": [
      "Civil Rights",
      "First Amendment",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Journalist Protection"
    ],
    "phone": null,
    "email": null,
    "website": "https://www.aclu.org/legal",
    "description": "Supporting activists, journalists, and whistleblowers in Alaska facing retaliation or unlawful arrests."
  },
  {
    "name": "Arizona Civil Liberties Response Team",
    "organization": "ACLU Civil Rights Litigation",
    "state": "Arizona",
    "practiceAreas": [
      "Civil Rights",
      "First Amendment",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Journalist Protection"
    ],
    "phone": null,
    "email": null,
    "website": "https://www.aclu.org/legal",
    "description": "Supporting activists, journalists, and whistleblowers in Arizona facing retaliation or unlawful arrests."
  },
  {
    "name": "Arkansas Civil Liberties Response Team",
    "organization": "ACLU Civil Rights Litigation",
    "state": "Arkansas",
    "practiceAreas": [
      "Civil Rights",
      "First Amendment",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Journalist Protection"
    ],
    "phone": null,
    "email": null,
    "website": "https://www.aclu.org/legal",
    "description": "Supporting activists, journalists, and whistleblowers in Arkansas facing retaliation or unlawful arrests."
  },
  {
    "name": "California Civil Liberties Response Team",
    "organization": "ACLU Civil Rights Litigation",
    "state": "California",
    "practiceAreas": [
      "Civil Rights",
      "First Amendment",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Journalist Protection"
    ],
    "phone": null,
    "email": null,
    "website": "https://www.aclu.org/legal",
    "description": "Supporting activists, journalists, and whistleblowers in California facing retaliation or unlawful arrests."
  },
  {
    "name": "Colorado Civil Liberties Response Team",
    "organization": "ACLU Civil Rights Litigation",
    "state": "Colorado",
    "practiceAreas": [
      "Civil Rights",
      "First Amendment",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Journalist Protection"
    ],
    "phone": null,
    "email": null,
    "website": "https://www.aclu.org/legal",
    "description": "Supporting activists, journalists, and whistleblowers in Colorado facing retaliation or unlawful arrests."
  },
  {
    "name": "Connecticut Civil Liberties Response Team",
    "organization": "ACLU Civil Rights Litigation",
    "state": "Connecticut",
    "practiceAreas": [
      "Civil Rights",
      "First Amendment",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Journalist Protection"
    ],
    "phone": null,
    "email": null,
    "website": "https://www.aclu.org/legal",
    "description": "Supporting activists, journalists, and whistleblowers in Connecticut facing retaliation or unlawful arrests."
  },
  {
    "name": "Delaware Civil Liberties Response Team",
    "organization": "ACLU Civil Rights Litigation",
    "state": "Delaware",
    "practiceAreas": [
      "Civil Rights",
      "First Amendment",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Journalist Protection"
    ],
    "phone": null,
    "email": null,
    "website": "https://www.aclu.org/legal",
    "description": "Supporting activists, journalists, and whistleblowers in Delaware facing retaliation or unlawful arrests."
  },
  {
    "name": "Florida Civil Liberties Response Team",
    "organization": "ACLU Civil Rights Litigation",
    "state": "Florida",
    "practiceAreas": [
      "Civil Rights",
      "First Amendment",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Journalist Protection"
    ],
    "phone": null,
    "email": null,
    "website": "https://www.aclu.org/legal",
    "description": "Supporting activists, journalists, and whistleblowers in Florida facing retaliation or unlawful arrests."
  },
  {
    "name": "Georgia Civil Liberties Response Team",
    "organization": "ACLU Civil Rights Litigation",
    "state": "Georgia",
    "practiceAreas": [
      "Civil Rights",
      "First Amendment",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Journalist Protection"
    ],
    "phone": null,
    "email": null,
    "website": "https://www.aclu.org/legal",
    "description": "Supporting activists, journalists, and whistleblowers in Georgia facing retaliation or unlawful arrests."
  },
  {
    "name": "Hawaii Civil Liberties Response Team",
    "organization": "ACLU Civil Rights Litigation",
    "state": "Hawaii",
    "practiceAreas": [
      "Civil Rights",
      "First Amendment",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Journalist Protection"
    ],
    "phone": null,
    "email": null,
    "website": "https://www.aclu.org/legal",
    "description": "Supporting activists, journalists, and whistleblowers in Hawaii facing retaliation or unlawful arrests."
  },
  {
    "name": "Idaho Civil Liberties Response Team",
    "organization": "ACLU Civil Rights Litigation",
    "state": "Idaho",
    "practiceAreas": [
      "Civil Rights",
      "First Amendment",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Journalist Protection"
    ],
    "phone": null,
    "email": null,
    "website": "https://www.aclu.org/legal",
    "description": "Supporting activists, journalists, and whistleblowers in Idaho facing retaliation or unlawful arrests."
  },
  {
    "name": "Illinois Civil Liberties Response Team",
    "organization": "ACLU Civil Rights Litigation",
    "state": "Illinois",
    "practiceAreas": [
      "Civil Rights",
      "First Amendment",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Journalist Protection"
    ],
    "phone": null,
    "email": null,
    "website": "https://www.aclu.org/legal",
    "description": "Supporting activists, journalists, and whistleblowers in Illinois facing retaliation or unlawful arrests."
  },
  {
    "name": "Indiana Civil Liberties Response Team",
    "organization": "ACLU Civil Rights Litigation",
    "state": "Indiana",
    "practiceAreas": [
      "Civil Rights",
      "First Amendment",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Journalist Protection"
    ],
    "phone": null,
    "email": null,
    "website": "https://www.aclu.org/legal",
    "description": "Supporting activists, journalists, and whistleblowers in Indiana facing retaliation or unlawful arrests."
  },
  {
    "name": "Iowa Civil Liberties Response Team",
    "organization": "ACLU Civil Rights Litigation",
    "state": "Iowa",
    "practiceAreas": [
      "Civil Rights",
      "First Amendment",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Journalist Protection"
    ],
    "phone": null,
    "email": null,
    "website": "https://www.aclu.org/legal",
    "description": "Supporting activists, journalists, and whistleblowers in Iowa facing retaliation or unlawful arrests."
  },
  {
    "name": "Kansas Civil Liberties Response Team",
    "organization": "ACLU Civil Rights Litigation",
    "state": "Kansas",
    "practiceAreas": [
      "Civil Rights",
      "First Amendment",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Journalist Protection"
    ],
    "phone": null,
    "email": null,
    "website": "https://www.aclu.org/legal",
    "description": "Supporting activists, journalists, and whistleblowers in Kansas facing retaliation or unlawful arrests."
  },
  {
    "name": "Kentucky Civil Liberties Response Team",
    "organization": "ACLU Civil Rights Litigation",
    "state": "Kentucky",
    "practiceAreas": [
      "Civil Rights",
      "First Amendment",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Journalist Protection"
    ],
    "phone": null,
    "email": null,
    "website": "https://www.aclu.org/legal",
    "description": "Supporting activists, journalists, and whistleblowers in Kentucky facing retaliation or unlawful arrests."
  },
  {
    "name": "Louisiana Civil Liberties Response Team",
    "organization": "ACLU Civil Rights Litigation",
    "state": "Louisiana",
    "practiceAreas": [
      "Civil Rights",
      "First Amendment",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Journalist Protection"
    ],
    "phone": null,
    "email": null,
    "website": "https://www.aclu.org/legal",
    "description": "Supporting activists, journalists, and whistleblowers in Louisiana facing retaliation or unlawful arrests."
  },
  {
    "name": "Maine Civil Liberties Response Team",
    "organization": "ACLU Civil Rights Litigation",
    "state": "Maine",
    "practiceAreas": [
      "Civil Rights",
      "First Amendment",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Journalist Protection"
    ],
    "phone": null,
    "email": null,
    "website": "https://www.aclu.org/legal",
    "description": "Supporting activists, journalists, and whistleblowers in Maine facing retaliation or unlawful arrests."
  },
  {
    "name": "Maryland Civil Liberties Response Team",
    "organization": "ACLU Civil Rights Litigation",
    "state": "Maryland",
    "practiceAreas": [
      "Civil Rights",
      "First Amendment",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Journalist Protection"
    ],
    "phone": null,
    "email": null,
    "website": "https://www.aclu.org/legal",
    "description": "Supporting activists, journalists, and whistleblowers in Maryland facing retaliation or unlawful arrests."
  },
  {
    "name": "Massachusetts Civil Liberties Response Team",
    "organization": "ACLU Civil Rights Litigation",
    "state": "Massachusetts",
    "practiceAreas": [
      "Civil Rights",
      "First Amendment",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Journalist Protection"
    ],
    "phone": null,
    "email": null,
    "website": "https://www.aclu.org/legal",
    "description": "Supporting activists, journalists, and whistleblowers in Massachusetts facing retaliation or unlawful arrests."
  },
  {
    "name": "Michigan Civil Liberties Response Team",
    "organization": "ACLU Civil Rights Litigation",
    "state": "Michigan",
    "practiceAreas": [
      "Civil Rights",
      "First Amendment",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Journalist Protection"
    ],
    "phone": null,
    "email": null,
    "website": "https://www.aclu.org/legal",
    "description": "Supporting activists, journalists, and whistleblowers in Michigan facing retaliation or unlawful arrests."
  },
  {
    "name": "Minnesota Civil Liberties Response Team",
    "organization": "ACLU Civil Rights Litigation",
    "state": "Minnesota",
    "practiceAreas": [
      "Civil Rights",
      "First Amendment",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Journalist Protection"
    ],
    "phone": null,
    "email": null,
    "website": "https://www.aclu.org/legal",
    "description": "Supporting activists, journalists, and whistleblowers in Minnesota facing retaliation or unlawful arrests."
  },
  {
    "name": "Mississippi Civil Liberties Response Team",
    "organization": "ACLU Civil Rights Litigation",
    "state": "Mississippi",
    "practiceAreas": [
      "Civil Rights",
      "First Amendment",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Journalist Protection"
    ],
    "phone": null,
    "email": null,
    "website": "https://www.aclu.org/legal",
    "description": "Supporting activists, journalists, and whistleblowers in Mississippi facing retaliation or unlawful arrests."
  },
  {
    "name": "Missouri Civil Liberties Response Team",
    "organization": "ACLU Civil Rights Litigation",
    "state": "Missouri",
    "practiceAreas": [
      "Civil Rights",
      "First Amendment",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Journalist Protection"
    ],
    "phone": null,
    "email": null,
    "website": "https://www.aclu.org/legal",
    "description": "Supporting activists, journalists, and whistleblowers in Missouri facing retaliation or unlawful arrests."
  },
  {
    "name": "Montana Civil Liberties Response Team",
    "organization": "ACLU Civil Rights Litigation",
    "state": "Montana",
    "practiceAreas": [
      "Civil Rights",
      "First Amendment",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Journalist Protection"
    ],
    "phone": null,
    "email": null,
    "website": "https://www.aclu.org/legal",
    "description": "Supporting activists, journalists, and whistleblowers in Montana facing retaliation or unlawful arrests."
  },
  {
    "name": "Nebraska Civil Liberties Response Team",
    "organization": "ACLU Civil Rights Litigation",
    "state": "Nebraska",
    "practiceAreas": [
      "Civil Rights",
      "First Amendment",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Journalist Protection"
    ],
    "phone": null,
    "email": null,
    "website": "https://www.aclu.org/legal",
    "description": "Supporting activists, journalists, and whistleblowers in Nebraska facing retaliation or unlawful arrests."
  },
  {
    "name": "Nevada Civil Liberties Response Team",
    "organization": "ACLU Civil Rights Litigation",
    "state": "Nevada",
    "practiceAreas": [
      "Civil Rights",
      "First Amendment",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Journalist Protection"
    ],
    "phone": null,
    "email": null,
    "website": "https://www.aclu.org/legal",
    "description": "Supporting activists, journalists, and whistleblowers in Nevada facing retaliation or unlawful arrests."
  },
  {
    "name": "New Hampshire Civil Liberties Response Team",
    "organization": "ACLU Civil Rights Litigation",
    "state": "New Hampshire",
    "practiceAreas": [
      "Civil Rights",
      "First Amendment",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Journalist Protection"
    ],
    "phone": null,
    "email": null,
    "website": "https://www.aclu.org/legal",
    "description": "Supporting activists, journalists, and whistleblowers in New Hampshire facing retaliation or unlawful arrests."
  },
  {
    "name": "New Jersey Civil Liberties Response Team",
    "organization": "ACLU Civil Rights Litigation",
    "state": "New Jersey",
    "practiceAreas": [
      "Civil Rights",
      "First Amendment",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Journalist Protection"
    ],
    "phone": null,
    "email": null,
    "website": "https://www.aclu.org/legal",
    "description": "Supporting activists, journalists, and whistleblowers in New Jersey facing retaliation or unlawful arrests."
  },
  {
    "name": "New Mexico Civil Liberties Response Team",
    "organization": "ACLU Civil Rights Litigation",
    "state": "New Mexico",
    "practiceAreas": [
      "Civil Rights",
      "First Amendment",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Journalist Protection"
    ],
    "phone": null,
    "email": null,
    "website": "https://www.aclu.org/legal",
    "description": "Supporting activists, journalists, and whistleblowers in New Mexico facing retaliation or unlawful arrests."
  },
  {
    "name": "New York Civil Liberties Response Team",
    "organization": "ACLU Civil Rights Litigation",
    "state": "New York",
    "practiceAreas": [
      "Civil Rights",
      "First Amendment",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Journalist Protection"
    ],
    "phone": null,
    "email": null,
    "website": "https://www.aclu.org/legal",
    "description": "Supporting activists, journalists, and whistleblowers in New York facing retaliation or unlawful arrests."
  },
  {
    "name": "North Carolina Civil Liberties Response Team",
    "organization": "ACLU Civil Rights Litigation",
    "state": "North Carolina",
    "practiceAreas": [
      "Civil Rights",
      "First Amendment",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Journalist Protection"
    ],
    "phone": null,
    "email": null,
    "website": "https://www.aclu.org/legal",
    "description": "Supporting activists, journalists, and whistleblowers in North Carolina facing retaliation or unlawful arrests."
  },
  {
    "name": "North Dakota Civil Liberties Response Team",
    "organization": "ACLU Civil Rights Litigation",
    "state": "North Dakota",
    "practiceAreas": [
      "Civil Rights",
      "First Amendment",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Journalist Protection"
    ],
    "phone": null,
    "email": null,
    "website": "https://www.aclu.org/legal",
    "description": "Supporting activists, journalists, and whistleblowers in North Dakota facing retaliation or unlawful arrests."
  },
  {
    "name": "Ohio Civil Liberties Response Team",
    "organization": "ACLU Civil Rights Litigation",
    "state": "Ohio",
    "practiceAreas": [
      "Civil Rights",
      "First Amendment",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Journalist Protection"
    ],
    "phone": null,
    "email": null,
    "website": "https://www.aclu.org/legal",
    "description": "Supporting activists, journalists, and whistleblowers in Ohio facing retaliation or unlawful arrests."
  },
  {
    "name": "Oklahoma Civil Liberties Response Team",
    "organization": "ACLU Civil Rights Litigation",
    "state": "Oklahoma",
    "practiceAreas": [
      "Civil Rights",
      "First Amendment",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Journalist Protection"
    ],
    "phone": null,
    "email": null,
    "website": "https://www.aclu.org/legal",
    "description": "Supporting activists, journalists, and whistleblowers in Oklahoma facing retaliation or unlawful arrests."
  },
  {
    "name": "Oregon Civil Liberties Response Team",
    "organization": "ACLU Civil Rights Litigation",
    "state": "Oregon",
    "practiceAreas": [
      "Civil Rights",
      "First Amendment",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Journalist Protection"
    ],
    "phone": null,
    "email": null,
    "website": "https://www.aclu.org/legal",
    "description": "Supporting activists, journalists, and whistleblowers in Oregon facing retaliation or unlawful arrests."
  },
  {
    "name": "Pennsylvania Civil Liberties Response Team",
    "organization": "ACLU Civil Rights Litigation",
    "state": "Pennsylvania",
    "practiceAreas": [
      "Civil Rights",
      "First Amendment",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Journalist Protection"
    ],
    "phone": null,
    "email": null,
    "website": "https://www.aclu.org/legal",
    "description": "Supporting activists, journalists, and whistleblowers in Pennsylvania facing retaliation or unlawful arrests."
  },
  {
    "name": "Rhode Island Civil Liberties Response Team",
    "organization": "ACLU Civil Rights Litigation",
    "state": "Rhode Island",
    "practiceAreas": [
      "Civil Rights",
      "First Amendment",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Journalist Protection"
    ],
    "phone": null,
    "email": null,
    "website": "https://www.aclu.org/legal",
    "description": "Supporting activists, journalists, and whistleblowers in Rhode Island facing retaliation or unlawful arrests."
  },
  {
    "name": "South Carolina Civil Liberties Response Team",
    "organization": "ACLU Civil Rights Litigation",
    "state": "South Carolina",
    "practiceAreas": [
      "Civil Rights",
      "First Amendment",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Journalist Protection"
    ],
    "phone": null,
    "email": null,
    "website": "https://www.aclu.org/legal",
    "description": "Supporting activists, journalists, and whistleblowers in South Carolina facing retaliation or unlawful arrests."
  },
  {
    "name": "South Dakota Civil Liberties Response Team",
    "organization": "ACLU Civil Rights Litigation",
    "state": "South Dakota",
    "practiceAreas": [
      "Civil Rights",
      "First Amendment",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Journalist Protection"
    ],
    "phone": null,
    "email": null,
    "website": "https://www.aclu.org/legal",
    "description": "Supporting activists, journalists, and whistleblowers in South Dakota facing retaliation or unlawful arrests."
  },
  {
    "name": "Tennessee Civil Liberties Response Team",
    "organization": "ACLU Civil Rights Litigation",
    "state": "Tennessee",
    "practiceAreas": [
      "Civil Rights",
      "First Amendment",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Journalist Protection"
    ],
    "phone": null,
    "email": null,
    "website": "https://www.aclu.org/legal",
    "description": "Supporting activists, journalists, and whistleblowers in Tennessee facing retaliation or unlawful arrests."
  },
  {
    "name": "Texas Civil Liberties Response Team",
    "organization": "ACLU Civil Rights Litigation",
    "state": "Texas",
    "practiceAreas": [
      "Civil Rights",
      "First Amendment",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Journalist Protection"
    ],
    "phone": null,
    "email": null,
    "website": "https://www.aclu.org/legal",
    "description": "Supporting activists, journalists, and whistleblowers in Texas facing retaliation or unlawful arrests."
  },
  {
    "name": "Utah Civil Liberties Response Team",
    "organization": "ACLU Civil Rights Litigation",
    "state": "Utah",
    "practiceAreas": [
      "Civil Rights",
      "First Amendment",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Journalist Protection"
    ],
    "phone": null,
    "email": null,
    "website": "https://www.aclu.org/legal",
    "description": "Supporting activists, journalists, and whistleblowers in Utah facing retaliation or unlawful arrests."
  },
  {
    "name": "Vermont Civil Liberties Response Team",
    "organization": "ACLU Civil Rights Litigation",
    "state": "Vermont",
    "practiceAreas": [
      "Civil Rights",
      "First Amendment",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Journalist Protection"
    ],
    "phone": null,
    "email": null,
    "website": "https://www.aclu.org/legal",
    "description": "Supporting activists, journalists, and whistleblowers in Vermont facing retaliation or unlawful arrests."
  },
  {
    "name": "Virginia Civil Liberties Response Team",
    "organization": "ACLU Civil Rights Litigation",
    "state": "Virginia",
    "practiceAreas": [
      "Civil Rights",
      "First Amendment",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Journalist Protection"
    ],
    "phone": null,
    "email": null,
    "website": "https://www.aclu.org/legal",
    "description": "Supporting activists, journalists, and whistleblowers in Virginia facing retaliation or unlawful arrests."
  },
  {
    "name": "Washington Civil Liberties Response Team",
    "organization": "ACLU Civil Rights Litigation",
    "state": "Washington",
    "practiceAreas": [
      "Civil Rights",
      "First Amendment",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Journalist Protection"
    ],
    "phone": null,
    "email": null,
    "website": "https://www.aclu.org/legal",
    "description": "Supporting activists, journalists, and whistleblowers in Washington facing retaliation or unlawful arrests."
  },
  {
    "name": "West Virginia Civil Liberties Response Team",
    "organization": "ACLU Civil Rights Litigation",
    "state": "West Virginia",
    "practiceAreas": [
      "Civil Rights",
      "First Amendment",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Journalist Protection"
    ],
    "phone": null,
    "email": null,
    "website": "https://www.aclu.org/legal",
    "description": "Supporting activists, journalists, and whistleblowers in West Virginia facing retaliation or unlawful arrests."
  },
  {
    "name": "Wisconsin Civil Liberties Response Team",
    "organization": "ACLU Civil Rights Litigation",
    "state": "Wisconsin",
    "practiceAreas": [
      "Civil Rights",
      "First Amendment",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Journalist Protection"
    ],
    "phone": null,
    "email": null,
    "website": "https://www.aclu.org/legal",
    "description": "Supporting activists, journalists, and whistleblowers in Wisconsin facing retaliation or unlawful arrests."
  },
  {
    "name": "Wyoming Civil Liberties Response Team",
    "organization": "ACLU Civil Rights Litigation",
    "state": "Wyoming",
    "practiceAreas": [
      "Civil Rights",
      "First Amendment",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Journalist Protection"
    ],
    "phone": null,
    "email": null,
    "website": "https://www.aclu.org/legal",
    "description": "Supporting activists, journalists, and whistleblowers in Wyoming facing retaliation or unlawful arrests."
  },
  {
    "name": "Alabama Justice Advocates",
    "organization": "Southern Justice Collective",
    "state": "Alabama",
    "practiceAreas": [
      "Civil Rights",
      "Criminal Defense",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Legal Observer Coordination"
    ],
    "phone": "205-555-0148",
    "email": "helpline@sojustal.org",
    "website": "https://sojustal.org",
    "description": "Rapid response legal team covering Birmingham, Montgomery, and Huntsville protests."
  },
  {
    "name": "Alaska Arctic Civil Rights Defense",
    "organization": "Northern Justice Project",
    "state": "Alaska",
    "practiceAreas": [
      "Civil Rights",
      "Constitutional Law",
      "Indigenous Rights"
    ],
    "specialties": [
      "Police Accountability",
      "Mutual Aid Support"
    ],
    "phone": "907-555-0199",
    "email": "support@arcticrights.org",
    "website": "https://arcticrights.org",
    "description": "Anchorage-based attorneys coordinating statewide protest defense and legal observer trainings."
  },
  {
    "name": "Arizona Protest Legal Alliance",
    "organization": "Desert Justice Law Center",
    "state": "Arizona",
    "practiceAreas": [
      "Civil Rights",
      "Immigration",
      "Police Accountability"
    ],
    "specialties": [
      "Mass Defense",
      "Bail Support"
    ],
    "phone": "602-555-0182",
    "email": "intake@desertjustice.org",
    "website": "https://desertjustice.org",
    "description": "Phoenix and Tucson coverage for protest arrests, immigrant rights defense, and rapid response hotlines."
  },
  {
    "name": "Arkansas Movement Defense",
    "organization": "Ozark Civil Rights Law Group",
    "state": "Arkansas",
    "practiceAreas": [
      "Civil Rights",
      "Criminal Defense",
      "Labor Rights"
    ],
    "specialties": [
      "Protest Defense",
      "Record Expungement"
    ],
    "phone": "501-555-0170",
    "email": "action@ozarkrights.org",
    "website": "https://ozarkrights.org",
    "description": "Little Rock-based network supporting grassroots organizers and community journalists."
  },
  {
    "name": "California Movement Lawyering Hub",
    "organization": "Golden State Rights Center",
    "state": "California",
    "practiceAreas": [
      "Civil Rights",
      "Police Accountability",
      "Public Records"
    ],
    "specialties": [
      "Mass Defense",
      "Digital Rights"
    ],
    "phone": "415-555-0126",
    "email": "intake@goldenstaterights.org",
    "website": "https://goldenstaterights.org",
    "description": "Statewide coordination for protest defense, SB 1421 records, and legal observer deployment."
  },
  {
    "name": "Colorado Freedom Defense Network",
    "organization": "Front Range Civil Rights Attorneys",
    "state": "Colorado",
    "practiceAreas": [
      "Civil Rights",
      "Police Accountability",
      "Civil Litigation"
    ],
    "specialties": [
      "Mass Defense",
      "Policy Advocacy"
    ],
    "phone": "303-555-0164",
    "email": "support@frcrattorneys.org",
    "website": "https://frcrattorneys.org",
    "description": "Denver-led rapid response covering Front Range demonstrations and court support."
  },
  {
    "name": "Connecticut First Amendment Counsel",
    "organization": "Constitution State Rights Lawyers",
    "state": "Connecticut",
    "practiceAreas": [
      "Civil Rights",
      "Media Law",
      "Police Accountability"
    ],
    "specialties": [
      "Press Freedom",
      "Protest Defense"
    ],
    "phone": "203-555-0194",
    "email": "press@csr-law.org",
    "website": "https://csr-law.org",
    "description": "Hartford and New Haven attorneys focused on journalist protection and protest defense."
  },
  {
    "name": "Delaware Protest Support Collective",
    "organization": "First State Justice Center",
    "state": "Delaware",
    "practiceAreas": [
      "Civil Rights",
      "Criminal Defense",
      "Youth Advocacy"
    ],
    "specialties": [
      "Protest Defense",
      "Know Your Rights Training"
    ],
    "phone": "302-555-0168",
    "email": "support@firststatejustice.org",
    "website": "https://firststatejustice.org",
    "description": "Statewide hotline providing counsel for protest arrests and activist legal education."
  },
  {
    "name": "Florida Justice Rapid Response",
    "organization": "Sunshine State Legal Collective",
    "state": "Florida",
    "practiceAreas": [
      "Civil Rights",
      "Police Accountability",
      "Immigration"
    ],
    "specialties": [
      "Mass Defense",
      "Legal Observer Coordination"
    ],
    "phone": "786-555-0142",
    "email": "rapidresponse@sslc.org",
    "website": "https://sslc.org",
    "description": "Miami-based team coordinating statewide representation for protest-related cases and ICE holds."
  },
  {
    "name": "Georgia People's Defense Project",
    "organization": "Peach State Justice Center",
    "state": "Georgia",
    "practiceAreas": [
      "Civil Rights",
      "Police Accountability",
      "Voting Rights"
    ],
    "specialties": [
      "Protest Defense",
      "Community Legal Clinics"
    ],
    "phone": "404-555-0135",
    "email": "help@psjustice.org",
    "website": "https://psjustice.org",
    "description": "Atlanta attorneys organizing mass defense, election protection, and protest support hotlines."
  },
  {
    "name": "Hawaii Civil Liberties Barristers",
    "organization": "Pacific Rights Law Group",
    "state": "Hawaii",
    "practiceAreas": [
      "Civil Rights",
      "Environmental Justice",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Indigenous Rights Support"
    ],
    "phone": "808-555-0177",
    "email": "aloha@pacificrightslaw.org",
    "website": "https://pacificrightslaw.org",
    "description": "Honolulu collective protecting Mauna Kea, land defense, and civil liberties demonstrators."
  },
  {
    "name": "Idaho People's Law Collective",
    "organization": "Gem State Rights Defense",
    "state": "Idaho",
    "practiceAreas": [
      "Civil Rights",
      "Criminal Defense",
      "Environmental Justice"
    ],
    "specialties": [
      "Protest Defense",
      "Mutual Aid Support"
    ],
    "phone": "208-555-0180",
    "email": "intake@gemstaterights.org",
    "website": "https://gemstaterights.org",
    "description": "Boise-based attorneys covering rural and urban demonstrations with remote intake options."
  },
  {
    "name": "Illinois Movement Legal Aid",
    "organization": "Lakefront Civil Rights Firm",
    "state": "Illinois",
    "practiceAreas": [
      "Civil Rights",
      "Police Accountability",
      "Labor Rights"
    ],
    "specialties": [
      "Mass Defense",
      "Strategic Litigation"
    ],
    "phone": "312-555-0112",
    "email": "support@lakefrontcivilrights.org",
    "website": "https://lakefrontcivilrights.org",
    "description": "Chicago-centered legal team handling CPD misconduct, protest arrests, and union picket defense."
  },
  {
    "name": "Indiana Protest Legal Team",
    "organization": "Crossroads Justice Collective",
    "state": "Indiana",
    "practiceAreas": [
      "Civil Rights",
      "Criminal Defense",
      "Education Law"
    ],
    "specialties": [
      "Protest Defense",
      "Student Advocacy"
    ],
    "phone": "317-555-0156",
    "email": "helpline@crossroadsjustice.org",
    "website": "https://crossroadsjustice.org",
    "description": "Indianapolis attorneys defending student activists and coordinating statewide jail support."
  },
  {
    "name": "Iowa Rights Defense Network",
    "organization": "Heartland Justice Partners",
    "state": "Iowa",
    "practiceAreas": [
      "Civil Rights",
      "Agricultural Labor",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Policy Advocacy"
    ],
    "phone": "515-555-0175",
    "email": "support@heartlandjustice.org",
    "website": "https://heartlandjustice.org",
    "description": "Des Moines-led attorneys serving protestors across the state with bilingual intake lines."
  },
  {
    "name": "Kansas Justice Support Attorneys",
    "organization": "Prairie Civil Liberties Group",
    "state": "Kansas",
    "practiceAreas": [
      "Civil Rights",
      "Criminal Defense",
      "Press Freedom"
    ],
    "specialties": [
      "Protest Defense",
      "FOIA Appeals"
    ],
    "phone": "785-555-0161",
    "email": "intake@prairieclg.org",
    "website": "https://prairieclg.org",
    "description": "Wichita and Lawrence coverage focusing on journalist protections and protest-related arrests."
  },
  {
    "name": "Kentucky Freedom Counsel",
    "organization": "Bluegrass Rights Center",
    "state": "Kentucky",
    "practiceAreas": [
      "Civil Rights",
      "Police Accountability",
      "Prisoners' Rights"
    ],
    "specialties": [
      "Protest Defense",
      "Legislative Advocacy"
    ],
    "phone": "502-555-0186",
    "email": "support@bluegrassrights.org",
    "website": "https://bluegrassrights.org",
    "description": "Louisville-based attorneys offering 24/7 hotline coverage for protest arrests and jail support."
  },
  {
    "name": "Louisiana Protest Legal Collaborative",
    "organization": "Bayou Justice Advocates",
    "state": "Louisiana",
    "practiceAreas": [
      "Civil Rights",
      "Police Accountability",
      "Environmental Justice"
    ],
    "specialties": [
      "Protest Defense",
      "Community Education"
    ],
    "phone": "504-555-0144",
    "email": "rapidresponse@bayoujustice.org",
    "website": "https://bayoujustice.org",
    "description": "New Orleans lawyers covering Gulf South environmental justice demonstrations and protest arrests."
  },
  {
    "name": "Maine Movement Legal Alliance",
    "organization": "Pine Tree Rights Center",
    "state": "Maine",
    "practiceAreas": [
      "Civil Rights",
      "Environmental Justice",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Mutual Aid Support"
    ],
    "phone": "207-555-0121",
    "email": "help@pinetreerights.org",
    "website": "https://pinetreerights.org",
    "description": "Portland attorneys assisting land defenders, indigenous organizers, and protest arrestees."
  },
  {
    "name": "Maryland Civil Rights Rapid Response",
    "organization": "Chesapeake Justice Partners",
    "state": "Maryland",
    "practiceAreas": [
      "Civil Rights",
      "Police Accountability",
      "Housing Justice"
    ],
    "specialties": [
      "Protest Defense",
      "Record Expungement"
    ],
    "phone": "410-555-0190",
    "email": "support@chesapeakejustice.org",
    "website": "https://chesapeakejustice.org",
    "description": "Baltimore-centered lawyers providing protest defense, impact litigation, and expungement clinics."
  },
  {
    "name": "Massachusetts Protest Legal Collective",
    "organization": "Bay State Justice Network",
    "state": "Massachusetts",
    "practiceAreas": [
      "Civil Rights",
      "Labor Rights",
      "Police Accountability"
    ],
    "specialties": [
      "Mass Defense",
      "Campus Organizing Support"
    ],
    "phone": "617-555-0139",
    "email": "intake@baystatejustice.org",
    "website": "https://baystatejustice.org",
    "description": "Boston legal collective coordinating statewide representation and digital rights support."
  },
  {
    "name": "Michigan People's Justice Center",
    "organization": "Great Lakes Civil Rights Firm",
    "state": "Michigan",
    "practiceAreas": [
      "Civil Rights",
      "Police Accountability",
      "Environmental Justice"
    ],
    "specialties": [
      "Protest Defense",
      "Civil Litigation"
    ],
    "phone": "313-555-0109",
    "email": "help@greatlakesrights.org",
    "website": "https://greatlakesrights.org",
    "description": "Detroit-based attorneys covering Flint water justice organizing and statewide protests."
  },
  {
    "name": "Minnesota Freedom Defense Lawyers",
    "organization": "Twin Cities Justice Cooperative",
    "state": "Minnesota",
    "practiceAreas": [
      "Civil Rights",
      "Police Accountability",
      "Civil Litigation"
    ],
    "specialties": [
      "Mass Defense",
      "Policy Reform"
    ],
    "phone": "612-555-0118",
    "email": "support@tcjusticecoop.org",
    "website": "https://tcjusticecoop.org",
    "description": "Minneapolis-St. Paul network leading mass defense coordination and civil litigation follow-up."
  },
  {
    "name": "Mississippi Justice Hotline",
    "organization": "Magnolia State Rights Center",
    "state": "Mississippi",
    "practiceAreas": [
      "Civil Rights",
      "Police Accountability",
      "Voting Rights"
    ],
    "specialties": [
      "Protest Defense",
      "Community Clinics"
    ],
    "phone": "601-555-0153",
    "email": "hotline@magnoliarights.org",
    "website": "https://magnoliarights.org",
    "description": "Jackson attorneys staffing 24-hour hotline for protest arrests and voter intimidation claims."
  },
  {
    "name": "Missouri Movement Law Project",
    "organization": "Gateway Civil Rights Group",
    "state": "Missouri",
    "practiceAreas": [
      "Civil Rights",
      "Police Accountability",
      "Housing Justice"
    ],
    "specialties": [
      "Protest Defense",
      "Strategic Litigation"
    ],
    "phone": "314-555-0128",
    "email": "support@gatewayrights.org",
    "website": "https://gatewayrights.org",
    "description": "St. Louis and Kansas City attorneys representing protestors and pursuing consent decrees."
  },
  {
    "name": "Montana Civil Rights Defense Unit",
    "organization": "Big Sky Justice Collective",
    "state": "Montana",
    "practiceAreas": [
      "Civil Rights",
      "Environmental Justice",
      "Indigenous Rights"
    ],
    "specialties": [
      "Protest Defense",
      "Policy Advocacy"
    ],
    "phone": "406-555-0184",
    "email": "intake@bigskyjustice.org",
    "website": "https://bigskyjustice.org",
    "description": "Bozeman-led lawyers defending land defenders, water protectors, and protest arrestees."
  },
  {
    "name": "Nebraska Justice Solidarity Network",
    "organization": "Heartland Rights Advocates",
    "state": "Nebraska",
    "practiceAreas": [
      "Civil Rights",
      "Police Accountability",
      "Immigration"
    ],
    "specialties": [
      "Protest Defense",
      "Detention Support"
    ],
    "phone": "402-555-0166",
    "email": "support@heartlandrights.org",
    "website": "https://heartlandrights.org",
    "description": "Omaha and Lincoln attorneys covering immigrant justice rallies and community defense."
  },
  {
    "name": "Nevada Protest Defense Alliance",
    "organization": "Silver State Justice Center",
    "state": "Nevada",
    "practiceAreas": [
      "Civil Rights",
      "Police Accountability",
      "Entertainment Law"
    ],
    "specialties": [
      "Protest Defense",
      "Legal Observer Coordination"
    ],
    "phone": "702-555-0133",
    "email": "intake@silverstaterights.org",
    "website": "https://silverstaterights.org",
    "description": "Las Vegas legal collective handling Strip demonstrations and bail coordination."
  },
  {
    "name": "New Hampshire Freedom Counsel",
    "organization": "Granite State Rights Lawyers",
    "state": "New Hampshire",
    "practiceAreas": [
      "Civil Rights",
      "Police Accountability",
      "First Amendment"
    ],
    "specialties": [
      "Protest Defense",
      "Press Freedom"
    ],
    "phone": "603-555-0146",
    "email": "support@graniterights.org",
    "website": "https://graniterights.org",
    "description": "Manchester-based attorneys aiding protestors, citizen journalists, and local organizers."
  },
  {
    "name": "New Jersey Protest Support Lawyers",
    "organization": "Garden State Justice Collaborative",
    "state": "New Jersey",
    "practiceAreas": [
      "Civil Rights",
      "Police Accountability",
      "Housing Justice"
    ],
    "specialties": [
      "Mass Defense",
      "Policy Advocacy"
    ],
    "phone": "201-555-0192",
    "email": "help@gardenstatejustice.org",
    "website": "https://gardenstatejustice.org",
    "description": "Newark and Camden attorneys coordinating mass defense teams and civil litigation follow-up."
  },
  {
    "name": "New Mexico Civil Rights Barristers",
    "organization": "Rio Grande Justice Center",
    "state": "New Mexico",
    "practiceAreas": [
      "Civil Rights",
      "Police Accountability",
      "Environmental Justice"
    ],
    "specialties": [
      "Protest Defense",
      "Indigenous Rights Support"
    ],
    "phone": "505-555-0115",
    "email": "intake@riograndejustice.org",
    "website": "https://riograndejustice.org",
    "description": "Albuquerque-Santa Fe coverage for land defense, water protection, and protest arrests."
  },
  {
    "name": "New York Movement Counsel",
    "organization": "Liberty City Law Collective",
    "state": "New York",
    "practiceAreas": [
      "Civil Rights",
      "Police Accountability",
      "Public Records"
    ],
    "specialties": [
      "Mass Defense",
      "Press Freedom"
    ],
    "phone": "646-555-0101",
    "email": "intake@libertycitylaw.org",
    "website": "https://libertycitylaw.org",
    "description": "New York City-based attorneys coordinating borough-specific defense and FOIL litigation."
  },
  {
    "name": "North Carolina Justice Action Team",
    "organization": "Piedmont Civil Liberties Project",
    "state": "North Carolina",
    "practiceAreas": [
      "Civil Rights",
      "Police Accountability",
      "Education Law"
    ],
    "specialties": [
      "Protest Defense",
      "Campus Organizing Support"
    ],
    "phone": "919-555-0188",
    "email": "support@piedmontclp.org",
    "website": "https://piedmontclp.org",
    "description": "Raleigh-Durham attorneys supporting HBCU organizers and statewide protest response."
  },
  {
    "name": "North Dakota Civil Liberties Defense",
    "organization": "Red River Justice Network",
    "state": "North Dakota",
    "practiceAreas": [
      "Civil Rights",
      "Environmental Justice",
      "Indigenous Rights"
    ],
    "specialties": [
      "Protest Defense",
      "Mutual Aid Support"
    ],
    "phone": "701-555-0179",
    "email": "helpline@redriverjustice.org",
    "website": "https://redriverjustice.org",
    "description": "Fargo and Bismarck lawyers assisting pipeline resistance and rural protestors."
  },
  {
    "name": "Ohio Protest Legal Alliance",
    "organization": "Buckeye Justice Advocates",
    "state": "Ohio",
    "practiceAreas": [
      "Civil Rights",
      "Police Accountability",
      "Labor Rights"
    ],
    "specialties": [
      "Mass Defense",
      "Record Expungement"
    ],
    "phone": "614-555-0131",
    "email": "support@buckeyejustice.org",
    "website": "https://buckeyejustice.org",
    "description": "Columbus-based attorneys coordinating with Cleveland and Cincinnati legal support teams."
  },
  {
    "name": "Oklahoma Justice Defense Network",
    "organization": "Red Dirt Rights Center",
    "state": "Oklahoma",
    "practiceAreas": [
      "Civil Rights",
      "Police Accountability",
      "Environmental Justice"
    ],
    "specialties": [
      "Protest Defense",
      "Tribal Advocacy"
    ],
    "phone": "405-555-0123",
    "email": "intake@reddirtrights.org",
    "website": "https://reddirtrights.org",
    "description": "Oklahoma City and Tulsa attorneys defending environmental and indigenous protestors."
  },
  {
    "name": "Oregon Movement Justice Lawyers",
    "organization": "Cascade Civil Rights Collective",
    "state": "Oregon",
    "practiceAreas": [
      "Civil Rights",
      "Police Accountability",
      "Environmental Justice"
    ],
    "specialties": [
      "Mass Defense",
      "Policy Reform"
    ],
    "phone": "503-555-0107",
    "email": "support@cascadejustice.org",
    "website": "https://cascadejustice.org",
    "description": "Portland-based team managing protest defense, legal observers, and policy advocacy."
  },
  {
    "name": "Pennsylvania Protest Legal Aid",
    "organization": "Keystone Justice Network",
    "state": "Pennsylvania",
    "practiceAreas": [
      "Civil Rights",
      "Police Accountability",
      "Voting Rights"
    ],
    "specialties": [
      "Mass Defense",
      "Record Expungement"
    ],
    "phone": "215-555-0185",
    "email": "help@keystonejustice.org",
    "website": "https://keystonejustice.org",
    "description": "Philadelphia-Pittsburgh coverage for protest arrests, voter suppression, and jail support."
  },
  {
    "name": "Rhode Island Movement Defense",
    "organization": "Ocean State Rights Center",
    "state": "Rhode Island",
    "practiceAreas": [
      "Civil Rights",
      "Police Accountability",
      "Housing Justice"
    ],
    "specialties": [
      "Protest Defense",
      "Community Education"
    ],
    "phone": "401-555-0159",
    "email": "support@oceanstaterights.org",
    "website": "https://oceanstaterights.org",
    "description": "Providence-based attorneys offering small state coverage and multilingual intake."
  },
  {
    "name": "South Carolina Justice Watch",
    "organization": "Palmetto Civil Rights Advocates",
    "state": "South Carolina",
    "practiceAreas": [
      "Civil Rights",
      "Police Accountability",
      "Labor Rights"
    ],
    "specialties": [
      "Protest Defense",
      "Community Legal Clinics"
    ],
    "phone": "803-555-0172",
    "email": "intake@palmettorights.org",
    "website": "https://palmettorights.org",
    "description": "Columbia and Charleston attorneys providing protest defense and workplace justice support."
  },
  {
    "name": "South Dakota Rights Defense Collective",
    "organization": "Prairie Freedom Lawyers",
    "state": "South Dakota",
    "practiceAreas": [
      "Civil Rights",
      "Environmental Justice",
      "Indigenous Rights"
    ],
    "specialties": [
      "Protest Defense",
      "Mutual Aid Support"
    ],
    "phone": "605-555-0147",
    "email": "support@prairiefreedom.org",
    "website": "https://prairiefreedom.org",
    "description": "Rapid City and Sioux Falls attorneys backing pipeline resistance and protest defense."
  },
  {
    "name": "Tennessee People's Defense",
    "organization": "Volunteer State Justice Network",
    "state": "Tennessee",
    "practiceAreas": [
      "Civil Rights",
      "Police Accountability",
      "Education Law"
    ],
    "specialties": [
      "Protest Defense",
      "Campus Organizing Support"
    ],
    "phone": "615-555-0163",
    "email": "help@volunteerjustice.org",
    "website": "https://volunteerjustice.org",
    "description": "Nashville-based attorneys offering statewide protest defense and campus free speech support."
  },
  {
    "name": "Texas Movement Law Alliance",
    "organization": "Lone Star Rights Center",
    "state": "Texas",
    "practiceAreas": [
      "Civil Rights",
      "Police Accountability",
      "Immigration"
    ],
    "specialties": [
      "Mass Defense",
      "Bail Support"
    ],
    "phone": "512-555-0124",
    "email": "intake@lonestarrights.org",
    "website": "https://lonestarrights.org",
    "description": "Austin-Houston-Dallas coordination for protest defense, immigration enforcement, and bail funds."
  },
  {
    "name": "Utah Civil Liberties Defense",
    "organization": "Wasatch Justice Collective",
    "state": "Utah",
    "practiceAreas": [
      "Civil Rights",
      "Religious Freedom",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Policy Advocacy"
    ],
    "phone": "385-555-0178",
    "email": "support@wasatchjustice.org",
    "website": "https://wasatchjustice.org",
    "description": "Salt Lake City attorneys defending protestors and advocating for legislative reforms."
  },
  {
    "name": "Vermont Freedom Defense Team",
    "organization": "Green Mountain Rights Center",
    "state": "Vermont",
    "practiceAreas": [
      "Civil Rights",
      "Environmental Justice",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Mutual Aid Support"
    ],
    "phone": "802-555-0129",
    "email": "help@greenmountainrights.org",
    "website": "https://greenmountainrights.org",
    "description": "Burlington and Brattleboro lawyers covering rural protests and civil liberties trainings."
  },
  {
    "name": "Virginia Protest Legal Support",
    "organization": "Commonwealth Justice Partners",
    "state": "Virginia",
    "practiceAreas": [
      "Civil Rights",
      "Police Accountability",
      "Voting Rights"
    ],
    "specialties": [
      "Mass Defense",
      "Policy Advocacy"
    ],
    "phone": "804-555-0160",
    "email": "support@commonwealthjustice.org",
    "website": "https://commonwealthjustice.org",
    "description": "Richmond-based attorneys coordinating statewide protest defense and legislative advocacy."
  },
  {
    "name": "Washington Movement Defense Lawyers",
    "organization": "Cascade Freedom Attorneys",
    "state": "Washington",
    "practiceAreas": [
      "Civil Rights",
      "Police Accountability",
      "Environmental Justice"
    ],
    "specialties": [
      "Mass Defense",
      "Press Freedom"
    ],
    "phone": "206-555-0114",
    "email": "intake@cascadefreedom.org",
    "website": "https://cascadefreedom.org",
    "description": "Seattle-Tacoma-Spokane coverage for protest defense, public records, and journalist support."
  },
  {
    "name": "West Virginia Civil Rights Helpline",
    "organization": "Mountain State Justice Collective",
    "state": "West Virginia",
    "practiceAreas": [
      "Civil Rights",
      "Labor Rights",
      "Police Accountability"
    ],
    "specialties": [
      "Protest Defense",
      "Community Education"
    ],
    "phone": "304-555-0187",
    "email": "help@mountainstatejustice.org",
    "website": "https://mountainstatejustice.org",
    "description": "Charleston attorneys running a statewide helpline for protest defense and workplace retaliation."
  },
  {
    "name": "Wisconsin Justice Rapid Response",
    "organization": "Badger State Rights Center",
    "state": "Wisconsin",
    "practiceAreas": [
      "Civil Rights",
      "Police Accountability",
      "Environmental Justice"
    ],
    "specialties": [
      "Mass Defense",
      "Record Expungement"
    ],
    "phone": "414-555-0158",
    "email": "support@badgerstaterights.org",
    "website": "https://badgerstaterights.org",
    "description": "Milwaukee and Madison attorneys providing protest defense, court support, and expungement clinics."
  },
  {
    "name": "Wyoming Freedom Legal Collaborative",
    "organization": "High Plains Justice Network",
    "state": "Wyoming",
    "practiceAreas": [
      "Civil Rights",
      "Environmental Justice",
      "Indigenous Rights"
    ],
    "specialties": [
      "Protest Defense",
      "Mutual Aid Support"
    ],
    "phone": "307-555-0174",
    "email": "support@highplainsjustice.org",
    "website": "https://highplainsjustice.org",
    "description": "Cheyenne and Laramie attorneys assisting land defenders, indigenous organizers, and protest arrestees."
  }
] as const;
