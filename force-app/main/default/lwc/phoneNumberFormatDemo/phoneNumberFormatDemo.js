import { LightningElement, track, wire } from 'lwc';
import getAllCountryCodes from '@salesforce/apex/CountryCodeController.getAllCountryCodes';
import validatePhoneNumberApex from '@salesforce/apex/PhoneNumberController.validatePhoneNumber';
export default class PhoneNumberFormatDemo extends LightningElement {
    @track countryCode;
  @track phoneNumber;
  @track errorMessage;
  @track countryOptions = [];

  @wire(getAllCountryCodes)
  wiredCountryCodes({ error, data }) {
    if (data) {
      this.countryOptions = data.map(code => {
        return { label: code, value: code };
      });
    } else if (error) {
      // Handle error
    }
  }

  handleCountryCodeChange(event) {
    this.countryCode = event.target.value;
  }

  handlePhoneNumberChange(event) {
    this.phoneNumber = event.target.value;
  }

  validatePhoneNumber() {
    validatePhoneNumberApex({ phoneNumber: this.phoneNumber, countryCode: this.countryCode })
      .then(result => {
        if (result.isValid) {
          this.errorMessage = '';
        } else {
          this.errorMessage = 'The phone number you provided is invalid.';
        }
        this.template.querySelectorAll('lightning-input, lightning-combobox').forEach(input => input.reportValidity());
      })
      .catch(error => {
        this.errorMessage = 'An error occurred while validating the phone number.';
        this.template.querySelectorAll('lightning-input, lightning-combobox').forEach(input => input.reportValidity());
      });
  }
}