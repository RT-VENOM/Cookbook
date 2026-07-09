// src/lib/routes.js
const BASE_URL = "https://api.cookbookguide.dpdns.org/api/v1/cookbook"
export const ROUTES = {
  HOME: "/",
  DOCS: "/docs",
  ERROR: "/error",
  SIGNUP: "/signup",
  PROFILE: "/profile",
  FEED: "/recipes"
  };


export const API = {
  LOGIN : "/data.json",
  CHECK_USERNAME: `${BASE_URL}/auth/check-username`,
  REGISTER: `${BASE_URL}/auth/register`,
  ME: `${BASE_URL}/auth/me`
}