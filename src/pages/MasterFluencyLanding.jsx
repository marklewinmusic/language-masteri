import React from "react";
import { ChevronRight, Mic2, Music, Zap, Target, Award, Volume2, Download, Play } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function MasterFluencyLanding() {
  const navigate = useNavigate();

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
    viewport: { once: true },
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-slate-950 to-slate-950" />
        <div className="absolute top-20 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div {...fadeInUp} className="space-y-8">
            <div>
              <p className="text-amber-400 text-sm font-semibold uppercase tracking-wider mb-3">
                Music-first Hebrew learning
              </p>
              <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
                Learn spoken Hebrew through music—then record your own version of the song.
              </h1>
              <p className="text-xl text-slate-300 leading-relaxed">
                Speak real Hebrew through songs, conversation, and repetition—then turn it into your own performance.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("/SingingHome")}
                className="px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg text-lg"
              >
                Start Singing
              </button>
              <button
                onClick={() => navigate("/?lesson=intro")}
                className="px-8 py-4 border-2 border-amber-400/50 text-amber-300 hover:text-amber-200 hover:border-amber-300 font-bold rounded-xl transition-all duration-300 text-lg"
              >
                Try First Lesson Free
              </button>
            </div>

            <p className="text-sm text-slate-400">
              No boring drills. No passive lessons. Just real speaking through music.
            </p>
          </motion.div>

          {/* Right Visual - Product Mockup */}
          <motion.div {...fadeInUp} className="relative">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 border border-slate-700/50 shadow-2xl backdrop-blur">
              {/* Mockup header */}
              <div className="mb-6 pb-6 border-b border-slate-700">
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Now Playing</p>
                <h3 className="text-white font-bold text-lg mt-1">Learn to Greet</h3>
              </div>

              {/* Playback info */}
              <div className="space-y-4 mb-8">
                {/* English line */}
                <div>
                  <p className="text-amber-300/60 text-xs uppercase tracking-wider mb-1">English</p>
                  <p className="text-white text-lg font-semibold">Where are you going?</p>
                </div>

                {/* Hebrew line */}
                <div>
                  <p className="text-cyan-300/60 text-xs uppercase tracking-wider mb-1">Hebrew</p>
                  <p className="text-cyan-300 text-2xl font-bold" dir="rtl">
                    לאן אתה הולך?
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-6">
                <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full w-1/3 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full" />
                </div>
                <p className="text-slate-400 text-xs mt-2">1:24 / 3:45</p>
              </div>

              {/* Waveform */}
              <div className="mb-8 flex items-end justify-center gap-1 h-16">
                {[40, 60, 45, 70, 55, 75, 50, 65, 48, 72, 52, 68].map((height, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-amber-400 to-amber-300 rounded-sm"
                    style={{ height: `${height}%` }}
                    animate={{ height: [height, height + 10, height] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                  />
                ))}
              </div>

              {/* Record button */}
              <button className="w-full py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 group">
                <div className="w-5 h-5 rounded-full bg-white/30 group-hover:bg-white/40 flex items-center justify-center">
                  <Mic2 className="w-3 h-3" />
                </div>
                Record Your Version
              </button>
            </div>

            {/* Floating accent */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-amber-400/10 rounded-full blur-2xl" />
          </motion.div>
        </div>
      </section>

      {/* QUICK BENEFITS */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <motion.div {...fadeInUp} className="grid md:grid-cols-4 gap-6">
          {[
            { icon: Music, title: "Learn through real songs", desc: "Every lesson is a song you'll actually want to sing" },
            { icon: Volume2, title: "Speak from day one", desc: "No listening-only lessons. You speak immediately" },
            { icon: Mic2, title: "Record your voice in the track", desc: "Your voice becomes part of the performance" },
            { icon: Award, title: "Actually remember what you learn", desc: "Music + repetition = real long-term memory" },
          ].map((card, i) => (
            <motion.div
              key={i}
              {...fadeInUp}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/30 hover:border-amber-400/30 transition-all group"
            >
              <card.icon className="w-8 h-8 text-amber-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-white font-bold text-lg mb-2">{card.title}</h3>
              <p className="text-slate-400 text-sm">{card.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <motion.h2 {...fadeInUp} className="text-4xl font-bold text-white text-center mb-16">
          How It Works
        </motion.h2>
        <motion.div {...fadeInUp} className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { num: "1", title: "Learn the song", desc: "Start with a simple, repeatable Hebrew song" },
            { num: "2", title: "Learn the words", desc: "Flashcards, meaning, and pronunciation" },
            { num: "3", title: "Talk about it", desc: "Answer questions out loud and build real sentences" },
            { num: "4", title: "Sing inside the song", desc: "Repeat lines in real time with instrumental gaps" },
            { num: "5", title: "Record your version", desc: "Your voice and the music become your own Hebrew track" },
            { num: "6", title: "Download it", desc: "You earned it. It's yours" },
          ].map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-slate-950 font-bold text-xl mb-3">
                {step.num}
              </div>
              <h3 className="text-white font-bold mb-2 text-sm">{step.title}</h3>
              <p className="text-slate-400 text-xs leading-tight">{step.desc}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* WHY THIS WORKS */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <motion.h2 {...fadeInUp} className="text-4xl font-bold text-white text-center mb-16">
          Why This Works
        </motion.h2>
        <motion.div {...fadeInUp} className="grid md:grid-cols-2 gap-8 mb-8">
          {[
            { title: "Most apps", bullets: ["Tap", "Guess", "Forget"] },
            { title: "MasterFluency", bullets: ["Hear", "Speak", "Repeat", "Perform"], highlight: true },
          ].map((card, i) => (
            <div
              key={i}
              className={`rounded-2xl p-8 border transition-all ${
                card.highlight
                  ? "bg-gradient-to-br from-amber-500/20 to-amber-600/10 border-amber-400/50"
                  : "bg-slate-800/50 border-slate-700/30"
              }`}
            >
              <h3 className={`text-2xl font-bold mb-6 ${card.highlight ? "text-amber-300" : "text-slate-300"}`}>
                {card.title}
              </h3>
              <ul className="space-y-3">
                {card.bullets.map((bullet, j) => (
                  <li key={j} className="text-slate-300 flex items-start gap-3">
                    <span className={`font-bold ${card.highlight ? "text-amber-400" : "text-slate-400"}`}>•</span>
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>
        <motion.p {...fadeInUp} className="text-center text-2xl font-bold text-white">
          You don't study Hebrew. You use it.
        </motion.p>
      </section>

      {/* FEATURE HIGHLIGHTS */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <motion.h2 {...fadeInUp} className="text-4xl font-bold text-white text-center mb-16">
          What Makes It Different
        </motion.h2>
        <motion.div {...fadeInUp} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Convo Mode", desc: "You're prompted to respond out loud. No typing. No guessing." },
            { title: "Song-Based Learning", desc: "Every lesson is built around a song designed for repetition." },
            { title: "Instrumental Gaps", desc: "You get space to speak—not just listen." },
            { title: "Voice Recording", desc: "Your voice is captured and layered into the track." },
            { title: "Smart Repetition", desc: "Same phrases, multiple contexts, real understanding." },
            { title: "Earn Your Song", desc: "Complete the lesson and unlock your personalized version." },
          ].map((feature, i) => (
            <div key={i} className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/30 hover:border-amber-400/30 transition-all">
              <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* WHAT YOU'LL SAY */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <motion.h2 {...fadeInUp} className="text-4xl font-bold text-white text-center mb-16">
          After One Lesson, You'll Be Able to Say:
        </motion.h2>
        <motion.div {...fadeInUp} className="grid md:grid-cols-2 gap-6 mb-8">
          {[
            "I want to go",
            "Where are you going?",
            "I went yesterday",
            "I will go tomorrow",
          ].map((phrase, i) => (
            <div key={i} className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border border-cyan-400/30 rounded-2xl p-8 text-center">
              <p className="text-cyan-300 text-lg font-semibold">{phrase}</p>
            </div>
          ))}
        </motion.div>
        <motion.p {...fadeInUp} className="text-center text-slate-400">
          Built for speaking, not just recognizing.
        </motion.p>
      </section>

      {/* LEVEL SYSTEM */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <motion.h2 {...fadeInUp} className="text-4xl font-bold text-white text-center mb-16">
          Progress from Repetition to Performance
        </motion.h2>
        <motion.div {...fadeInUp} className="grid md:grid-cols-5 gap-4">
          {[
            { level: 1, title: "Repeat" },
            { level: 2, title: "Understand" },
            { level: 3, title: "Respond" },
            { level: 4, title: "Speak freely" },
            { level: 5, title: "Perform", highlight: true },
          ].map((item, i) => (
            <div
              key={i}
              className={`rounded-2xl p-6 text-center transition-all ${
                item.highlight
                  ? "bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 transform scale-105"
                  : "bg-slate-800/50 border border-slate-700/30 text-white"
              }`}
            >
              <p className={`text-3xl font-bold mb-2 ${item.highlight ? "" : "text-slate-400"}`}>Level {item.level}</p>
              <p className="font-bold">{item.title}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <motion.h2 {...fadeInUp} className="text-4xl font-bold text-white text-center mb-16">
          What Early Users Say
        </motion.h2>
        <motion.div {...fadeInUp} className="grid md:grid-cols-2 gap-8">
          {[
            { quote: "First time I actually spoke Hebrew without thinking.", author: "Early User", initials: "EU" },
            { quote: "I didn't feel like I was studying at all.", author: "Beta Tester", initials: "BT" },
          ].map((testimonial, i) => (
            <div key={i} className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/30">
              <p className="text-white text-lg mb-6 italic">"{testimonial.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-slate-950 font-bold">
                  {testimonial.initials}
                </div>
                <p className="text-slate-300 font-semibold">— {testimonial.author}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 px-6 max-w-2xl mx-auto text-center">
        <motion.div {...fadeInUp} className="space-y-8">
          <h2 className="text-5xl font-bold text-white">Stop studying Hebrew. Start speaking it.</h2>
          <p className="text-xl text-slate-300">
            Learn through music, speak with confidence, and record your own version of the song.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/SingingHome")}
              className="px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg text-lg"
            >
              Start Your First Song
            </button>
            <button
              onClick={() => navigate("/?lesson=intro")}
              className="px-8 py-4 border-2 border-amber-400/50 text-amber-300 hover:text-amber-200 hover:border-amber-300 font-bold rounded-xl transition-all duration-300 text-lg"
            >
              Try It Free
            </button>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/50 py-12 px-6 bg-slate-950/50 mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-2">MasterFluency</h3>
              <p className="text-slate-400 text-sm">Built for people who want to speak, not just understand.</p>
            </div>
            <div className="flex justify-end gap-6 text-slate-400 text-sm">
              {["Features", "How It Works", "Pricing", "Contact"].map((link) => (
                <a key={link} href="#" className="hover:text-amber-400 transition-colors">
                  {link}
                </a>
              ))}
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-500 text-xs">
            <p>© 2026 MasterFluency. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}