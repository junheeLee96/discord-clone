//src/setupProxy.js
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app) => {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:9000",
      changeOrigin: true,
    })
  );
  app.use(
    "/api2",
    createProxyMiddleware({
      target: "http://localhost:3070",
      changeOrigin: true,
    })
  );
};
