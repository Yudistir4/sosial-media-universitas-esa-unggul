export const config = {
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL + '/api/v1',
  frontendURL: process.env.NEXT_PUBLIC_FRONTEND_URL,
};

export const api = {
  auths: '/auths',
  users: '/users',
  posts: '/posts',
  notifications: '/notifications',
  comments: '/comments',
  studyprograms: '/studyprograms',
  pollings: '/pollings',
};
