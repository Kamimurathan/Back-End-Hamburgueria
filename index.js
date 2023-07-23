const express = require('express')
const cors = require('cors')
const uuid = require('uuid')

const app = express()
const port = 3001
app.use(express.json())
app.use(cors())

const orders = []

const checkOrderId = (request, response, next) => {

    const { id } = request.params

    const index = orders.findIndex(order => order.id === id)

    if (index < 0) {

        return response.status(404).json("Order not found")

    }

    request.id = id
    request.index = index

    next()

}

const showMethodAndUrl = (request, response, next) => {
    console.log(`[${request.method}] - ${request.url}`)

    next()
}

app.get('/orders', showMethodAndUrl, (request, response) => {

    return response.json(orders)

})

app.post('/orders', showMethodAndUrl, (request, response) => {

    const { order, clientName, price } = request.body

    const clientOrder = { id: uuid.v4(), order, clientName, price, status: "Em preparo" }

    orders.push(clientOrder)

    return response.status(201).json(clientOrder)

})

app.put('/orders/:id', checkOrderId, showMethodAndUrl, (request, response) => {

    const id = request.id
    const index = request.index

    const { order, clientName, price, status } = request.body

    const updateOrder = { id, order, clientName, price, status }

    orders[index] = updateOrder

    return response.json(updateOrder)

})

app.delete('/orders/:id', checkOrderId, showMethodAndUrl, (request, response) => {

    const index = request.index

    orders.splice(index, 1)

    return response.status(204).json()

})

app.get('/orders/:id', checkOrderId, showMethodAndUrl, (request, response) => {

    const id = request.id

    const index = orders.find(order => order.id === id)

    return response.json(index)

})

app.patch('/orders/:id', checkOrderId, showMethodAndUrl, (request, response) => {

    const id = request.id

    const index = orders.find(order => order.id === id)
    
    index.status = "Pronto"

    return response.json(index);
})

app.listen(port, () => {
    console.log(`🚀 Server starting on ${port}`)
})