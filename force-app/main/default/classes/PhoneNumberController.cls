public with sharing class PhoneNumberController {
    @AuraEnabled(cacheable=true)
    public static List<String> getAllCountryCodes() {
        List<String> countryCodes = new List<String>();
        try {
            noltic_libphone.PhoneNumberUtil phoneUtil = noltic_libphone.PhoneNumberUtil.getInstance();
            Set<String> supportedRegions = phoneUtil.getSupportedRegions();
            for (String region : supportedRegions) {
                Integer countryCode = phoneUtil.getCountryCodeForRegion(region);
                countryCodes.add(region + ' (' + countryCode + ')');
            }
        } catch (Exception e) {
            // Handle exception
        }
        return countryCodes;
    }

    @AuraEnabled
    public static ValidateResult validatePhoneNumber(String phoneNumber, String regionCode) {
        ValidateResult result = new ValidateResult();
        try {
            noltic_libphone.PhoneNumberUtil phoneUtil = noltic_libphone.PhoneNumberUtil.getInstance();
            noltic_libphone.PhoneNumber numberProto = phoneUtil.parse(phoneNumber, regionCode);
            result.isValid = phoneUtil.isValidNumber(numberProto);
            if (result.isValid) {
                result.formattedNumber = phoneUtil.format(numberProto, noltic_libphone.PhoneNumberUtil.PhoneNumberFormat.INTERNATIONAL);
            }
        } catch (noltic_libphone.NumberParseException e) {
            result.isValid = false;
            result.errorMessage = e.getMessage();
        }
        return result;
    }

    @AuraEnabled
    public static String formatPhoneNumber(String phoneNumber, String regionCode, String format) {
        try {
            noltic_libphone.PhoneNumberUtil phoneUtil = noltic_libphone.PhoneNumberUtil.getInstance();
            noltic_libphone.PhoneNumber numberProto = phoneUtil.parse(phoneNumber, regionCode);
            noltic_libphone.PhoneNumberUtil.PhoneNumberFormat phoneFormat;
            if (format == 'INTERNATIONAL') {
                phoneFormat = noltic_libphone.PhoneNumberUtil.PhoneNumberFormat.INTERNATIONAL;
            } else if (format == 'NATIONAL') {
                phoneFormat = noltic_libphone.PhoneNumberUtil.PhoneNumberFormat.NATIONAL;
            } else if (format == 'E164') {
                phoneFormat = noltic_libphone.PhoneNumberUtil.PhoneNumberFormat.E164;
            } else {
                phoneFormat = noltic_libphone.PhoneNumberUtil.PhoneNumberFormat.RFC3966;
            }
            return phoneUtil.format(numberProto, phoneFormat);
        } catch (noltic_libphone.NumberParseException e) {
            return 'Invalid number';
        }
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
