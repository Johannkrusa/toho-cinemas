import express, { Express, Request, Response } from 'express';
import fs from 'fs';
import cors from 'cors'

import { IUser, IMovies, ITransaction } from './types';

const app: Express = express();
app.use(express.json());
app.use(cors())

app.post('/auth/register', (req:Request, res:Response)=>{
    try {
        const { username, email, password }: IUser = req.body;

        const newUser: IUser = {
            username,
            email,
            password
        };

        const data = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));

        const validation = validateRegister(newUser, data)

        if(!validation.valid ){
            throw new Error(validation['error'])
        }

        newUser.uid = Date.now()
        newUser.role = 'USER'

        data.users.push(newUser)

        fs.writeFileSync('./db/db.json', JSON.stringify(data));

        res.send({
            message: 'new user created',
            data: newUser
        });
        
    } catch (error: any) {
        res.status(400).send({
            message: error.message
        })
    }
})


function validateRegister(user: IUser, database: any): { valid: boolean; error?: string } {
    console.log(user.username)
    if (!user.email || !user.username || !user.password) {
        return {
            valid: false,
            error: 'Please fill in all the blanks'
        };
    }

    let errorMessage: string | null = null;

    database.users.forEach((item: any) => {
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

app.get('/auth/login', (req:Request, res: Response) => {
try {
        const user: IUser = req.body;

        const data = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));



        let userFound = false;
    
        data.users.forEach((item:any, index:number) => {
            if(item.email === user.email || item.username === user.username){

                if(item.password === user.password){
                    userFound = true;
                    return;
                }
            }
        })

        if(!userFound){
            throw new Error("username, email or password is invalid")
        }
        res.send({
            username: user.username,
            message: 'Login Successfully'
        })        

    } catch (error: any) {
        res.send({
            message: error.message
        })
    }
})

const calculateRemainingSeats = (movie: IMovies, transactions: ITransaction[]) => {
    const remainingSeats: { [key: string]: number } = {};

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

app.get('/movies', (req: Request, res: Response) => {
    const { status, date, time } = req.query;

    const data = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));

    let moviesData = data.movies;

    if (!status && !date && !time) {
        moviesData = moviesData.map((movie: IMovies) => {
            return {
                ...movie,
                remaining_seats: calculateRemainingSeats(movie, data.transactions)
            };
        });
        return res.send({
            data: moviesData
        });
    }

    if (status) {
        moviesData = moviesData.filter((item: any) => item.status === status);
    }

    if (date) {
        moviesData = moviesData.filter((item: any) => item.date === date);
    }

    if (time) {
        moviesData = moviesData.filter((item: any) => item.time === time);
    }


    moviesData = moviesData.map((movie: IMovies) => {
        return {
            ...movie,
            remaining_seats: calculateRemainingSeats(movie, data.transactions)
        };
    });

    res.send({
        data: moviesData
    });
});

app.post('/transaction', (req: Request, res: Response) => {
    try {
        const { users_uid, movies_id, time, total_seat, date } = req.body;

        const data = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));

        const validation = validateTransaction(users_uid, movies_id, time, total_seat, date, data);
        if (!validation.valid) {
            throw new Error(validation.error || "Unknown Error");
        }

        let selectedMovie = null;
        data.movies.forEach((item:any) => {
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

        console.log(newTransaction)

        data.transactions.push(newTransaction);
        fs.writeFileSync('./db/db.json', JSON.stringify(data, null, 2));

        res.send({
            total_price: totalPrice,
            movies_id: movies_id,
            time: time,
            total_seat: total_seat,
            date: date
        });

    } catch (error:any) {
        res.status(404).send({
            error: error.message
        });
    }
});

function validateTransaction(users_uid: number, movies_id: any, time: any, total_seat: any, date: any, database:any){
    let moviesFound = false;
    let usersFound = false;
    let remainingSeats = 0;

    
    database.movies.forEach((movie: any) => {
        
        if (movie.id === movies_id && movie.release_date === date) {
            
            movie.time.forEach((movieTime: any) => {
                if (movieTime === time) {
                    moviesFound = true;
                    remainingSeats = movie.total_seat;
                }
            });
        }
    });

    
    if(database.transactions.length !==0){
        database.transactions.forEach((item:any) => {
            if (item.movies_id === movies_id && item.time === time && item.date === date) {
                remainingSeats -= item.total_seat;
            }
        });
    }


    database.users.forEach((item:any) => {
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
