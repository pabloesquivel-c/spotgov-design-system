/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/storybook',
        destination: '/storybook/index.html',
        permanent: false,
      },
      {
        source: '/storybook/',
        destination: '/storybook/index.html',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
