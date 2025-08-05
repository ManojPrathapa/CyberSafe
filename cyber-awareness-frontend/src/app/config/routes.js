export const ROUTES = {
  student: "/student",            // goes to /Students because of redirect
  parent: "/parent",              // goes to /Parents
  admin: "/adminDashboard",       // goes to /Admin/dashboard
  trainer: "/trainer",            // goes to /trainer/dashboard
  support: "/support",            // goes to /support/home
  login: "/login",                // goes to /login_signup/login
  signup: "/signup",              // goes to /login_signup/signup
};

//this was created as helper file to route the urls using next.config.mjs redirects but not required now 