const organizationAccents = [
  {
    icon: "fa-landmark",
    card: "from-primaryLight/35 via-white to-white",
    badge: "bg-primary text-white",
    border: "border-primary/25",
    line: "bg-primary/35",
  },
  {
    icon: "fa-people-roof",
    card: "from-secondaryLight/45 via-white to-white",
    badge: "bg-secondary text-white",
    border: "border-secondary/25",
    line: "bg-secondary/35",
  },
  {
    icon: "fa-clipboard-list",
    card: "from-muted/80 via-white to-white",
    badge: "bg-accent text-white",
    border: "border-accent/25",
    line: "bg-accent/35",
  },
  {
    icon: "fa-laptop-file",
    card: "from-primaryLight/30 via-secondaryLight/30 to-white",
    badge: "bg-primaryDark text-white",
    border: "border-primary/25",
    line: "bg-primary/35",
  },
  {
    icon: "fa-map-location-dot",
    card: "from-secondaryLight/35 via-primaryLight/25 to-white",
    badge: "bg-secondary text-white",
    border: "border-secondary/25",
    line: "bg-secondary/35",
  },
];

function PersonCard({ member, prominent = false, accent = organizationAccents[0] }) {
  return (
    <div
      className={`group relative min-h-full overflow-hidden rounded-2xl border bg-gradient-to-br ${accent.card} p-4 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-card sm:p-5 ${
        prominent ? `${accent.border} ring-1 ring-primary/10` : "border-slate-200"
      }`}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-white/50 ring-1 ring-slate-100 transition group-hover:scale-110" />
      <div className={`mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-2xl ${accent.badge} shadow-sm`}>
        <i className={`fa-solid ${member.position ? "fa-user-tie" : "fa-user"}`} aria-hidden="true" />
      </div>
      {member.position && (
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
          {member.position}
        </p>
      )}
      <p className={`${prominent ? "text-xl" : "text-base"} leading-snug font-bold text-ink`}>{member.name}</p>
      {member.note && (
        <p className="mt-3 rounded-xl border border-secondary/10 bg-secondaryLight/50 px-3 py-2 text-center text-xs font-medium leading-5 text-slate-700">
          {member.note}
        </p>
      )}
    </div>
  );
}

function OrganizationGroup({ group, index = 0 }) {
  const accent = organizationAccents[index % organizationAccents.length];

  if (group.layout === "leaders") {
    return (
      <section className={`relative overflow-hidden rounded-2xl border ${accent.border} bg-gradient-to-br ${accent.card} p-4 shadow-sm sm:p-5`}>
        <div className="pointer-events-none absolute -left-16 -top-16 h-32 w-32 rounded-full bg-white/50" />
        <div className="mb-4 flex items-center justify-center gap-3">
          <span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${accent.badge} shadow-sm`}>
            <i className={`fa-solid ${accent.icon}`} aria-hidden="true" />
          </span>
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Level {index + 1}</p>
            <h3 className="text-lg font-bold text-ink">{group.title}</h3>
          </div>
        </div>
        <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
          {group.members.map((member) => (
            <PersonCard key={`${group.title}-${member.position || member.name}`} member={member} prominent accent={accent} />
          ))}
        </div>
      </section>
    );
  }

  const isTerritory = group.layout === "territory";

  return (
    <section className={`relative overflow-hidden rounded-2xl border ${accent.border} bg-gradient-to-br ${accent.card} p-4 shadow-sm sm:p-5`}>
      <div className="pointer-events-none absolute -right-14 -top-14 h-28 w-28 rounded-full bg-white/50" />
      <div className="mb-4 flex flex-col items-center justify-center gap-2 text-center sm:flex-row sm:gap-3">
        <span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${accent.badge} shadow-sm`}>
          <i className={`fa-solid ${isTerritory ? "fa-map-location-dot" : accent.icon}`} aria-hidden="true" />
        </span>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Level {index + 1}</p>
          <h3 className="text-base font-bold text-ink sm:text-lg">{group.title}</h3>
        </div>
      </div>

      <div className={`grid gap-3 ${isTerritory ? "sm:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2 xl:grid-cols-3"}`}>
        {group.members.map((member) => (
          <PersonCard key={`${group.title}-${member.position || member.name}`} member={member} accent={accent} />
        ))}
      </div>
    </section>
  );
}

