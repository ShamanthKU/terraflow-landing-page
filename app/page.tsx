'use client';

import TerraflowNavbar from './components/TerraflowNavbar';
import TerraflowGsapHero from './components/TerraflowGsapHero';
import LeadChaosSection from './components/LeadChaosSection';
import IntelligentFlowSection from './components/IntelligentFlowSection';
import VideoBackgroundSection from './components/VideoBackgroundSection';
import ImpactROISection from './components/ImpactROISection';
import CinematicConversationSection from './components/CinematicConversationSection';
import OutcomeSection from './components/OutcomeSection';

export default function Page() {
  return (
    <main className="min-h-screen bg-[#F4F7FA] text-[#14261C] font-sans selection:bg-emerald-200 selection:text-emerald-950">
      {/* PERSISTENT FLOATING UNIFIED NAVIGATION BAR */}
      <TerraflowNavbar />
      
      {/* 01: GSAP SCROLLTRIGGER CINEMATIC 3D DEPTH HERO SECTION */}
      <TerraflowGsapHero />

      {/* 02: THE PROBLEM — INTERACTIVE LEAD CHAOS & WOOD MOSS REVEAL */}
      <LeadChaosSection />

      {/* 03: ACT III — TURN THE CHAOS INTO A FLOW (LIVING EDITORIAL CARDS) */}
      <IntelligentFlowSection />

      {/* 04: AI AUTOMATION — FULL VIEWPORT FIXED VIDEO BACKGROUND SECTION */}
      <VideoBackgroundSection />

      {/* 05: MEASURABLE IMPACT & ROI — BENTO GRID OF INTERACTIVE VALUE CARDS */}
      <ImpactROISection />

      {/* 06: ACT VI — THE CONVERSATION (CINEMATIC ENVIRONMENTAL HIGH-INTENT DIALOGUE) */}
      <CinematicConversationSection />

      {/* 07: ACT VII — THE OUTCOME & MONUMENTAL FROSTED GLASS FOOTER */}
      <OutcomeSection />

    </main>
  );
}
