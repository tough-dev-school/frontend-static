const express = require("express");
const morgan = require("morgan");
const consola = require("consola");
const history = require('connect-history-api-fallback');
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.set("trust proxy", true);
app.use(morgan("combined"));

app.use("/healthcheck/", (_, res) => res.send("OK"));

const target = process.env.BACKEND_URL || "https://app.tough-dev.school";

app.use(
    ["/admin", "/api", "/static"],
    createProxyMiddleware({
        target,
        changeOrigin: Boolean(target.includes("https")),
    })
);

const staticFolder = process.env.STATIC_FOLDER || '/dist';

consola.info(`Serving static from ${staticFolder}`);
app.use(history());
app.use(express.static(staticFolder))

/* Run express */
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;
app.set('port', port);
app.listen(port, host);

consola.ready({
  message: `Server listening on http://${host}:${port}`,
  badge: true,
});
