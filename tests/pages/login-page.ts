import { Locator, Page } from '@playwright/test'
import { OrderPage } from './order-page'
import { SERVICE_URL } from '../../config/env-data'
import { BasePage } from './base-page'

export class LoginPage extends BasePage {
  readonly signInButton: Locator
  readonly usernameField: Locator
  readonly passwordField: Locator

  constructor(page: Page) {
    super(page, `${SERVICE_URL}/signin`)
    this.signInButton = page.getByTestId('signIn-button')
    this.usernameField = page.getByTestId('username-input')
    this.passwordField = page.getByTestId('password-input')
  }

  async signIn(username: string, password: string) {
    await this.fillElement(this.usernameField, username)
    await this.fillElement(this.passwordField, password)
    await this.clickElement(this.signInButton)

    return new OrderPage(this.page)
  }
}
