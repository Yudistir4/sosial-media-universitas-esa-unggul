export const config = {
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL + '/api/v1',
};

export const api = {
  auths: { login: '/auths/login' },
  users: '/users',
};
