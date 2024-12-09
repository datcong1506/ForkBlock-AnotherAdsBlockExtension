const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const filmSchema = new Schema({
    title: { type: String, required: true },
    genre: {
        type: String, required: true,
        enum: ['Hành động', 'Kinh dị', 'Viễn tưởng', 'Lãng mạn', 'Hài hước', 'Phiêu lưu', 'Thần thoại', 'Hoạt hình', 'Tài liệu', 'Kịch tính', 'Chiến tranh', 'Thể thao', 'Nhạc kịch']
    },
    duration: { type: Number, required: true }, // in seconds
    actors: { type: [String], required: true },
    releaseDate: { type: Date, required: true },
    shortDescription: { type: String, required: true },
    thumb: { type: String, required: false }, // Đường dẫn đến hình ảnh thu nhỏ
    trailer: { type: String, required: false } // Đường dẫn đến video trailer
});

const cinemaSchema = new Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    rooms: [{ type: Schema.Types.ObjectId, ref: 'Projection' }],
    description: { type: String, required: true }, // Miêu tả bắt buộc
    logo: { type: String, required: true } // Logo (link hình ảnh) bắt buộc
});
const seatSchema = new Schema({
    name: { type: String, required: true }, // Thêm trường name
    type: { type: String, enum: ['VIP', 'Regular'], required: true },
    booked: { type: Boolean, required: true, default: false },
    isAvailable: { type: Boolean, required: true, default: true } // Thêm trường IsAvailable
});


const projectionSchema = new Schema({
    name: { type: String, required: true },
    seats: [seatSchema],
    available: { type: Boolean, required: true, default: true },
    cinema: { type: Schema.Types.ObjectId, ref: 'Cinema', required: true },
}).index({name: 1, cinema: 1}, {unique: true});



const showtimeSchema = new Schema({
    film: { type: Schema.Types.ObjectId, ref: 'Film', required: true },
    room: { type: Schema.Types.ObjectId, ref: 'Projection', required: true },
    time: { type: Date, required: true },
    vipPrice: {type: Number, required: true},
    regularPrice: {type: Number, required: true}
});

const scheduleSchema = new Schema({
    showtimes: [{ type: Schema.Types.ObjectId, ref: 'Showtime' }] // Chỉ chứa ObjectId của showtimeSchema
});

const ticketSchema = new Schema({
    film: { type: Schema.Types.ObjectId, ref: 'Film', required: true },
    showtime: { type: Schema.Types.ObjectId, ref: 'Showtime', required: true },
    seat: { type: String, required: true },
    purchasedAt: { type: Date, required: true, default: Date.now },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true } // Thêm trường này để thể hiện thuộc về người dùng nào
});

const userSchema = new Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Thêm trường password
    ticketHistory: [{ type: Schema.Types.ObjectId, ref: 'Ticket' }] // Chứa ObjectId của ticketSchema
});



const adminSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const Film = mongoose.model('Film', filmSchema);
const Cinema = mongoose.model('Cinema', cinemaSchema);
const Seat = mongoose.model('Seat', seatSchema);
const Projection = mongoose.model('Projection', projectionSchema);
const Showtime = mongoose.model('Showtime', showtimeSchema);
const Schedule = mongoose.model('Schedule', scheduleSchema);
const Ticket = mongoose.model('Ticket', ticketSchema);
const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);

module.exports = {
    Film,
    Cinema,
    Seat,
    Projection,
    Showtime,
    Schedule,
    Ticket,
    User,
    Admin
};
