const BLOCKS = [
  {
    title: 'Why This Site',
    content:
      "We wanted a gentle, private place to share Hestia Elif's journey with close family — photos, milestones, and messages — without the noise of social media. This is that place.",
    variant: 'blush',
  },
  {
    title: 'For Family & Friends',
    content:
      "You can leave a message on the message board for Hestia to read when she's older. Browse the gallery and milestones anytime to see how she's growing.",
    variant: 'sky',
  },
]

export default function About() {
  return (
    <>
      <section className="py-10 pb-6 text-center sm:py-12 sm:pb-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h1 className="font-display text-3xl font-medium tracking-wide text-baby-text sm:text-4xl md:text-5xl dark:text-dark-text">
            About Hestia Elif
          </h1>
          <p className="mt-2 text-baby-text-soft dark:text-dark-text-soft">A little corner of the web just for her</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        {/* Hero card with name */}
        <div className="mb-6 rounded-3xl bg-gradient-to-br from-blush-soft to-sky-soft p-6 text-center shadow-soft dark:from-dark-surface dark:to-dark-surface-alt dark:shadow-soft-dark sm:mb-8 sm:p-8">
          <p className="font-body text-sm uppercase tracking-[0.15em] text-baby-text-soft mb-1 dark:text-dark-text-soft">Our daughter</p>
          <h2 className="font-display text-4xl font-medium text-baby-text sm:text-5xl dark:text-dark-text">Hestia Elif</h2>
          <p className="mt-2 text-lg text-baby-text dark:text-dark-text">Born February 20, 2026</p>
          <p className="mt-3 text-baby-text-soft dark:text-dark-text-soft">
            Our little flame. She arrived with the softest yawns and the tiniest fingers, and has been lighting up our days ever since.
          </p>
        </div>

        <div className="space-y-6">
          {BLOCKS.map((block, i) => (
            <div
              key={i}
              className={`rounded-2xl p-6 ${
                block.variant === 'blush' ? 'bg-blush-soft dark:bg-dark-surface' : 'bg-sky-soft dark:bg-dark-surface-alt'
              } shadow-soft dark:shadow-soft-dark`}
            >
              <h3 className="font-display text-xl font-medium text-baby-text mb-2 dark:text-dark-text">{block.title}</h3>
              <p className="m-0 text-baby-text-soft dark:text-dark-text-soft">{block.content}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
