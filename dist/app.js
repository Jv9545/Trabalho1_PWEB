"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const PORT = process.env.PORT ?? 3000;
app.use(express_1.default.json());
function helloWord(req, res) {
    res.status(200).send('Hello Word!!!');
}
app.get('/api/hello', helloWord);
app.listen(PORT, () => console.log(`API em execução no URL: http://localhost:${PORT}`));
