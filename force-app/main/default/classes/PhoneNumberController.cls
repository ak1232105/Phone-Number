public with sharing class PhoneNumberController {
    @AuraEnabled
    public static ValidateResult validatePhoneNumber(String phoneNumber, String regionCode) {
        ValidateResult result = new ValidateResult();
        try {
            noltic_libphone.PhoneNumberUtil phoneUtil = noltic_libphone.PhoneNumberUtil.getInstance();
            noltic_libphone.PhoneNumber numberProto = phoneUtil.parse(phoneNumber, regionCode);
            result.isValid = phoneUtil.isValidNumber(numberProto);
            if (result.isValid) {
                // Using the correct format reference
                result.formattedNumber = phoneUtil.format(numberProto, noltic_libphone.PhoneNumberUtil.PhoneNumberFormat.INTERNATIONAL);
            }
        } catch (noltic_libphone.NumberParseException e) {
            result.isValid = false;
            result.errorMessage = e.getMessage();
        }
        return result;
    }

    public class ValidateResult {
        @AuraEnabled
        public Boolean isValid;
        @AuraEnabled
        public String errorMessage;
        @AuraEnabled
        public String formattedNumber;
    }
}
