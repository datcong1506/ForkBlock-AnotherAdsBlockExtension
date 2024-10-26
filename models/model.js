const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const filmSchema = new Schema({
    title: { type: String, required: true },
    genre: { type: String, required: true,
         enum: ['Hành động', 'Kinh dị', 'Viễn tưởng', 'Lãng mạn', 'Hài hước', 'Phiêu lưu', 'Thần thoại', 'Hoạt hình', 'Tài liệu', 'Kịch tính', 'Chiến tranh', 'Thể thao', 'Nhạc kịch'] },
    duration: { type: Number, required: true }, // in second
    actors: { type: [String], required: true },
    releaseDate: { type: Date, required: true },
    shortDescription: { type: String, required: true },
    thumb: { type: String, required: false }, // Đường dẫn đến hình ảnh thu nhỏ
    trailer: { type: String, required: false } // Đường dẫn đến video trailer
});

const seatSchema = new Schema({
    type: { type: String, enum: ['VIP', 'Regular'], required: true },
    booked: { type: Boolean, required: true, default: false }
});

const projectionSchema = new Schema({
    seats: [seatSchema],
    available: { type: Boolean, required: true, default: true }
});

const showtimeSchema = new Schema({
    film: { type: Schema.Types.ObjectId, ref: 'Film', required: true },
    room: { type: Schema.Types.ObjectId, ref: 'Projection', required: true },
    time: { type: Date, required: true }
});

const scheduleSchema = new Schema({
    showtimes: [showtimeSchema]
});

const ticketSchema = new Schema({
    film: { type: Schema.Types.ObjectId, ref: 'Film', required: true },
    showtime: { type: Schema.Types.ObjectId, ref: 'Showtime', required: true },
    seat: { type: String, required: true },
    purchasedAt: { type: Date, required: true, default: Date.now },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true } // Thêm trường này để thể hiện thuộc về người dùng nào
});

const userSchema = new Schema({
    googleId: { type: String, required: true, unique: true },
    ticketHistory: [{ type: Schema.Types.ObjectId, ref: 'Ticket' }] // Chứa ObjectId của ticketSchema
})

const adminSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});


