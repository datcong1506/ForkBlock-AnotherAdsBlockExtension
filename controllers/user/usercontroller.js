const Joi = require('joi');
const model = require('../../models/model');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_secret_key'; // Thay bằng khóa bí mật của bạn

// Định nghĩa schema Joi để xác thực
const userSchema = Joi.object({
  name: Joi.string().required(),
  age: Joi.number().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(), // Thêm trường password
});
// fix bug
// Hàm tạo mới một user
async function CreateUser(data) {
  const { error, value } = userSchema.validate(data);
  if (error) throw new Error(error.details[0].message);

  try {
    // Kiểm tra xem có user nào trùng email hoặc số điện thoại không
    const existingUser = await model.User.findOne({
         email: value.email 
    });

    if (existingUser) {
      throw new Error('Email hoặc số điện thoại đã được sử dụng');
    }

    const newUser = new model.User(value);
    await newUser.save();
    return newUser;
  } catch (err) {
    throw new Error(err.message);
  }
}

// Các hàm khác (GetAllUsers, GetUserById, GetUserByEmail, GetUserByIds, UpdateUser, DeleteUser)...

// Hàm lấy danh sách tất cả các user
async function GetAllUsers() {
  try {
    const users = await model.User.find();
    if (users.length === 0) throw new Error('Không tìm thấy user nào');
    return users;
  } catch (err) {
    throw new Error(err.message);
  }
}

// Hàm lấy thông tin một user theo ID
async function GetUserById(id) {
  try {
    const user = await model.User.findById(id);
    if (!user) throw new Error('User không tồn tại');
    return user;
  } catch (err) {
    throw new Error(err.message);
  }
}

// Hàm lấy thông tin một user theo email
async function GetUserByEmail(email) {
  try {
    const user = await model.User.findOne({ email });
    if (!user) throw new Error('User không tồn tại');
    return user;
  } catch (err) {
    throw new Error(err.message);
  }
}

// Hàm lấy thông tin nhiều user theo IDs
async function GetUserByIds(ids) {
  try {
    const users = await model.User.find({ _id: { $in: ids } });
    if (users.length === 0) throw new Error('Không tìm thấy user nào');
    return users;
  } catch (err) {
    throw new Error(err.message);
  }
}

// Hàm cập nhật thông tin một user theo ID
async function UpdateUser(id, data) {
  try {
    const user = await model.User.findById(id);
    if (!user) throw new Error('User không tồn tại');

    user.name = data.name || user.name;
    user.age = data.age || user.age;
    user.email = data.email || user.email;

    await user.save();
    return user;
  } catch (err) {
    throw new Error(err.message);
  }
}

// Hàm xóa một user theo ID
async function DeleteUser(id) {
  try {
    const user = await model.User.findById(id);
    if (!user) throw new Error('User không tồn tại');

    await user.remove();
    return { message: 'Đã xóa user' };
  } catch (err) {
    throw new Error(err.message);
  }
}

// Hàm mua vé
// async function BuyTicket(userId, ticketData) {
//   try {
//     const user = await model.User.findById(userId);
//     if (!user) throw new Error('User không tồn tại');

//     const newTicket = new model.Ticket(ticketData);
//     await newTicket.save();

//     user.ticketHistory.push(newTicket._id);
//     await user.save();

//     // Cập nhật trạng thái ghế về booked
//     await model.Projection.updateOne(
//       { _id: ticketData.room, 'seats._id': ticketData.seat },
//       { $set: { 'seats.$.booked': true } }
//     );

//     return newTicket;
//   } catch (err) {
//     throw new Error(err.message);
//   }
// }

async function GetUserByToken(token) {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await model.User.findById(decoded.id);
    if (!user) throw new Error('User không tồn tại');
    return user;
  } catch (err) {
    throw new Error(err.message);
  }
}

async function getTicketBookedBySchedulerId(id) {
  try {
    const booked = await model.Ticket.find({ showtime: id, state: {$ne: 4} });
    return booked;
  } catch (err) {
    throw new Error(err.message);
  }
}

async function getTicketBySchedulerId(id) {
  try {
    const booked = await model.Ticket.find({ showtime: id }).populate(['user', {path:'showtime', populate: ['film', {path: 'room', populate: 'cinema'}]}]);
    return booked;
  } catch (err) {
    throw new Error(err.message);
  }
}

async function buyTicket({userId, schedulerId, seatName}) {
  try {
    const user = await model.User.findById(userId);
    if (!user) throw new Error('User không tồn tại');

    const newTicket = new model.Ticket({
      seat: seatName,
      showtime: schedulerId,
      user: userId,
      state: 1
    });
    await newTicket.save();

    return newTicket
  } catch (err) {
    throw new Error(err.message);
  }
}

async function rejectTicket(id) {
  try {
    const date = new Date()
    const ticket = await model.Ticket.findByIdAndUpdate(id, {state: 4, rejectAt: date})
    return ticket
  } catch (err) {
    throw new Error(err.message);
  }
}

async function doneTicket(id) {
  try {
    const date = new Date()
    const ticket = await model.Ticket.findByIdAndUpdate(id, {state: 2, purchasedAt: date})
    return ticket
  } catch (err) {
    throw new Error(err.message);
  }
}

async function getTicket(state, userId) {
  try {
    const user = await model.User.findById(userId);
    if (!user) throw new Error('User không tồn tại');

    const tickets = await model.Ticket.find({ user: userId, state }).populate([{path: 'showtime', populate: ['film', {path: 'room', populate: ['cinema']}]}]);

    return tickets
  } catch (err) {
    throw new Error(err.message);
  }
}



// Export các function
module.exports = {
  CreateUser,
  GetAllUsers,
  GetUserById,
  GetUserByEmail,
  GetUserByIds,
  UpdateUser,
  DeleteUser,
  buyTicket, // Export hàm BuyTicket,
  GetUserByToken,
  getTicketBookedBySchedulerId,
  getTicket,
  rejectTicket,
  getTicketBySchedulerId,
  doneTicket
};
