import { expect, Locator, Page, test } from '@playwright/test'

export abstract class BasePage {
  readonly page: Page
  readonly languageSwitcher: Locator
  readonly url: string
  // TODO add EN & RU buttons
  readonly privacyPolicyLink: Locator
  // TODO add other documents
  readonly TIMEOUT_VISIBILITY: number = 5000

  protected constructor(page: Page, url: string) {
    this.page = page
    this.url = url
    this.languageSwitcher = page.locator('div.language')
    this.privacyPolicyLink = page.getByTestId('privacy-policy')
  }
  async open() {
    await this.page.goto(this.url)
  }
  async checkElementVisibility(element: Locator): Promise<void> {
    await test.step(`Verifying element visibility: ${element}`, async () => {
      await expect(element).toBeVisible({ timeout: this.TIMEOUT_VISIBILITY })
    })
  }

  async checkElementEnabled(element: Locator): Promise<void> {
    await test.step(`Verifying element enabled: ${element}`, async () => {
      await expect(element).toBeEnabled({ timeout: this.TIMEOUT_VISIBILITY })
    })
  }

  async verifyLanguageSelector(): Promise<void> {
    await test.step('Verify language selector', async () => {
      await this.checkElementVisibility(this.languageSwitcher)
    })
  }

  async clickElement(element: Locator) {
    await test.step(`Clicking element: ${element}`, async () => {
      await element.click()
    })
  }

  async fillElement(element: Locator, text: string) {
    await test.step(`Filling element: ${element}`, async () => {
      await element.fill(text)
    })
  }
}
