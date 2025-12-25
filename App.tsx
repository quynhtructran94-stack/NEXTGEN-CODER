
import React, { useState, useEffect } from 'react';
import { Screen, Language, UserProfile, Mission } from './types';
import { INITIAL_BADGES, MISSIONS, RANK_BADGES } from './constants';
import Login from './screens/Login';
import Home from './screens/Home';
import Selection from './screens/Selection';
import MissionMap from './screens/MissionMap';
import MissionEditor from './screens/MissionEditor';
import Leaderboard from './screens/Leaderboard';
import ResultScreen from './screens/ResultScreen';
import QuizPractice from './screens/QuizPractice';
import Header from './components/Header';
import { sound } from './services/audioService';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.LOGIN);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    className: '',
    level: 1,
    xp: 0,
    badges: [],
    completedMissions: [],
  });
  const [selectedLanguage, setSelectedLanguage] = useState<Language | undefined>();
  const [activeMission, setActiveMission] = useState<Mission | undefined>();
  const [localMissions, setLocalMissions] = useState(MISSIONS);

  const navigate = (screen: Screen) => {
    sound.playClick();
    setCurrentScreen(screen);
  };

  const handleLogin = (name: string, className: string) => {
    setProfile(prev => ({ ...prev, name, className }));
    navigate(Screen.HOME);
  };

  const handleLanguageSelect = (lang: Language) => {
    sound.playClick();
    setSelectedLanguage(lang);
    navigate(Screen.MAP);
  };

  const startMission = (mission: Mission) => {
    sound.playClick();
    setActiveMission(mission);
    navigate(Screen.MISSION);
  };

  const completeMission = (missionId: string, xpEarned: number) => {
    let isLastMission = false;

    setProfile(prev => {
      const newXP = prev.xp + xpEarned;
      const newLevel = Math.floor(newXP / 1000) + 1;
      const newCompleted = [...new Set([...prev.completedMissions, missionId])];
      
      if (newLevel > prev.level) {
        sound.playLevelUp();
      }

      let newBadges = [...prev.badges];
      if (newCompleted.length === 1 && !newBadges.find(b => b.id === 'first_step')) {
        newBadges.push(INITIAL_BADGES.find(b => b.id === 'first_step')!);
      }

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        completedMissions: newCompleted,
        badges: newBadges
      };
    });

    if (selectedLanguage) {
      setLocalMissions(prev => {
        const langMissions = [...prev[selectedLanguage]];
        const currentIndex = langMissions.findIndex(m => m.id === missionId);
        
        if (currentIndex !== -1) {
          langMissions[currentIndex].completed = true;
          if (currentIndex === langMissions.length - 1) {
            isLastMission = true;
          } else {
            langMissions[currentIndex + 1].unlocked = true;
          }
        }
        return { ...prev, [selectedLanguage]: langMissions };
      });
    }
    
    if (isLastMission) {
      setTimeout(() => navigate(Screen.RESULT), 1000);
    } else {
      navigate(Screen.MAP);
    }
  };

  const handleRestart = () => {
    setProfile(prev => ({ ...prev, xp: 0, level: 1, completedMissions: [], badges: [] }));
    setLocalMissions(JSON.parse(JSON.stringify(MISSIONS)));
    navigate(Screen.SELECTION);
  };

  return (
    <div className="min-h-screen flex flex-col overflow-hidden bg-[#0f172a]">
      {currentScreen !== Screen.LOGIN && currentScreen !== Screen.HOME && currentScreen !== Screen.RESULT && currentScreen !== Screen.QUIZ_PRACTICE_SELECT && (
        <Header 
          profile={profile} 
          onNavigate={navigate} 
          onLanguageChange={() => navigate(Screen.SELECTION)}
        />
      )}
      
      <main className="flex-1 relative">
        {currentScreen === Screen.LOGIN && (
          <Login onLogin={handleLogin} />
        )}

        {currentScreen === Screen.HOME && (
          <Home onStart={() => navigate(Screen.SELECTION)} profile={profile} />
        )}
        
        {currentScreen === Screen.SELECTION && (
          <Selection onSelect={handleLanguageSelect} onNavigate={navigate} />
        )}
        
        {currentScreen === Screen.MAP && selectedLanguage && (
          <MissionMap 
            language={selectedLanguage} 
            missions={localMissions[selectedLanguage]} 
            onSelectMission={startMission}
          />
        )}
        
        {currentScreen === Screen.MISSION && activeMission && selectedLanguage && (
          <MissionEditor 
            mission={activeMission} 
            language={selectedLanguage}
            onComplete={completeMission}
            onBack={() => navigate(Screen.MAP)}
          />
        )}

        {currentScreen === Screen.QUIZ_PRACTICE_SELECT && (
          <QuizPractice onBack={() => navigate(Screen.SELECTION)} />
        )}

        {currentScreen === Screen.LEADERBOARD && (
          <Leaderboard />
        )}

        {currentScreen === Screen.RESULT && (
          <ResultScreen 
            profile={profile} 
            onRestart={handleRestart}
            onHome={() => navigate(Screen.HOME)}
          />
        )}
      </main>
    </div>
  );
};

export default App;
