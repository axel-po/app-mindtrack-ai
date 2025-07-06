const config = {
  plugins: [
    process.env.NODE_ENV === "test" ? undefined : "@tailwindcss/postcss",
  ].filter(Boolean),
};

export default config;
