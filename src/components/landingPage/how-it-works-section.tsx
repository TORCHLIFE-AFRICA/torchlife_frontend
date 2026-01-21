// app/about/page.tsx
import { Metadata } from "next";

// ✅ SEO Metadata
export const metadata: Metadata = {
  title: "About TorchLife | Saving Pregnant Women Through Crowdfunding",
  description:
    "Learn about TorchLife, an Impact-driven platform helping pregnant women access urgent medical care through fast, transparent, and trusted crowdfunding.",
  keywords: [
    "TorchLife",
    "maternal health",
    "pregnancy emergencies",
    "medical crowdfunding",
    "maternal care Africa",
    "pregnant women support",
    "maternal healthcare Africa",
    "TorchLife Africa",
    "Impact-driven platform",
    "Maternal healthcare Nigeria",
    "Pregnant women support Africa",
    "first pregnancy Crowdfunding ",
    "first pregnancy Crowdfund",
  ],
  openGraph: {
    title: "About TorchLife | Maternal Healthcare Crowdfunding",
    description:
      "TorchLife exists to ensure pregnant women facing medical emergencies receive timely care through trusted and transparent crowdfunding.",
    url: "https://torchlife.africa/about",
    type: "website",
    siteName: "TorchLife",
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "TorchLife – Saving Lives Through Maternal Care",
      },
    ],
  },
};

export default function AboutTorchLifePage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-20 space-y-20">
      {/* Intro */}
      <section className="text-center space-y-6">
        <h1 className="text-3xl font-bold text-[#2b5f56]">About TorchLife</h1>

        <p className="text-lg leading-relaxed">
          TorchLife is an <strong>Impact driven platform</strong> built to save
          the lives of pregnant women facing medical emergencies through fast,
          transparent, and trusted crowdfunding.
        </p>

        <p className="leading-relaxed">
          We exist because too many women lose their lives not just because
          treatment is unavailable, but because <em>help comes too late</em>.
        </p>

        <p className="leading-relaxed">
          In many parts of Africa and developing regions, a medical emergency
          during pregnancy can become fatal within hours if funds are not
          available.
        </p>

        <p className="font-semibold">
          We believe no woman should die while trying to give life.
        </p>
      </section>

      {/* What We Do – Cards */}
      <section className="space-y-10">
        <h2 className="text-2xl font-bold text-center text-[#2b5f56]">
          What We Do
        </h2>

        <p className="text-center">
          TorchLife is a medical crowdfunding platform focused on pregnant women
          in urgent need of care.
        </p>

        <div className="grid sm:grid-cols-2 gap-6">
          {[
            "Emergency childbirth ",
            "Pregnancy complications",
            "Antenatal Care",
            "Hospital and treatment costs",
          ].map((item) => (
            <div
              key={item}
              className="bg-[#e1f4ed] border border-[#2b5f56]/20 rounded-xl p-6 shadow-sm hover:shadow-md transition"
            >
              <p className="font-medium text-[#173e37]">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works – Cards */}
      <section className="space-y-10">
        <h2 className="text-2xl font-bold text-center text-[#2b5f56]">
          How TorchLife Works
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              title: "Campaign Creation",
              text: "A pregnant woman or her representative starts a campaign with medical details and hospital information.",
            },
            {
              title: "Verification",
              text: "Our team verifies the case, hospital, and medical needs before the campaign goes live.",
            },
            {
              title: "Fast Fundraising",
              text: "Donations begin immediately, with a focus on raising the first critical amount needed to start treatment.",
            },
            {
              title: "Transparent Disbursement",
              text: "Funds are sent directly to verified healthcare providers, not individuals.",
            },
            {
              title: "Progress Updates",
              text: "Donors receive updates showing how their support is making real impact.",
            },
          ].map((step) => (
            <div
              key={step.title}
              className="bg-[#f6fdfb] border border-[#2b5f56]/20 rounded-xl p-6 shadow-sm hover:shadow-md transition space-y-2"
            >
              <h3 className="font-semibold text-[#2b5f56]">{step.title}</h3>
              <p className="text-sm leading-relaxed text-gray-700">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* What Makes Us Different – Cards */}
      <section className="space-y-10">
        <h2 className="text-2xl font-bold text-center text-[#2b5f56]">
          What Makes Us Different
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              title: "Speed",
              text: "We focus on raising the first critical amount quickly so treatment can begin immediately.",
            },
            {
              title: "Trust",
              text: "Every campaign is verified. Every hospital is confirmed. Every donation is traceable.",
            },
            {
              title: "Transparency",
              text: "Donors can see where funds go, how they are used, and the impact created.",
            },
            {
              title: "Human-Centered Design",
              text: "We design for dignity, not pity. For people, not statistics.",
            },
            {
              title: "Community Driven",
              text: "TorchLife is powered by volunteers, medical partners, creatives, technologists, and everyday people who care.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-[#e1f4ed] border border-[#2b5f56]/20 rounded-xl p-6 shadow-sm hover:shadow-md transition space-y-2"
            >
              <h3 className="font-semibold text-[#173e37]">{item.title}</h3>
              <p className="text-sm leading-relaxed text-gray-700">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Values – Cards */}
      <section className="space-y-10">
        <h2 className="text-2xl font-bold text-center text-[#2b5f56]">
          Our Values
        </h2>

        <div className="grid sm:grid-cols-2 gap-6">
          {[
            "Compassion — Every decision starts with empathy.",
            "Transparency — Trust is built through openness and accountability.",
            "Speed with Responsibility — Lives depend on timing. We act fast but carefully.",
            "Community — Real change happens when people come together.",
            "Integrity — We do what is right, even when no one is watching.",
          ].map((value) => (
            <div
              key={value}
              className="bg-[#f6fdfb] border border-[#2b5f56]/20 rounded-xl p-6 shadow-sm hover:shadow-md transition"
            >
              <p className="text-sm leading-relaxed text-gray-800">{value}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="space-y-6">
        <h2 className="text-2xl text-[#2b5f56] font-bold text-center">
          Why TorchLife Matters
        </h2>

        <p>
          Every year, hundreds of thousands of women die from preventable
          pregnancy complications.
        </p>

        <p>Many of these deaths happen simply because help came too late.</p>

        <p>
          TorchLife exists to ensure that when help is needed, it is only one
          click away.
        </p>
      </section>

      {/* Join */}
      <section className="space-y-6 text-center">
        <h2 className="text-2xl font-bold text-[#2b5f56]">Join the Movement</h2>

        <p>
          Whether you are a donor, volunteer, partner, or supporter, you have a
          place here.
        </p>

        <p>
          This is not just a platform. It is a movement to save lives, restore
          hope, and prove that technology can serve humanity.
        </p>

        <p className="font-semibold">
          Together, we can make sure no woman is left behind.
        </p>
      </section>
    </main>
  );
}
