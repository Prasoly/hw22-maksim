import { expect, Locator, Page, test } from '@playwright/test'
import { BasePage } from './base-page'
import { SERVICE_URL } from '../../config/env-data'

export class OrderPage extends BasePage {
  readonly statusButton: Locator
  readonly nameField: Locator
  readonly phoneField: Locator
  readonly commentField: Locator
  readonly createOrderButton: Locator

  //creation popup
  readonly successfulCreationPopup: Locator
  readonly okButton: Locator
  readonly codeSpan: Locator

  //search popup elements
  readonly searchOrderPopup: Locator
  readonly orderIdInputField: Locator
  readonly trackButton: Locator

  readonly logoutButton: Locator

  constructor(page: Page, url?: string) {
    super(page, url ? url : SERVICE_URL)
    this.statusButton = page.getByTestId('openStatusPopup-button')
    this.nameField = page.getByTestId('username-input')
    this.phoneField = page.getByTestId('phone-input')
    this.commentField = page.getByTestId('comment-input')
    this.createOrderButton = page.getByTestId('createOrder-button')

    this.successfulCreationPopup = page.getByTestId('orderSuccessfullyCreated-popup')
    this.okButton = this.successfulCreationPopup.getByTestId(
      'orderSuccessfullyCreated-popup-ok-button',
    )
    this.codeSpan = this.successfulCreationPopup.locator('.notification-popup__text').nth(1)

    this.logoutButton = page.getByTestId('logout-button')

    this.searchOrderPopup = page.getByTestId('searchOrder-popup')
    this.orderIdInputField = this.searchOrderPopup.getByTestId('searchOrder-input')
    this.trackButton = this.searchOrderPopup.getByTestId('searchOrder-submitButton')
  }

  async checkInnerComponentsVisible(): Promise<void> {
    await this.checkElementVisibility(this.statusButton)
    await expect(this.statusButton).toBeEnabled()
    await this.checkElementVisibility(this.nameField)
    await this.checkElementVisibility(this.phoneField)
    await this.checkElementVisibility(this.commentField)
    await this.checkElementVisibility(this.createOrderButton)
    await this.checkElementVisibility(this.logoutButton)
  }

  async checkCreationPopupVisible(visible = true): Promise<void> {
    await expect(this.successfulCreationPopup).toBeVisible({ visible })
  }

  async findOrderById(id: number): Promise<void> {
    await test.step(`Search order by ID: '${id}'`, async () => {
      await this.clickElement(this.statusButton)
      await this.fillElement(this.orderIdInputField, String(id))
      await this.clickElement(this.trackButton)
    })
  }

  async closeCreationPopup(): Promise<void> {
    await test.step('Close popup after order creation', async () => {
      await this.clickElement(this.okButton)
    })
  }

  async getOrderIdFromPopup(): Promise<number> {
    const text = await this.codeSpan.innerText() // tracking code 13223
    const strArray = text.split(' ')

    return Number(strArray[strArray.length - 1])
  }
}
