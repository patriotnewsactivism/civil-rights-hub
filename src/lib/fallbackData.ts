export interface AccountabilityAgency {
  id: string;
  name: string;
  agency_type: string;
  state: string;
  city: string | null;
  total_complaints: number;
  total_settlements_paid: number;
}

export interface AccountabilityOfficer {
  id: string;
  badge_number: string | null;
  first_name: string | null;
  last_name: string | null;
  rank: string | null;
  total_violations: number;
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
}

export interface ActionTemplateItem {
  id: string;
  bill_id: string;
  template_type: string;
  position: string;
  subject_line: string | null;
  body_text: string;
}

export const ACCOUNTABILITY_FALLBACK: {
  agencies: AccountabilityAgency[];
  officers: AccountabilityOfficer[];
} = {
  agencies: [
    {
      id: "fallback-agency-1",
      name: "River City Police Department",
      agency_type: "Police Department",
      state: "California",
      city: "River City",
      total_complaints: 28,
      total_settlements_paid: 1250000,
    },
    {
      id: "fallback-agency-2",
      name: "Metro Transit Authority",
      agency_type: "Transit Authority",
      state: "New York",
      city: "New York",
      total_complaints: 19,
      total_settlements_paid: 780000,
    },
    {
      id: "fallback-agency-3",
      name: "Jefferson County Sheriff's Office",
      agency_type: "Sheriff's Office",
      state: "Alabama",
      city: "Birmingham",
      total_complaints: 12,
      total_settlements_paid: 250000,
    },
  ],
  officers: [
    {
      id: "fallback-officer-1",
      badge_number: "4821",
      first_name: "Jordan",
      last_name: "Miles",
      rank: "Sergeant",
      total_violations: 5,
      agency: {
        name: "River City Police Department",
        state: "California",
      },
    },
    {
      id: "fallback-officer-2",
      badge_number: "MTA-204",
      first_name: "Taylor",
      last_name: "Nguyen",
      rank: "Transit Officer",
      total_violations: 4,
      agency: {
        name: "Metro Transit Authority",
        state: "New York",
      },
    },
    {
      id: "fallback-officer-3",
      badge_number: "JC-118",
      first_name: "Dana",
      last_name: "Reeves",
      rank: "Deputy",
      total_violations: 3,
      agency: {
        name: "Jefferson County Sheriff's Office",
        state: "Alabama",
      },
    },
  ],
};

export const LEGISLATION_FALLBACK: {
  legislation: LegislationItem[];
  actionTemplates: Record<string, ActionTemplateItem[]>;
} = {
  legislation: [
    {
      id: "fallback-bill-1",
      bill_number: "HR 4821",
      title: "Federal Police Accountability & Transparency Act",
      description:
        "Creates a national misconduct database and sets minimum standards for use of force, de-escalation, and public transparency.",
      level: "federal",
      state: null,
      category: ["Police Reform", "Accountability"],
      status: "in_committee",
      introduced_date: "2024-02-11",
      last_action_date: "2024-04-09",
      last_action_description: "Referred to the House Committee on the Judiciary",
      support_count: 12452,
      oppose_count: 2312,
    },
    {
      id: "fallback-bill-2",
      bill_number: "SB 317",
      title: "Community Control Over Surveillance Ordinance",
      description:
        "Requires local governments to approve and publicly report on surveillance technologies used by law enforcement agencies.",
      level: "state",
      state: "California",
      category: ["Privacy", "Transparency"],
      status: "introduced",
      introduced_date: "2024-01-22",
      last_action_date: "2024-03-15",
      last_action_description: "Assigned to Senate Committee on Public Safety",
      support_count: 5634,
      oppose_count: 821,
    },
    {
      id: "fallback-bill-3",
      bill_number: "HB 92",
      title: "Civilian Review Board Empowerment Act",
      description:
        "Grants subpoena power and independent investigative authority to local civilian oversight boards reviewing police misconduct.",
      level: "state",
      state: "Illinois",
      category: ["Accountability", "Civil Rights"],
      status: "passed_house",
      introduced_date: "2023-12-05",
      last_action_date: "2024-02-28",
      last_action_description: "Passed the Illinois House of Representatives",
      support_count: 7841,
      oppose_count: 1432,
    },
  ],
  actionTemplates: {
    "fallback-bill-1": [
      {
        id: "fallback-template-1",
        bill_id: "fallback-bill-1",
        template_type: "email",
        position: "support",
        subject_line: "Support the Police Accountability & Transparency Act",
        body_text:
          "Dear Representative,\n\nI am writing as your constituent to ask that you support HR 4821, the Police Accountability & Transparency Act. Establishing a national database of misconduct and strengthening transparency requirements are essential steps toward protecting civil rights in our community.\n\nThank you for your leadership.",
      },
    ],
    "fallback-bill-2": [
      {
        id: "fallback-template-2",
        bill_id: "fallback-bill-2",
        template_type: "call",
        position: "support",
        subject_line: null,
        body_text:
          "Hello, my name is [Your Name] and I live in [City]. I’m calling to ask Senator [Name] to support SB 317, which ensures community oversight before surveillance technologies are deployed. This legislation protects privacy while maintaining safety. Please support SB 317.",
      },
    ],
    "fallback-bill-3": [
      {
        id: "fallback-template-3",
        bill_id: "fallback-bill-3",
        template_type: "email",
        position: "support",
        subject_line: "Pass the Civilian Review Board Empowerment Act",
        body_text:
          "Dear Senator,\n\nPlease vote in favor of HB 92 when it reaches the Senate. Empowering civilian review boards with investigatory powers will help build trust between law enforcement and our communities.\n\nSincerely,\n[Your Name]",
      },
    ],
  },
};
