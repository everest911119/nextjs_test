export const ironOptions = {
  cookieName: process.env.SESSION_COOKIE_NAME as string,
  password: process.env.SESSION_PASSWORD as string,
  cookieOptions: {
    maxAge: 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === 'production',
  },
};
const GITHUB_OAUTH_URL='http://github.com/login/oauth/authorize'
const SCOPE= 'user'
const client_id='cff279a65694d65b56e0'
export const Oath_URL = {
  GITHUB_OAUTH_URL,
  github: {
    client_id,
    client_secret:'b89f06caf05ec79bda012cb8a4c249cf567025f6',
    request_token_url:'https://github.com/login/oauth/access_token'
  },
  OAUTH_URL: `${GITHUB_OAUTH_URL}?client_id=${client_id}&scope=${SCOPE}`
}
export const CORS = {
  SecretId :process.env.NEXT_PUBLIC_COS_SECRETID as string,
  SecretKey: process.env.NEXT_PUBLIC_COS_SECRETKEY as string
}