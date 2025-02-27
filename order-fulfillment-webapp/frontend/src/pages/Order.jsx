import { getOrder } from "../api"
import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

export function Order() {

    const [order, setOrder] = useState({})

    let params = useParams()
    const navigate = useNavigate()
    let id = params.id

    useEffect(() => {
        async function loadOrder() {
            let data = await getOrder(id)
            let date = new Date(data.timestamp)
            data.timestamp = date.toString()
            setOrder(data)
        }
        loadOrder()
    }, [])

    return (
        <div>
            <button onClick={() => navigate(-1)}>Back</button>

            <h3>Order# {order.order_id}</h3>
            <p><b>Customer:</b> {order.customer}</p>

            <p><b>Items</b></p>
            {order.items?.map((orderitem) => {
                return (
                    <li>
                        {orderitem}
                    </li>
                )
            })}

            <p><b>Ordered on:</b> {order.timestamp?.slice(4, 15)} <b>at</b> {order.timestamp?.slice(16, 21)}</p>

        </div>
    )
}