import { FacultySelect, VoterSelect } from '@/typing';
import { Resolver } from 'dns';
import { create } from 'zustand';

interface Data {
  id: number;
  name: string;
  allChecked: boolean;
  isIndeterminate: boolean;
  total_people: number;
  isByClick: boolean;
}
interface User {
  profile_pic_url: string;
  name: string;
  isChecked: boolean;
  id: number;
}
interface Faculty extends Data {
  study_programs?: StudyProgram[];
}
interface StudyProgram extends Data {
  // data?: UserType;
  students?: Student;
  lecturers?: Lecturer;
}
interface UserType extends Data {
  students?: Student;
  lecturers?: Lecturer;
}
interface Batch extends Data {
  users?: User[];
}
interface Lecturer extends Data {
  users?: User[];
}
interface Student extends Data {
  batches?: Batch[];
}
const facultys: Faculty[] = [
  {
    allChecked: false,
    id: 1,
    isByClick: false,
    isIndeterminate: false,
    name: '',
    total_people: 2009,
    study_programs: [
      {
        allChecked: false,
        id: 1,
        isByClick: false,
        isIndeterminate: false,
        name: '',
        total_people: 2009,
        lecturers: {
          allChecked: false,
          id: 1,
          isByClick: false,
          isIndeterminate: false,
          name: '',
          total_people: 2009,
          users: [
            {
              profile_pic_url: '',
              name: '',
              isChecked: false,
              id: 10,
            },
          ],
        },

        students: {
          allChecked: false,
          id: 1,
          isByClick: false,
          isIndeterminate: false,
          name: '',
          total_people: 2009,
          batches: [
            {
              allChecked: false,
              id: 1,
              isByClick: false,
              isIndeterminate: false,
              name: '',
              total_people: 2009,
              users: [
                { profile_pic_url: '', name: '', isChecked: false, id: 10 },
              ],
            },
          ],
        },
      },
    ],
  },
];

type ModalState = {
  facultys: Faculty[];
  getFacultys: () => Faculty[];
  setFacultys: (facultys: Data[]) => void;
  setStudyPrograms: (studyProgram: Data[], indexFaculty: number) => void;
  // studyprograms: Data[][];
  // getStudyprograms: () => Data[][];
  // setStudyprograms: (studyprograms: Data[][]) => void;
  // filterVoters: (id_filter: string) => Promise<void>;
  // removeVoters: () => void;
  // removeVoter: (id: string) => void;
  // searchVoter: (name: string) => void;
};

export const useVoters = create<ModalState>((set, get) => ({
  facultys: [],
  getFacultys() {
    return get().facultys;
  },
  setFacultys(facultys: Data[]) {
    const oldFacultys = get().facultys;
    const newFacultys = facultys.map((faculty, i) => {
      return {
        ...faculty,
        // study_programs: oldFacultys[i]?.study_programs?.map(st =>{
        //   return
        // }),
        study_programs: oldFacultys[i]?.study_programs,
      };
    });

    set({ facultys: newFacultys });
  },
  setStudyPrograms(studyPrograms: Data[], indexFaculty: number) {
    const oldFacultys = get().facultys;
    const newFacultys = oldFacultys.map((faculty, i) => {
      if (indexFaculty === i) {
        console.log({ indexFaculty: oldFacultys[i] });
        return {
          ...oldFacultys[i],
          study_programs: studyPrograms.map((st, indexSt) => {
            return {
              ...st,
              lecturers: oldFacultys[i]?.study_programs?.[indexSt]?.lecturers,
              students: oldFacultys[i]?.study_programs?.[indexSt]?.students,
            };
          }),
          // study_programs: oldFacultys[i]?.study_programs,
        };
      } else {
        return faculty;
      }
    });
    console.log(newFacultys);
    // set({ facultys: newFacultys });
  },
  // studyprograms: [[]],
  // getStudyprograms() {
  //   return get().studyprograms;
  // },
  // setStudyprograms(studyprograms: Data[][]) {
  //   set({ studyprograms });
  // },
  // addVoters: (voters: VoterSelect[]) =>
  //   set({ voters: [...get().voters, ...voters] }),
  // filterVoters: async (id_filter: string) => {
  //   set({ isLoading: true });
  //   set({ voters: get().voters.filter((row) => row.id_filter !== id_filter) });
  //   set({ isLoading: false });
  // },
  // removeVoters: () => set({ voters: []  }),
  // removeVoter: (id: string) => {
  // set({
  //   voters: get().voters.filter((row) => row.id !== id),
  //   searchResult: get().voters.filter(
  //     (row) =>
  //       row.id !== id &&
  //       row.name.toLowerCase().includes(get().search.toLocaleLowerCase())
  //   ),
  // });
  // },
  // searchVoter: (name: string) =>
  //   set({
  //     search: name,
  //     searchResult: get().voters.filter((row) =>
  //       row.name.toLowerCase().includes(name.toLocaleLowerCase())
  //     ),
  //   }),
}));
