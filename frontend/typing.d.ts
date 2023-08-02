import { StudyProgram } from '@/typing';
import { types } from 'util';
import { Faculty, Response, Lecturer } from './typing.d';

interface QueryParams {
  user_id: string;
  post_id: string;
  polling_id: string;
  post_category: string;
  saved: boolean;
  email: string;
  code: string;
  reset_password: boolean;
}
type UserType =
  | 'alumni'
  | 'student'
  | 'lecturer'
  | 'university'
  | 'organization'
  | 'faculty';
export interface LoginResponse {
  error: any;
  message: string;
  data: LoginData;
}

export interface Response<T = null> {
  error: ErrorResponse;
  message: string;
  data: T;
}

export interface ErrorResponse {
  error: {
    message: string;
    details?: [string];
  };
}

export interface LoginData {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface User {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
  profile_pic_url: string;
  email: string;
  bio: string;
  eksternal_link: string;
  instagram: string;
  linkedin: string;
  whatsapp: string;
  student: Student;
  lecturer: Lecturer;
  user_type: UserType;
}

export interface Student {
  id: string;
  nim: string;
  year: number;
  is_graduated: boolean;
  faculty: Faculty;
  study_program: StudyProgram;
  campus_location: string;
}
export interface Lecturer {
  id: string;
  nidn: string;
  faculty: Faculty;
  study_program: StudyProgram;
}

export interface Faculty {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}
export interface StudyProgram {
  id: string;
  name: string;
  faculty: Faculty;
  created_at: Date;
  updated_at: Date;
}

export interface PostDoc {
  id: string;
  created_at: Date;
  updated_at: Date;
  caption: string;
  content_file_url?: string;
  content_type?: string;
  post_category?: string;
  is_saved: boolean;
  is_liked: boolean;
  total_likes: number;
  total_comments: number;
  total_saves: number;
  user: User;
  to_user: User;
}

interface UserLittle {
  id: string;
  name: string;
  profile_pic_url: string;
}
export interface CommentDoc {
  id: string;
  created_at: Date;
  updated_at: Date;
  comment: string;
  user: UserLittle;
}
export interface NotificationDoc {
  id: string;
  created_at: Date;
  updated_at: Date;
  activity: string;
  is_read: boolean;
  from_user: UserLittle;
  post: NotifPost;
  comment: NotifComment;
  polling_id: string;
  message: string;
}

interface NotifPost {
  id: string;
  caption: string;
  content_file_url: string;
  content_type: string;
  post_category: string;
  user: UserLittle;
  to_user: UserLittle;
}
interface NotifComment {
  id: string;
  comment: string;
}
export interface PollingDoc {
  id: string;
  is_public: boolean;
  is_voter: boolean;
  title: string;
  user: UserLittle;
  end_date: Date;
  created_at: Date;
  updated_at: Date;
  use_image: boolean;
  options: [OptionDoc];
  user_choice: VoterDoc | null;
}
export interface OptionDoc {
  id: string;
  text: string;
  image_url: string;
  position: number;
  total_voters: int;
}
export interface VoterDoc {
  id: string;
  option_id: string | null;
  vote_at: Date;
}

// Select Voters

// export interface SelectVoters {
//   // total_people: number;
//   facultys: FacultySelect[];
// }
export interface FacultySelect {
  id: string;
  name: string;
  total_people: number;
  study_programs: StudyProgramSelect[];
}
export interface StudyProgramSelect {
  id: string;
  name: string;
  total_people: number;
  students?: StudentSelect;
  lecturers?: LecturerSelect;
}
export interface StudentSelect {
  total_people: number;
  batches: BatchSelect[];
}
export interface LecturerSelect {
  // id: string;
  total_people: number;
  isChecked: boolean;
  // users?: UserSelect[];
}
export interface BatchSelect {
  // id: string;
  year: number;
  isChecked: boolean;
  total_people: number;
  // users?: UserSelect[];
}

export interface UserSelect {
  id: string;
  name: string;
  profile_pic_url: string;
  isChecked: boolean;
}

export interface VoterSelect {
  id: string;
  name: string;
  profile_pic_url: string;

  id_filter: string;
}

const facultys = [
  {
    id: '3dced97a-ed1d-40cd-9151-c3560448a229',
    study_programs: [
      {
        id: 'cc17148a-d30a-45cb-8abe-4ae0ab9a76a8',
        students: {
          batches: [{ year: 2017 }, { year: 2019 }],
        },
      },
      {
        id: 'f66e9e0e-795e-4104-894d-fe9f15c6ed6f',

        students: {
          batches: [{ year: 2020 }, { year: 2019 }],
        },
        lecturers: null,
      },
    ],
  },
];

// Select ()

// Selected User
export interface SelectedUserReq {
  page: number;
  limit: number;
  facultys: SelectedFacultyReq[];
  excluded_ids: string[];
  search: string;
}
export interface SelectedFacultyReq {
  id: string;
  study_programs: SelectedStudyProgramsReq[];
}
export interface SelectedStudyProgramsReq {
  id: string;
  student_batches: number[];
  lecturer: boolean;
}

export interface Filter {
  id: string;
  name: string;
}
export interface UserLittle2 extends UserLittle {
  user_type: string;
}
