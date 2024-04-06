import http from 'k6/http';
import {crypto as webcrypto} from "k6/experimental/webcrypto";
import crypto from 'k6/crypto';
import {FormData} from 'https://jslib.k6.io/formdata/0.0.2/index.js';
import * as config from '../config.js';

let baseUrl = `https://${config.ENV}.`;

function randomInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

function getSignature(payload) {
    return crypto.sha512(JSON.stringify(payload).replace(/\s/g, '') + '', `hex`);
}

export async function createDeposit() {
    const id = webcrypto.randomUUID();
    const data = {
    };

    const headers = {
        'Signature': `${getSignature(data)}`,
        'Content-Type': 'application/json',
    };

    let response = await http.asyncRequest('POST', `${baseUrl}`, JSON.stringify(data), {
        headers: headers,
    });
    return JSON.parse(response.body).invoiceId;
}

export async function getBanksPage(depositId) {
    const headers = {
        'Content-Type': 'application/json'
    };

    const response = await http.get(`${baseUrl}`);
}

export async function setBankForTheDeposit(depositId, randomBank) {
    const fd = new FormData();
    fd.append('', `${randomBank}`);

    const headers = {
        'Content-Type': 'multipart/form-data'
    };

    const response = await http.post(`${baseUrl}`, fd.body(), {
        headers: {'Content-Type': 'multipart/form-data; boundary=' + fd.boundary},
    });
}

export async function createWithdrawal(cardNumber) {
    const myUUID = webcrypto.randomUUID();
    let payoutAmount = config.PAYOUT_AMOUNTS[Math.floor(Math.random() * config.PAYOUT_AMOUNTS.length)];
    const data = {
    };

    const headers = {
        'Signature': `${getSignature(data)}`,
        'Content-Type': 'application/json',
    };

    let response = await http.asyncRequest('POST', `${baseUrl}`, JSON.stringify(data), {
        headers: headers,
    });
}