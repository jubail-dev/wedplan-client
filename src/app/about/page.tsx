
import Link from "next/link";
import {
  ArrowRight,
  Heart,
  Sparkles,
  CalendarCheck,
  Users,
  ShieldCheck,
  Flower2,
  CheckCircle2,
} from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Made with Love",
    description:
      "We believe every wedding deserves thoughtful planning and personal attention to every little detail.",
  },
  {
    icon: ShieldCheck,
    title: "Trust & Reliability",
    description:
      "We want couples to feel confident while exploring services and connecting with wedding vendors.",
  },
  {
    icon: Sparkles,
    title: "Beautiful Experiences",
    description:
      "Our goal is to make discovering wedding services simple, enjoyable, and memorable.",
  },
];

const steps = [
  {
    number: "01",
    title: "Explore Services",
    description:
      "Discover wedding services and explore options that match your vision and budget.",
    icon: Sparkles,
  },
  {
    number: "02",
    title: "Connect with Vendors",
    description:
      "Find suitable vendors and send booking requests for your special day.",
    icon: Users,
  },
  {
    number: "03",
    title: "Celebrate Your Day",
    description:
      "Keep your planning journey organized and focus on creating beautiful memories.",
    icon: CalendarCheck,
  },
];

export default function AboutPage() {
  return (
    <main className="overflow-hidden bg-[#FFFDFB] text-[#423638]">
      {/* Hero Section */}
      <section className="relative border-b border-[#F0E5E1] bg-[#FBF3EF]">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#EBC8C5]/20 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-[#D9B18C]/15 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 text-center sm:py-28 lg:py-32">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D9B18C]/40 bg-white/70 px-5 py-2 text-sm font-medium text-[#A87965]">
            <Flower2 size={16} />
            The Story Behind WedPlan
          </div>

          <h1 className="mx-auto max-w-4xl font-serif text-4xl leading-tight tracking-tight text-[#49383A] sm:text-5xl lg:text-6xl">
            Every Love Story Deserves
            <span className="block italic text-[#C17F83]">
              a Beautiful Beginning.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-[#826F70] sm:text-lg">
            Your wedding is more than just a day. It is a collection of
            unforgettable moments. WedPlan is here to make your journey
            toward that special day a little easier and more beautiful.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-full bg-[#C17F83] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#AA696E]"
            >
              Explore Services
              <ArrowRight size={17} />
            </Link>

            <Link
              href="/"
              className="rounded-full border border-[#D9B18C] bg-white/70 px-7 py-3.5 text-sm font-semibold text-[#8D685D] transition hover:bg-white"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-2 lg:gap-20 lg:py-28">
        <div className="relative">
          <div className="absolute -left-5 -top-5 h-full w-full rounded-[2rem] border border-[#E8CFC5]" />

          <div className="relative flex min-h-[360px] flex-col justify-between overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#EBD4CD] via-[#F7E8E0] to-[#DDB9AE] p-9 sm:min-h-[430px] sm:p-12">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/70 text-[#B47C78]">
              <Heart size={27} />
            </div>

            <div>
              <p className="font-serif text-4xl italic leading-tight text-[#684E4D] sm:text-5xl">
                Your Day.
                <br />
                Your Story.
                <br />
                Your Way.
              </p>
              <div className="mt-6 h-px w-20 bg-[#B47C78]" />
              <p className="mt-5 text-sm tracking-[0.2em] text-[#876967]">
                MADE FOR YOUR FOREVER
              </p>
            </div>

            <Flower2
              className="absolute -bottom-7 -right-5 rotate-12 text-[#B47C78]/20"
              size={180}
              strokeWidth={0.7}
            />
          </div>
        </div>

        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#B47C78]">
            Who We Are
          </p>

          <h2 className="font-serif text-3xl leading-tight text-[#49383A] sm:text-4xl lg:text-5xl">
            Making Wedding Planning Feel
            <span className="italic text-[#C17F83]"> Effortless.</span>
          </h2>

          <div className="mt-7 space-y-5 text-base leading-8 text-[#826F70]">
            <p>
              WedPlan is a wedding planning platform designed to bring
              couples and wedding service providers closer together.
            </p>

            <p>
              Finding the right photographer, decorator, venue, or other
              wedding services can feel overwhelming. We aim to make that
              journey easier by bringing different services together in
              one convenient place.
            </p>

            <p>
              Whether you are planning an intimate celebration or a grand
              wedding, WedPlan helps you explore possibilities and take
              the next step with confidence.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            {[
              "Discover wedding services in one place",
              "Explore vendors and their offerings",
              "Send and manage booking requests",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle2
                  size={19}
                  className="shrink-0 text-[#C17F83]"
                />
                <span className="text-sm text-[#705E5E]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-[#FBF3EF] px-6 py-20 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#C17F83] shadow-sm">
            <Sparkles size={25} />
          </div>

          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#B47C78]">
            Our Mission
          </p>

          <h2 className="font-serif text-3xl leading-snug text-[#49383A] sm:text-4xl lg:text-5xl">
            To Make Every Wedding Planning Journey
            <span className="italic text-[#C17F83]"> Simpler and Sweeter.</span>
          </h2>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-[#826F70]">
            We want to create a space where couples can discover the
            services they need and vendors can showcase their work.
            Because the journey to forever should be filled with excitement,
            not unnecessary stress.
          </p>
        </div>
      </section>

      {/* Our Values */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
        <div className="mb-14 text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#B47C78]">
            What Matters to Us
          </p>

          <h2 className="font-serif text-3xl text-[#49383A] sm:text-4xl">
            The Values Behind <span className="italic text-[#C17F83]">WedPlan</span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-[#826F70]">
            Everything we do is guided by the experience we want couples
            and vendors to have.
          </p>
        </div>

        <div className="grid gap-7 md:grid-cols-3">
          {values.map((value) => {
            const Icon = value.icon;

            return (
              <div
                key={value.title}
                className="group rounded-3xl border border-[#F0E5E1] bg-white p-8 transition duration-300 hover:-translate-y-1 hover:border-[#DDB9AE] hover:shadow-[0_18px_45px_rgba(120,80,75,0.08)]"
              >
                <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FBF0EC] text-[#C17F83] transition group-hover:bg-[#C17F83] group-hover:text-white">
                  <Icon size={25} />
                </div>

                <h3 className="font-serif text-2xl text-[#49383A]">
                  {value.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-[#826F70]">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-[#FBF3EF] px-6 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#B47C78]">
              Your Journey Starts Here
            </p>

            <h2 className="font-serif text-3xl text-[#49383A] sm:text-4xl">
              How <span className="italic text-[#C17F83]">WedPlan</span> Works
            </h2>
          </div>

          <div className="grid gap-10 md:grid-cols-3">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div key={step.number} className="relative text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#E8CFC5] bg-white text-[#C17F83]">
                    <Icon size={29} strokeWidth={1.5} />
                  </div>

                  <p className="mb-3 text-xs font-bold tracking-[0.2em] text-[#C17F83]">
                    STEP {step.number}
                  </p>

                  <h3 className="font-serif text-2xl text-[#49383A]">
                    {step.title}
                  </h3>

                  <p className="mx-auto mt-4 max-w-xs text-sm leading-7 text-[#826F70]">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 lg:py-24">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-[#684E4D] px-7 py-16 text-center sm:px-12">
          <Flower2
            className="absolute -left-10 -top-10 rotate-12 text-white/10"
            size={180}
            strokeWidth={0.7}
          />

          <Flower2
            className="absolute -bottom-14 -right-10 -rotate-12 text-white/10"
            size={200}
            strokeWidth={0.7}
          />

          <div className="relative">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-[#EBC8C5]">
              Let's Make It Special
            </p>

            <h2 className="mx-auto max-w-3xl font-serif text-3xl leading-tight text-white sm:text-4xl lg:text-5xl">
              Your Beautiful Wedding Story Starts Here.
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-white/70 sm:text-base">
              Explore wedding services and take the first step toward
              planning a celebration that feels truly yours.
            </p>

            <Link
              href="/services"
              className="mt-9 inline-flex items-center gap-2 rounded-full bg-[#EBC8C5] px-8 py-3.5 text-sm font-semibold text-[#684E4D] transition hover:bg-white"
            >
              Discover Services
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
