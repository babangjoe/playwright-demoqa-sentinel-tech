const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');
const { setDate, formatDateForAssertion } = require('../utils/datepicker-helper');

class StudentRegistrationPage extends BasePage {
  constructor(page) {
    super(page);
    this.firstNameInput = page.locator('#firstName');
    this.lastNameInput = page.locator('#lastName');
    this.emailInput = page.locator('#userEmail');

    this.genderOption = (gender) => page.getByText(gender, { exact: true });

    this.mobileInput = page.locator('#userNumber');
    this.dateOfBirthInput = page.locator('#dateOfBirthInput');
    this.subjectsInput = page.locator('#subjectsInput');

    this.hobbyCheckbox = (hobby) => page.getByText(hobby, { exact: true });

    this.pictureInput = page.locator('#uploadPicture');
    this.currentAddressInput = page.locator('#currentAddress');
    
    this.stateDropdown = page.locator('#state');
    this.cityDropdown = page.locator('#city');
    this.submitButton = page.locator('#submit');
  }

  async fillRegistrationForm(data) {
    const {
      firstName,
      lastName,
      email,
      gender,
      mobile,
      dateOfBirth,
      subjects,
      hobbies,
      picturePath,
      currentAddress,
      state,
      city
    } = data;

    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);

    // select the gender option based on the provided gender value
    await this.genderOption(gender).click();
    
    await this.mobileInput.fill(mobile);

    // await this.dateOfBirthInput.fill('');
    // await this.dateOfBirthInput.fill(dateOfBirth);
    await setDate(this.page, this.dateOfBirthInput, dateOfBirth);

    // fill the subjects input with each subject from the provided subjects array
    for (const subject of subjects){
        await this.subjectsInput.fill(subject);
        await this.page.getByText(subject, { exact: true }).click();
    }

    // check the hobbies checkboxes based on the provided hobbies array
    for (const hobby of hobbies) {
      await this.hobbyCheckbox(hobby).click();
    }
    
    await this.pictureInput.setInputFiles(picturePath);
    await this.currentAddressInput.fill(currentAddress);
    
    // Select state using dropdown
    await this.stateDropdown.click();
    await this.page.getByText(state, { exact: true }).click();

    // Select city using dropdown (based on selected state)
    await this.cityDropdown.click();
    await this.page.getByText(city, { exact: true }).click();
  }

  async submitRegistrationForm() {
    // await this.page.click(this.submitButton);
    await this.submitButton.click()
  }

  async assertSubmissionSuccess() {
    await expect(this.page.getByText('Thanks for submitting the form')).toBeVisible();
  }

  async assertRow(label, expected) {
    const row = this.page.locator('tr', {
      has: this.page.locator('td', { hasText: label })
    });

    await expect(row.locator('td').nth(1)).toHaveText(expected);
  }

  // Assert that the data in the submission table matches the data that was submitted
  async assertSubmissionDataTable(data) {
    const fullName = `${data.firstName} ${data.lastName}`;
    const subjects = data.subjects.join(', ');
    const hobbies = data.hobbies.join(', ');
    const dob = formatDateForAssertion(data.dateOfBirth);
    const pictureFileName = data.picturePath.split('/').pop();

    await this.assertRow('Student Name', fullName);
    await this.assertRow('Student Email', data.email);
    await this.assertRow('Gender', data.gender);
    await this.assertRow('Mobile', data.mobile);
    await this.assertRow('Date of Birth', dob);
    await this.assertRow('Subjects', subjects);
    await this.assertRow('Hobbies', hobbies);
    await this.assertRow('Picture', pictureFileName);
    await this.assertRow('Address', data.currentAddress);
    await this.assertRow('State and City', `${data.state} ${data.city}`);
  }
}

module.exports = { StudentRegistrationPage };