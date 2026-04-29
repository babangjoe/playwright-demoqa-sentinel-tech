const { test, expect } = require('@playwright/test');
const { StudentRegistrationPage } = require('../pages/StudentRegistrationPage');

test.describe('Student Registration Form', () => {
  let studentRegistrationPage;

  test.beforeEach(async ({ page }) => {
    studentRegistrationPage = new StudentRegistrationPage(page);
  });

  test('should submit the registration form successfully', async ({ page }) => {
    const testData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        gender: 'Male',
        mobile: '1234567890',
        dateOfBirth: '20 Jun 2002',
        subjects: ['Maths', 'Physics', 'Computer Science'],
        hobbies: ['Sports', 'Reading'],
        picturePath: 'pictures/oldtrafford-1.jpg',
        currentAddress: 'test address',
        state: 'NCR',
        city: 'Delhi'
    }

    await studentRegistrationPage.navigate('/automation-practice-form');

    await studentRegistrationPage.fillRegistrationForm(testData);

    // await page.waitForTimeout(5000); // Wait for 10 seconds before submitting the form

    await studentRegistrationPage.submitRegistrationForm();

    await studentRegistrationPage.assertSubmissionSuccess();

    await studentRegistrationPage.assertSubmissionDataTable(testData);

    await page.waitForTimeout(3000); // Wait for 10 seconds before submitting the form
  });
})