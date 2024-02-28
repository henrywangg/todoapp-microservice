"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var cors = require("cors");
var typeorm_1 = require("typeorm");
var amqp = require("amqplib/callback_api");
var Todo_1 = require("./entities/Todo");
var axios_1 = require("axios");
(0, typeorm_1.createConnection)().then(function (db) {
    var todoRepository = db.getMongoRepository(Todo_1.Todo);
    amqp.connect('amqps://qowqyodp:mOzoFwWruWw3Ja_x2-Tg7eGS5MIOsq6z@armadillo.rmq.cloudamqp.com/qowqyodp', function (err0, conn) {
        if (err0)
            throw err0;
        conn.createChannel(function (err1, channel) {
            if (err1)
                throw err1;
            channel.assertQueue('todo_created', { durable: false });
            channel.assertQueue('todo_updated', { durable: false });
            channel.assertQueue('todo_deleted', { durable: false });
            var app = express();
            app.use(cors({
                origin: [
                    'http://localhost:3000',
                    'http://localhost:8080',
                    'http://localhost:4200'
                ]
            }));
            channel.consume('todo_created', function (msg) { return __awaiter(void 0, void 0, void 0, function () {
                var eventTodo, todo;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            eventTodo = JSON.parse(msg.content.toString());
                            todo = new Todo_1.Todo();
                            todo.admin_id = parseInt(eventTodo.id);
                            todo.title = eventTodo.title;
                            todo.description = eventTodo.description;
                            todo.image = eventTodo.image;
                            todo.isFinished = eventTodo.isFinished;
                            return [4 /*yield*/, todoRepository.save(todo)];
                        case 1:
                            _a.sent();
                            console.log('todo created');
                            return [2 /*return*/];
                    }
                });
            }); }, { noAck: true });
            channel.consume('todo_updated', function (msg) { return __awaiter(void 0, void 0, void 0, function () {
                var eventTodo, todo;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            eventTodo = JSON.parse(msg.content.toString());
                            return [4 /*yield*/, todoRepository.findOne({ where: { admin_id: parseInt(eventTodo.id) } })];
                        case 1:
                            todo = _a.sent();
                            todoRepository.merge(todo, {
                                title: eventTodo.title,
                                description: eventTodo.description,
                                image: eventTodo.image,
                                isFinished: eventTodo.isFinished
                            });
                            return [4 /*yield*/, todoRepository.save(todo)];
                        case 2:
                            _a.sent();
                            console.log('todo updated');
                            return [2 /*return*/];
                    }
                });
            }); }, { noAck: true });
            channel.consume('todo_deleted', function (msg) { return __awaiter(void 0, void 0, void 0, function () {
                var admin_id;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            admin_id = parseInt(JSON.parse(msg.content.toString()));
                            return [4 /*yield*/, todoRepository.deleteOne({ admin_id: admin_id })];
                        case 1:
                            _a.sent();
                            console.log('todo deleted');
                            return [2 /*return*/];
                    }
                });
            }); });
            app.get('/api/todos', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                var todos;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, todoRepository.find()];
                        case 1:
                            todos = _a.sent();
                            res.json(todos);
                            return [2 /*return*/];
                    }
                });
            }); });
            app.put('/api/todos/:id/finished', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                var todo, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, todoRepository.findOne({ where: { admin_id: parseInt(req.params.id) } })];
                        case 1:
                            todo = _a.sent();
                            todo.isFinished = 1;
                            data = {
                                title: todo.title,
                                description: todo.description,
                                image: todo.image,
                                isFinished: todo.isFinished
                            };
                            return [4 /*yield*/, axios_1.default.put("http://localhost:8080/api/todos/".concat(req.params.id), data)];
                        case 2:
                            _a.sent();
                            res.json(todo);
                            return [2 /*return*/];
                    }
                });
            }); });
            app.put('/api/todos/:id/unfinished', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                var todo, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, todoRepository.findOne({ where: { admin_id: parseInt(req.params.id) } })];
                        case 1:
                            todo = _a.sent();
                            todo.isFinished = 0;
                            data = {
                                title: todo.title,
                                description: todo.description,
                                image: todo.image,
                                isFinished: todo.isFinished
                            };
                            return [4 /*yield*/, axios_1.default.put("http://localhost:8080/api/todos/".concat(req.params.id), data)];
                        case 2:
                            _a.sent();
                            res.json(todo);
                            return [2 /*return*/];
                    }
                });
            }); });
            app.use(express.json());
            console.log('Listening to port: 8081');
            app.listen(8081);
            process.on('beforeExit', function () {
                console.log('closing');
                conn.close();
            });
        });
    });
});
