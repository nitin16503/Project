/** @type {import('next').NextConfig} */
const dotenv = require('dotenv');
dotenv.config();
const nextConfig = {
   distDir: 'build',
   images: {
      domains: [
         'dev.radpretation.ai',
         '3.110.122.195:3001'
      ],
   },
   env: {
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
      NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
      NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
      NEXT_PUBLIC_PACS_URL: process.env.NEXT_PUBLIC_PACS_URL,
   },
}

module.exports = nextConfig
