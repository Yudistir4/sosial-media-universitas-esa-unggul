import { types } from 'util';
import { Faculty, Response } from './typing.d';

interface QueryParams {
  user_id: string;
  post_id: string;
  post_category: string;
  saved: boolean;
  email: string;
  code: string;
  reset_password: boolean;
}
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
