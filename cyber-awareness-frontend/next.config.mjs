/** @type {import('next').NextConfig} */
const nextConfig = {};


// export default nextConfig;
export default {
  
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/Home/main',
        permanent: true,
      },
      {
        source: '/admin',
        destination: '/Admin/home',
        permanent: true,
      },
      {
        source: '/adminDashboard',
        destination: '/Admin/dashboard',
        permanent: true,
      },
      {
        source: '/support',
        destination: '/support/home',
        permanent: true,
      },
      {
        source: '/supportDashboard',
        destination: '/support/dashboard',
        permanent: true,
      },
      {
        source: '/trainer',
        destination: '/trainer/dashboard',
        permanent: true,
      },
      {
        source: '/student',
        destination: '/Students/home',
        permanent: true,
      },
      {
        source: '/parent',
        destination: '/Parents',
        permanent: true,
      },
      {
        source: '/login',
        destination: '/login_signup/login',
        permanent: true,
      },
      {
        source: '/signup',
        destination: '/login_signup/signup',
        permanent: true,
      },
    ];
    }
  }


