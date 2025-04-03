import { getOrders } from "../api"
import { useState, useEffect } from "react"
import { OrderCard } from "../components/OrderCard"
import { SearchBar } from "../components/SearchBar"

export function Home() {

    const [orders, setOrders] = useState([])
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOption, setSortOption] = useState("default");
    const [dupeFilter, setDupeFilter] = useState("showDupes");
    const [dateFilter, setDateFilter] = useState("default");


    useEffect(() => {
        console.log("Fetching orders with:", { searchQuery, sortOption, dupeFilter, dateFilter});
        async function fetchOrders() {
            try {
                const fetchedOrders = await getOrders({
                    searchQuery,
                    sortOption,
                    dupeFilter,
                    dateFilter,
                });
                setOrders(fetchedOrders);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        }
        fetchOrders();
    }, [searchQuery, sortOption, dupeFilter, dateFilter]); // Dependencies trigger re-fetch

    return (
        <div>
            <div className = "ml-12 mr-12">
                <SearchBar
                onSearch={setSearchQuery}
                onSortChange={setSortOption}
                onDupeFilterChange={setDupeFilter}
                onDateChange={setDateFilter}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 ml-10 mr-10">
                {orders.map((order) => {
                    return (
                        <OrderCard key={order.id || order._id} order={order} />
                    )
                })}
            </div>
        </div>
    )
}