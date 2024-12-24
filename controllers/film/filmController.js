const model = require('../../models/model');

// Hàm tạo mới một bộ phim
async function CreateFilm(data) {
  const { title, genre, duration, actors, releaseDate, shortDescription, thumb, trailer } = data;
  try {
    const newFilm = new model.Film({
      title,
      genre,
      duration,
      actors,
      releaseDate,
      shortDescription,
      thumb,
      trailer
    });
    await newFilm.save();
    return newFilm;
  } catch (err) {
    throw new Error(err.message);
  }
}

// Hàm lấy danh sách tất cả các bộ phim
async function GetFilms() {
  try {
    const films = await model.Film.find();
    if (films.length === 0) throw new Error('Không tìm thấy bộ phim nào');
    return films;
  } catch (err) {
    throw new Error(err.message);
  }
}

// Hàm lấy thông tin một bộ phim theo ID
async function GetFilmById(id) {
  try {
    const film = await model.Film.findById(id);
    if (!film) throw new Error('Bộ phim không tồn tại');
    return film;
  } catch (err) {
    throw new Error(err.message);
  }
}

async function GetFilmByCategory(cate) {
  try {
    const film = await model.Film.find({genre: {$in: [cate]}});
    if (!film) throw new Error('Bộ phim không tồn tại');
    return film;
  } catch (err) {
    throw new Error(err.message);
  }
}

// Hàm lấy thông tin nhiều bộ phim theo IDs
async function GetFilmByIds(ids) {
  try {
    let films = [];
    if(ids.length) {
      films = await model.Film.find({ _id: { $in: ids } });
    } else {
      films = await model.Film.find();
    }
    if (films.length === 0) throw new Error('Không tìm thấy bộ phim nào');
    return films;
  } catch (err) {
    throw new Error(err.message);
  }
}

// Hàm cập nhật thông tin một bộ phim theo ID
async function UpdateFilm(id, data) {
  const { title, genre, duration, actors, releaseDate, shortDescription, thumb, trailer } = data;
  try {
    const film = await model.Film.findById(id);
    if (!film) throw new Error('Bộ phim không tồn tại');

    film.title = title || film.title;
    film.genre = genre || film.genre;
    film.duration = duration || film.duration;
    film.actors = actors || film.actors;
    film.releaseDate = releaseDate || film.releaseDate;
    film.shortDescription = shortDescription || film.shortDescription;
    film.thumb = thumb || film.thumb;
    film.trailer = trailer || film.trailer;

    await film.save();
    return film;
  } catch (err) {
    throw new Error(err.message);
  }
}

// Hàm xóa một bộ phim theo ID
async function DeleteFilm(id) {
  try {
    const film = await model.Film.findById(id);
    if (!film) throw new Error('Bộ phim không tồn tại');

    await film.deleteOne();
    return { message: 'Đã xóa bộ phim' };
  } catch (err) {
    throw new Error(err.message);
  }
}

// Export các function
module.exports = {
  CreateFilm,
  GetFilms,
  GetFilmById,
  GetFilmByIds,
  UpdateFilm,
  DeleteFilm,
  GetFilmByCategory
};
