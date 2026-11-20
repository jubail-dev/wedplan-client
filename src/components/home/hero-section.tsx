
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Heart,
  Sparkles,
  Flower2,
} from "lucide-react";

const images = {
  // Portrait-friendly wedding photograph
  main: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&crop=faces&w=1200&h=1600&q=90",

  // Secondary wedding photograph
  second:
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=700&h=900&q=90",
};

function WeddingIllustration() {
  return (
    <svg
      viewBox="0 0 850 900"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="archGold" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#C6A16D" />
          <stop offset="1" stopColor="#E6CFAE" />
        </linearGradient>

        <linearGradient id="softPink" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#E9C9C3" />
          <stop offset="1" stopColor="#CFA7A0" />
        </linearGradient>
      </defs>

      {/* Wedding arches */}
      <path
        d="M145 850V385C145 170 270 65 425 65C580 65 705 170 705 385V850"
        stroke="url(#archGold)"
        strokeWidth="2"
      />

      <path
        d="M170 850V395C170 194 280 92 425 92C570 92 680 194 680 395V850"
        stroke="#C7A77F"
        strokeWidth="1"
        strokeDasharray="4 8"
        opacity=".7"
      />

      <path
        d="M235 850V410C235 250 315 160 425 160C535 160 615 250 615 410V850"
        stroke="#D7BDA0"
        strokeWidth="1.4"
      />

      {/* Chandelier */}
      <path d="M425 0V112" stroke="#C6A16D" />
      <path
        d="M403 112H447L425 150L403 112Z"
        stroke="#C6A16D"
      />
      <circle cx="425" cy="153" r="4" fill="#D9B78B" />

      {/* Floral branches */}
      <g
        stroke="#B98D84"
        strokeWidth="1.4"
        strokeLinecap="round"
      >
        <path d="M145 490C90 425 105 325 155 265" />
        <path d="M137 430C75 400 65 340 78 310" />
        <path d="M150 365C205 320 215 270 200 220" />
        <path d="M155 305C205 295 235 250 235 210" />

        <path d="M705 490C760 425 745 325 695 265" />
        <path d="M713 430C775 400 785 340 772 310" />
        <path d="M700 365C645 320 635 270 650 220" />
        <path d="M695 305C645 295 615 250 615 210" />
      </g>

      {/* Leaves */}
      <g fill="#A8A88A" opacity=".7">
        <ellipse cx="102" cy="385" rx="10" ry="26" transform="rotate(-48 102 385)" />
        <ellipse cx="188" cy="335" rx="11" ry="25" transform="rotate(35 188 335)" />
        <ellipse cx="100" cy="330" rx="9" ry="23" transform="rotate(-30 100 330)" />

        <ellipse cx="748" cy="385" rx="10" ry="26" transform="rotate(48 748 385)" />
        <ellipse cx="662" cy="335" rx="11" ry="25" transform="rotate(-35 662 335)" />
        <ellipse cx="750" cy="330" rx="9" ry="23" transform="rotate(30 750 330)" />
      </g>

      {/* Flowers */}
      <g fill="url(#softPink)">
        <circle cx="155" cy="265" r="11" />
        <circle cx="145" cy="252" r="9" />
        <circle cx="165" cy="252" r="9" />

        <circle cx="78" cy="310" r="10" />
        <circle cx="68" cy="297" r="8" />
        <circle cx="89" cy="298" r="8" />

        <circle cx="200" cy="220" r="11" />
        <circle cx="190" cy="207" r="8" />

        <circle cx="695" cy="265" r="11" />
        <circle cx="685" cy="252" r="9" />
        <circle cx="705" cy="252" r="9" />

        <circle cx="772" cy="310" r="10" />
        <circle cx="762" cy="297" r="8" />

        <circle cx="650" cy="220" r="11" />
        <circle cx="640" cy="207" r="8" />
      </g>

      {/* Wedding rings */}
      <g stroke="#C6A16D" strokeWidth="2">
        <circle cx="425" cy="555" r="34" />
        <circle cx="459" cy="555" r="34" />
      </g>

      {/* Decorative stars */}
      <g fill="#C6A16D">
        <path d="M425 235L430 247L442 252L430 257L425 269L420 257L408 252L420 247Z" />
        <path d="M275 565L279 574L288 578L279 582L275 591L271 582L262 578Z" />
        <path d="M575 565L579 574L588 578L579 582L575 591L571 582L562 578Z" />
        <circle cx="340" cy="300" r="3" />
        <circle cx="510" cy="300" r="3" />
      </g>

      <path
        d="M145 850H705"
        stroke="#C6A16D"
        strokeWidth="1"
        opacity=".7"
      />
    </svg>
  );
}

