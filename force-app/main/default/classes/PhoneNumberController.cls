public with sharing class PhoneNumberController {
    @AuraEnabled
    public static ValidateResult validatePhoneNumber(String phoneNumber, String countryCode) {
      ValidateResult result = new ValidateResult();
      try {
        noltic_libphone.PhoneNumberUtil phoneUtil = noltic_libphone.PhoneNumberUtil.getInstance();
        noltic_libphone.PhoneNumber numberProto = phoneUtil.parse(phoneNumber, countryCode);
        result.isValid = phoneUtil.isValidNumber(numberProto);
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
    }
  }
  