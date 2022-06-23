const path = require("path");

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    domains: [process.env.NEXT_PUBLIC_DOMAIN],
  },
};
