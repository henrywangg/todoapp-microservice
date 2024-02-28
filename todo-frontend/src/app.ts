import * as express from 'express'
import { Request, Response } from 'express'
import * as cors from 'cors'
import { JsonContains, createConnection } from 'typeorm'
import * as amqp from 'amqplib/callback_api'
import { Todo } from './entities/Todo'
import axios from 'axios'

createConnection().then(db => {
    const todoRepository = db.getMongoRepository(Todo)

    amqp.connect('amqps://qowqyodp:mOzoFwWruWw3Ja_x2-Tg7eGS5MIOsq6z@armadillo.rmq.cloudamqp.com/qowqyodp', (err0, conn) => {
        if (err0)
            throw err0

        conn.createChannel((err1, channel) => {
            if (err1)
                throw err1

            channel.assertQueue('todo_created', { durable: false })
            channel.assertQueue('todo_updated', { durable: false })
            channel.assertQueue('todo_deleted', { durable: false })

            const app = express();

            app.use(cors({
                origin: [
                    'http://localhost:3000',
                    'http://localhost:8080',
                    'http://localhost:4200'
                ]
            }))

            channel.consume('todo_created', async (msg) => {
                const eventTodo: Todo = JSON.parse(msg.content.toString())
                let todo = new Todo()
                todo.admin_id = parseInt(eventTodo.id)
                todo.title = eventTodo.title
                todo.description = eventTodo.description
                todo.image = eventTodo.image
                todo.isFinished = eventTodo.isFinished
                await todoRepository.save(todo)
                console.log('todo created')
            }, { noAck: true })

            channel.consume('todo_updated', async (msg) => {
                const eventTodo: Todo = JSON.parse(msg.content.toString())
                let todo = await todoRepository.findOne({ where: { admin_id: parseInt(eventTodo.id) } })
                todoRepository.merge(todo, {
                    title: eventTodo.title,
                    description: eventTodo.description,
                    image: eventTodo.image,
                    isFinished: eventTodo.isFinished
                })
                await todoRepository.save(todo)
                console.log('todo updated')
            }, { noAck: true })

            channel.consume('todo_deleted', async (msg) => {
                const admin_id = parseInt(JSON.parse(msg.content.toString()))
                await todoRepository.deleteOne({admin_id})
                console.log('todo deleted')
            })

            app.get('/api/todos', async (req, res) => {
                const todos = await todoRepository.find()
                res.json(todos)
            })

            app.put('/api/todos/:id/finished', async (req, res) => {
                const todo = await todoRepository.findOne({where: {admin_id: parseInt(req.params.id)}})
                todo.isFinished = 1
                let data: any = {
                    title: todo.title,
                    description: todo.description,
                    image: todo.image,
                    isFinished: todo.isFinished
                }
                await axios.put(`http://localhost:8080/api/todos/${req.params.id}`, data)
                res.json(todo)
            })

            app.put('/api/todos/:id/unfinished', async (req, res) => {
                const todo = await todoRepository.findOne({where: {admin_id: parseInt(req.params.id)}})
                todo.isFinished = 0
                let data: any = {
                    title: todo.title,
                    description: todo.description,
                    image: todo.image,
                    isFinished: todo.isFinished
                }
                await axios.put(`http://localhost:8080/api/todos/${req.params.id}`, data)
                res.json(todo)
            })

            app.use(express.json())

            console.log('Listening to port: 8081')
            app.listen(8081);

            process.on('beforeExit', () => {
                console.log('closing')
                conn.close()
            })
        })
    })
})

