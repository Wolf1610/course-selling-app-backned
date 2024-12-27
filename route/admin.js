const { Router } = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_ADMIN } = require('../config');
const adminRouter = Router();
const { adminModel, courseModel } = require('../db');
const { adminMiddleware } = require('../middleware/admin');
const { z } = require('zod');
const express = require('express');
const app = express();
app.use(express.json());

adminRouter.post('/signup', async function (req, res) {
    const schemaValidation = z.object({
        username: z.string().min(1, "Username is required"),
        email: z.string().email(6, "Invalid format"),
        password: z.string()
    });

    const parseDataWithSuccess = schemaValidation.safeParse(req.body);
    if(!parseDataWithSuccess.success) {
        res.json({
            message: "Incorrect format"
        })
    }

    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 5);
    console.log(hashedPassword);
    await adminModel.create({
        username: username,
        email: email,
        password: hashedPassword
    })
    res.json({
        message: "You are successfully signed up."
    })
});

adminRouter.post('/signin', async function (req, res){
    const email = req.body.email;
    const password = req.body.password;
    const response = await adminModel.findOne({
        email: email
    });

    if(!response) {
        res.status(403).json({
            message: "Admin not exist in DB."
        })
    } 

    const passwordMatch = await bcrypt.compare(password, response.password);
    if(passwordMatch) {
        const token = jwt.sign({
            id: response._id.toString()
        }, JWT_ADMIN, {
            expiresIn: '1h'
        });
        res.json({
            token
        })
    } else {
        res.status(403).json({
            message: "Wrong ADMIN credential."
        })
    }
});

adminRouter.post('/course', adminMiddleware,  async (req, res) => {
    const adminId = req.userId; // decoded userId inside middleware by jwt.sign({...})
    // zod
    const schemaValidation = z.object({
        title: z.string().min(5, "please enter title"),
        description: z.string(),
        imageUrl: z.string().url(),
        price: z.number()
    });

    const parseDataWithSuccess = schemaValidation.safeParse(req.body);
    if(!parseDataWithSuccess.success){
        res.json({
            message: "Incorrect format"
        })
    }
    const title = req.body.title;
    const description = req.body.description;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;

    const course = await courseModel.create({
        title: title,
        description : description,
        price: price,
        imageUrl: imageUrl,
        creatorId: adminId
    })
    console.log(course);
    res.json({
        message: "Course successfully created",
        courseId: course._id
    })

});

adminRouter.get('/course/get', adminMiddleware, async (req, res) => {
    const response = await courseModel.find({});
    res.json({
        course: response
    })
});

/**/
adminRouter.put('/course', adminMiddleware, async (req, res) => {
    const adminId = req.userId;
    const { title, description, imageUrl, price, courseId } = req.body;
    const course = await courseModel.updateOne({
        _id: courseId,
        creatorId: adminId
    }, {
        title: title,
        description: description,
        imageUrl: imageUrl,
        price: price
    });
    res.json({
        message: "Course updated",
        courseId: course._id 
    })
});

adminRouter.get('/course/get-all', adminMiddleware, async (req, res) => {
    const adminId = req.userId;
    const courses = await courseModel.find({
        creatorId: adminId
    });
    res.json({
        courses
    })
});

module.exports = {
    adminRouter
}
