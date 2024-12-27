const JWT_ADMIN = process.env.JWT_ADMIN_SECRETE;
const JWT_USER = process.env.JWT_USER_SECRETE;
const MONGO = process.env.MONGO_URL;

module.exports = {
    JWT_ADMIN,
    JWT_USER,
    MONGO
}