interface GlossaryEntry {
  term: string
  meaning: string
}

interface FaqEntry {
  question: string
  answer: string
}

/** Plain-language explanations of words students meet on scholarship portals. */
export const GLOSSARY: GlossaryEntry[] = [
  {
    term: 'Merit-based',
    meaning: 'Awarded for good marks or achievements. Family income usually does not matter.',
  },
  {
    term: 'Need-based',
    meaning: 'Awarded when family income is below a limit. You usually need an income certificate.',
  },
  {
    term: 'Income certificate',
    meaning:
      'An official paper from your local government office that states your family’s yearly income. It often expires after a year.',
  },
  {
    term: 'Domicile certificate',
    meaning:
      'Proof that you live in a state. State scholarships are often only for people with this certificate.',
  },
  {
    term: 'Category (GEN, OBC, SC, ST, EWS)',
    meaning:
      'Your social category as recorded in official documents. Some scholarships are reserved for certain categories.',
  },
  {
    term: 'EWS',
    meaning:
      'Economically Weaker Section. A category for families below an income limit who are not in other reserved categories.',
  },
  {
    term: 'Disbursement',
    meaning: 'The moment the money is actually paid, usually straight into your bank account.',
  },
  {
    term: 'Renewal',
    meaning:
      'Some scholarships must be applied for again each year. Check if yours needs it so you do not lose it.',
  },
  {
    term: 'Official portal',
    meaning:
      'The government or provider website where you actually apply. GRANTLY never applies for you.',
  },
]

/** Questions students ask most often about using GRANTLY. */
export const FAQ: FaqEntry[] = [
  {
    question: 'Why does a scholarship say “Needs information”?',
    answer:
      'One of its rules depends on something you have not told us yet, such as family income. We never assume you fail a rule you have not answered. Add the missing detail on your profile and the result updates straight away.',
  },
  {
    question: 'Does GRANTLY apply for me?',
    answer:
      'No. GRANTLY helps you find, understand and track scholarships. You always apply on the official website, using the “Visit official website” button.',
  },
  {
    question: 'Where is my information stored?',
    answer:
      'Only in your own browser. There is no account and nothing is sent to a server. You can export it or clear it any time from Profile.',
  },
  {
    question: 'Are the amounts and deadlines real?',
    answer:
      'The sample data is labelled “Demo data”. Where an official deadline is not known we show “Check official site”. Always confirm details on the official page before applying.',
  },
  {
    question: 'How do I get deadline reminders?',
    answer:
      'Turn on “Deadline reminders” in Profile and allow notifications. You can also export all deadlines to your calendar from the Deadlines page.',
  },
  {
    question: 'Can I use GRANTLY in Hindi?',
    answer:
      'Yes. Use the language switch at the top of any page. The main screens are available in English and Hindi.',
  },
]
