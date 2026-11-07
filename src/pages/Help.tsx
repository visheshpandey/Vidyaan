import { ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { buttonClass } from '@/components/ui/buttonStyles'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { ROUTES } from '@/constants/routes'
import { FAQ, GLOSSARY } from '@/data/glossary'

const STEPS = [
  {
    title: 'Discover',
    text: 'Answer a few questions once. GRANTLY checks every scholarship for you.',
  },
  {
    title: 'Understand',
    text: 'Each scholarship shows Eligible, Needs information or Not eligible, with reasons.',
  },
  {
    title: 'Navigate',
    text: 'Open a scholarship for a step-by-step guide and the documents you need.',
  },
  {
    title: 'Track',
    text: 'Save it, move it through each stage, keep notes and watch the deadline.',
  },
]

/** Help page: how GRANTLY works, frequently asked questions and a glossary of scholarship terms. */
export default function Help() {
  return (
    <>
      <PageHeader
        title="Help"
        subtitle="How GRANTLY works, answers to common questions, and what the difficult words mean."
      />

      <section aria-labelledby="how" className="mb-10">
        <h2 id="how" className="mb-3 font-serif text-2xl text-heading">
          How it works
        </h2>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <Card className="h-full">
                <p className="text-sm text-muted">Step {i + 1}</p>
                <p className="font-serif text-xl text-heading">{s.title}</p>
                <p className="mt-1 text-sm text-ink">{s.text}</p>
              </Card>
            </li>
          ))}
        </ol>
        <Link to={ROUTES.discover} className={buttonClass('primary', 'md', 'mt-4')}>
          Start discovering
        </Link>
      </section>

      <section aria-labelledby="faq" className="mb-10">
        <h2 id="faq" className="mb-3 font-serif text-2xl text-heading">
          Frequently asked questions
        </h2>
        <div className="divide-y divide-line rounded-card border border-line bg-surface">
          {FAQ.map((f) => (
            <details key={f.question} className="group p-4">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 font-medium text-ink">
                {f.question}
                <ChevronDown
                  size={18}
                  aria-hidden
                  className="shrink-0 text-muted transition-transform group-open:rotate-180"
                />
              </summary>
              <p className="mt-2 max-w-3xl text-sm text-muted">{f.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section aria-labelledby="glossary">
        <h2 id="glossary" className="mb-3 font-serif text-2xl text-heading">
          Glossary
        </h2>
        <dl className="grid gap-3 md:grid-cols-2">
          {GLOSSARY.map((g) => (
            <Card key={g.term} className="p-4">
              <dt className="font-medium text-ink">{g.term}</dt>
              <dd className="mt-1 text-sm text-muted">{g.meaning}</dd>
            </Card>
          ))}
        </dl>
      </section>
    </>
  )
}
