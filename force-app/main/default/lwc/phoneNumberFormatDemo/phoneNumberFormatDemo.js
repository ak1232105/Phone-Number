import { LightningElement, track, wire } from 'lwc';
import getAllCountryCodes from '@salesforce/apex/PhoneNumberController.getAllCountryCodes';
import validatePhoneNumberApex from '@salesforce/apex/PhoneNumberController.validatePhoneNumber';
import formatPhoneNumberApex from '@salesforce/apex/PhoneNumberController.formatPhoneNumber';

export default class PhoneNumberFormatDemo extends LightningElement {
    @track countryCode;
    @track phoneNumber;
    @track errorMessage;
    @track formattedNumber;
    @track formattedPhoneNumber;
    @track countryOptions = [];
    @track isLoading = false;
    @track isFormatDisabled = true;

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
        const regionCode = this.countryCode.split(' ')[0];
        this.isLoading = true;
        this.isFormatDisabled = true;
        
        validatePhoneNumberApex({ phoneNumber: this.phoneNumber, regionCode: regionCode })
            .then(result => {
                this.isLoading = false;
                if (result.isValid) {
                    this.errorMessage = '';
                    this.formattedNumber = result.formattedNumber;
                    this.isFormatDisabled = false;
                } else {
                    this.errorMessage = result.errorMessage || 'The phone number you provided is invalid.';
                    this.formattedNumber = '';
                }
                this.template.querySelectorAll('lightning-input, lightning-combobox').forEach(input => input.reportValidity());
            })
            .catch(error => {
                this.isLoading = false;
                this.errorMessage = 'An error occurred while validating the phone number.';
                this.formattedNumber = '';
                this.template.querySelectorAll('lightning-input, lightning-combobox').forEach(input => input.reportValidity());
            });
    }

    formatPhoneNumber() {
        const regionCode = this.countryCode.split(' ')[0];
        
        formatPhoneNumberApex({ phoneNumber: this.phoneNumber, regionCode: regionCode, format: 'INTERNATIONAL' })
            .then(result => {
                if (result !== 'Invalid number') {
                    this.errorMessage = '';
                    this.formattedPhoneNumber = result;
                } else {
                    this.errorMessage = 'The phone number you provided is invalid.';
                    this.formattedPhoneNumber = '';
                }
            })
            .catch(error => {
                this.errorMessage = 'An error occurred while formatting the phone number.';
                this.formattedPhoneNumber = '';
            });
    }
}
