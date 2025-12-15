import { Locator, Page } from '@playwright/test'
import { OrderPage } from './order-page'
import { SERVICE_URL } from '../../config/env-data'
import { BasePage } from './base-page'

const jwt = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkZW5pc292YSIsImV4cCI6MTc2NTgzNzg3NSwiaWF0IjoxNzY1ODE5ODc1fQ.Udto73R_PvE5slIARh4KVJgIk5Rb2Lr7zPD_r_tOA83wbO7CWKTOxKgGjV6ceVgAacu8g6m6I8mQ87NxKH3t8w';

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

  async mockAuth(): Promise<void> {
    await this.page.route('**/login/student', async (route) => {
      await route.fulfill({
        status: 200,
        body: jwt,
      })
    })
  }
}
