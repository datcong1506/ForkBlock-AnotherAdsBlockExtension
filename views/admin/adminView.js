const express = require('express');
const jwt = require('jsonwebtoken');
const adminRouters = express.Router();

const appExtensions=require("../../extensions/appExtensions")
var adminController=require("../../controllers/admin/admincontroller")
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

adminRouters.get("/helloadmin",(req,res)=>{
  console.log("Okia");
  return res.send({message:"heelo"});
});

const cinemaRouters=express.Router();
cinemaRouters.post("/create",async (req,res)=>{
    try {
      const cinema = await adminController.CreateCinema(req.body);
      res.status(201).json(cinema);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});

// Route để lấy tất cả rạp chiếu
cinemaRouters.get('/getAll', async (req, res) => {
  try {
    const cinemas = await adminController.GetAllCinemas();
    res.status(200).json(cinemas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Route để lấy nhiều rạp chiếu
cinemaRouters.post('/getMultiple', async (req, res) => {
  try {
    const cinemas = await adminController.GetCinemaByIds(req.body.ids);
    res.status(200).json(cinemas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to update cinema by ID
cinemaRouters.put('/update', async (req, res) => {
  try {
    const cinema = await adminController.UpdateCinema(req.body.id, req.body);
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
    const projection = await  adminController.CreateProjection(req.body.cinemaId, req.body);
    res.status(201).json(projection);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route để cập nhật phòng chiếu
projectionRouters.put('/update', async (req, res) => {
  try {
    const projection = await adminController.UpdateProjection(req.body.id, req.body);
    res.status(200).json(projection);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route để xóa phòng chiếu
projectionRouters.delete('/delete', async (req, res) => {
  try {
    const result = await adminController.DeleteProjection(req.body.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route để lấy nhiều phòng chiếu
projectionRouters.post('/getMultiple', async (req, res) => {
  try {
    const projections = await adminController.GetProjections(req.body.ids);
    res.status(200).json(projections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route để lấy tất cả phòng chiếu từ danh sách các cinemaId
projectionRouters.post('/getByCinemaIds', async (req, res) => {
  try {
    const projections = await adminController.GetProjectionsByCinemaIds(req.body.cinemaIds);
    res.status(200).json(projections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



function Init(app) {
  if (app) {
    cinemaRouters.use("/projection",projectionRouters);
    adminRouters.use("/cinema",cinemaRouters);
    app.use('/admin', adminRouters);
  }
}



module.exports = { Init };
