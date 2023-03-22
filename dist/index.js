"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const client_1 = require("./client");
const port = process.env.PORT || 8000;
app_1.app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
(0, client_1.connect)();
