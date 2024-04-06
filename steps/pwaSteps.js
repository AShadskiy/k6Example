import {
    depositOrderConfirmQuery, dropActivateQuery, dropDeactivateQuery,
    getDropQuery,
    getOrdersArchiveQuery,
    getOrdersQuery,
    getProfileQuery,
    getPwaToken, payoutOrderConfirmQuery, payoutOrderFailQuery
} from "../helpers/pwaService.js";
import * as constants from "../dataManager/constants.js";
import * as config from "../config.js";
import {randomIntBetween} from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import {sleep} from 'k6';
import {changeReceivedAmount, getRandomBoolean} from "../helpers/logicalHelper.js";


export async function logInToPwa(user) {
    let pwaToken = await getPwaToken(user);
    await getProfileQuery(pwaToken);
    await getDropQuery(pwaToken);
    return pwaToken;
}

export async function openOrdersPage(token) {
    await getProfileQuery(token);
    await getOrdersQuery(token);
}

export async function openArchiveOrdersPage(token) {
    await getOrdersArchiveQuery(token);
}

export async function dropDeactivate(token) {
    await dropDeactivateQuery(token);
    await getDropQuery(token);
}

export async function dropActivate(token) {
    await dropActivateQuery(token);
    await getDropQuery(token);
}

export async function payoutOrderConfirm(token, orderId) {
    await payoutOrderConfirmQuery(token, orderId);
    await getDropQuery(token);
    await getOrdersQuery(token);
}

export async function payoutOrderFail(token, orderId) {
    await payoutOrderFailQuery(token, orderId);
    await getDropQuery(token);
    await getOrdersQuery(token);
}

export async function depositOrderConfirm(token, orderId, amount) {
    await depositOrderConfirmQuery(token, orderId, amount);
    await getDropQuery(token);
    await getOrdersQuery(token);
}

export async function dropTrackingOrders(token) {
    let orders = await getOrdersQuery(token);
    sleep(randomIntBetween(1, 10));
    for (const order of orders) {
        await handlePayoutStatus(token, order);
        await handleDepositStatus(token, order);
        await sleep(randomIntBetween(1, 5)); // Sleep after processing each order
    }
}

async function handlePayoutStatus(token, order) {
    if (order.payoutStatus === constants.PENDING_STATUS) {
        sleep(randomIntBetween(1, 10));
        let isSuccessfully = getRandomBoolean(config.PERCENT_OF_SUCCESS);
        const action = isSuccessfully ? payoutOrderConfirm : payoutOrderFail;
        await action(token, order.id);
    }
}

async function handleDepositStatus(token, order) {
    if (order.depositStatus === constants.PENDING_STATUS) {
        sleep(randomIntBetween(1, 10));
        let receivedAmount = order.amount.value;
        let isSuccessfully = getRandomBoolean(config.PERCENT_OF_SUCCESS);
        if (!isSuccessfully) {
            let offset = 0.05;
            if (!getRandomBoolean(config.PERCENT_OF_SUCCESS)) {
                offset = 0.15;
            }
            receivedAmount = changeReceivedAmount(order.amount.value, offset);
        }
        await depositOrderConfirm(token, order.id, receivedAmount);
    }
}