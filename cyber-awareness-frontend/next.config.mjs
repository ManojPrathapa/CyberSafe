/** @type {import('next').NextConfig} */
const nextConfig = {};


// export default nextConfig;
export default {
  
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/admin',
        destination: '/Admin/dashboard',
        permanent: true,
      },
      {
        source: '/trainer',
        destination: '/trainer/dashboard',
        permanent: true,
      },
      {
        source: '/student',
        destination: '/student/home',
        permanent: true,
      },
      {
        source: '/parent',
        destination: '/parent/home',
        permanent: true,
      },
    ];
    }
  }


