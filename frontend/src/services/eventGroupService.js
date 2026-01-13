import { getAuthHeader } from './authService';

const API_URL = 'http://localhost:3001/api';

export const getAll = async () => {
    const response = await fetch(`${API_URL}/event-groups`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error fetching event groups');
    }

    return data;
};

export const getById = async (id) => {
    const response = await fetch(`${API_URL}/event-groups/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error fetching event group');
    }

    return data;
};

export const create = async (groupData) => {
    const response = await fetch(`${API_URL}/event-groups`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
        },
        body: JSON.stringify(groupData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error creating event group');
    }

    return data;
};

export const update = async (id, groupData) => {
    const response = await fetch(`${API_URL}/event-groups/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
        },
        body: JSON.stringify(groupData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error updating event group');
    }

    return data;
};

export const remove = async (id) => {
    const response = await fetch(`${API_URL}/event-groups/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error deleting event group');
    }

    return data;
};
