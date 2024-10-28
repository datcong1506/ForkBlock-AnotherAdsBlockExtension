const model = require('../../models/model');
// Hàm tạo mới một rạp chiếu
async function CreateCinema(data) {
    const { name, location, description, logo } = data;
    try {
        const newCinema = new model.Cinema({ name, location, description, logo });
        await newCinema.save();
        return newCinema;
    } catch (err) {
        throw new Error(err.message);
    }
}

// Hàm lấy danh sách tất cả các rạp chiếu
async function GetCinemas() {
    try {
        const cinemas = await model.Cinema.find();
        return cinemas;
    } catch (err) {
        throw new Error(err.message);
    }
}

async function GetCinemaByIds(ids) {
    try {
        const cinemas = await model.Cinema.find({ _id: { $in: ids } });
        if (cinemas.length === 0) throw new Error('Không tìm thấy rạp chiếu nào');

        return cinemas;
    } catch (err) {
        throw new Error(err.message);
    }
}


// Hàm cập nhật thông tin một rạp chiếu theo ID
async function UpdateCinema(id, data) {
    const { name, location, description, logo } = data;
    try {
        const cinema = await model.Cinema.findById(id);
        if (!cinema) throw new Error('Rạp chiếu không tồn tại');

        cinema.name = name || cinema.name;
        cinema.location = location || cinema.location;
        cinema.description = description || cinema.description;
        cinema.logo = logo || cinema.logo;

        await cinema.save();
        return cinema;
    } catch (err) {
        throw new Error(err.message);
    }
}

// Hàm xóa một rạp chiếu theo ID
async function DeleteCinema(id) {
    try {
        const cinema = await model.Cinema.findById(id);
        if (!cinema) throw new Error('Rạp chiếu không tồn tại');

        await cinema.remove();
        return { message: 'Đã xóa rạp chiếu' };
    } catch (err) {
        throw new Error(err.message);
    }
}

// Hàm tạo phòng chiếu từ rạp chiếu
async function CreateProjection(cinemaId, data) {

    const { name, seats, available, regularPrice, vipPrice } = data;
    try {
        const cinema = await model.Cinema.findById(cinemaId);
        if (!cinema) throw new Error('Rạp chiếu không tồn tại');

        const newProjection = new model.Projection({ name, seats, available, cinema: cinema._id });
        await newProjection.save();

        cinema.rooms.push(newProjection._id);
        await cinema.save();
        return newProjection;
    } catch (err) {
        throw new Error(err.message);
    }
}
async function UpdateProjection(projectionId, data) {
    const { name, seats, available, regularPrice, vipPrice } = data;
    try {
        const projection = await model.Projection.findById(projectionId);
        if (!projection) throw new Error('Phòng chiếu không tồn tại');

        // Kiểm tra xem các seat có trùng tên nhau không
        const seatNames = seats.map(seat => seat.name);
        const uniqueSeatNames = new Set(seatNames);
        if (uniqueSeatNames.size !== seatNames.length) {
            throw new Error('Có tên ghế trùng nhau trong danh sách');
        }

        projection.name = name || projection.name;
        projection.seats = seats.length ? seats : projection.seats;
        projection.available = available !== undefined ? available : projection.available;

        await projection.save();
        return projection;
    } catch (err) {
        throw new Error(err.message);
    }
}
async function DeleteProjection(projectionId) {
    try {
        const projection = await model.Projection.findById(projectionId);
        if (!projection) throw new Error('Phòng chiếu không tồn tại');

        await projection.remove();
        return { message: 'Đã xóa phòng chiếu' };
    } catch (err) {
        throw new Error(err.message);
    }
}

async function GetProjections(projectionIds) {
    try {
        const projections = await model.Projection.find({ _id: { $in: projectionIds } });
        if (projections.length === 0) throw new Error('Không tìm thấy phòng chiếu nào');

        return projections;
    } catch (err) {
        throw new Error(err.message);
    }
}


async function GetProjectionsByCinemaIds(cinemaIds) {
    try {
        const cinemas = await model.Cinema.find({ _id: { $in: cinemaIds } }).select('rooms');
        const projectionIds = cinemas.reduce((acc, cinema) => acc.concat(cinema.rooms), []);

        const projections = await model.Projection.find({ _id: { $in: projectionIds } });
        if (projections.length === 0) throw new Error('Không tìm thấy phòng chiếu nào');

        return projections;
    } catch (err) {
        throw new Error(err.message);
    }
}

async function GetAllCinemas() {
    try {
        const cinemas = await model.Cinema.find();
        if (cinemas.length === 0) throw new Error('Không tìm thấy rạp chiếu nào');
        return cinemas;
    } catch (err) {
        throw new Error(err.message);
    }
}


// Export các function
module.exports = {
    CreateCinema,
    GetCinemas,
    GetCinemaByIds, // Export hàm mới để lấy nhiều rạp chiếu
    UpdateCinema,
    DeleteCinema,
    CreateProjection,
    UpdateProjection,
    DeleteProjection,
    GetProjections,
    GetProjectionsByCinemaIds,
    GetAllCinemas
};
