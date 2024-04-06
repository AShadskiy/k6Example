import {SharedArray} from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
import {scenario} from 'k6/execution';
import {
    pwaScenarioConfig,
    dmAdminScenarioConfig,
    smokeTestConfig,
    depositScenarioConfig, payoutScenarioConfig
} from "../helpers/scenarioConfigs.js";
import {
    depositOrderConfirm,
    dropActivate,
    dropDeactivate, dropTrackingOrders,
    logInToPwa,
    openArchiveOrdersPage,
    openOrdersPage
} from "../steps/pwaSteps.js";
import {randomIntBetween} from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import {sleep} from 'k6';
import * as config from '../config.js';
import {adminTrackingTickets, logInToDm, openTicketsPage} from "../steps/adminSteps.js";
import {createDeposit, createWithdrawal, getBanksPage, setBankForTheDeposit} from "../helpers/merchantService.js";
import {getRandomValue} from "../helpers/dataHelper.js";
import { vu } from 'k6/execution';
import {getTrackingDuration} from '../helpers/logicalHelper.js'
import {getOrdersQuery} from "../helpers/pwaService";

const dropUsers = new SharedArray('dropUsers', function () {
    return papaparse.parse(open('../dataManager/phone_credentials.csv'), {header: true}).data;
});

const dmAdmins = new SharedArray('dmAdmins', function () {
    return JSON.parse(open('../dataManager/data.json')).dmAdmins;
});

const bankCards = new SharedArray('bankCards', function () {
    const f = JSON.parse(open('../dataManager/data.json')).cards;
    return f;
});

const banks = new SharedArray('banks', function () {
    const f = JSON.parse(open('../dataManager/data.json')).banks;
    return f;
});

export const options = {
    scenarios: {
        loadTestPwaScenario: pwaScenarioConfig,
        dmAdminScenario: dmAdminScenarioConfig,
        loadTestDepositScenario: depositScenarioConfig,
        loadTestPayoutScenario: payoutScenarioConfig
    }
};

export async function loadTestPwaScenario() {

    const user = dropUsers[scenario.iterationInTest];

    sleep(randomIntBetween(1, 20));
    let pwaToken = await logInToPwa(user);
    sleep(randomIntBetween(1, 5));
    await dropActivate(pwaToken);
    sleep(randomIntBetween(1, 5));
    await openOrdersPage(pwaToken);
    sleep(randomIntBetween(1, 5));
    await openArchiveOrdersPage(pwaToken);
    sleep(randomIntBetween(1, 5));

    // Getting the start time of execution
    const startTime = new Date().getTime();
    // Perform the action within the specified time
    const duration = getTrackingDuration();
    while (new Date().getTime() - startTime < duration) {
        await dropTrackingOrders(pwaToken);
    }

    sleep(randomIntBetween(1, 5));
    await dropDeactivate(pwaToken);
}

export async function loadTestPwaScenario() {

    const user = dropUsers[scenario.iterationInTest];

    let pwaToken = await logInToPwa(user);
    await dropActivate(pwaToken);
    let orders = await getOrdersQuery(pwaToken);
    for (const order of orders) {
        await depositOrderConfirm(token, order.id, order.amount.value);
        await sleep(randomIntBetween(1, 5)); // Sleep after processing each order
    }
}

export async function dmAdminScenario() {
    const admin = dmAdmins[scenario.iterationInTest];

    let dmToken = await logInToDm(admin);
    sleep(randomIntBetween(1, 5));

    // Getting the lust ticket id
    let tickets = await openTicketsPage(dmToken);
    let markerTicketId = tickets[0].id;

    // Getting the start time of execution
    const startTime = new Date().getTime();
    // Perform the action within the specified time
    const duration = getTrackingDuration();
    while (new Date().getTime() - startTime < duration) {
        await adminTrackingTickets(dmToken, markerTicketId);
    }
}

export async function loadTestDepositScenario() {
    sleep(randomIntBetween(20, 30));
    var depositId = await createDeposit();
    await getBanksPage;
    sleep(1);
    let bank = getRandomValue(banks);
    await setBankForTheDeposit(depositId, bank);
}

export async function loadTestPayoutScenario() {
    sleep(randomIntBetween(20, 30));
    let cardNumber = getRandomValue(bankCards);
    await createWithdrawal(cardNumber);
}