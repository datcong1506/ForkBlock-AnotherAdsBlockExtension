const express = require('express');
const jwt = require('jsonwebtoken');
const adminRouters = express.Router();

const appExtensions=require("../../extensions/appExtensions");
const cinemaController=require("../../controllers/cinema/cinemacontroller");
const filmController=require("../../controllers/film/filmController");
const showtimeController=require("../../controllers/showtime/showtimeController");

adminRouters.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Kiểm tra nếu username và password là "admin"
  if (username === 'admin' && password === 'admin') {
    const token = jwt.sign({ username }, 'secret', { expiresIn: '168h' }); // 7 ngày
    return res.json({ token });
  }

  return res.status(401).json({ message: 'Tài khoản hoặc mật khẩu sai' });
});

adminRouters.get('/verify', (req, res) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).send({ auth: false, message: 'No token provided.' });
  }

  jwt.verify(token, 'secret', (err, decoded) => {
    if (err) {
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    }

    // Nếu xác thực thành công, trả về thông tin người dùng
    res.status(200).send(decoded);
  });
});


adminRouters.use(appExtensions.VerifyToken);

const cinemaRouters=express.Router();
cinemaRouters.post("/create",async (req,res)=>{
    try {
      const cinema = await cinemaController.CreateCinema(req.body);
      res.status(201).json(cinema);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});

// Route để lấy tất cả rạp chiếu
cinemaRouters.get('/getAll', async (req, res) => {
  try {
    const cinemas = await cinemaController.GetAllCinemas();
    res.status(200).json(cinemas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Route để lấy nhiều rạp chiếu
cinemaRouters.post('/getMultiple', async (req, res) => {
  try {
    const cinemas = await cinemaController.GetCinemaByIds(req.body.ids);
    res.status(200).json(cinemas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to update cinema by ID
cinemaRouters.put('/update', async (req, res) => {
  try {
    const cinema = await cinemaController.UpdateCinema(req.body.id, req.body);
    res.status(200).json(cinema);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Route to delete cinema by ID
cinemaRouters.delete('/delete', async (req, res) => {
  try {
    const result = await cinemaController.DeleteCinema(req.body.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Các route khác liên quan đến rạp chiếu



const projectionRouters=express.Router();
// Route để tạo phòng chiếu mới
projectionRouters.post('/create', async (req, res) => {
  try {
    const projection = await  cinemaController.CreateProjection(req.body.cinemaId, req.body);
    res.status(201).json(projection);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route để cập nhật phòng chiếu
projectionRouters.put('/update', async (req, res) => {
  try {
    const projection = await cinemaController.UpdateProjection(req.body.id, req.body);
    res.status(200).json(projection);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route để xóa phòng chiếu
projectionRouters.delete('/delete', async (req, res) => {
  try {
    const result = await cinemaController.DeleteProjection(req.body.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route để lấy nhiều phòng chiếu
projectionRouters.post('/getMultiple', async (req, res) => {
  try {
    const projections = await cinemaController.GetProjections(req.body.ids);
    res.status(200).json(projections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route để lấy tất cả phòng chiếu từ danh sách các cinemaId
projectionRouters.post('/getByCinemaIds', async (req, res) => {
  try {
    const projections = await cinemaController.GetProjectionsByCinemaIds(req.body.cinemaIds);
    res.status(200).json(projections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




const filmRouters = express.Router();



// Route để tạo mới một bộ phim
filmRouters.post('/create', async (req, res) => {
  try {
    const film = await filmController.CreateFilm(req.body);
    res.status(201).json(film);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route để lấy danh sách tất cả các bộ phim
filmRouters.get('/getAll', async (req, res) => {
  try {
    const films = await filmController.GetFilms();
    res.status(200).json(films);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route để lấy thông tin một bộ phim theo ID
filmRouters.get('/get/:id', async (req, res) => {
  try {
    const film = await filmController.GetFilmById(req.params.id);
    res.status(200).json(film);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route để lấy thông tin nhiều bộ phim theo IDs
filmRouters.post('/getMultiple', async (req, res) => {
  try {
    const films = await filmController.GetFilmByIds(req.body.ids);
    res.status(200).json(films);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route để cập nhật thông tin một bộ phim
filmRouters.put('/update', async (req, res) => {
  try {
    const film = await filmController.UpdateFilm(req.body.id, req.body);
    res.status(200).json(film);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route để xóa một bộ phim
filmRouters.delete('/delete', async (req, res) => {
  try {
    const result = await filmController.DeleteFilm(req.body.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




const showtimeRouters = express.Router();

// Route để tạo mới một showtime
showtimeRouters.post('/create', async (req, res) => {
  try {
    const showtime = await showtimeController.CreateShowtime(req.body);
    res.status(201).json(showtime);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route để lấy danh sách tất cả các showtime
showtimeRouters.get('/getAll', async (req, res) => {
  try {
    const showtimes = await showtimeController.GetShowtimes();
    res.status(200).json(showtimes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route để lấy thông tin một showtime theo ID
showtimeRouters.get('/get/:id', async (req, res) => {
  try {
    const showtime = await showtimeController.GetShowtimeById(req.params.id);
    res.status(200).json(showtime);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route để lấy thông tin nhiều showtime theo IDs
showtimeRouters.post('/getMultiple', async (req, res) => {
  try {
    const showtimes = await showtimeController.GetShowtimeByIds(req.body.ids);
    res.status(200).json(showtimes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route để cập nhật thông tin một showtime
showtimeRouters.put('/update', async (req, res) => {
  try {
    const showtime = await showtimeController.UpdateShowtime(req.body.id, req.body);
    res.status(200).json(showtime);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route để xóa một showtime
showtimeRouters.delete('/delete', async (req, res) => {
  try {
    const result = await showtimeController.DeleteShowtime(req.body.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});






function Init(app) {
  if (app) {
    cinemaRouters.use("/showtime",showtimeRouters);
    cinemaRouters.use("/film",filmRouters);
    cinemaRouters.use("/projection",projectionRouters);
    adminRouters.use("/cinema",cinemaRouters);
    app.use('/admin', adminRouters);
  }
}



module.exports = { Init };
