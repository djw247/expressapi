// import express from node_modules
const { response } = require('express')
let express = require('express')
// import mongoose
let mongoose = require('mongoose')
let songs = require('./songs')

let cors = require('cors')
// create express app
let app = express()


app.use(cors)

// configure express app to parse incoming request payload
// in JSON format
app.use(express.json())

// use mongoose to database
let connectionString = "mongodb+srv://mongo-user:mongopassword@cluster0.fv2ls1q.mongodb.net/youtube"
mongoose.connect(connectionString)
let db = mongoose.connection

db.once('open', ()=>{
    console.log("Connection to MongoDB in cloud is successful.")
})

/* 
create root endpoint
http://localhost:8080/
app.get(endpoint, callback)
endpoint -> /, /todos /get/friends/all
callback -> (incoming request, outgoing response)=>{}

*/

app.get("/", (request,response) => {
    console.log("Request received...")
    console.log(request.url)
    response.send("<h1>Hello from server</h1>")
})


app.get("/welcome", (request,response) => {
    console.log("Request received...")
    console.log(request.url)
    response.send("<h1>Hello from Cyclic!</h1>")
})

/* 
create endpoint -> /help
http://localhost:8080/help
GET request
*/

app.get("/help", (request,response) => {
    console.log("Request received...GET")
    console.log(request.url)
    // response.send("<h1>HELP from server</h1>")
    response.json({
        status:"Success",
        request_type:"GET",
        message:"Send email to dale.wong@revmedia.my",
        meaning:"I will retrive the single/list of data from the server."
    })
})

/* 
create endpoint -> /showrequest
http://localhost:8080/showrequest
*/

app.get("/showrequest", (request,response) => {
    console.log("Request received...GET")
    console.log("********** Request Start **********")
    console.log(request)
    console.log("********** Request End **********")
    response.send("<h1>See Request Object in JSON in server console!</h1>")
})

/* 
create endpoint -> /help
http://localhost:8080/help
POST request
*/

app.post("/help", (request,response) => {
    console.log("Request received...POST")
    // console.log(request)
    console.log(request.body)
    console.log(request.body.name)
    console.log(request.body.location)
    console.log(request.url)
    response.json({
        status:"Success",
        request_type:"POST",
        message:"Send email to dale.wong@revmedia.my",
        meaning:"I will add new data to the server."
    })
})

/* 
create endpoint -> /help
http://localhost:8080/help
PUT request
*/

app.put("/help", (request,response) => {
    console.log("Request received...POST")
    console.log(request.url)
    response.json({
        status:"Success",
        request_type:"PUT",
        message:"Send email to dale.wong@revmedia.my",
        meaning:"I will update data on the server."
    })
})

/* 
create endpoint -> /help
http://localhost:8080/help
DELETE request
*/

app.delete("/help", (request,response) => {
    console.log("Request received...DELETE")
    console.log(request.url)
    response.json({
        status:"Success",
        request_type:"DELETE",
        message:"Send email to dale.wong@revmedia.my",
        meaning:"I will delete data from the server."
    })
})

// get data from mongoDB database
/*
http://localhost:8080/get/all/songs
*/
app.get("/get/all/songs", (request,response)=>{
    // use song reference/model in line 4 to interact
    // with song collection in mongoDB database
    songs.find({})
        .then((data)=>{
            response.json(data)
        })
        .catch((error)=>{
            response.json(error)
        })
})

/*
http://localhost:8080/add/song
*/
app.post("/add/song", (request,response)=>{
    console.log("Request body received from frontend.")
    console.log(request.body)
    let newSong = new songs()
    console.log(newSong)
    newSong.videoid = request.body.videoid
    newSong.likes = request.body.likes
    newSong.dislikes = request.body.dislikes
    console.log(newSong)
    // insert new song to mongoDB database
    newSong.save()
        .then((data)=>{
            response.json({
                "message":"Success",
                "status":data
            })
        })
        .catch((error)=>{
            response.json(error)
        })
})

/*
http://localhost:8080/remove/song/64009e5e3b70a10bfe693be0
*/
app.delete("/remove/song/:myid", (request,response)=>{
    console.log("Remove one document from song collection...")
    console.log("id: " + request.params.myid)
    // use myid 
    songs.findByIdAndDelete(request.params.myid)
        .then((data)=>{
            response.json(data)
        })
        .catch((error)=>{
            response.json(error)
        })
    // response.send({})
})

/*
http://localhost:8080/update/song/64009f408a706fb98a763089
*/
app.put("/update/song/:id", (request,response)=>{
    // Received path variable
    // console.log("id:" + request.params.id)
    console.log(`id received: ${request.params.id}`)
    console.log("Request body received...")
    console.log(request.body)
    // let songUpdate = new songs()
    // songUpdate.videoid = request.body.videoid
    // songUpdate.likes = request.body.likes
    // songUpdate.dislikes = request.body.dislikes
    // songUpdate.isNew = false
    // update song collection w/ songUpdate in mongoDB database
    songs.updateOne({_id: request.params.id}, 
                    {
                        $set:{
                            videoid:request.body.videoid,
                            likes:request.body.likes,
                            dislikes:request.body.dislikes
                        }
                    })
        .then(data=>{
            response.json(data)
        })
        .catch(error=>{
            response.json(error)
        })
            

    // response.json({})
})

// define port for the API
let PORT = 8080;
// listen on port
app.listen(PORT, ()=>{
    console.log("Listening on port " + PORT)
})