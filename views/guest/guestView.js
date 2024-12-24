const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userController = require('../../controllers/user/usercontroller'); // Điều chỉnh đường dẫn theo cấu trúc dự án của bạn
const cinemaController = require("../../controllers/cinema/cinemacontroller");
const filmController = require("../../controllers/film/filmController");
const showtimeController = require("../../controllers/showtime/showtimeController");
const guestRouters = express.Router();
const SECRET_KEY = 'your_secret_key'; // Thay bằng khóa bí mật của bạn

// Route để đăng ký user mới
guestRouters.post('/register', async (req, res) => {
    try {
        const { name, age, email, password } = req.body;

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await userController.CreateUser({ name, age, email, password: hashedPassword });
        // Tạo JWT token
        const token = jwt.sign({ id: newUser._id }, SECRET_KEY, { expiresIn: '999h' });
        res.status(201).json({user: newUser, token});
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
        // Kiểm tra mật khẩu
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });

        // Tạo JWT token
        const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '999h' });

        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route để lấy tất cả rạp chiếu
guestRouters.get('/cinema/getAll', async (req, res) => {
    try {
        const cinemas = await cinemaController.GetAllCinemas();
        res.status(200).json(cinemas);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

guestRouters.post('/projection/getMultiple', async (req, res) => {
    try {
        const projections = await cinemaController.GetProjections(req.body.ids);
        res.status(200).json(projections);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Route để lấy thông tin nhiều bộ phim theo IDs
guestRouters.post('/film/getMultiple', async (req, res) => {
    try {
        const films = await filmController.GetFilmByIds(req.body.ids);
        res.status(200).json(films);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

guestRouters.post('/film/byCategory', async (req, res) => {
    try {
        const films = await filmController.GetFilmByCategory(req.body.cate);
        res.status(200).json(films);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


guestRouters.get('/showTime/daily', async (req, res) => {
    try {
        const showtime = await showtimeController.GetDailyShowTimes();
        res.status(200).json(showtime);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

guestRouters.post('/showtime/film', async (req, res) => {
    try {
        const showtime = await showtimeController.GetShowtimeByFilmId(req.body.idFilm, req.body.time, req.body.location);
        res.status(200).json(showtime);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

guestRouters.get('/showtime/getAll', async (req, res) => {
    try {
        const showtime = await showtimeController.GetShowtimes();
        res.status(200).json(showtime);
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
