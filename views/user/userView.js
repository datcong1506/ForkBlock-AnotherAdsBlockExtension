const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userController = require('../../controllers/user/usercontroller'); // Điều chỉnh đường dẫn theo cấu trúc dự án của bạn
const cinemaController = require("../../controllers/cinema/cinemacontroller");
const filmController = require("../../controllers/film/filmController");
const showtimeController = require("../../controllers/showtime/showtimeController");
const userRouters = express.Router();
const SECRET_KEY = 'your_secret_key'; // Thay bằng khóa bí mật của bạn

// Route để lấy tất cả rạp chiếu
userRouters.get('/cinema/getAll', async (req, res) => {
    try {
        const cinemas = await cinemaController.GetAllCinemas();
        res.status(200).json(cinemas);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

userRouters.post('/projection/getMultiple', async (req, res) => {
    try {
        const projections = await cinemaController.GetProjections(req.body.ids);
        res.status(200).json(projections);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Route để lấy thông tin nhiều bộ phim theo IDs
userRouters.post('/film/getMultiple', async (req, res) => {
    try {
        const films = await filmController.GetFilmByIds(req.body.ids);
        res.status(200).json(films);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

userRouters.post('/showtime/get',  async (req, res) => {
    try {
        const showtime = await showtimeController.GetShowtimeById(req.body.id);
        res.status(200).json(showtime);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})
userRouters.post('/ticket/booked-scheduler',  async (req, res) => {
    try {
        const booked = await userController.getTicketBookedBySchedulerId(req.body.id);
        res.status(200).json(booked);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})
userRouters.post('/ticket/buy',  async (req, res) => {
    try {
        const booked = await userController.buyTicket(req.body);
        res.status(200).json(booked);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})
userRouters.post('/ticket/reject',  async (req, res) => {
    try {
        const ticket = await userController.rejectTicket(req.body.id);
        res.status(200).json(ticket);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})
userRouters.post('/ticket/state',  async (req, res) => {
    try {
        const booked = await userController.getTicket(req.body.state, req.body.userId);
        res.status(200).json(booked);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

userRouters.get('/showTime/daily', async (req, res) => {
    try {
        const showtime = await showtimeController.GetDailyShowTimes();
        res.status(200).json(showtime);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Tạo mới một user
// Tạo mới một user
userRouters.post('/create', async (req, res) => {
    try {
        const newUser = await userController.CreateUser(req.body);
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Lấy danh sách tất cả các user
userRouters.get('/getAll', async (req, res) => {
    try {
        const users = await userController.GetAllUsers();
        res.status(200).json(users);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});
// Lấy thông tin một user theo email
userRouters.get('/email/:email', async (req, res) => {
    try {
      const user = await userController.GetUserByEmail(req.params.email);
      res.status(200).json(user);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
});
// Lấy thông tin nhiều user theo IDs
userRouters.post('/ids', async (req, res) => {
    try {
      const users = await userController.GetUserByIds(req.body.ids);
      res.status(200).json(users);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
});

// Cập nhật thông tin một user theo ID
userRouters.put('/:id', async (req, res) => {
    try {
      const updatedUser = await userController.UpdateUser(req.params.id, req.body);
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
// Cập nhật thông tin một user theo ID
userRouters.get('/token/:id', async (req, res) => {
    try {
      const user = await userController.GetUserByToken(req.params.id);
      res.status(200).json(user);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  

  


function Init(app) {
    if (app) {
        app.use('/user', userRouters);
    }
}



module.exports = { Init };
