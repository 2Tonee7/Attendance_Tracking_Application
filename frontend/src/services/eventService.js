import { getAuthHeader } from './authService';

const API_URL = 'http://localhost:3001/api';

export const getAll = async () => {
    const response = await fetch(`${API_URL}/events`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error fetching events');
    }

    return data;
};

export const getById = async (id) => {
    const response = await fetch(`${API_URL}/events/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error fetching event');
    }

    return data;
};

export const create = async (eventData) => {
    const response = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
        },
        body: JSON.stringify(eventData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error creating event');
    }

    return data;
};

export const update = async (id, eventData) => {
    const response = await fetch(`${API_URL}/events/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
        },
        body: JSON.stringify(eventData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error updating event');
    }

    return data;
};

export const remove = async (id) => {
    const response = await fetch(`${API_URL}/events/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error deleting event');
    }

    return data;
};

export const calculateStatus = (startTime, endTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now < start) return 'CLOSED';
    if (now >= start && now <= end) return 'OPEN';
    return 'CLOSED';
};
