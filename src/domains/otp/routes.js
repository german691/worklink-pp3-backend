const express = require("express");
const router = express.Router();
const { sendOTP, verifyOTP } = require("./controller");

// Verificación OTP

// ruta para enviar token OTP
router.post("/", async (req, res) => {
    try {
        const { email, subject, message, duration } = req.body;
        const createdOTP = await sendOTP({
            email,
            subject,
            message,
            duration, 
        });
        res.status(200).json(createdOTP);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// ruta para verificar token OTP
router.post("/verify", async (req, res) => {
    try {
        let { email, otp } = req.boby;
        
        const validOTP = await verifyOTP({ email, otp });
        res.status(200).json({ valid: validOTP });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;