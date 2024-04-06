const dataHelpers = {
    getRandomValue: (cards) => {
        return cards[Math.floor(Math.random() * cards.length)];
    }
}

export const getRandomValue = dataHelpers.getRandomValue;

export function getGraphQlHeaders(token) {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
}
