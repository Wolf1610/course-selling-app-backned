const { Router } = require('express');
const { courseModel, purchaseModel } = require('../db');
const { userMiddleware } = require('../middleware/user');
const courseRouter = Router();


courseRouter.post('/purchase', userMiddleware, async (req, res) => {
    const userId = req.userId; // inside middleware
    const courseId = req.body.courseId;

    // check that the user has actually paid the price
    await purchaseModel.create({
        userId,
        courseId
    })
    res.json({
        message: "You are successfully bought the course"
    })
});

courseRouter.get('/preview', async (req, res) => {
    const courses = await courseModel.find({});
    res.json({
        courses
    })
});

module.exports = {
    courseRouter
}