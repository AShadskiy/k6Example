import http from 'k6/http';
import * as config from '../config.js';
import {getGraphQlHeaders} from './dataHelper.js';
import {check} from 'k6';

let baseUrl = `https://${config.ENV}.tstdrm.com/graphql/site`;

const queries = JSON.parse(open('../dataManager/pwaQueries.json')).queries;

export async function getPwaToken(user) {
    const data = {
    };

    let response = await http.asyncRequest('POST', `${baseUrl}`, JSON.stringify(data), {
        headers: {'Content-Type': 'application/json'},
    });

    // Check response body
    check(response, {
        "": (response) => JSON.parse(response.body).token !== undefined,
    });

    return JSON.parse(response.body).token;
}

export async function getProfileQuery(token) {
    // Define your GraphQL query
    const query = queries.getProfile;

    // Set headers for the GraphQL request
    const headers = getGraphQlHeaders(token);

    // Make the GraphQL POST request
    const response = http.post(baseUrl, JSON.stringify({query}), {headers});

    // Check response body
    check(response, {
        "": (response) => JSON.parse(response.body).data.drop !== undefined,
    });
}

export async function getDropQuery(token) {
    // Define your GraphQL query
    const query = queries.getDrop;

    // Set headers for the GraphQL request
    const headers = getGraphQlHeaders(token);

    // Make the GraphQL POST request
    const response = http.post(baseUrl, JSON.stringify({query}), {headers});

    // Check response body
    check(response, {
        "": (response) => JSON.parse(response.body).data.drop !== undefined,
    });
}

export async function dropActivateQuery(token) {
    // Define your GraphQL query
    const query = queries.dropActivate;

    // Set headers for the GraphQL request
    const headers = getGraphQlHeaders(token);

    // Make the GraphQL POST request
    const response = http.post(baseUrl, JSON.stringify({query}), {headers});

    // Check response body
    check(response, {
        "": (response) => JSON.parse(response.body).data.dropActivate === true,
    });
}

export async function dropDeactivateQuery(token) {
    // Define your GraphQL query
    const query = queries.dropDeactivate;

    // Set headers for the GraphQL request
    const headers = getGraphQlHeaders(token);

    // Make the GraphQL POST request
    const response = http.post(baseUrl, JSON.stringify({query}), {headers});

    // Check response body
    check(response, {
        "": (response) => JSON.parse(response.body).data.dropDeactivate === true,
    });
}

export async function getOrdersQuery(token) {
    // Define your GraphQL query
    const query = queries.getOrders;

    // Define variables
    const variables = {
    };

    // Set headers for the GraphQL request
    const headers = getGraphQlHeaders(token);

    // Make the GraphQL POST request
    const response = http.post(baseUrl, JSON.stringify({query, variables}), {headers});

    // Check response body
    check(response, {
        "": (response) => JSON.parse(response.body).data.orders !== undefined,
    });

    return JSON.parse(response.body).data.orders.items
}

export async function getOrdersArchiveQuery(token) {
    // Define your GraphQL query
    const query = queries.getOrdersArchive;

    // Define variables
    const variables = {
    };

    // Set headers for the GraphQL request
    const headers = getGraphQlHeaders(token);

    // Make the GraphQL POST request
    const response = http.post(baseUrl, JSON.stringify({query, variables}), {headers});

    // Check response body
    check(response, {
        "": (response) => JSON.parse(response.body).data.ordersArchive !== undefined,
    });
}

export async function payoutOrderConfirmQuery(token, orderId) {
    // Define your GraphQL query
    const query = queries.payoutOrderConfirm;

    // Define variables
    const variables = {
    };

    // Set headers for the GraphQL request
    const headers = getGraphQlHeaders(token);

    // Make the GraphQL POST request
    const response = http.post(baseUrl, JSON.stringify({query, variables}), {headers});

    // Check response body
    check(response, {
        "": (response) => JSON.parse(response.body).data.payoutOrderConfirm === true,
    });
}

export async function payoutOrderFailQuery(token, orderId) {
    // Define your GraphQL query
    const query = queries.payoutOrderConfirm;

    // Define variables
    const variables = {
    };

    // Set headers for the GraphQL request
    const headers = getGraphQlHeaders(token);

    // Make the GraphQL POST request
    const response = http.post(baseUrl, JSON.stringify({query, variables}), {headers});

    // Check response body
    check(response, {
        "": (response) => JSON.parse(response.body).data.payoutOrderConfirm === true,
    });
}

export async function depositOrderConfirmQuery(token, orderId, amount) {
    // Define your GraphQL query
    const query = queries.depositOrderConfirm;

    // Define variables
    const variables = {
    };

    // Set headers for the GraphQL request
    const headers = getGraphQlHeaders(token);

    // Make the GraphQL POST request
    const response = http.post(baseUrl, JSON.stringify({query, variables}), {headers});
    console.log(response);
    // Check response body
    check(response, {
        "": (response) => JSON.parse(response.body).data.depositOrderConfirm !== undefined
    });
}