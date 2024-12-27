require('dotenv').config();
const express = require('express');
const { adminRouter } = require('./route/admin');
const { userRouter } = require('./route/user');
const { courseRouter } = require('./route/course');
const { default: mongoose } = require('mongoose');
const app = express();

app.use(express.json());

app.use("/v1/admin", adminRouter);
app.use("/v1/user", userRouter);
app.use("/v1/course", courseRouter);

async function main(){
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(3002);
    console.log(`Listening PORT 3002`);
}

main();