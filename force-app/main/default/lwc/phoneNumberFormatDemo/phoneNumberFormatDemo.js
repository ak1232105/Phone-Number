import { LightningElement, track, wire } from 'lwc';
import getAllCountryCodes from '@salesforce/apex/CountryCodeController.getAllCountryCodes';
import validatePhoneNumberApex from '@salesforce/apex/PhoneNumberController.validatePhoneNumber';

export default class PhoneNumberFormatDemo extends LightningElement {
    @track countryCode;
    @track phoneNumber;
    @track errorMessage;
    @track formattedNumber;
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
        // Extract the region code from the selected country code (e.g., "IN" from "IN (91)")
        const regionCode = this.countryCode.split(' ')[0];
        
        validatePhoneNumberApex({ phoneNumber: this.phoneNumber, regionCode: regionCode })
            .then(result => {
                if (result.isValid) {
                    this.errorMessage = '';
                    this.formattedNumber = result.formattedNumber;
                } else {
                    this.errorMessage = 'The phone number you provided is invalid.';
                    this.formattedNumber = '';
                }
                this.template.querySelectorAll('lightning-input, lightning-combobox').forEach(input => input.reportValidity());
            })
            .catch(error => {
                this.errorMessage = 'An error occurred while validating the phone number.';
                this.formattedNumber = '';
                this.template.querySelectorAll('lightning-input, lightning-combobox').forEach(input => input.reportValidity());
            });
    }
}
