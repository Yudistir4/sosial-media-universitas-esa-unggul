import { create } from 'zustand';

type VideoState = {
  isPlay: boolean;
  isMuted: boolean;
  playVideo: () => void;
  pauseVideo: () => void;
  muteVideo: () => void;
  unmuteVideo: () => void;
};

export const useVideoSetting = create<VideoState>((set) => ({
  isPlay: true,
  isMuted: false,
  playVideo: () => set({ isPlay: true }),
  pauseVideo: () => set({ isPlay: false }),
  muteVideo: () => set({ isMuted: true }),
  unmuteVideo: () => set({ isMuted: false }),
}));
