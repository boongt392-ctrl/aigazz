
const serverless = require("serverless-http");
const app = require("../../server.js");

const handler = serverless(app);

exports.handler = async (event, context) => {
  // Batasi fungsi ini untuk endpoint API saja.
  if (!event.path.startsWith("/api/")) {
    return {
      statusCode: 404,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ok: false,
        error: "Endpoint tidak ditemukan.",
      }),
    };
  }

  return handler(event, context);
};

exports.config = {
  path: "/api/*",
};
