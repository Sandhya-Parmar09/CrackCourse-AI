"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";

export default function Home() {
  const { isSignedIn } = useUser();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1e003a] via-[#0a1a3c] to-[#2d0b4e] text-white relative overflow-x-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="w-[120vw] h-[120vw] bg-gradient-radial from-purple-700/40 via-blue-700/30 to-transparent rounded-full blur-3xl opacity-60 animate-pulse-slow absolute -top-1/3 -left-1/4"></div>
        <div className="w-[80vw] h-[80vw] bg-gradient-radial from-blue-500/30 via-purple-500/20 to-transparent rounded-full blur-2xl opacity-40 animate-pulse-slower absolute top-1/2 left-2/3"></div>
      </div>

      {/* Top-right user profile or Get Started */}
      <div className="fixed top-8 right-10 z-30">
        {isSignedIn ? (
          <UserButton />
        ) : (
          <Button
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-full px-7 py-2.5 shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-200"
            asChild
          >
            <a href="/workspace">Get Started</a>
          </Button>
        )}
      </div>

      {/* Logo */}
      <nav className="fixed w-full z-20 top-0 start-0 backdrop-blur-xl border-b border-white/10 bg-black/30">
        <div className="max-w-screen-xl flex items-center justify-between mx-auto p-5">
          <a href="#" className="flex items-center gap-3">
            <Image
              src="/bg_logo.png"
              alt="CrackCourse Logo"
              width={100}
              height={50}
              className="rounded-md"
              priority
            />
            <span className="text-3xl font-extrabold tracking-wider bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
              CrackCourse AI
            </span>
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="pt-36 pb-24 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-8 drop-shadow-xl">
            Unlock Your Potential with{" "}
            <div className="bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">
            AI-Powered Learning
            </div>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto mb-12 font-medium">
            Your AI-powered mentor — guiding, tracking, and boosting your learning journey
          </p>
          <Button
            className="text-white bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:opacity-90 font-semibold rounded-full text-xl px-10 py-5 shadow-2xl transform hover:scale-105 transition-all duration-200"
            asChild
          >
            <a href="/workspace">Get Started →</a>
          </Button>

          {/* Hero Image */}
          <div className="mt-20 flex justify-center">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-white/5 backdrop-blur-xl max-w-2xl mx-auto animate-fade-in">
              <Image
                src="/Landing_Page.jpg"
                alt="AI-Powered Learning"
                className="rounded-3xl"
                width={700}
                height={420}
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-gradient-to-b from-purple-950/80 to-blue-950/90">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 tracking-tight drop-shadow-lg">
            Key Features <span className="animate-bounce inline-block">✨</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: "fas fa-robot",
                title: "Personalized AI Course Generation",
                desc: "Get custom courses crafted by AI to match your skills, goals, and pace.",
                color: "text-purple-400",
                glow: "shadow-[0_0_40px_0_rgba(168,85,247,0.3)]",
              },
              {
                icon: "fab fa-youtube",
                title: "Smart YouTube Video Suggestions",
                desc: "Learn faster with curated video recommendations for every topic you study.",
                color: "text-blue-400",
                glow: "shadow-[0_0_40px_0_rgba(59,130,246,0.3)]",
              },
              {
                icon: "fas fa-chart-line",
                title: "Progress Tracking & Course Completion",
                desc: "Monitor your learning streak, track completion, and celebrate milestones.",
                color: "text-pink-400",
                glow: "shadow-[0_0_40px_0_rgba(244,114,182,0.3)]",
              },
            ].map((f, i) => (
              <div
                key={i}
                className={`bg-white/10 backdrop-blur-2xl p-10 rounded-2xl shadow-xl text-center hover:scale-105 hover:shadow-2xl transition-all duration-200 border border-white/10 ${f.glow}`}
              >
                <div className={`text-6xl mb-6 ${f.color} drop-shadow-lg animate-fade-in`}>
                  <i className={f.icon}></i>
                </div>
                <h3 className="text-2xl font-semibold mb-4">{f.title}</h3>
                <p className="text-gray-200 text-lg">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-gradient-to-r from-blue-900/90 to-purple-900/90">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 tracking-tight drop-shadow-lg">
            How It Works <span className="animate-spin-slow inline-block">🤔</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            {[
              {
                icon: "fas fa-user-plus",
                title: "Sign Up",
                desc: "Create your CrackCourse AI account and unlock AI-driven learning.",
              },
              {
                icon: "fas fa-book-open",
                title: "Create & Explore Courses",
                desc: "Let AI design your personalized courses or explore our curated library.",
              },
              {
                icon: "fas fa-graduation-cap",
                title: "Start Learning",
                desc: "Follow your path, watch videos, and track your achievements.",
              },
            ].map((step, i) => (
              <div
                key={i}
                className="p-10 rounded-2xl bg-white/10 backdrop-blur-2xl shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-200 border border-white/10"
              >
                <div className="text-6xl text-purple-300 mb-6 drop-shadow-lg animate-fade-in">
                  <i className={step.icon}></i>
                </div>
                <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
                <p className="text-gray-200 text-lg">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="py-24 text-center bg-gradient-to-r from-purple-700 via-blue-700 to-pink-700">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 drop-shadow-lg">
            Ready to Start Your Learning Journey? <span className="animate-bounce inline-block">🚀</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-100 mb-10 font-medium">
            Many learners achieving their goals with CrackCourse AI.
          </p>
          <Button
            className="text-purple-700 bg-white hover:bg-gray-200 font-semibold rounded-full text-xl px-10 py-5 shadow-2xl hover:scale-105 transition-all duration-200"
            asChild
          >
            <a href="/workspace">Sign Up for Free →</a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/80 text-gray-400 py-6 text-center text-base border-t border-white/10 mt-10">
        © 2025 CrackCourse AI — Made by Shubhraj
      </footer>
    </div>
  );
}


