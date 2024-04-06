import {
    createDeposit,
    createWithdrawal,
    setBankForTheDeposit,
    getBanksPage
} from '../helpers/merchantService.js';
import {getRandomValue} from '../helpers/dataHelper.js';
import {smokeTestConfig} from '../helpers/scenarioConfigs.js';
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
        smokeTestScenario: smokeTestConfig
    }
};

export async function smokeTestScenario() {
    var depositId = await createDeposit();
    await getBanksPage;
    sleep(1);
    let bank = getRandomValue(banks);
    await setBankForTheDeposit(depositId, bank);

    let cardNumber = getRandomValue(data);
    await createWithdrawal(cardNumber);
}