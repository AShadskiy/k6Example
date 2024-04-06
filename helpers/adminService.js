import http from 'k6/http';
import * as config from '../config.js';
import {getGraphQlHeaders} from "./dataHelper.js";
import {check} from 'k6';

const authUrl = `https://${config.ENV}.`;
const baseUrl = `https://${config.ENV}.`;

const queries = JSON.parse(open('../dataManager/tacQueries.json')).queries;

export async function getDmToken(admin) {
    const data = {
    };

    let response = await http.asyncRequest('POST', authUrl, JSON.stringify(data), {
        headers: {'Content-Type': 'application/json'},
    });

    check(response, {
        "": (response) => JSON.parse(response.body).token !== undefined,
    });

    return JSON.parse(response.body).token;
}

export async function getTicketsQuery(token) {
    // Define your GraphQL query
    const query = queries.getTickets;

    // Define variables
    const variables = {

    };

    // Set headers for the GraphQL request
    const headers = getGraphQlHeaders(token);

    // Make the GraphQL POST request
    const response = http.post(baseUrl, JSON.stringify({query, variables}), {headers});

    // Check response body
    check(response, {
        "": (response) => JSON.parse(response.body).data.tickets !== undefined,
    });

    return JSON.parse(response.body).data.tickets.items;
}

export async function getTicketQuery(token, ticketId) {
    // Define your GraphQL query
    const query = queries.getTicket;

    // Define variables
    const variables = {
    };

    // Set headers for the GraphQL request
    const headers = getGraphQlHeaders(token);

    // Make the GraphQL POST request
    const response = http.post(baseUrl, JSON.stringify({query, variables}), {headers});
    // Check response body
    check(response, {
        "": (response) => JSON.parse(response.body).data.ticket !== undefined,
    });
    return JSON.parse(response.body).data.ticket;
}

export async function ticketTransitionQuery(token, ticketId, transition) {
    // Define your GraphQL query
    const query = queries.ticketTransition;

    // Define variables
    const variables = {
    };

    // Set headers for the GraphQL request
    const headers = getGraphQlHeaders(token);

    // Make the GraphQL POST request
    const response = http.post(baseUrl, JSON.stringify({query, variables}), {headers});

    // Check response body
    check(response, {
        "": (response) => JSON.parse(response.body).data.applyTicketTransition === true,
    });
}

export async function payoutOrderTransitionQuery(token, orderId, transition) {
    // Define your GraphQL query
    const query = queries.payoutOrderTransition;

    // Define variables
    const variables = {
    };

    // Set headers for the GraphQL request
    const headers = getGraphQlHeaders(token);

    // Make the GraphQL POST request
    const response = http.post(baseUrl, JSON.stringify({query, variables}), {headers});

    // Check response body
    check(response, {
        "": (response) => JSON.parse(response.body).data.applyPayoutOrderTransition === true,
    });
}

export async function depositOrderTransitionQuery(token, orderId, transition) {
    // Define your GraphQL query
    const query = queries.depositOrderTransition;

    // Define variables
    const variables = {
    };

    // Set headers for the GraphQL request
    const headers = getGraphQlHeaders(token);

    // Make the GraphQL POST request
    const response = http.post(baseUrl, JSON.stringify({query, variables}), {headers});

    // Check response body
    check(response, {
        "": (response) => JSON.parse(response.body).data.applyDepositOrderTransition === true,
    });
}

export async function depositOrderToPayQuery(token, orderId, receivedAmount) {
    // Define your GraphQL query
    const query = queries.depositOrderToPay;

    // Define variables
    const variables = {
    };

    // Set headers for the GraphQL request
    const headers = getGraphQlHeaders(token);

    // Make the GraphQL POST request
    const response = http.post(baseUrl, JSON.stringify({query, variables}), {headers});
    // Check response body
    check(response, {
        "": (response) => JSON.parse(response.body).data.depositOrderToPay === true,
    });
}