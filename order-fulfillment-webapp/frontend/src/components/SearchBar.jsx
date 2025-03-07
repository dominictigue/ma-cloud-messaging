import { useState } from "react";

export function SearchBar() {
    
    const [selectedOption, setSelectedOption] = useState("");

    const dupeFilterColors = {
        showDupes: "bg-red-200 text-red-800 hover:bg-red-300",
        hideDupes: "bg-green-200 text-green-800 hover:bg-green-300"
    };
    
    
    return (
        <div class="bg-white p-4 rounded-lg shadow-md mt-4 flex flex-col md:flex-row items-center justify-between border border-gray-200">
                
                <div className="flex space-x-2 mt-2 md:mt-0 w-full">
                    <input class="p-3 w-1/3 border border-gray-400 rounded-lg  focus:ring-2 focus:ring-blue-500" type="text" id="search-input" placeholder="Search for Order #, Customer name, etc." ></input>

                    <button className="p-3 rounded border rounded-lg bg-blue-600 text-white border-black hover:bg-blue-500">
                        Search
                    </button>
                </div>
                
                <div class="flex space-x-2 mt-2 md:mt-0">
                    <select id="sort-filter" class="p-3 border border-gray-400 rounded-lg bg-gray-100">
                        <option class="text-gray-500" value="default">Sort by:</option>
                        <option value="time">Order Time</option>
                        <option value="time">Order #</option>
                        <option value="status">Customer Name</option>
                        <option value="customer"># of Items</option>
                    </select>
                    
                    <select id="show-duplicates" 
                        className={`p-2 rounded border rounded-lg ${dupeFilterColors[selectedOption] || "bg-red-200 text-red-700 hover:bg-red-300"}`}
                        value={selectedOption}
                        onChange={(e) => setSelectedOption(e.target.value)}
                    >
                        <option class="bg-gray-100 text-black" value="showDupes">Show Duplicates</option>
                        <option class="bg-gray-100 text-black" value="hideDupes">Hide Duplicates</option>
                    </select>
                </div>
                
        </div>
    )
}