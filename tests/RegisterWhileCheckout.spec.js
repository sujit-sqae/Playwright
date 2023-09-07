import { test, expect } from '@playwright/test';
import { chromium, BrowserContext } from '@playwright/test';
import { timeout } from '../playwright.config';
import { WebExtensionBlocker } from '@cliqz/adblocker-webextension';

const fs = require('fs');

test('RegisterWhileCheckout', async () => {

  WebExtensionBlocker.fromPrebuiltAdsAndTracking().then((blocker) => {
    blocker.enableBlockingInBrowser(browser);
  });

  const jsonData = fs.readFileSync('data.json', 'utf-8');
  const data = JSON.parse(jsonData);

  // Extract the email from the JSON data
  const email = data.email;

  //Launch Chrome browser
  const browser = await chromium.launch();
  const page = await browser.newPage();

  //Navigate to url 'http://automationexercise.com'
  await page.goto('https://automationexercise.com/');

  if(timeout){
    await page.goBack();
  };

  //Verify that home page is visible successfully
  expect(page).toHaveTitle('Automation Exercise');
  expect(page.url()).toEqual('https://automationexercise.com/');

  //Add products to cart
  await page.locator('.features_items > div:nth-child(3)').hover();
  await page.locator('.overlay-content > .btn').first().click();

  //Click 'Cart' button
  await page.getByRole('link', { name: 'View Cart' }).click();

  //Verify that cart page is displayed
  const element1 = page.getByText('Shopping Cart');
  expect(element1 !== undefined ).toBeTruthy();

  //Click Proceed To Checkout
  await page.getByText('Proceed To Checkout').click();

  //Click 'Register / Login' button
  await page.getByRole('link', { name: 'Register / Login' }).click();

  //Fill all details in Sign up and create account
  await page.getByPlaceholder('Name').click();
  await page.getByPlaceholder('Name').fill('Sujit');
  await page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address').click();
  await page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address').fill(email);
  await page.getByRole('button', { name: 'Signup' }).click();

  await page.getByLabel('Mr.').check();
  await page.getByLabel('Password *').click();
  await page.getByLabel('Password *').fill('1234567890');
  await page.locator('#days').selectOption('21');
  await page.locator('#months').selectOption('8');
  await page.locator('#years').selectOption('1988');
  await page.getByLabel('First name *').click();
  await page.getByLabel('First name *').fill('Sujit');
  await page.getByLabel('Last name *').click();
  await page.getByLabel('Last name *').fill('Sarker');
  await page.getByLabel('Company', { exact: true }).click();
  await page.getByLabel('Company', { exact: true }).fill('Kite Games Studio');
  await page.getByLabel('Address * (Street address, P.O. Box, Company name, etc.)').click();
  await page.getByLabel('Address * (Street address, P.O. Box, Company name, etc.)').fill('Dhaka');
  await page.getByLabel('Country *').selectOption('United States');
  await page.getByLabel('State *').click();
  await page.getByLabel('State *').fill('New York');
  await page.getByLabel('City *').click();
  await page.getByLabel('City *').fill('New York');
  await page.locator('#zipcode').click();
  await page.locator('#zipcode').fill('10013');
  await page.getByLabel('Mobile Number *').click();
  await page.getByLabel('Mobile Number *').fill('1234567890');
  await page.getByRole('button', { name: 'Create Account' }).click();

  //Verify 'ACCOUNT CREATED!' and click 'Continue' button
  const element2 = page.getByText('Account Created!');
  expect(element2 !== undefined ).toBeTruthy();

  await page.getByRole('link', { name: 'Continue' }).click();

  //Verify ' Logged in as username' at top
  const element3 = page.getByText('Logged in as Sujit');
  expect(element3 !== undefined ).toBeTruthy();
  
  //Click 'Cart' button
  await page.getByRole('link', { name: ' Cart' }).click();
  //await page.getByText('Shopping Cart').click();

  //Click 'Proceed To Checkout' button
  await page.getByText('Proceed To Checkout').click();

  //Verify Address Details and Review Your Order
  const element4 = await page.getByText('Your delivery address Mr. Sujit Sarker Kite Games Studio Dhaka New York New York');
  expect(element4 !== undefined ).toBeTruthy();

  const element5 = await page.getByText('Your billing address Mr. Sujit Sarker Kite Games Studio Dhaka New York New York');
  expect(element5 !== undefined ).toBeTruthy();
  
  await page.getByRole('heading', { name: 'Review Your Order' }).click();

  //Enter description in comment text area and click 'Place Order'
  await page.locator('textarea[name="message"]').click();
  await page.locator('textarea[name="message"]').fill('Place Order');
  await page.getByRole('link', { name: 'Place Order' }).click();

  //Enter payment details: Name on Card, Card Number, CVC, Expiration date
  await page.locator('input[name="name_on_card"]').click();
  await page.locator('input[name="name_on_card"]').fill('Sujit Sarker');
  await page.locator('input[name="card_number"]').click();
  await page.locator('input[name="card_number"]').fill('1234567890');
  await page.getByPlaceholder('ex. 311').click();
  await page.getByPlaceholder('ex. 311').fill('1234567890');
  await page.getByPlaceholder('MM').click();
  await page.getByPlaceholder('MM').fill('12');
  await page.getByPlaceholder('YYYY').click();
  await page.getByPlaceholder('YYYY').fill('2345');

  //Click 'Pay and Confirm Order' button
  await page.getByRole('button', { name: 'Pay and Confirm Order' }).click();

  //Verify the success message 
  const element6 = await page.getByText('Order Placed!');
  expect(element6 !== undefined ).toBeTruthy();

  const element7 = await page.getByText('Your order has been placed successfully!');
  expect(element7 !== undefined ).toBeTruthy();

  await browser.close();

});