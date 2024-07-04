public with sharing class CountryCodeController {
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
  }  