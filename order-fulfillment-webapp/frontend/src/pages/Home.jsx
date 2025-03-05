import { getOrders } from "../api"
import { useState, useEffect } from "react"
import { OrderCard } from "../components/OrderCard"
import { SearchBar } from "../components/SearchBar"

export function Home() {

    const [orders, setOrders] = useState([])

    useEffect(() => {
        async function loadAllOrders() {
            const data = await getOrders()
            data.sort((d1, d2) => new Date(d2.timestamp).getTime() - new Date(d1.timestamp).getTime())
            setOrders(data) 
        }
        loadAllOrders()
    }, [])

    return (
        <div>
            <div className = "ml-12 mr-12">
                <SearchBar/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 ml-10 mr-10">
                {orders.map((order) => {
                    return (
                        <OrderCard order={order}/>
                    )
                })}
            </div>
        </div>
    )
}