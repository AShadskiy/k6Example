import {
    createDeposit,
    createWithdrawal,
    setBankForTheDeposit,
    getBanksPage
} from '../helpers/merchantService.js';
import {getRandomValue} from '../helpers/dataHelper.js';
import {depositScenarioConfig, payoutScenarioConfig} from '../helpers/scenarioConfigs.js';
import {randomIntBetween} from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import {sleep} from 'k6';
import {SharedArray} from 'k6/data';

const data = new SharedArray('bankCards', function () {
    const f = JSON.parse(open('../dataManager/data.json')).cards;
    return f;
});

const banks = new SharedArray('banks', function () {
    const f = JSON.parse(open('../dataManager/data.json')).banks;
    return f;
});

export const options = {
    scenarios: {
        loadTestDepositScenario: depositScenarioConfig,
        loadTestPayoutScenario: payoutScenarioConfig
    }
};

export async function loadTestDepositScenario() {
    sleep(randomIntBetween(1, 5));
    var depositId = await createDeposit();
    await getBanksPage;
    sleep(1);
    let bank = getRandomValue(banks);
    await setBankForTheDeposit(depositId, bank);
}

export async function loadTestPayoutScenario() {
    sleep(randomIntBetween(1, 5));
    let cardNumber = getRandomValue(data);
    await createWithdrawal(cardNumber);
}