function InfoSection({ section }) {
  const isBlue = section.tone === "blue";
  const isWarm = section.tone === "warm";
  const iconClass = isBlue
    ? "bg-secondaryLight text-secondary ring-secondaryLight"
    : isWarm
      ? "bg-amber-100 text-amber-700 ring-amber-100"
      : "bg-primaryLight/50 text-primary ring-primaryLight";
  const sectionGradient = isBlue
    ? "from-secondaryLight/60 via-white to-white"
    : isWarm
      ? "from-amber-50 via-white to-white"
      : "from-primaryLight/45 via-white to-white";

  return (
    <section className={`relative mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br ${sectionGradient} p-4 shadow-sm sm:p-5`}>
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/60 ring-1 ring-slate-100" />
      <div className="relative flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">{section.eyebrow}</p>
          <h2 className="text-xl font-bold text-ink sm:text-2xl">{section.title}</h2>
          {section.summary && <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">{section.summary}</p>}
        </div>
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1 ${iconClass}`}>
          <i className={`fa-solid ${section.icon || (isBlue ? "fa-chart-line" : "fa-hands-holding-child")}`} aria-hidden="true" />
        </div>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {section.points.map((point, index) => (
          <article className="group rounded-2xl border border-slate-200 bg-white/86 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-card" key={point.title}>
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${iconClass}`}>
                <i className={`fa-solid ${point.icon || (isBlue ? "fa-chart-line" : "fa-hands-holding-child")}`} aria-hidden="true" />
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <h3 className="mb-2 text-base font-semibold text-ink">{point.title}</h3>
            <p className="text-sm leading-7 text-slate-600">{point.description}</p>
            {point.tip && (
              <p className="mt-3 rounded-xl border border-primary/10 bg-primaryLight/35 px-3 py-2 text-xs font-medium leading-5 text-primaryDark">
                {point.tip}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

function OrganizationRoot({ villageGovernment }) {
  return (
    <section className="mx-4 mb-5 mt-2 overflow-hidden rounded-2xl border border-primary/15 bg-white shadow-card sm:mx-7 sm:mb-7">
      <div className="relative overflow-hidden bg-gradient-to-r from-primary via-primaryDark to-secondary px-5 py-7 text-white sm:px-6">
        <div className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full bg-white/15" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-16 w-full bg-gradient-to-t from-black/10 to-transparent" />
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-primaryLight">Bagan Organisasi Desa</p>
        <h2 className="text-2xl font-bold leading-tight sm:text-3xl">{villageGovernment.title}</h2>
        <p className="mt-2 text-sm font-medium text-white/90">{villageGovernment.subtitle}</p>
      </div>

      <div className="bg-gradient-to-br from-muted/70 via-white to-secondaryLight/35 p-4 sm:p-6">
        <div className="relative mx-auto max-w-5xl">
          <div className="mx-auto max-w-sm rounded-3xl border border-primary/25 bg-white p-5 text-center shadow-card">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-sm">
              <i className="fa-solid fa-seedling" aria-hidden="true" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Akar Utama</p>
            <h3 className="mt-1 text-xl font-bold text-ink">{villageGovernment.root?.title || "Desa Girimulyo"}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{villageGovernment.root?.description}</p>
          </div>

          <div className="mx-auto h-10 w-1 rounded-full bg-gradient-to-b from-primary/60 to-secondary/40" />
          <div className="hidden h-1 rounded-full bg-gradient-to-r from-primary/10 via-primary/40 to-secondary/10 md:block" />

          <div className="grid gap-6">
            {villageGovernment.groups.map((group, index) => (
              <div className="relative pt-6" key={group.title}>
                <div className={`absolute left-1/2 top-0 h-6 w-1 -translate-x-1/2 rounded-full ${organizationAccents[index % organizationAccents.length].line}`} />
                {index > 0 && <div className="absolute left-0 right-0 top-0 hidden h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent md:block" />}
                <OrganizationGroup group={group} index={index} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function InfoPage({ page, headingLevel = "h2", heroImage = "" }) {
  const Heading = headingLevel;
  const villageGovernment = page.villageGovernment;

  return (
    <main className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft sm:mt-7">
      {heroImage ? (
        <section
          className="relative min-h-[360px] overflow-hidden bg-cover bg-center px-4 py-10 sm:min-h-[460px] sm:px-7 sm:py-14"
          style={{ backgroundImage: `url('${heroImage}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/55 via-secondary/24 to-primaryLight/18 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/55 via-slate-900/24 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white via-white/72 to-transparent" />
          <div className="relative z-10 flex min-h-[280px] max-w-2xl flex-col justify-end sm:min-h-[360px]">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primaryLight">Posyandu Girimulyo</p>
            <Heading className="text-3xl font-bold leading-tight text-white drop-shadow-sm sm:text-5xl">
              {page.title}
            </Heading>
          </div>
        </section>
      ) : (
        <section className="border-b border-slate-200 bg-muted/70 px-4 py-6 sm:px-7 sm:py-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">Posyandu Girimulyo</p>
          <Heading className="max-w-3xl text-2xl font-bold leading-tight text-ink sm:text-4xl">
            {page.title}
          </Heading>
        </section>
      )}

      <section className="px-4 py-5 sm:px-7 sm:py-7">
        {heroImage && (
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">Penjelasan Stunting</p>
        )}
        <div className="max-w-4xl">
          {page.paragraphs.map((paragraph) => (
            <p className="my-3 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8" key={paragraph}>
              {paragraph}
            </p>
          ))}
        </div>

        {page.highlights?.length > 0 && (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {page.highlights.map((highlight) => (
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-muted/90 via-white to-primaryLight/25 p-4 shadow-sm" key={highlight.value}>
                <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-white/70" />
                <p className="relative text-2xl font-bold text-primary">{highlight.value}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{highlight.label}</p>
              </div>
            ))}
          </div>
        )}

        {page.points?.length > 0 && (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {page.points.map((point) => (
              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-white to-muted/70 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-card sm:p-5" key={point.title}>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-accent ring-1 ring-muted">
                  <i className={`fa-solid ${point.icon || "fa-circle-info"}`} aria-hidden="true" />
                </div>
                <h4 className="mb-2 text-base font-semibold text-ink sm:text-lg">{point.title}</h4>
                <p className="m-0 text-sm leading-7 text-slate-600 sm:text-[0.95rem]">{point.description}</p>
              </div>
            ))}
          </div>
        )}

        {page.sections?.map((section) => (
          <InfoSection key={section.title} section={section} />
        ))}
      </section>

      {villageGovernment && <OrganizationRoot villageGovernment={villageGovernment} />}
    </main>
  );
}
