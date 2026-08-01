import { create } from 'zustand';
import { RiskLevel } from '@/types/workflow';

interface SettingsState {
  coastyApiKey: string;
  openaiApiKey: string;
  cuaVersion: 'v3' | 'v4' | 'v5';
  autoApproveRiskThreshold: RiskLevel;
  machineOs: 'Ubuntu 22.04 LTS' | 'macOS Sonoma' | 'Windows 11 Pro';
  resolution: '1920x1080' | '2560x1440' | '1280x720';
  soundNotifications: boolean;

  setCoastyApiKey: (key: string) => void;
  setOpenaiApiKey: (key: string) => void;
  setCuaVersion: (ver: 'v3' | 'v4' | 'v5') => void;
  setAutoApproveRiskThreshold: (thresh: RiskLevel) => void;
  setMachineOs: (os: SettingsState['machineOs']) => void;
  setResolution: (res: SettingsState['resolution']) => void;
  setSoundNotifications: (val: boolean) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  coastyApiKey: '',
  openaiApiKey: '',
  cuaVersion: 'v5',
  autoApproveRiskThreshold: 'medium',
  machineOs: 'Ubuntu 22.04 LTS',
  resolution: '1920x1080',
  soundNotifications: true,

  setCoastyApiKey: (coastyApiKey) => set({ coastyApiKey }),
  setOpenaiApiKey: (openaiApiKey) => set({ openaiApiKey }),
  setCuaVersion: (cuaVersion) => set({ cuaVersion }),
  setAutoApproveRiskThreshold: (autoApproveRiskThreshold) => set({ autoApproveRiskThreshold }),
  setMachineOs: (machineOs) => set({ machineOs }),
  setResolution: (resolution) => set({ resolution }),
  setSoundNotifications: (soundNotifications) => set({ soundNotifications }),
}));
