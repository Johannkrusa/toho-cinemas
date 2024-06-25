"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post('/auth/register', (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = {
            username,
            email,
            password
        };
        const data = JSON.parse(fs_1.default.readFileSync('./db/db.json', 'utf-8'));
        const validation = validateRegister(newUser, data);
        if (!validation.valid) {
            throw new Error(validation['error']);
        }
        newUser.uid = Date.now();
        newUser.role = 'USER';
        data.users.push(newUser);
        fs_1.default.writeFileSync('./db/db.json', JSON.stringify(data));
        res.send({
            message: 'new user created',
            data: newUser
        });
    }
    catch (error) {
        res.status(400).send({
            message: error.message
        });
    }
});
function validateRegister(user, database) {
    console.log(user.username);
    if (!user.email || !user.username || !user.password) {
        return {
            valid: false,
            error: 'Please fill in all the blanks'
        };
    }
    let errorMessage = null;
    database.users.forEach((item) => {
        if (item.email === user.email) {
            errorMessage = 'Email has already been registered';
        }
        if (item.username === user.username) {
            errorMessage = 'Username has already been registered';
        }
    });
    if (errorMessage) {
        return {
            valid: false,
            error: errorMessage
        };
    }
    if (user.password.length < 8) {
        return {
            valid: false,
            error: 'Password must be 8 characters in length'
        };
    }
    return { valid: true };
}
app.get('/auth/login', (req, res) => {
    try {
        const user = req.body;
        const data = JSON.parse(fs_1.default.readFileSync('./db/db.json', 'utf-8'));
        let userFound = false;
        data.users.forEach((item, index) => {
            if (item.email === user.email || item.username === user.username) {
                if (item.password === user.password) {
                    userFound = true;
                    return;
                }
            }
        });
        if (!userFound) {
            throw new Error("username, email or password is invalid");
        }
        res.send({
            username: user.username,
            message: 'Login Successfully'
        });
    }
    catch (error) {
        res.send({
            message: error.message
        });
    }
});
const calculateRemainingSeats = (movie, transactions) => {
    const remainingSeats = {};
    movie.time.forEach(showtime => {
        let bookedSeats = 0;
        transactions.forEach(transaction => {
            if (transaction.movies_id === movie.id && transaction.time === showtime) {
                bookedSeats += transaction.total_seat;
            }
        });
        remainingSeats[showtime] = movie.total_seat - bookedSeats;
    });
    return remainingSeats;
};
app.get('/movies', (req, res) => {
    const { status, date, time } = req.query;
    const data = JSON.parse(fs_1.default.readFileSync('./db/db.json', 'utf-8'));
    let moviesData = data.movies;
    if (!status && !date && !time) {
        moviesData = moviesData.map((movie) => {
            return Object.assign(Object.assign({}, movie), { remaining_seats: calculateRemainingSeats(movie, data.transactions) });
        });
        return res.send({
            data: moviesData
        });
    }
    if (status) {
        moviesData = moviesData.filter((item) => item.status === status);
    }
    if (date) {
        moviesData = moviesData.filter((item) => item.date === date);
    }
    if (time) {
        moviesData = moviesData.filter((item) => item.time === time);
    }
    moviesData = moviesData.map((movie) => {
        return Object.assign(Object.assign({}, movie), { remaining_seats: calculateRemainingSeats(movie, data.transactions) });
    });
    res.send({
        data: moviesData
    });
});
app.post('/transaction', (req, res) => {
    try {
        const { users_uid, movies_id, time, total_seat, date } = req.body;
        const data = JSON.parse(fs_1.default.readFileSync('./db/db.json', 'utf-8'));
        const validation = validateTransaction(users_uid, movies_id, time, total_seat, date, data);
        if (!validation.valid) {
            throw new Error(validation.error || "Unknown Error");
        }
        let selectedMovie = null;
        data.movies.forEach((item) => {
            if (item.id === movies_id) {
                selectedMovie = item;
                return;
            }
        });
        if (!selectedMovie) {
            throw new Error("Selected movie not found");
        }
        const totalPrice = selectedMovie['price'] * total_seat;
        const newTransaction = {
            users_uid: users_uid,
            movies_id: movies_id,
            time: time,
            total_seat: total_seat,
            date: date
        };
        console.log(newTransaction);
        data.transactions.push(newTransaction);
        fs_1.default.writeFileSync('./db/db.json', JSON.stringify(data, null, 2));
        res.send({
            total_price: totalPrice,
            movies_id: movies_id,
            time: time,
            total_seat: total_seat,
            date: date
        });
    }
    catch (error) {
        res.status(404).send({
            error: error.message
        });
    }
});
function validateTransaction(users_uid, movies_id, time, total_seat, date, database) {
    let moviesFound = false;
    let usersFound = false;
    let remainingSeats = 0;
    database.movies.forEach((movie) => {
        if (movie.id === movies_id && movie.release_date === date) {
            movie.time.forEach((movieTime) => {
                if (movieTime === time) {
                    moviesFound = true;
                    remainingSeats = movie.total_seat;
                }
            });
        }
    });
    if (database.transactions.length !== 0) {
        database.transactions.forEach((item) => {
            if (item.movies_id === movies_id && item.time === time && item.date === date) {
                remainingSeats -= item.total_seat;
            }
        });
    }
    database.users.forEach((item) => {
        if (item.uid === users_uid) {
            usersFound = true;
        }
    });
    if (!moviesFound) {
        return {
            valid: false,
            error: 'Movie not found'
        };
    }
    if (!usersFound) {
        return {
            valid: false,
            error: 'User ID not found'
        };
    }
    if (remainingSeats < total_seat) {
        return {
            valid: false,
            error: 'Not enough seats available'
        };
    }
    return {
        valid: true,
        error: null
    };
}
const port = 5000;
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
