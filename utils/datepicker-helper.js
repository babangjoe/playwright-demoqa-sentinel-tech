const { expect } = require('@playwright/test');

function normalizeDate(dateString) {
  // support multiple formats
  const date = new Date(dateString);

  if (isNaN(date)) {
    throw new Error(`Invalid date format: ${dateString}`);
  }

  const day = String(date.getDate());
  const monthIndex = date.getMonth(); // 0-11
  const year = String(date.getFullYear());

  const monthsFull = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  return {
    day,
    monthIndex,
    monthFull: monthsFull[monthIndex],
    year
  };
}

async function setDate(page, locator, dateString) {
  const { day, monthIndex, monthFull, year } = normalizeDate(dateString);

  // 1. Ensure ready
  await locator.waitFor({ state: 'visible' });
  await locator.scrollIntoViewIfNeeded();

  // 2. Open datepicker
  await locator.click();

  const yearDropdown = page.locator('.react-datepicker__year-select');
  const monthDropdown = page.locator('.react-datepicker__month-select');

  // 3. Select year (robust)
  if (await yearDropdown.isVisible()) {
    await yearDropdown.selectOption({ label: year });
  } else {
    await page.getByText(year, { exact: true }).click();
  }

  // 4. Select month (pakai index biar anti format issue)
  if (await monthDropdown.isVisible()) {
    await monthDropdown.selectOption({ index: monthIndex });
  } else {
    await page.getByText(monthFull, { exact: true }).click();
  }

  // 5. Select day (hindari duplicate day)
  const dayLocator = page.locator(
    `.react-datepicker__day--0${day.padStart(2, '0')}:not(.react-datepicker__day--outside-month)`
  );

  await dayLocator.first().click();

  // 6. Assertion (anti silent failure)
  await expect(locator).toHaveValue(new RegExp(`${day}.*${year}`));
}

function formatDateForAssertion(dateString) {
  const date = new Date(dateString);

  const day = date.getDate();
  const year = date.getFullYear();

  const months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  return `${day} ${months[date.getMonth()]},${year}`;
}

module.exports = { setDate, formatDateForAssertion };