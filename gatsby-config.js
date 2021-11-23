module.exports = {
  siteMetadata: {
    siteUrl: "https://www.yourdomain.tld",
    title: "Creekside Logistics App",
  },
  plugins: [
    {
      resolve: "gatsby-plugin-google-analytics",
      options: {
        trackingId: "G-8M4QDXNVK8",
      },
    },
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-top-layout",
    "gatsby-plugin-mui-emotion",
    "gatsby-plugin-gatsby-cloud",
    "gatsby-plugin-image",
    {
      resolve: "gatsby-plugin-google-analytics",
      options: {
        trackingId: "G-8M4QDXNVK8",
      },
    },
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        icon: "./src/images/splash.png",
        name: `Creekside Logistics Delivery App`,
        short_name: `CS App`,
        description: `Online delivery app within Port Harcourt`,
        start_url: `/`,
        background_color: `#fff`,
        theme_color: `#ff0600`,
        display: `standalone`,
        icons: [
          {
            src: `./src/images/splash.png`,
            sizes: `192x192`,
            type: `image/png`,
          },
          {
            src: `./src/images/splash.png`,
            sizes: `512x512`,
            type: `image/png`,
          },
        ],
      },
    },
    "gatsby-plugin-mdx",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./src/images/",
      },
      __key: "images",
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages",
        path: "./src/pages/",
      },
      __key: "pages",
    },
  ],
};
