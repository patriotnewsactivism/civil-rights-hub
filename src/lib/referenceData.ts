export interface AccountabilityAgency {
  id: string;
  name: string;
  agency_type: string;
  state: string;
  city: string | null;
  total_complaints: number;
  total_settlements_paid: number;
  data_notes?: string;
  source_url?: string;
}

export interface AccountabilityOfficer {
  id: string;
  badge_number: string | null;
  first_name: string | null;
  last_name: string | null;
  rank: string | null;
  total_violations: number;
  status_summary?: string | null;
  source_url?: string;
  agency: {
    name: string;
    state: string;
  } | null;
}

export interface LegislationItem {
  id: string;
  bill_number: string;
  title: string;
  description: string | null;
  level: string;
  state: string | null;
  category: string[];
  status: string;
  introduced_date: string | null;
  last_action_date: string | null;
  last_action_description: string | null;
  support_count: number;
  oppose_count: number;
  sponsor?: string | null;
  source_url?: string | null;
}

export interface ActionTemplateItem {
  id: string;
  bill_id: string;
  template_type: string;
  position: string;
  subject_line: string | null;
  body_text: string;
}

export const ACCOUNTABILITY_DATA: {
  agencies: AccountabilityAgency[];
  officers: AccountabilityOfficer[];
} = {
  agencies: [
    {
      id: "agency-chicago-pd",
      name: "Chicago Police Department",
      agency_type: "Police Department",
      state: "Illinois",
      city: "Chicago",
      total_complaints: 54,
      total_settlements_paid: 91500000,
      data_notes: "Fatal police shootings documented by The Washington Post (2015-present).",
      source_url: "https://www.washingtonpost.com/graphics/investigations/police-shootings-database/",
    },
    {
      id: "agency-los-angeles-pd",
      name: "Los Angeles Police Department",
      agency_type: "Police Department",
      state: "California",
      city: "Los Angeles",
      total_complaints: 144,
      total_settlements_paid: 101000000,
      data_notes: "Fatal police shootings documented by The Washington Post (2015-present).",
      source_url: "https://www.washingtonpost.com/graphics/investigations/police-shootings-database/",
    },
    {
      id: "agency-new-york-pd",
      name: "New York Police Department",
      agency_type: "Police Department",
      state: "New York",
      city: "New York City",
      total_complaints: 86,
      total_settlements_paid: 115000000,
      data_notes: "Fatal police shootings documented by The Washington Post (2015-present).",
      source_url: "https://www.washingtonpost.com/graphics/investigations/police-shootings-database/",
    },
    {
      id: "agency-houston-pd",
      name: "Houston Police Department",
      agency_type: "Police Department",
      state: "Texas",
      city: "Houston",
      total_complaints: 88,
      total_settlements_paid: 3200000,
      data_notes: "Fatal police shootings documented by The Washington Post (2015-present).",
      source_url: "https://www.washingtonpost.com/graphics/investigations/police-shootings-database/",
    },
    {
      id: "agency-phoenix-pd",
      name: "Phoenix Police Department",
      agency_type: "Police Department",
      state: "Arizona",
      city: "Phoenix",
      total_complaints: 125,
      total_settlements_paid: 5700000,
      data_notes: "Fatal police shootings documented by The Washington Post (2015-present).",
      source_url: "https://www.washingtonpost.com/graphics/investigations/police-shootings-database/",
    },
    {
      id: "agency-philadelphia-pd",
      name: "Philadelphia Police Department",
      agency_type: "Police Department",
      state: "Pennsylvania",
      city: "Philadelphia",
      total_complaints: 39,
      total_settlements_paid: 9100000,
      data_notes: "Fatal police shootings documented by The Washington Post (2015-present).",
      source_url: "https://www.washingtonpost.com/graphics/investigations/police-shootings-database/",
    },
  ],
  officers: [
    {
      id: "officer-derek-chauvin",
      badge_number: null,
      first_name: "Derek",
      last_name: "Chauvin",
      rank: "Former Officer",
      total_violations: 18,
      status_summary: "Convicted of murder in 2021 for the killing of George Floyd.",
      source_url: "https://apnews.com/article/46bd65be5fdf0e96e7c0f18ac7940c2d",
      agency: {
        name: "Minneapolis Police Department",
        state: "Minnesota",
      },
    },
    {
      id: "officer-brett-hankison",
      badge_number: null,
      first_name: "Brett",
      last_name: "Hankison",
      rank: "Former Detective",
      total_violations: 26,
      status_summary: "Fired and federally indicted following the Breonna Taylor raid.",
      source_url: "https://www.courier-journal.com/story/news/crime/breonna-taylor/2020/10/02/breonna-taylor-case-complaints-against-officer-brett-hankison/5886545002/",
      agency: {
        name: "Louisville Metro Police Department",
        state: "Kentucky",
      },
    },
    {
      id: "officer-michael-slager",
      badge_number: null,
      first_name: "Michael",
      last_name: "Slager",
      rank: "Former Officer",
      total_violations: 2,
      status_summary: "Sentenced to 20 years in federal prison for the murder of Walter Scott.",
      source_url: "https://www.theguardian.com/us-news/2015/apr/08/north-charleston-police-michael-slager-complaints",
      agency: {
        name: "North Charleston Police Department",
        state: "South Carolina",
      },
    },
    {
      id: "officer-aaron-dean",
      badge_number: null,
      first_name: "Aaron",
      last_name: "Dean",
      rank: "Former Officer",
      total_violations: 1,
      status_summary: "Convicted of manslaughter in 2022 for the killing of Atatiana Jefferson.",
      source_url: "https://www.texastribune.org/2022/12/20/aaron-dean-sentencing-atatiana-jefferson/",
      agency: {
        name: "Fort Worth Police Department",
        state: "Texas",
      },
    },
    {
      id: "officer-jeronimo-yanez",
      badge_number: null,
      first_name: "Jeronimo",
      last_name: "Yanez",
      rank: "Former Officer",
      total_violations: 1,
      status_summary: "Acquitted in 2017 for the shooting of Philando Castile; city paid a $3 million settlement.",
      source_url: "https://www.nbcnews.com/news/us-news/philando-castile-shooting-officer-jeronimo-yanez-wins-175k-severance-package-n777056",
      agency: {
        name: "St. Anthony Police Department",
        state: "Minnesota",
      },
    },
  ],
};

