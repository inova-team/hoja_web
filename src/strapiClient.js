import { createClient } from '@strapi/sdk-js';

export const strapi = createClient({
  url: process.env.STRAPI_URL,
  token: process.env.STRAPI_TOKEN
});
