const model = require('../../models/model');

// Hàm tạo mới một showtime
async function CreateShowtime(data) {
  const { film, room, time } = data;
  try {
    const newShowtime = new model.Showtime({ film, room, time });
    await newShowtime.save();
    return newShowtime;
  } catch (err) {
    throw new Error(err.message);
  }
}

// Hàm lấy danh sách tất cả các showtime
async function GetShowtimes() {
  try {
    const showtimes = await model.Showtime.find();
    if (showtimes.length === 0) throw new Error('Không tìm thấy showtime nào');
    return showtimes;
  } catch (err) {
    throw new Error(err.message);
  }
}

// Hàm lấy thông tin một showtime theo ID
async function GetShowtimeById(id) {
  try {
    const showtime = await model.Showtime.findById(id);
    if (!showtime) throw new Error('Showtime không tồn tại');
    return showtime;
  } catch (err) {
    throw new Error(err.message);
  }
}

// Hàm lấy thông tin nhiều showtime theo IDs
async function GetShowtimeByIds(ids) {
  try {
    const showtimes = await model.Showtime.find({ _id: { $in: ids } });
    if (showtimes.length === 0) throw new Error('Không tìm thấy showtime nào');
    return showtimes;
  } catch (err) {
    throw new Error(err.message);
  }
}

// Hàm cập nhật thông tin một showtime theo ID
async function UpdateShowtime(id, data) {
  const { film, room, time } = data;
  try {
    const showtime = await model.Showtime.findById(id);
    if (!showtime) throw new Error('Showtime không tồn tại');

    showtime.film = film || showtime.film;
    showtime.room = room || showtime.room;
    showtime.time = time || showtime.time;

    await showtime.save();
    return showtime;
  } catch (err) {
    throw new Error(err.message);
  }
}

// Hàm xóa một showtime theo ID
async function DeleteShowtime(id) {
  try {
    const showtime = await model.Showtime.findById(id);
    if (!showtime) throw new Error('Showtime không tồn tại');

    await showtime.remove();
    return { message: 'Đã xóa showtime' };
  } catch (err) {
    throw new Error(err.message);
  }
}

// Export các function
module.exports = {
  CreateShowtime,
  GetShowtimes,
  GetShowtimeById,
  GetShowtimeByIds,
  UpdateShowtime,
  DeleteShowtime
};
