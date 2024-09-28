module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.bdblood24.com',
        port: '',  // No need for port if it's using the default
        pathname: '/uploads/**',
      },
    ],
  },
}



