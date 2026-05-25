import { combineReducers } from 'redux';
import { LoginReducer, ForgetPasswordReducer, ResetPasswordReducer } from "./Login/Login_Reducer";
import { SignupReducer, SendConfirmationEmailReducer, VerifyConfirmationEmailReducer } from "./Signup/Signup_Reducer";
import { GetProfileReducer, UpdatePasswordReducer, UpdateProfileReducer } from './Profile/Profile_Reducer';
import { GetSiteDetailsReducer, UpdateSiteDetailsReducer, GetSiteDataReducer } from './SiteDetails/SiteDetails_Reducer';
import { GetAppDetailsReducer, UpdateAppCurrencyDetailsReducer, UpdateAppDetailsReducer } from './AppDetails/AppDetails_Reducer';
import { GetUsersDetailsReducer, GetUsersListReducer, UpdateIsBlockedUserReducer, GetRewardHistoryListReducer, GetPurchaseCoinHistoryListReducer, GetPurchaseVIPHistoryListReducer } from './Users/Users_Reducer';
import { AddPaymentMethodReducer, DeletePaymentMethodReducer, GetPaymentMethodReducer, UpdatePaymentMethodReducer, UpdatePaymentMethodStatusReducer } from './PaymentMethod/PaymentMethod_Reducer';
import { GetDashboardDetailsReducer } from './Dashboard/Dashboard_Reducer';
import { VerifyTokenReducer } from './VerifyToken/VerifyToken_Reducer';
import { AddCategoriesReducer, DeleteCategoriesReducer, GetCategoriesReducer, UpdateCategoriesReducer } from './Categories/Categories_Reducer';
import { AddTagsReducer, DeleteTagsReducer, GetTagsReducer, UpdateTagsReducer } from './Tags/Tags_Reducer';
import { AddLanguagesReducer, DeleteLanguagesReducer, GetLanguagesReducer, UpdateLanguagesReducer } from './Languages/Languages_Reducer';
import { AddReportReasonReducer, DeleteReportReasonReducer, GetReportReasonReducer, UpdateReportReasonReducer } from './ReportReason/ReportReason_Reducer';
import { AddFAQReducer, DeleteFAQReducer, GetFAQReducer, UpdateFAQReducer } from './FAQ/FAQ_Reducer';
import { AddTypesReducer, DeleteTypesReducer, GetTypesReducer, UpdateTypesReducer } from './Types/Types_Reducer';
import { AddPlansReducer, DeletePlansReducer, GetPlansReducer, UpdatePlansReducer } from './Plans/Plans_Reducer';
import { AddSeriesReducer, DeleteSeriesReducer, GetSeriesDetailsReducer, GetSeriesReducer, UpdateActiveSeriesReducer, UpdateFreeSeriesReducer, UpdateRecommandedSeriesReducer, UpdateSeriesReducer } from './Series/Series_Reducer';
import { AddEpisodesReducer, AddEpisodesUrlsReducer, AddMultipleEpisodesReducer, DeleteEpisodesReducer, GetEpisodesReducer, UpdateEpisodesReducer } from './Episodes/Episodes_Reducer';
import { GetSocialLinksReducer, UpdateSocialLinksReducer } from './SocialLinks/SocialLinks_Reducer';
import { GetAboutUsReducer, UpdateAboutUsReducer } from './AboutUs/AboutUs_Reducer';
import { GetTermsConditionReducer, UpdateTermsConditionReducer } from './TermsCondition/TermsCondition_Reducer';
import { GetPrivacyPolicyReducer, UpdatePrivacyPolicyReducer } from './PrivacyPolicy/PrivacyPolicy_Reducer';
import { GetAdsPLatformListReducer, UpdateAdsPLatformStatusReducer, GetAdsPlatformDetailsReducer, UpdateAdsPlatformDetailsReducer } from './AdsSetting/AdsSetting_Reducer';
import { GetTicketListReducer, UpdateTicketStatusReducer } from './Tickets/Tickets_Reducer';
import { GetLicenseReducer, VerifyLicenseReducer } from './License/License_Reducer';
import { SendNotificationReducer } from './Notification/Notification_Reducer';

const reducer = combineReducers({LoginReducer, SignupReducer, SendConfirmationEmailReducer, VerifyConfirmationEmailReducer, ForgetPasswordReducer, ResetPasswordReducer, UpdateProfileReducer, GetProfileReducer, GetAppDetailsReducer, UpdateAppDetailsReducer, UpdateAppCurrencyDetailsReducer, GetSiteDetailsReducer, UpdateSiteDetailsReducer, UpdatePasswordReducer, GetUsersDetailsReducer, GetUsersListReducer, UpdatePaymentMethodReducer, GetPaymentMethodReducer, AddPaymentMethodReducer, DeletePaymentMethodReducer, GetDashboardDetailsReducer, VerifyTokenReducer, GetCategoriesReducer, AddCategoriesReducer, UpdateCategoriesReducer, DeleteCategoriesReducer, GetTagsReducer, AddTagsReducer, UpdateTagsReducer, DeleteTagsReducer, GetLanguagesReducer, AddLanguagesReducer, UpdateLanguagesReducer, DeleteLanguagesReducer, GetTypesReducer, AddTypesReducer, UpdateTypesReducer, DeleteTypesReducer, GetPlansReducer, AddPlansReducer, UpdatePlansReducer, DeletePlansReducer, GetSeriesReducer, AddSeriesReducer, UpdateSeriesReducer, DeleteSeriesReducer, UpdateRecommandedSeriesReducer, UpdateFreeSeriesReducer, GetEpisodesReducer, AddEpisodesReducer, UpdateEpisodesReducer, DeleteEpisodesReducer, GetSeriesDetailsReducer, UpdatePaymentMethodStatusReducer, GetSocialLinksReducer, UpdateSocialLinksReducer, GetAboutUsReducer, UpdateAboutUsReducer, GetTermsConditionReducer, UpdateTermsConditionReducer, GetPrivacyPolicyReducer, UpdatePrivacyPolicyReducer, UpdateActiveSeriesReducer, AddMultipleEpisodesReducer, AddEpisodesUrlsReducer, GetAdsPLatformListReducer, UpdateAdsPLatformStatusReducer, GetAdsPlatformDetailsReducer, UpdateAdsPlatformDetailsReducer, UpdateIsBlockedUserReducer, GetRewardHistoryListReducer, GetPurchaseCoinHistoryListReducer, GetPurchaseVIPHistoryListReducer, AddReportReasonReducer, DeleteReportReasonReducer, GetReportReasonReducer, UpdateReportReasonReducer, GetTicketListReducer, UpdateTicketStatusReducer, AddFAQReducer, DeleteFAQReducer, GetFAQReducer, UpdateFAQReducer, GetSiteDataReducer, VerifyLicenseReducer, GetLicenseReducer, SendNotificationReducer})

export default reducer;