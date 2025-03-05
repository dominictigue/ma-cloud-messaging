

export function SearchBar() {
    return (
        <div class="bg-white p-4 rounded-lg shadow-md mt-4 flex flex-col md:flex-row items-center justify-between border border-gray-200">
                <input class = "p-3 border rounded-lg w-full md:w-1/3 focus:ring-2 focus:ring-blue-500" type="text" id="search-input" placeholder="Search Order ID or Customer Name" ></input>
                <div class="flex space-x-2 mt-2 md:mt-0">
                    <select id="sort-filter" class="p-3 border rounded-lg bg-gray-100">
                        <option value="default">Sort / Filter Orders</option>
                        <option value="time">Order Time</option>
                        <option value="status">Order Status</option>
                        <option value="customer">Customer Name</option>
                    </select>
                    <button id="show-duplicates" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition">
                        Show Duplicates
                    </button>
                </div>
                
        </div>
    )
}