export const LEGISLATION_DATA: {
  legislation: LegislationItem[];
  actionTemplates: Record<string, ActionTemplateItem[]>;
} = {
  legislation: [
    {
      id: "hr-40-118",
      bill_number: "H.R. 40",
      title: "Commission to Study and Develop Reparation Proposals for African Americans Act",
      description:
        "Establishes a commission to study the legacy of slavery and racism in the United States and recommend appropriate remedies, including reparations proposals.",
      level: "federal",
      state: null,
      category: ["Civil Rights", "Reparations"],
      status: "in_committee",
      introduced_date: "2023-01-09",
      last_action_date: "2023-04-14",
      last_action_description: "Referred to the Subcommittee on the Constitution and Limited Government.",
      support_count: 196,
      oppose_count: 0,
      sponsor: "Rep. Sheila Jackson Lee (D-TX-18)",
      source_url: "https://www.congress.gov/bill/118th-congress/house-bill/40",
    },
    {
      id: "hr-1280-117",
      bill_number: "H.R. 1280",
      title: "George Floyd Justice in Policing Act of 2021",
      description:
        "Addresses a broad range of police reform measures, including banning chokeholds, creating a national misconduct registry, and reforming qualified immunity.",
      level: "federal",
      state: null,
      category: ["Police Reform", "Accountability"],
      status: "passed_house",
      introduced_date: "2021-02-24",
      last_action_date: "2021-06-23",
      last_action_description: "Motion to invoke cloture on the motion to proceed in the Senate not agreed to.",
      support_count: 220,
      oppose_count: 212,
      sponsor: "Rep. Karen Bass (D-CA-37)",
      source_url: "https://www.congress.gov/bill/117th-congress/house-bill/1280",
    },
    {
      id: "s-492-118",
      bill_number: "S. 492",
      title: "Facial Recognition and Biometric Technology Moratorium Act of 2023",
      description:
        "Imposes a federal moratorium on facial recognition technology and conditions certain federal funding for state and local entities on adopting similar restrictions.",
      level: "federal",
      state: null,
      category: ["Privacy", "Surveillance"],
      status: "in_committee",
      introduced_date: "2023-02-16",
      last_action_date: "2023-02-16",
      last_action_description: "Read twice and referred to the Committee on Commerce, Science, and Transportation.",
      support_count: 6,
      oppose_count: 0,
      sponsor: "Sen. Edward J. Markey (D-MA)",
      source_url: "https://www.congress.gov/bill/118th-congress/senate-bill/492",
    },
    {
      id: "ca-sb-2-2021",
      bill_number: "California SB 2 (2021)",
      title: "Peace Officer Decertification Act",
      description:
        "Creates a statewide process to decertify officers for misconduct and establishes an advisory board with community representation to review cases.",
      level: "state",
      state: "California",
      category: ["Police Reform", "Accountability"],
      status: "signed",
      introduced_date: "2020-12-07",
      last_action_date: "2021-09-30",
      last_action_description: "Signed by Governor Gavin Newsom.",
      support_count: 28,
      oppose_count: 9,
      sponsor: "Sen. Steven Bradford (D-35)",
      source_url: "https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=202120220SB2",
    },
    {
      id: "co-sb20-217",
      bill_number: "Colorado SB20-217",
      title: "Enhance Law Enforcement Integrity Act",
      description:
        "Bans chokeholds, limits use of deadly force, requires body cameras, and removes qualified immunity as a defense for officers in civil rights cases.",
      level: "state",
      state: "Colorado",
      category: ["Accountability", "Transparency"],
      status: "signed",
      introduced_date: "2020-06-09",
      last_action_date: "2020-06-19",
      last_action_description: "Signed by Governor Jared Polis.",
      support_count: 52,
      oppose_count: 13,
      sponsor: "Sen. Leroy Garcia (D-3)",
      source_url: "https://leg.colorado.gov/bills/sb20-217",
    },
    {
      id: "ny-s-8496-2020",
      bill_number: "New York S.8496",
      title: "Eric Garner Anti-Chokehold Act",
      description:
        "Makes the use of chokeholds by law enforcement that result in serious injury or death a class C felony in New York State.",
      level: "state",
      state: "New York",
      category: ["Police Reform", "Civil Rights"],
      status: "signed",
      introduced_date: "2020-05-28",
      last_action_date: "2020-06-12",
      last_action_description: "Signed by Governor Andrew Cuomo.",
      support_count: 62,
      oppose_count: 0,
      sponsor: "Sen. Brian A. Benjamin (D-30)",
      source_url: "https://www.nysenate.gov/legislation/bills/2019/s8496",
    },
  ],
  actionTemplates: {
    "hr-40-118": [
      {
        id: "template-hr40-email",
        bill_id: "hr-40-118",
        template_type: "email",
        position: "support",
        subject_line: "Support H.R. 40 and a federal reparations study",
        body_text:
          "Dear Representative,\n\nI am urging you to support H.R. 40, which would create a commission to study the legacy of slavery and recommend reparative policies. This legislation is a crucial step toward acknowledging the lasting impacts of systemic racism and proposing actionable solutions.\n\nPlease cosponsor H.R. 40 and support it when it comes to a vote.\n\nSincerely,\n[Your Name]\n[City, State]",
      },
    ],
    "hr-1280-117": [
      {
        id: "template-hr1280-call",
        bill_id: "hr-1280-117",
        template_type: "call",
        position: "support",
        subject_line: null,
        body_text:
          "Hello, my name is [Your Name] and I live in [City]. I'm calling to ask [Representative/Senator] [Name] to champion the George Floyd Justice in Policing Act. This bill reforms qualified immunity, bans chokeholds, and creates a national misconduct registry — core steps toward transparency and accountability. Please make this legislation a priority. Thank you for your time.",
      },
    ],
    "s-492-118": [
      {
        id: "template-s492-email",
        bill_id: "s-492-118",
        template_type: "email",
        position: "support",
        subject_line: "Protect civil liberties: Support S. 492",
        body_text:
          "Dear Senator,\n\nPlease support S. 492, the Facial Recognition and Biometric Technology Moratorium Act. This bill pauses government use of error-prone surveillance tools until Congress enacts safeguards. Facial recognition has misidentified people of color at alarming rates. A moratorium will prevent further harm while standards are developed.\n\nThank you for standing up for civil liberties.\n\nSincerely,\n[Your Name]\n[City, State]",
      },
    ],
    "ca-sb-2-2021": [
      {
        id: "template-ca-sb2-email",
        bill_id: "ca-sb-2-2021",
        template_type: "email",
        position: "support",
        subject_line: "Thank you for implementing SB 2",
        body_text:
          "Dear Senator Bradford,\n\nThank you for sponsoring SB 2 to establish a decertification process for officers who commit serious misconduct. Please continue overseeing the implementation of this law to ensure the Peace Officer Standards and Training Commission has the resources to act quickly on community complaints.\n\nSincerely,\n[Your Name]\n[City, State]",
      },
    ],
    "co-sb20-217": [
      {
        id: "template-co-sb217-call",
        bill_id: "co-sb20-217",
        template_type: "call",
        position: "support",
        subject_line: null,
        body_text:
          "Hello, I'm [Your Name] from [City]. I'm calling to thank Senator Garcia for sponsoring SB20-217 and to ask for continued oversight to ensure body camera and reporting requirements are fully enforced. Transparency and accountability are critical to rebuilding trust. Please keep this law strong. Thank you.",
      },
    ],
    "ny-s-8496-2020": [
      {
        id: "template-ny-s8496-email",
        bill_id: "ny-s-8496-2020",
        template_type: "email",
        position: "support",
        subject_line: "Ensure strong enforcement of New York's chokehold ban",
        body_text:
          "Dear Senator Benjamin,\n\nThank you for passing the Eric Garner Anti-Chokehold Act. Please work with oversight agencies to ensure officers are held accountable when chokeholds are used in violation of the law. Constituents are watching implementation closely.\n\nSincerely,\n[Your Name]\n[City, State]",
      },
    ],
  },
};
