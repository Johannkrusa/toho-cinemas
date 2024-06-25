export interface IUser {
    uid?: number,
    username: string,
    email: string,
    password: string,
    role?:string
}

export interface IMovies {
    id: number,
    title: string,
    release_date: Date,
    genre: string,
    status: "ON SHOW" | "UPCOMING",
    total_seat: number,
    time: [string],
    price: number
}

export interface ITransaction {
    users_uid: number,
    movies_id: number,
    time: string,
    total_seat: number,
    date: Date
}