export interface SituationInfo {
  id: string;
  title: string;
  emoji: string;
  description: string;
  script: string;
  checklist: string[];
  warning: string;
}

export const SITUATIONS: SituationInfo[] = [
  {
    id: "traffic",
    title: "Pulled Over",
    emoji: "🚗",
    description: "General U.S. safety and rights-reference steps for a traffic stop.",
    script: "Officer, I will provide the driving documents required by law. I am choosing to remain silent about other questions, and I do not consent to a search of myself or my vehicle.",
    checklist: [
      "Pull over promptly and safely in a place where you can stop without creating another hazard.",
      "Keep your hands visible and tell the officer before reaching for documents.",
      "Provide the driver's license, registration, insurance, or other driving documents required in your jurisdiction.",
      "If you do not consent to a search, say so clearly and calmly; do not physically interfere with a search.",
      "If an officer orders you out during a lawful traffic stop, do not physically resist the order.",
      "Document the encounter afterward, including names, badge numbers, time, place, and any citations or paperwork.",
    ],
    warning: "Under Pennsylvania v. Mimms, an officer may order the driver out of a vehicle after a lawful traffic stop without violating the Fourth Amendment. That does not by itself create consent to a separate search.",
  },
  {
    id: "door",
    title: "Police at Door",
    emoji: "🚪",
    description: "General reference steps when officers seek entry to a home.",
    script: "I do not consent to entry or a search. If you have a warrant, please show it to me so I can read it. I will not physically interfere with what you do.",
    checklist: [
      "You can ask who is there and why they want to enter before deciding whether to open the door.",
      "Ask whether officers have a warrant and, if practical, ask to see or read it.",
      "If you do not consent to entry or a search, state that clearly without physically blocking officers.",
      "If officers enter, do not physically resist. Record what you can safely observe and preserve paperwork afterward.",
      "Contact a lawyer promptly if property is searched, seized, damaged, or if anyone is detained or arrested.",
    ],
    warning: "A warrant is not the only possible legal basis for entry. Consent and recognized emergency/exigent-circumstance exceptions can also matter, so do not assume an entry is automatically unlawful solely because no warrant is shown at the door.",
  },
  {
    id: "street",
    title: "Stopped on Street",
    emoji: "🛑",
    description: "General reference steps for a police encounter while on foot.",
    script: "Officer, am I free to go, or am I being detained? I am choosing to remain silent. If you require identification, please tell me the legal basis for that requirement.",
    checklist: [
      "Ask calmly whether you are free to go. If the officer says yes, leave calmly.",
      "If detained, keep your hands visible and avoid sudden movements or physical resistance.",
      "State identification duties vary by state and by circumstance; driving, arrest, probation, and other situations can have separate rules.",
      "You can state that you do not consent to a search while still avoiding physical interference.",
      "If you choose to invoke silence, say so clearly rather than trying to argue the case on the street.",
    ],
    warning: "Under Terry v. Ohio, a limited outer-clothing frisk for weapons can be permitted when an officer reasonably believes a detained person may be armed and presently dangerous. A frisk is not the same thing as a general evidence search.",
  },
  {
    id: "recording",
    title: "Recording Police",
    emoji: "📹",
    description: "General safety and documentation guidance; recording rules can vary by jurisdiction and context.",
    script: "I am recording from a safe distance and I will not interfere with your work. I do not consent to a search of my device or its digital contents.",
    checklist: [
      "Stay at a safe distance and do not physically obstruct officers, emergency personnel, traffic, or an active scene.",
      "If directed to move for a safety or scene-control reason, avoid physical confrontation while continuing to document if lawful and practical.",
      "Audio-recording consent laws vary by state and can depend on whether a conversation is private and whether the recorder is a party to it.",
      "Back up important footage when practical and preserve the original file and metadata.",
      "If a device is seized, do not physically resist; state that you do not consent to a search of its digital contents.",
    ],
    warning: "Riley v. California holds that police generally need a warrant to search digital information on a phone seized from an arrestee, but recognized warrant exceptions can still apply in particular circumstances.",
  },
  {
    id: "attorney",
    title: "Arrest / Custody",
    emoji: "⚖️",
    description: "General reference steps after arrest or during custodial questioning.",
    script: "I am remaining silent. I want a lawyer. I do not want to answer questions about this case without counsel present.",
    checklist: [
      "Do not physically resist an arrest, even if you believe it is unlawful.",
      "Clearly state that you want a lawyer and that you are remaining silent.",
      "Avoid discussing the facts of the case with officers, other detainees, or on calls that may be monitored.",
      "Read documents carefully and ask for legal advice before signing waivers, statements, or documents you do not understand.",
      "Rules governing phone access after booking vary; when allowed, contact counsel or a trusted person without discussing sensitive case facts on a monitored line.",
    ],
    warning: "Under Edwards v. Arizona, once a person in custodial interrogation clearly invokes the right to have counsel present, police generally may not reinitiate interrogation until counsel is available unless the person initiates further communication. Waiver and exception questions can be fact-specific.",
  },
];
