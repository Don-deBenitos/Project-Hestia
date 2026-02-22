const MILESTONES = [
  { id: 1, date: 'Week 1', title: 'First week home', note: 'Settling in and getting to know each other. So much cuddling and soft light.', achieved: true },
  { id: 2, date: 'Feb 18', title: 'First smile', note: 'A tiny grin while napping in the morning. We melted.', achieved: true },
  { id: 3, date: '—', title: 'First laugh', note: "We're waiting for that first giggle. Any day now.", achieved: false },
  { id: 4, date: '—', title: 'First solid food', note: 'A messy milestone to look forward to in a few months.', achieved: false },
  { id: 5, date: '—', title: 'First word', note: "We'll capture it here when Hestia says her first word.", achieved: false },
  { id: 6, date: '—', title: 'First steps', note: 'The beginning of many adventures. Can\'t wait.', achieved: false },
]

export default function Milestones() {
  return (
    <>
      <section className="py-10 pb-6 text-center sm:py-12 sm:pb-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h1 className="font-display text-3xl font-medium tracking-wide text-baby-text sm:text-4xl md:text-5xl dark:text-dark-text">
            Milestone Tracker
          </h1>
          <p className="mt-2 text-baby-text-soft dark:text-dark-text-soft">Hestia Elif's first smiles, first steps, and everything in between</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <ul className="list-none p-0 m-0 space-y-3">
          {MILESTONES.map((m) => (
            <li
              key={m.id}
              className={`flex gap-3 rounded-2xl bg-cream p-4 dark:bg-dark-surface sm:gap-4 sm:p-5 ${
                m.achieved ? 'border-l-4 border-baby-accent-sky dark:border-dark-accent' : 'border-l-4 border-baby-accent-blush dark:border-dark-border'
              }`}
            >
              <span className="shrink-0 text-sm text-baby-text-soft dark:text-dark-text-soft">{m.date}</span>
              <div>
                <div className="font-semibold text-baby-text dark:text-dark-text">{m.title}</div>
                <p className="m-0 text-[0.95rem] text-baby-text-soft dark:text-dark-text-soft">{m.note}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-center text-sm text-baby-text-soft dark:text-dark-text-soft">
          Edit the <code className="rounded bg-beige-dark px-1 dark:bg-dark-surface dark:text-dark-text-soft">MILESTONES</code> array in{' '}
          <code className="rounded bg-beige-dark px-1 dark:bg-dark-surface dark:text-dark-text-soft">Milestones.jsx</code> to add your own dates and notes.
        </p>
      </section>
    </>
  )
}
