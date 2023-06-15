import { types } from 'util';
import { Faculty, Response } from './typing.d';
type UserType =
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
  angkatan: int;
  faculty: Faculty;
  study_program: StudyProgram;
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
