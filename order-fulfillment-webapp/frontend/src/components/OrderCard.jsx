import { Link } from "react-router-dom"

export function OrderCard({order}) {
    
    let dateTime = new Date(order.timestamp)
    let stringDateTime = dateTime.toString()

    return (
        <Link to={`/order/${order._id}`} className="bg-white p-6 rounded-xl shadow-lg border border-gray-300 transform transition hover:scale-105">
            <h3 className="text-lg font-semibold text-gray-800">Order# {order.order_id}</h3>
            <p className="text-sm text-gray-500"><b>ID:</b> {order.message_id}</p>
            <p className="text-gray-600">{order.customer} - {order.items.length} Items</p>
            <p className="text-sm text-gray-500">{stringDateTime.slice(4, 15)} <b>at</b> {stringDateTime.slice(16, 21)}</p>
            {order.isDuplicate === true &&
                <span class="bg-red-100 text-red-800 text-sm font-semibold px-3 py-1 rounded-lg">Duplicate</span>
            }
            
        </Link>
    )
}