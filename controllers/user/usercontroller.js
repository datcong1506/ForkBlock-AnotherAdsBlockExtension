const Joi = require('joi');
const model = require('../../models/model');

// Định nghĩa schema Joi để xác thực
const userSchema = Joi.object({
  name: Joi.string().required(),
  age: Joi.number().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(new RegExp('^[0-9]{10,15}$')).required(), // Định dạng sdt phải từ 10 đến 15 chữ số
  password: Joi.string().min(6).required(), // Thêm trường password
  ticketHistory: Joi.array().items(Joi.string().hex().length(24)) // Định dạng ObjectId
});

// Hàm tạo mới một user
async function CreateUser(data) {
  const { error, value } = userSchema.validate(data);
  if (error) throw new Error(error.details[0].message);

  try {
    // Kiểm tra xem có user nào trùng email hoặc số điện thoại không
    const existingUser = await model.User.findOne({
      $or: [
        { email: value.email },
        { phone: value.phone }
      ]
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
  const { error, value } = userSchema.validate(data);
  if (error) throw new Error(error.details[0].message);

  try {
    const user = await model.User.findById(id);
    if (!user) throw new Error('User không tồn tại');

    user.name = value.name || user.name;
    user.age = value.age || user.age;
    user.email = value.email || user.email;
    user.phone = value.phone || user.phone;
    user.ticketHistory = value.ticketHistory || user.ticketHistory;

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
async function BuyTicket(userId, ticketData) {
  try {
    const user = await model.User.findById(userId);
    if (!user) throw new Error('User không tồn tại');

    const newTicket = new model.Ticket(ticketData);
    await newTicket.save();

    user.ticketHistory.push(newTicket._id);
    await user.save();

    return newTicket;
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
  BuyTicket // Export hàm BuyTicket
};
