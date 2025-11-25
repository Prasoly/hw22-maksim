import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/login-page'
import { faker } from '@faker-js/faker/locale/ar'
import { PASSWORD, SERVICE_URL, USERNAME } from '../../config/env-data'
import NotFoundPage from '../pages/not-found-page'
import { OrderPage } from '../pages/order-page'
import FoundPage from '../pages/found-page'

let authPage: LoginPage

test.beforeEach(async ({ page }) => {
  authPage = new LoginPage(page)
  await authPage.open()
})

test('TL-17-3 signIn button disabled when incorrect data inserted', async ({}) => {
  await authPage.usernameField.fill(faker.lorem.word(2))
  await authPage.passwordField.fill(faker.lorem.word(7))
  await expect(authPage.signInButton).toBeDisabled()
})

test('TL-17-4 error message displayed when incorrect credentials used', async ({}) => {
  await authPage.usernameField.fill(faker.internet.username())
  await authPage.passwordField.fill(faker.internet.password())
  await authPage.signInButton.click()
  await expect(authPage.page.getByText('Incorrect credentials')).toBeVisible()
})

test('TL-17-5 login with correct credentials and verify order creation page', async ({}) => {
  const orderCreationPage = await authPage.signIn(USERNAME, PASSWORD)
  await expect(orderCreationPage.statusButton).toBeVisible()
  await orderCreationPage.checkInnerComponentsVisible()
})

test('TL-17-6 login and create order and check order found page', async ({ page }) => {
  const foundPage = new FoundPage(page)
  const orderInfo = {
    name: 'order',
    phoneField: '12345678',
    comment: 'comment',
  }
  const orderCreationPage = await authPage.signIn(USERNAME, PASSWORD)
  await orderCreationPage.nameField.fill(orderInfo.name)
  await orderCreationPage.phoneField.fill(orderInfo.phoneField)
  await orderCreationPage.commentField.fill(orderInfo.comment)
  await orderCreationPage.createOrderButton.click()
  await page.waitForTimeout(1000)
  await orderCreationPage.checkCreationPopupVisible(true)
  const orderId = await orderCreationPage.getOrderIdFromPopup()
  await orderCreationPage.closeCreationPopup()
  await orderCreationPage.findOrderById(orderId)
  await foundPage.checkElementVisibility(foundPage.orderName)
})

test('TL-17-7 logout', async ({}) => {
  const orderCreationPage = await authPage.signIn(USERNAME, PASSWORD)
  await expect(orderCreationPage.logoutButton).toBeVisible()
  await orderCreationPage.logoutButton.click()
  await expect(authPage.signInButton).toBeVisible()
})

test('TL-18-1-1 Check not found page via url', async ({ page }) => {
  const notFoundPage = new NotFoundPage(page, `${SERVICE_URL}/order/-1`)

  await authPage.signIn(USERNAME, PASSWORD)
  await page.waitForTimeout(1000)
  await notFoundPage.open()
  await notFoundPage.checkElementVisibility(notFoundPage.title)
  await notFoundPage.checkElementVisibility(notFoundPage.description)
})

test('TL-18-1-2 Check not found page via modal', async ({ page }) => {
  const notFoundPage = new NotFoundPage(page, `${SERVICE_URL}/order/123412341234123412341234`)
  const orderPage = new OrderPage(page)

  await authPage.signIn(USERNAME, PASSWORD)
  await orderPage.findOrderById(-1)
  await notFoundPage.checkElementVisibility(notFoundPage.title)
  await notFoundPage.checkElementVisibility(notFoundPage.description)
})
