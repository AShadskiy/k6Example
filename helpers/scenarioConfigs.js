import * as config from '../config.js';
import {SharedArray} from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
import {MAX_DURATION} from "../config.js";

const dropUsers = new SharedArray('dropUsers', function () {
    return papaparse.parse(open('../dataManager/phone_credentials.csv'), {header: true}).data;
});

const dmAdmins = new SharedArray('dmAdmins', function () {
    return JSON.parse(open('../dataManager/data.json')).dmAdmins;
});

const scenarioConfigs = {

    depositScenarioConfig: {
        executor: 'constant-arrival-rate',
        rate: 250,
        timeUnit: `${config.LOAD_TIME_UNIT}m`,
        duration: `${config.DURATION}m`,
        preAllocatedVUs: 100,
        maxVUs: 200,
        exec: 'loadTestDepositScenario'
    },

    payoutScenarioConfig: {
        executor: 'constant-arrival-rate',
        rate: 150,
        timeUnit: `${config.LOAD_TIME_UNIT}m`,
        duration: `${config.DURATION}m`,
        preAllocatedVUs: 100,
        maxVUs: 200,
        exec: 'loadTestPayoutScenario'
    },

    smokeTestConfig: {
        executor: 'constant-arrival-rate',
        rate: 1,
        preAllocatedVUs: 5,
        maxVUs: 50,
        timeUnit: `${config.SMOKE_TIME_UNIT}s`,
        duration: `${config.DURATION}m`,
        exec: 'smokeTestScenario'
    },

    pwaScenarioConfig: {
        executor: 'shared-iterations',
        vus: dropUsers.length,
        iterations: dropUsers.length,
        maxDuration: `${config.MAX_DURATION}m`,
        exec: 'loadTestPwaScenario'
    },

    dmAdminScenarioConfig: {
        executor: 'shared-iterations',
        vus: dmAdmins.length,
        iterations: dmAdmins.length,
        maxDuration: `${config.MAX_DURATION}m`,
        exec: 'dmAdminScenario'
    }
}

export const depositScenarioConfig = scenarioConfigs.depositScenarioConfig;
export const payoutScenarioConfig = scenarioConfigs.payoutScenarioConfig;
export const smokeTestConfig = scenarioConfigs.smokeTestConfig;
export const pwaScenarioConfig = scenarioConfigs.pwaScenarioConfig;
export const dmAdminScenarioConfig = scenarioConfigs.dmAdminScenarioConfig;