import axios from "axios";

const URL = "http://localhost:3000"

// Retrieve All with Filters
export async function getOrders({ searchQuery, sortOption, dupeFilter }) {
    console.log("Sending request with:", { searchQuery, sortOption, dupeFilter });
    
    const params = {
        searchQuery,
        sortOption,
        dupeFilter,
    };

    const response = await axios.get(`${URL}/orders`, { params });

    if (response.status === 200) {
        return response.data;
    } else {
        return;
    }
}

// Retrieve One
export async function getOrder(id) {
    const response = await axios.get(`${URL}/orders/${id}`)

    if (response.status === 200) {
        return response.data
    } else {
        return
    } 
}

// Create One
export async function createOrder(order) {
    const response = await axios.post(`${URL}/orders`, order)
    return response
}

// Update One
export async function updateOrder(id, order) {
    const response = await axios.put(`${URL}/orders/${id}`, order)
    return response
}

// Delete One
export async function deleteOrder(id) {
    const response = await axios.delete(`${URL}/orders/${id}`)
    return response
}