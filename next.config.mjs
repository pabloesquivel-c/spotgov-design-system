/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/storybook',
          destination: '/storybook/index.html',
        },
        {
          source: '/storybook/',
          destination: '/storybook/index.html',
        },
      ],
    };
  },
};

export default nextConfig;
