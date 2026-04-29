const { test, expect } = require('@playwright/test');
const { StudentRegistrationPage } = require('../pages/StudentRegistrationPage');

test.describe('Student Registration Form - Negative Cases', () => {
  let studentRegistrationPage;

  test.beforeEach(async ({ page }) => {
    studentRegistrationPage = new StudentRegistrationPage(page);
  });

  test('should show error when mobile number < 10 digits', async ( { page }) => {
    const testData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        gender: 'Male',
        mobile: '12345678',
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

    await studentRegistrationPage.submitRegistrationForm();

    const isValid = await studentRegistrationPage.mobileInput.evaluate(el => el.checkValidity());
    expect(isValid).toBe(false);
 })
})