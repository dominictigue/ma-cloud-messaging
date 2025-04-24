import { useState } from "react";

export function SearchBar({onSearch, onSortChange, onDupeFilterChange, onDateChange}) {
    
    const [selectedOption, setSelectedOption] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [dateFilterOption, setDateFilterOption] = useState("");
    const [customStartDate, setCustomStartDate] = useState("");
    const [customEndDate, setCustomEndDate] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");

    const dupeFilterColors = {
        showDupes: "bg-red-200 text-red-800 hover:bg-red-300",
        hideDupes: "bg-green-200 text-green-800 hover:bg-green-300"
    };

    const dateFilterStyles = {
        default: "w-18",
        today: "w-auto", 
        yesterday: "w-auto",
        lastWeek: "w-auto",
        lastMonth: "w-auto",
        custom: "w-auto",
    };

    const toggleSortOrder = () => {
        const newOrder = sortOrder === "asc" ? "desc" : "asc";
        setSortOrder(newOrder);
        
        if (selectedOption) {
            onSortChange(`${selectedOption}:${newOrder}`);
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md mt-4 flex flex-wrap items-center border border-gray-200 gap-x-2 gap-y-2">
            {/* Search Input */}
            <input
                className="p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 flex-1 min-w-[200px]"
                type="text"
                id="search-input"
                placeholder="Search for Order #, Customer name, etc."
                value={searchInput}
                onChange={(e) => {
                    setSearchInput(e.target.value);
                    onSearch(e.target.value);
                }}
            />

            {/* Search Button */}
            <button
                className="p-3 rounded border rounded-lg bg-blue-600 text-white border-black hover:bg-blue-500"
                onClick={() => {
                    console.log("Search button clicked with input:", searchInput);
                    onSearch(searchInput);
                }}
            >
                Search
            </button>

            <div className="flex-1"></div>

            {/* Date Filter */}
            <select
                id="date-filter"
                className={`p-3 w-18 focus:w-auto border border-gray-400 rounded-lg bg-gray-100 hover:bg-gray-200 ${dateFilterStyles[dateFilterOption] || "w-18"}`}
                onChange={(e) => {
                    console.log("date filter option changed to:", e.target.value);
                    setDateFilterOption(e.target.value);
            
                    if (e.target.value === "custom") {
                        // Apply previously entered custom dates instantly
                        const combinedDates = `${customStartDate},${customEndDate}`;
                        console.log("Applying previously entered custom dates:", combinedDates);
                        onDateChange(combinedDates);
                    } else {
                        onDateChange(e.target.value);
                    }
                }}
            >
                <option className="text-gray-500" value="default">📅</option>
                <option className="bg-gray-100" value="today">Today</option>
                <option className="bg-gray-100" value="yesterday">Yesterday</option>
                <option className="bg-gray-100" value="lastWeek">Last Week</option>
                <option className="bg-gray-100" value="lastMonth">Last Month</option>
                <option className="bg-gray-100" value="custom">Custom</option>
            </select>

            {/* Conditional Custom Date Input */}
            {dateFilterOption === "custom" && (
                <div className="flex items-center gap-x-2">
                    <input
                        type="date"
                        className="p-3 border border-gray-400 rounded-lg bg-gray-100 hover:bg-gray-200"
                        value={customStartDate}
                        onChange={(e) => {
                            setCustomStartDate(e.target.value);
                            const combinedDates = `${e.target.value},${customEndDate}`;
                            console.log("Custom start date selected:", e.target.value);
                            onDateChange(combinedDates);
                        }}
                    />
                    <span className="text-gray-500">to</span>
                    <input
                        type="date"
                        className="p-3 border border-gray-400 rounded-lg bg-gray-100 hover:bg-gray-200"
                        value={customEndDate}
                        onChange={(e) => {
                            setCustomEndDate(e.target.value);
                            const combinedDates = `${customStartDate},${e.target.value}`;
                            console.log("Custom end date selected:", e.target.value);
                            onDateChange(combinedDates);
                        }}
                    />
                </div>
            )}

            {/* Sort Filter */}
            <select
                id="sort-filter"
                className="p-3 border border-gray-400 rounded-lg bg-gray-100 hover:bg-gray-200"
                onChange={(e) => {
                    const field = e.target.value;
                    setSelectedOption(field);

                    if (field) {
                        onSortChange(`${field}:${sortOrder}`);
                    }
                }}
            >
                <option className="bg-gray-100 text-gray-500" value="default">Sort by:</option>
                <option className="bg-gray-100" value="time">Order Time</option>
                <option className="bg-gray-100" value="orderNum">Order #</option>
                <option className="bg-gray-100" value="customer">Customer Name</option>
                <option className="bg-gray-100" value="itemCount"># of Items</option>
            </select>
            
            {/* Sort Order Toggle */}
            <button
                    className={`p-2 rounded-lg border ${
                        sortOrder === "asc" ? "p-2 border border-gray-400 rounded-lg bg-gray-100 hover:bg-gray-200" : "p-2 border border-gray-400 rounded-lg bg-gray-100 hover:bg-gray-200"
                    }`}
                    onClick={toggleSortOrder}
                >
                    {sortOrder === "asc" ? "▲" : "▼"}
                </button>

            {/* Duplicate Filter */}
            <select
                id="show-duplicates"
                className={`p-3 rounded-lg border ${dupeFilterColors[selectedOption] || "bg-red-200 text-red-700 hover:bg-red-300"}`}
                value={selectedOption}
                onChange={(e) => {
                    console.log("Duplicate filter option changed to:", e.target.value);
                    setSelectedOption(e.target.value);
                    onDupeFilterChange(e.target.value);
                }}
            >
                <option className="bg-gray-100 text-black" value="showDupes">Show Duplicates</option>
                <option className="bg-gray-100 text-black" value="hideDupes">Hide Duplicates</option>
            </select>
        </div>
    )
}