import { getAuthHeader } from './authService';

const API_URL = 'http://localhost:3001/api';

export const checkIn = async (code) => {
    const response = await fetch(`${API_URL}/attendance/check-in`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
        },
        body: JSON.stringify({ code }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error confirming attendance');
    }

    return data;
};

export const getEventAttendees = async (eventId) => {
    const response = await fetch(`${API_URL}/attendance/events/${eventId}/attendees`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error fetching attendance list');
    }

    return data;
};
