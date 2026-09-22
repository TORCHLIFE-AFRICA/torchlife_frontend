import { RevealOnScroll } from "../../landingPage/RevealOnScroll";
import { ECOSYSTEM_NODES, type EcosystemNode } from "../about-content";
import { SECTION_CLASS, SectionHeading } from "../primitives";

/** Radius of the ring the nodes sit on, as a percentage of the diagram box. */
const RING_RADIUS = 38;

/**
 * Evenly spaced points on the ring, clockwise from the top. Rounded so the
 * server and the browser emit identical style strings.
 */
const NODE_POSITIONS = ECOSYSTEM_NODES.map((_, index) => {
  const angle = (-90 + (360 / ECOSYSTEM_NODES.length) * index) * (Math.PI / 180);

  return {
    x: Math.round((50 + RING_RADIUS * Math.cos(angle)) * 100) / 100,
    y: Math.round((50 + RING_RADIUS * Math.sin(angle)) * 100) / 100,
  };
});

function NodeCard({ node }: { node: EcosystemNode }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-white p-3.5 shadow-[0_18px_50px_-32px_rgba(8,28,25,0.5)] ring-1 ring-black/5">
      <span
        aria-hidden="true"
        className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#0f766e]/10 text-[#0f766e]"
      >
        <node.icon className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-[#132726]">{node.label}</p>
        <p className="mt-0.5 text-xs leading-5 text-[#6c7f7b]">{node.line}</p>
      </div>
    </div>
  );
}

function CentreNode({ className }: { className?: string }) {
  return (
    <div
      className={`grid size-32 place-items-center rounded-full bg-[#0f4d46] text-center shadow-[0_24px_60px_-24px_rgba(15,77,70,0.8)] ring-[10px] ring-[#0f766e]/10 ${className ?? ""}`}
    >
      <span className="text-sm font-semibold uppercase tracking-[0.22em] text-white">
        TorchLife
      </span>
    </div>
  );
}

/**
 * An ecosystem rather than an org chart: TorchLife sits in the middle, and the
 * dashed ring joins the groups to each other as well as to the centre, because
 * much of the work happens between them.
 */
export function CommunitySection() {
  return (
    <section id="community" aria-labelledby="community-title" className={SECTION_CLASS}>
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          id="community-title"
          eyebrow="The wider TorchLife community"
          title="It takes more than a team to build this."
          align="center"
        >
          <p>
            Around TorchLife are supporters, healthcare professionals, volunteers,
            families, organizations, community members, and partners who contribute in
            different ways.
          </p>
        </SectionHeading>

        <RevealOnScroll delay={0.1} className="mt-12 sm:mt-16">
          <figure>
            <figcaption className="sr-only">
              TorchLife at the centre of a connected community of families, healthcare
              providers, supporters, organizations, and community members.
            </figcaption>

            {/* Tablet and up: the radial diagram. */}
            <div className="relative mx-auto hidden aspect-[16/11] max-w-5xl md:block">
              <svg
                aria-hidden="true"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full"
              >
                <ellipse
                  cx="50"
                  cy="50"
                  rx={RING_RADIUS}
                  ry={RING_RADIUS}
                  fill="none"
                  stroke="#d8cfbe"
                  strokeWidth="1"
                  strokeDasharray="4 6"
                  vectorEffect="non-scaling-stroke"
                />
                {NODE_POSITIONS.map((point, index) => (
                  <line
                    key={ECOSYSTEM_NODES[index].label}
                    x1="50"
                    y1="50"
                    x2={point.x}
                    y2={point.y}
                    stroke="#0f766e"
                    strokeOpacity="0.28"
                    strokeWidth="1.5"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
              </svg>

              <CentreNode className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />

              <ul>
                {ECOSYSTEM_NODES.map((node, index) => (
                  <li
                    key={node.label}
                    className="absolute w-52 -translate-x-1/2 -translate-y-1/2 lg:w-56"
                    style={{
                      left: `${NODE_POSITIONS[index].x}%`,
                      top: `${NODE_POSITIONS[index].y}%`,
                    }}
                  >
                    <NodeCard node={node} />
                  </li>
                ))}
              </ul>
            </div>

            {/* Phones: the same groups as a connected list. */}
            <div className="md:hidden">
              <CentreNode className="mx-auto" />
              <span aria-hidden="true" className="mx-auto block h-8 w-px bg-[#0f766e]/30" />
              <ul className="space-y-3 rounded-[1.5rem] border border-dashed border-[#d8cfbe] p-3">
                {ECOSYSTEM_NODES.map((node) => (
                  <li key={node.label}>
                    <NodeCard node={node} />
                  </li>
                ))}
              </ul>
            </div>
          </figure>
        </RevealOnScroll>
      </div>
    </section>
  );
}
