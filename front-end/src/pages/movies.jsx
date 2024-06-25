import { useEffect, useState } from "react";
import axios from 'axios';

export default function MoviesPage() {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/movies');
                console.log(response)
                setData(response.data.data);
            } catch (error) {
                console.error("There was an error fetching the data!", error);
            }
        };

        fetchData();
    }, []);


    return (
        <>
            <div>
                <div>Filter</div>
                <button>Status</button>
                <button>Time</button>
                <button>Date</button>
            </div>
            <div>
                
                <div className="grid grid-cols-5 gap-4">
                    {
                        data.map((item) => {
                            return (
                                <div key={item.id} id="card" className="w-20 border p-2">
                                    <img src={item.image_url} alt={item.title} className="w-full h-32 object-cover" />
                                    <div>{item.title}</div>
                                    <div>{new Date(item.release_date).toLocaleDateString()}</div>
                                    <div>{item.status}</div>
                                    <div>{item.genre}</div>
                                    {
                                        item.time.map((time) => (
                                            <button key={time} className="m-1">{time}</button>
                                        ))
                                    }
                                    <div>Remaining Seats: {item.remaining_seats}</div>
                                    <div>Price: ${item.price}</div>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        </>
    );
}
