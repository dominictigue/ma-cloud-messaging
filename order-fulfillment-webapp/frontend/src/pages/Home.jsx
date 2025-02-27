import { getOrders } from "../api"
import { useState, useEffect } from "react"
import { OrderCard } from "../components/OrderCard"

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
        <div className = "orders">
            {orders.map((order) => {
                return (
                    <OrderCard order={order}/>
                )
            })}
        </div>
    )
}