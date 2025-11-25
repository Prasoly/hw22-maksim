import { BasePage } from './base-page'
import { Locator, Page } from '@playwright/test'
import { SERVICE_URL } from '../../config/env-data'

export default class FoundPage extends BasePage {
  readonly orderName: Locator

  constructor(page: Page, url?: string) {
    super(page, url ? url : SERVICE_URL)
    this.orderName = this.page.locator('.order-list__description').first()
  }
}
