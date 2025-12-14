import { expect, test } from '@playwright/test'
import { LoginPage } from '../pages/login-page'
import { OrderPage } from '../pages/order-page'
import FoundPage from '../pages/found-page'

const jwt = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkZW5pc292YSIsImV4cCI6MTc2NTc0MTkyNCwiaWF0IjoxNzY1NzIzOTI0fQ.QCO2SRIfQj2iDlfhBkLW145h_wxJIYnpl8bm87fz-ItVxY-xBfb-PujTdI1pEpo2RZKYxH8-mkpsUVfCZBZzxQ';

test('TL-22-1 signIn with mocks', async ({page}) => {
  const loginPage = new LoginPage(page)
  const orderPage = new OrderPage(page)
  await loginPage.mockAuth()
  await loginPage.open()
  await loginPage.usernameField.fill('test');
  await loginPage.passwordField.fill('test1234');
  await loginPage.signInButton.click();
  await orderPage.checkElementVisibility(orderPage.trackButton)
})

test('TL-22-2 create and find order with mocks', async ({context}) => {
  const newOrder = {
    status: 'OPEN',
    courierId: null,
    customerName: 'customerName',
    customerPhone: 'customerPhone',
    comment: 'comment',
    id: 100
  }
  await context.addInitScript((token) => {
    localStorage.setItem('jwt', token);
  }, jwt);
  const page = await context.newPage();
  const loginPage = new LoginPage(page)
  const orderPage = new OrderPage(page)
  const foundPage = new FoundPage(page)
  await loginPage.open()

  await orderPage.nameField.fill(newOrder.customerName)
  await orderPage.phoneField.waitFor({ state: 'visible', timeout: 10000 })
  await orderPage.phoneField.fill(newOrder.customerPhone)
  await orderPage.commentField.fill(newOrder.comment)
  await page.route('**/orders', async route => {
    await route.fulfill({
      status: 200,
      json: newOrder
    })
  })
  const createOrderResponse = page.waitForResponse('**/orders');
  await orderPage.createOrderButton.click()
  await createOrderResponse;
  await orderPage.checkElementVisibility(orderPage.successfulCreationPopup)
  expect(await orderPage.getOrderIdFromPopup()).toBe(newOrder.id);
  await orderPage.okButton.click();
  await orderPage.statusButton.click();
  await orderPage.fillElement(orderPage.orderIdInputField, String(newOrder.id))

  await page.route('**/orders/*', async route => {
    await route.fulfill({
      status: 200,
      json: newOrder
    })
  })
  const trackOrderResponse = page.waitForResponse('**/orders/*')
  await orderPage.trackButton.click()
  await trackOrderResponse;
  expect(await foundPage.orderName.innerText()).toBe(newOrder.customerName)
})