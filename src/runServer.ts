import App from "./server.js";
import http from "http";

const server = http.createServer(App.callback());
// where to get port from?
server.listen(process.env.PORT ? process.env.PORT : 3000);