export default function HeroSection() {
  const shouldReduceMotion = useReducedMotion();

  const reveal = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 25,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.8,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  const stagger = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.13,
      },
    },
  };

  return (
    <section className="relative isolate overflow-hidden bg-[#FBF8F3]">

      {/* Wedding Background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_35%,rgba(230,207,174,0.25),transparent_55%)]" />

        <div className="absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-[#EAD5CD]/25 blur-[120px]" />

        <div className="absolute -right-[190px] top-[-100px] h-[850px] w-[850px] opacity-[0.24] sm:-right-[150px] lg:right-[-70px] lg:top-[-120px] lg:opacity-[0.32]">
          <WeddingIllustration />
        </div>

        {/* Paper Texture */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "radial-gradient(#806A55 0.6px, transparent 0.6px)",
            backgroundSize: "18px 18px",
          }}
        />

        {/* Decorative Circles */}
        <div className="absolute right-8 top-20 hidden h-32 w-32 rounded-full border border-[#C6A16D]/20 lg:block" />

        <div className="absolute right-14 top-28 hidden h-20 w-20 rounded-full border border-[#C6A16D]/20 lg:block" />
      </div>

      <div className="mx-auto max-w-[1450px] px-5 pb-20 pt-16 sm:px-8 sm:pb-24 sm:pt-20 lg:px-14 lg:pb-28 lg:pt-24">

        <div className="grid items-center gap-16 lg:grid-cols-[1fr_0.92fr] lg:gap-12">

          {/* LEFT CONTENT */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="relative z-10"
          >

            {/* Eyebrow */}
            <motion.div
              variants={reveal}
              className="mb-8 flex items-center gap-3"
            >
              <Flower2
                size={18}
                strokeWidth={1.3}
                className="text-[#B98A79]"
              />

              <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#A17D69]">
                The Art of Wedding Planning
              </span>

              <span className="h-px w-10 bg-[#C6A16D]/60" />
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={reveal}
              className="max-w-[680px] font-heading text-[3.5rem] font-medium leading-[1.06] tracking-[-0.065em] text-[#382D29] sm:text-7xl lg:text-[6rem] xl:text-[6.7rem]"
            >
              Where your

              <br />

              <span className="font-normal italic text-[#B78379]">
                forever
              </span>{" "}
              begins,

              <br />

              beautifully.
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={reveal}
              className="mt-8 max-w-[440px] text-[14px] leading-[2] text-[#82756B] sm:text-[15px]"
            >
              Your wedding deserves more than ordinary planning.
              Discover exceptional vendors, meaningful details,
              and everything you need to create a celebration
              as beautiful as your love story.
            </motion.p>

            {/* CTA */}
            <motion.div
              variants={reveal}
              className="mt-9 flex flex-wrap items-center gap-5"
            >
              <Link
                href="/services"
                className="group inline-flex min-h-[58px] items-center gap-6 rounded-full bg-[#44332F] py-2 pl-7 pr-2 text-[11px] font-semibold tracking-wide text-white shadow-xl shadow-[#44332F]/10 transition-all duration-500 hover:-translate-y-1 hover:bg-[#A87576]"
              >
                Explore Wedding Services

                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight size={19} />
                </span>
              </Link>

              <Link
                href="/services"
                className="group inline-flex items-center gap-2 text-[12px] font-semibold text-[#786A60] transition-colors hover:text-[#B78379]"
              >
                Discover more

                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </motion.div>

            {/* Signature */}
            <motion.div
              variants={reveal}
              className="mt-12 flex items-center gap-4 border-t border-[#DCCFC0]/70 pt-6"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D8BBA4] text-[#B78379]">
                <Heart size={17} strokeWidth={1.3} />
              </div>

              <div>
                <p className="font-heading text-lg italic text-[#51413A]">
                  Made for your forever.
                </p>

                <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-[#A19385]">
                  Every detail tells your story
                </p>
              </div>
            </motion.div>

          </motion.div>

          {/* RIGHT VISUAL */}
          <div className="relative mx-auto w-full max-w-[540px] lg:ml-auto">

            {/* Outer Gold Frame */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1 }}
              className="absolute -inset-4 rounded-t-[48%] border border-[#C6A16D]/45 sm:-inset-6"
            />

            {/* Main Image */}
            <motion.div
              initial={{
                opacity: 0,
                y: shouldReduceMotion ? 0 : 35,
              }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 1.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative aspect-[4/5] w-full overflow-hidden rounded-t-[48%] border-[5px] border-[#FBF8F3] bg-[#E9DED2] shadow-[0_25px_80px_rgba(75,49,37,0.16)] sm:border-[7px]"
            >
              <Image
                src={images.main}
                alt="Romantic bride and groom wedding celebration"
                fill
                priority
                sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 540px"
                className="object-cover object-[50%_35%] transition-transform duration-[1800ms] group-hover:scale-[1.04]"
              />

              {/* Image Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#34251F]/45 via-transparent to-[#34251F]/5" />

              {/* Image Caption */}
              <div className="absolute bottom-10 left-0 right-0 px-4 text-center sm:bottom-14">
                <Sparkles
                  size={19}
                  className="mx-auto mb-3 text-[#F0D5B3]"
                />

                <p className="font-heading text-3xl italic text-white sm:text-4xl">
                  Your day. Your story.
                </p>

                <p className="mt-3 text-[9px] uppercase tracking-[0.3em] text-white/85">
                  A little magic in every moment
                </p>
              </div>
            </motion.div>

            {/* Secondary Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.9 }}
              className="absolute -bottom-8 -left-5 z-10 h-[145px] w-[125px] overflow-hidden border-[5px] border-[#FBF8F3] bg-white shadow-xl sm:-left-12 sm:h-[190px] sm:w-[160px]"
            >
              <Image
                src={images.second}
                alt="Beautiful wedding celebration details"
                fill
                sizes="160px"
                className="object-cover object-center transition-transform duration-700 hover:scale-110"
              />
            </motion.div>

            {/* Floating Note */}
            <motion.div
              animate={
                shouldReduceMotion ? undefined : { y: [0, -7, 0] }
              }
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -right-2 top-[17%] z-10 flex items-center gap-3 border border-[#E7D7C6] bg-[#FBF8F3]/95 px-4 py-4 shadow-xl backdrop-blur-md sm:-right-10 sm:px-5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F1E2D9] text-[#B78379]">
                <Heart size={16} />
              </div>

              <div>
                <p className="font-heading text-base italic text-[#51413A]">
                  Forever starts here
                </p>

                <p className="mt-1 text-[8px] uppercase tracking-[0.16em] text-[#A19385]">
                  The WedPlan Experience
                </p>
              </div>
            </motion.div>

            {/* Gold Ornament */}
            <div className="absolute -bottom-7 right-8 flex h-14 w-14 items-center justify-center rounded-full border border-[#C6A16D]/50 bg-[#FBF8F3] text-[#B98D72] shadow-lg sm:right-14">
              <Flower2 size={25} strokeWidth={1} />
            </div>

          </div>

        </div>

        {/* Bottom Signature Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-24 flex flex-col justify-between gap-5 border-t border-[#E5D9CD] pt-7 sm:flex-row sm:items-center lg:mt-32"
        >
          <div className="flex items-center gap-3">
            <Sparkles size={15} className="text-[#B78379]" />

            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#88776B] sm:text-[10px]">
              Your vision. Your vendors. Your perfect day.
            </p>
          </div>

          <p className="font-heading text-lg italic text-[#A58C79]">
            Thoughtfully planned, beautifully remembered.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
