import { root } from './index';

const CONTINUE_SHOPPING_BUTTON_TEXT = '[data-testid="header-continueButton"] > span > span';
const HEADER_NEXT_BUTTON_TEXT = '[data-testid="header-nextButton-configure"] > span > span';
const CONFIGURE_PROGRESSIVE_ITEM_TEXT = '[data-testid="CONFIGURE"] > span > span';
const BILLING_PROGRESSIVE_ITEM_TEXT = '[data-testid="BILLING"] > span > span';
const REVIEW_PROGRESSIVE_ITEM_TEXT = '[data-testid="REVIEW"] > span > span';
const DISCOUNT_CODE_TEXT = '[data-testid="discount-apply"] > span';

const getElementText = async (element) => {
  const app = await root();
  return await app.$eval(element, el => el.innerText);
}
export const getContinueShoppingButtonText = () => getElementText(CONTINUE_SHOPPING_BUTTON_TEXT);

export const getNextButtonText = () => getElementText(HEADER_NEXT_BUTTON_TEXT);

export const getdiscountCodeBtnText = () => getElementText(DISCOUNT_CODE_TEXT);

export const getCartProgressiveItemText = async () => {
  const cartText = await getElementText(CONFIGURE_PROGRESSIVE_ITEM_TEXT);
  const billingText = await getElementText(BILLING_PROGRESSIVE_ITEM_TEXT);
  const reviewText = await getElementText(REVIEW_PROGRESSIVE_ITEM_TEXT);

  return await [cartText, billingText, reviewText]
}
