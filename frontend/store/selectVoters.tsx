import { FacultySelect, VoterSelect } from '@/typing';
import { Resolver } from 'dns';
import { create } from 'zustand';

type ModalState = {
  voters: VoterSelect[];
  searchResult: VoterSelect[];
  isLoading: boolean;
  search: string;
  addVoters: (voters: VoterSelect[]) => void;
  filterVoters: (id_filter: string) => Promise<void>;
  removeVoters: () => void;
  removeVoter: (id: string) => void;
  searchVoter: (name: string) => void;
};

export const useSelectVoters = create<ModalState>((set, get) => ({
  voters: [],
  searchResult: [],
  isLoading: false,
  search: "",
  addVoters: (voters: VoterSelect[]) =>
    set({ voters: [...get().voters, ...voters] }),
  filterVoters: async (id_filter: string) => {
    set({ isLoading: true });
    set({ voters: get().voters.filter((row) => row.id_filter !== id_filter) });
    set({ isLoading: false });
  },
  removeVoters: () => set({ voters: [], searchResult: [] }),
  removeVoter: (id: string) => {
    set({
      voters: get().voters.filter((row) => row.id !== id),
      searchResult: get().voters.filter(
        (row) =>
          row.id !== id &&
          row.name.toLowerCase().includes(get().search.toLocaleLowerCase())
      ),
    });
  },
  searchVoter: (name: string) =>
    set({
      search: name,
      searchResult: get().voters.filter((row) =>
        row.name.toLowerCase().includes(name.toLocaleLowerCase())
      ),
    }),
}));
