const { Router } = require('express');
const userRouter = Router();
const { userMiddleware } = require('../middleware/user');
const { userModel, courseModel, purchaseModel } = require('../db');
const { z } = require('zod');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_USER } = require('../config'); 

userRouter.post('/signup', async (req, res) => {
    const schemaValidation = z.object({
        username: z.string(),
        email: z.string().email(6, "Invalid format"),
        password: z.string()
    });

    const parseDataWithSuccess = schemaValidation.safeParse(req.body);
    if(!parseDataWithSuccess.success){
        res.json({
            message: "Incorrect password"
        })
    }

    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 4);
    console.log(hashedPassword);
    await userModel.create({
        username: username,
        email: email,
        password: hashedPassword
    })
    res.json({
        message: "You are signed in"
    })
});

userRouter.post('/signin', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const response = await userModel.findOne({
        email: email
    })
    if(!response) {
        res.json({
            message: "User is not exist."
        })
    }
    const passwordMatch = await bcrypt.compare(password, response.password);
    if(passwordMatch) {
        const token = jwt.sign({
            id: response._id
        }, JWT_USER);
        res.json({ // Do cookie login
            token
        })
    } else {
        res.status(403).json({
            message: "User credential wrong."
        })
    }
});

userRouter.get('/course', async (req, res) => {
    const course = await courseModel.find({});
    res.json({
        course: course
    })
}); 

/*
userRouter.post('/course/:courseId', userMiddleware, async (req, res) => {
    const courseId = req.params.courseId;
    const username = req.headers.username;
    userModel.updateOne({
        username: username
    }, {
        "$push": {
            purchasedCourse: courseId
        }
    }) 
    res.json({
        message: "prchased complete"
    })
})
*/

userRouter.get('/purchases', userMiddleware, async (req, res) => {
    const userId = req.userId; // inside middleware
    const purchases = await purchaseModel.find({ 
        userId
    });
    let purchasedCourseIds = [];
    for(let i=0; i<purchases.length; i++){
        purchasedCourseIds.push(purchases[i].courseId); //  each purchase, the courseId is extracted from the purchase object and pushed into the purchasedCourseIds array
    }
    const courseData = await courseModel.find({
        _id: { $in: purchasedCourseIds } // MongoDB query that finds all courses where the _id (course ID) is in the list of purchasedCourseIds
    })
    res.json({ // JSON Object : ser's purchases and the corresponding course data.
        purchases,
        courseData
    })
});

module.exports = {
    userRouter
}