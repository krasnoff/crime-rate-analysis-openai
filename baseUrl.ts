export const baseURL =
  process.env.NODE_ENV == "development"
    // TODO change to your ngrok url or to localhost
    ? "https://full-hookworm-tightly.ngrok-free.app"
    : "https://" +
      (process.env.VERCEL_ENV === "production"
        ? process.env.VERCEL_PROJECT_PRODUCTION_URL
        : process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL);
