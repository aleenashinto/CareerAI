import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './views/LandingPage';
import { AuthModal } from './components/AuthModal';
import { OnboardingWizard } from './views/OnboardingWizard';
import { DashboardView } from './views/DashboardView';
import { CareerBrainView } from './views/CareerBrainView';
import { AICoachView } from './views/AICoachView';
import { DailyTrainingView } from './views/DailyTrainingView';
import { DigitalTwinView } from './views/DigitalTwinView';
import { RoadmapView } from './views/RoadmapView';
import { ResumeStudioView } from './views/ResumeStudioView';
import { JobMatcherView } from './views/JobMatcherView';
import { InterviewArenaView } from './views/InterviewArenaView';
import { CodingSandboxView } from './views/CodingSandboxView';
import { CRMTrackerView } from './views/CRMTrackerView';
import { InstitutionPortalView } from './views/InstitutionPortalView';
import { RecruiterPortalView } from './views/RecruiterPortalView';
import { AdminHubView } from './views/AdminHubView';
import { api } from './api';
import type { CandidateProfile, JobApplicationItem } from './api';

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'forgot' | null>(null);

  const [currentTab, setCurrentTab] = useState('dashboard');
  const [currentRole, setCurrentRole] = useState<'candidate' | 'institution' | 'recruiter' | 'admin'>('candidate');
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [applications, setApplications] = useState<JobApplicationItem[]>([]);

  const loadData = async () => {
    try {
      const [p, a] = await Promise.all([
        api.getProfile().catch(() => null),
        api.getApplications().catch(() => [])
      ]);
      if (p) setProfile(p);
      if (a) setApplications(a);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // 1. Unauthenticated: Public Landing Page + Auth Modal
  if (!isAuthenticated) {
    return (
      <>
        <LandingPage
          onGetStarted={() => setAuthModalMode('signup')}
          onLogin={() => setAuthModalMode('login')}
          onTryInterview={() => {
            setIsAuthenticated(true);
            setIsOnboarded(true);
            setCurrentTab('interview_arena');
          }}
        />
        {authModalMode && (
          <AuthModal
            mode={authModalMode}
            onClose={() => setAuthModalMode(null)}
            onSuccess={() => {
              setAuthModalMode(null);
              setIsAuthenticated(true);
            }}
            onSwitchMode={(mode) => setAuthModalMode(mode)}
          />
        )}
      </>
    );
  }

  // 2. Authenticated but Needs Onboarding
  if (!isOnboarded) {
    return <OnboardingWizard onComplete={() => setIsOnboarded(true)} />;
  }

  // 3. Authenticated & Onboarded: Full Career Operating System Dashboard
  return (
    <div className="flex min-h-screen bg-[#0b0f17] text-slate-100 antialiased">
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        readinessScore={profile?.readiness_score || 84.5}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
      />

      <main className="flex-1 p-6 md:p-8 lg:p-10 max-w-7xl mx-auto overflow-y-auto">
        {/* Candidate Portal Views */}
        {currentTab === 'dashboard' && (
          <DashboardView
            profile={profile}
            applications={applications}
            onNavigate={setCurrentTab}
          />
        )}
        {currentTab === 'career_brain' && (
          <CareerBrainView onNavigate={setCurrentTab} />
        )}
        {currentTab === 'ai_coach' && (
          <AICoachView onNavigate={setCurrentTab} />
        )}
        {currentTab === 'daily_training' && (
          <DailyTrainingView />
        )}
        {currentTab === 'digital_twin' && (
          <DigitalTwinView
            profile={profile}
            onRefresh={loadData}
          />
        )}
        {currentTab === 'roadmap' && <RoadmapView />}
        {currentTab === 'resume_studio' && <ResumeStudioView />}
        {currentTab === 'job_matcher' && <JobMatcherView />}
        {currentTab === 'interview_arena' && <InterviewArenaView />}
        {currentTab === 'coding_sandbox' && <CodingSandboxView />}
        {currentTab === 'crm_tracker' && (
          <CRMTrackerView
            applications={applications}
            onRefresh={loadData}
          />
        )}

        {/* Institution / College Portal */}
        {currentTab === 'institution_portal' && <InstitutionPortalView />}

        {/* Recruiter SaaS Portal */}
        {currentTab === 'recruiter_portal' && <RecruiterPortalView />}

        {/* Platform Admin & LLMOps Hub */}
        {currentTab === 'admin_hub' && <AdminHubView />}
      </main>
    </div>
  );
}

export default App;
