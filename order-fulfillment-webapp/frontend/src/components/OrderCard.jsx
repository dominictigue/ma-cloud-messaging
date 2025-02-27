import { Link } from "react-router-dom"

export function OrderCard({order}) {
    
    let dateTime = new Date(order.timestamp)
    let stringDateTime = dateTime.toString()

    return (
        <Link to={`/order/${order._id}`} className="order">
            <h3>Order# {order.order_id}</h3>
            <p><b>Customer:</b> {order.customer}</p>

            <p><b>Items</b></p>
            {order.items.map((orderitem) => {
                return (
                    <li>
                        {orderitem}
                    </li>
                )
            })}

            <p><b>Ordered on:</b> {stringDateTime.slice(4, 15)} <b>at</b> {stringDateTime.slice(16, 21)}</p>
        </Link>
    )
}