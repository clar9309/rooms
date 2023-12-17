/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true, // To include the slash in the url
  images: {
    domains: ["res.cloudinary.com"],
  },
};

module.exports = nextConfig;
