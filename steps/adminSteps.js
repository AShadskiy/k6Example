import {
    depositOrderToPayQuery, depositOrderTransitionQuery,
    getDmToken,
    getTicketQuery,
    getTicketsQuery,
    payoutOrderTransitionQuery,
    ticketTransitionQuery
} from "../helpers/adminService.js";
import {ORDER_CANCEL_TRANSITION} from "../dataManager/constants.js";
import * as constants from "../dataManager/constants.js";
import {getRandomBoolean} from "../helpers/logicalHelper.js";
import * as config from "../config.js";
import {randomIntBetween} from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import {sleep} from 'k6';

export async function logInToDm(admin) {
    let dmToken = await getDmToken(admin);
    return dmToken;
}

export async function openTicketsPage(token) {
    return await getTicketsQuery(token);
}

export async function openTicketPage(token, ticketId) {
    return await getTicketQuery(token, ticketId);
}

export async function doTicketTransition(token, ticketId, transition) {
    await ticketTransitionQuery(token, ticketId, transition);
    await getTicketQuery(token, ticketId);
}

export async function doPayoutOrderTransition(token, orderId, transition, ticketId) {
    await payoutOrderTransitionQuery(token, orderId, transition);
    await getTicketQuery(token, ticketId);
}

export async function markDepositOrderAsCanceled(token, orderId, ticketId) {
    await depositOrderTransitionQuery(token, orderId, ORDER_CANCEL_TRANSITION);
    await getTicketQuery(token, ticketId);
}

export async function markDepositOrderAsPayed(token, orderId, receivedAmount, ticketId) {
    await depositOrderToPayQuery(token, orderId, receivedAmount);
    await getTicketQuery(token, ticketId);
}

export async function adminTrackingTickets(token, markerTicketId) {
    let tickets = await getTicketsQuery(token);
    sleep(randomIntBetween(1, 10));
    tickets = await getTicketsQuery(token);

    for (const ticket of tickets) {
        if (ticket.id === markerTicketId) {
            break;
        } else if (ticket.status === constants.PENDING_STATUS.toUpperCase()) {
            await handleTicket(token, ticket);
        }

        sleep(randomIntBetween(1, 10));
    }
}

async function handleTicket(token, ticket) {
    let sourceTicket = await openTicketPage(token, ticket.id);
    sleep(randomIntBetween(1, 10));
    await doTicketTransition(token, sourceTicket.id, constants.TICKET_TO_WORK_TRANSITION);
    if (sourceTicket.depositOrder !== undefined) {
        await handleDepositOrder(token, ticket.depositOrder, sourceTicket.id);
    } else if (sourceTicket.payoutOrder !== undefined) {
        await handlePayoutOrder(token, sourceTicket.payoutOrder, sourceTicket.id);
    }
    await doTicketTransition(token, sourceTicket.id, constants.TICKET_TO_FINISH_TRANSITION);
    sleep(randomIntBetween(1, 10));
}

async function handlePayoutOrder(token, order, ticketId) {
    sleep(randomIntBetween(1, 10));
    let isSuccessfully = getRandomBoolean(config.PERCENT_OF_SUCCESS);
    const orderTransition = isSuccessfully ? constants.ORDER_PAY_TRANSITION : constants.ORDER_EXPIRE_TRANSITION;
    await doPayoutOrderTransition(token, order.id, orderTransition, ticketId);
}

async function handleDepositOrder(token, order, ticketId) {
    sleep(randomIntBetween(1, 10));
    let isSuccessfully = getRandomBoolean(config.PERCENT_OF_SUCCESS);
    if (isSuccessfully) {
        await markDepositOrderAsPayed(token, order.id, order.paidAmount.value, ticketId)
    } else {
        await markDepositOrderAsCanceled(token, order.id, ticketId);
    }
}
