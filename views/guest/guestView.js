const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userController = require('../../controllers/user/usercontroller'); // Điều chỉnh đường dẫn theo cấu trúc dự án của bạn
const guestRouters = express.Router();

const SECRET_KEY = 'your_secret_key'; // Thay bằng khóa bí mật của bạn

// Route để đăng ký user mới
guestRouters.post('/register', async (req, res) => {
    try {
        const { name, age, email, phone, password } = req.body;

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await userController.CreateUser({ name, age, email, phone, password: hashedPassword });
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route để đăng nhập user
guestRouters.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Tìm user theo email
      const user = await userController.GetUserByEmail(email);
      if (!user) return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
        console.log("okia")
      // Kiểm tra mật khẩu
      const isValidPassword = await bcrypt.compare(password, user.password);
      console.log("okia")

      if (!isValidPassword) return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
  
      // Tạo JWT token
      const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '999h' });
  
      res.json({ token });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  



function Init(app) {
    if (app) {
        app.use('/guest', guestRouters);
    }
}



module.exports = { Init };
