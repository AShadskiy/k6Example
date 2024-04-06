import * as config from "../config.js";

export function getRandomBoolean(percentTrue = 50) {
    // Generate a random number between 0 and 1
    const randomNumber = Math.random();

    // Calculate the threshold value based on the desired percentage
    const threshold = percentTrue / 100;

    // Return true if the random number is less than the threshold, otherwise return false
    return randomNumber < threshold;
}

export function changeReceivedAmount(originalAmount, offset = 0) {
    let isMore = getRandomBoolean();
    // Calculate percent of the original integer
    let percentChange = originalAmount * offset;

    if (isMore) {
        // Add percent to the original integer
        return originalAmount + percentChange;
    } else {
        // Subtract percent from the original integer
        return originalAmount - percentChange;
    }
}

export function getTrackingDuration() {
    return (config.DURATION + 5) * 60 * 1000;
}