import jwt from "jsonwebtoken";

export const JWT_SECRET = "my-super-secret";

export const payload = {
    sub: "user-1",
    role: "DOCTOR"
};

const token = jwt.sign(payload, JWT_SECRET)
const decoded = jwt.verify(token, JWT_SECRET)

console.log("JWT:", token);