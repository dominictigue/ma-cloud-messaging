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
        <div className="mt-6 ml-12 mr-12">
            <div class="bg-white p-4 rounded-lg shadow-md mt-4 flex flex-col md:flex-row items-center border border-gray-200 justify-left">
                <button className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg transition" onClick={() => navigate(-1)}>Back</button>
                <p className="text-lg font-semibold ml-6 mr-10">Order# {order.order_id}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 transform transition mt-6 justify-left">
                <div className="grid grid-cols-2 gap-4 max-w-md p-1">
                    <p className="font-semibold text-gray-700">ID</p>
                    <p className="text-gray-900 text-gray-900 border border-gray-200 rounded-lg p-4 bg-white">{order.message_id}</p>
                    
                    <p className="font-semibold text-gray-700">Customer</p>
                    <p className="text-gray-900 text-gray-900 border border-gray-200 rounded-lg p-4 bg-white">{order.customer}</p>

                    <p className="font-semibold text-gray-700">Order Date</p>
                    <p className="text-gray-900 border border-gray-200 rounded-lg p-4 bg-white">{order.timestamp?.slice(4, 15)}</p>

                    <p className="font-semibold text-gray-700">Order Time</p>
                    <p className="text-gray-900 border border-gray-200 rounded-lg p-4 bg-white">{order.timestamp?.slice(16, 21)}</p>
                </div>
                <div className="max-w-md p-1">
                    <p className="font-semibold text-gray-700 mb-3">Items</p>
                    {order.items?.map((orderitem) => {
                        return (
                            <p className="text-gray-900 border border-gray-200 rounded-lg p-4 bg-white mb-2">
                                {orderitem}
                            </p>
                        )
                    })}  
                </div>
            </div>
        </div>
    )
}