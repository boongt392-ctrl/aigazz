
const serverless = require("serverless-http");
const app = require("../../server.js");

const handler = serverless(app);

exports.handler = async (event, context) => {
  // Teruskan request ke Express tanpa menolak berdasarkan event.path.
  return handler(event, context);
};

exports.config = {
  path: ["/api/*", "/.netlify/functions/api/*"],
};
