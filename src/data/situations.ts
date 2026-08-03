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
    description: "You have been pulled over while driving a vehicle.",
    script: "Officer, I am keeping my hands on the wheel where they are visible. I am happy to provide my driver's license, registration, and insurance. However, I am exercising my right to remain silent, and I do not consent to any searches of myself, my passenger cabin, or my vehicle's trunk.",
    checklist: [
      "Pull over immediately and safely in a well-lit area.",
      "Turn off the engine, open your window, and turn on the dome light if it's dark.",
      "Place both hands clearly on the steering wheel.",
      "Provide license, registration, and proof of insurance when asked (legally required).",
      "Do NOT consent to a vehicle search ('I do not consent to a search').",
      "If the officer asks you to step out, do so calmly. Lock your doors as you exit.",
    ],
    warning: "Refusing to step out of the car when ordered is illegal. Comply with orders to exit, but continue to refuse consent to searches.",
  },
  {
    id: "door",
    title: "Police at Door",
    emoji: "🚪",
    description: "Officers are knocking or standing outside your home.",
    script: "Officer, I will not open the door. If you have a search warrant, please slide it under the door or hold it up to the window so I can inspect it. Otherwise, I am exercising my right to privacy and will not allow you inside without a warrant signed by a judge.",
    checklist: [
      "Keep the door closed. Do NOT open it to talk—speak through the door or a window.",
      "Ask clearly: 'Do you have a warrant signed by a judge?'",
      "If they say yes, have them slide it under the door or hold it to a window.",
      "Verify the warrant has your exact address, today's date, and a judge's signature.",
      "If they force entry, do NOT physically resist. Say loudly: 'I do not consent to this entry!' and document the officers' names and badge numbers.",
    ],
    warning: "Opening the door, even a crack, can be interpreted by courts as 'consent to enter' or allow officers to claim they smelled/saw something illegal.",
  },
  {
    id: "street",
    title: "Stopped on Street",
    emoji: "🛑",
    description: "An officer stops or detains you while walking in public.",
    script: "Officer, am I free to go, or am I being detained? If I am free to go, I will be on my way. If I am being detained, please state your reasonable articulable suspicion. I am invoking my right to remain silent and will not answer questions without an attorney.",
    checklist: [
      "Ask immediately: 'Am I free to go?'",
      "If free to go, walk away calmly. Do not run.",
      "If detained, ask: 'What is your reasonable suspicion?'",
      "Keep your hands visible and do not reach into pockets or make sudden movements.",
      "State clearly: 'I am exercising my right to remain silent.' You do not have to answer questions about where you are going or what you are doing.",
      "Check state guidelines below to see if you are legally required to provide your name/ID.",
    ],
    warning: "You can be patted down on the outside of your clothing if officers reasonably suspect you have a weapon. Say: 'I do not consent to a search, but I will not physically resist.'",
  },
  {
    id: "recording",
    title: "Recording Police",
    emoji: "📹",
    description: "You are documenting/filming officers or an incident in public.",
    script: "Officer, I have a constitutionally protected First Amendment right to record police officers performing their duties in public spaces. I am standing at a safe distance and am not interfering with your operations in any way.",
    checklist: [
      "Stand at a safe, non-obstructive distance (typically 10-15 feet away).",
      "Do NOT stand between officers and a suspect or interfere with their movements.",
      "Keep your hands visible; do not make sudden gestures with your phone.",
      "If ordered to move back, comply while continuing to record. Do not argue.",
      "Do NOT hide that you are recording; secret recording can violate wiretapping laws in two-party states.",
      "Lock your phone with a passcode, NOT biometric (FaceID/TouchID), so it cannot be forced open.",
    ],
    warning: "An officer cannot legally delete or inspect your footage without a warrant. If they seize your device, say: 'I do not consent to you searching my phone.'",
  },
  {
    id: "attorney",
    title: "Arrest/Detainment",
    emoji: "⚖️",
    description: "You have been placed under arrest or taken into custody.",
    script: "I am invoking my Fifth Amendment right to remain silent. I want to speak to an attorney immediately. I will not answer any questions, sign any documents, or make any statements without my lawyer present.",
    checklist: [
      "Do NOT resist physically, even if you believe the arrest is completely unlawful.",
      "Say nothing else. Do NOT engage in casual conversation, make excuses, or try to 'explain' yourself.",
      "Demand an attorney immediately and repeatedly: 'I want a lawyer.'",
      "Do NOT sign any statements, confession drafts, or waiver forms.",
      "If you are booked, you have a right to make local phone calls. Call a lawyer or trusted emergency contact.",
      "Do not talk about your case on jail phones—they are recorded.",
    ],
    warning: "Once you ask for an attorney, police must stop questioning you. If they continue, simply repeat: 'I want a lawyer, and I am staying silent.'",
  },
];
