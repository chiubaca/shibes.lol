// Generated by Wrangler on Sun May 26 2024 13:51:11 GMT+0100 (British Summer Time)
// by running `wrangler types`

interface Env {
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;

  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CLIENT_REDIRECT_URL: string;

  TWITTER_CLIENT_ID: string;
  TWITTER_CLIENT_SECRET: string;
  TWITTER_CLIENT_REDIRECT_URL: string;

  APP_BUCKET: R2Bucket;
  APP_DB: D1Database;

  R2_ACCOUNT_ID: string;
  R2_ACCESS_ID: string;
  R2_SECRET_KEY: string;

  TERRIBLE_GATE_PASSWORD: string;
}
