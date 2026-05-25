package com.app.dramashort.Model


import com.google.gson.annotations.SerializedName
import androidx.annotation.Keep

@Keep
data class PlanListResponse(
    @SerializedName("responseCode")
    val responseCode: String?,
    @SerializedName("responseDetails")
    val responseDetails: ResponseDetails?,
    @SerializedName("responseMessage")
    val responseMessage: String?
) {
    @Keep
    data class ResponseDetails(
        @SerializedName("limited")
        val limited: List<Limited?>?,
        @SerializedName("paymentGateway")
        val paymentGateway: String?,
        @SerializedName("unlimited")
        val unlimited: List<Unlimited?>?,
        @SerializedName("userLocation")
        val userLocation: UserLocation?
    ) {
        @Keep
        data class Limited(
            @SerializedName("amount")
            val amount: String?,
            @SerializedName("amount_in_user_currency")
            val amountInUserCurrency: String?,
            @SerializedName("coin")
            val coin: String?,
            @SerializedName("created_at")
            val createdAt: String?,
            @SerializedName("description")
            val description: Any?,
            @SerializedName("discount_percentage")
            val discountPercentage: String?,
            @SerializedName("display_amount")
            val displayAmount: String?,
            @SerializedName("display_currency")
            val displayCurrency: String?,
            @SerializedName("display_currency_symbol")
            val displayCurrencySymbol: String?,
            @SerializedName("extra_coin")
            val extraCoin: String?,
            @SerializedName("formatted_price")
            val formattedPrice: String?,
            @SerializedName("google_play_id")
            val googlePlayId: String?,
            @SerializedName("id")
            val id: Int?,
            @SerializedName("is_active")
            val isActive: Int?,
            @SerializedName("is_deleted")
            val isDeleted: Int?,
            @SerializedName("is_limited_time")
            val isLimitedTime: Int?,
            @SerializedName("is_unlimited")
            val isUnlimited: Int?,
            @SerializedName("is_weekly")
            val isWeekly: Int?,
            @SerializedName("is_yearly")
            val isYearly: Int?,
            @SerializedName("name")
            val name: Any?,
            @SerializedName("original_amount")
            val originalAmount: String?,
            @SerializedName("original_currency")
            val originalCurrency: String?,
            @SerializedName("updated_at")
            val updatedAt: String?,
            @SerializedName("user_currency")
            val userCurrency: String?,
            @SerializedName("user_currency_symbol")
            val userCurrencySymbol: String?,
            var googleAmountFormated: String?,
            var googleCurrency: String? = null,
        )

        @Keep
        data class Unlimited(
            @SerializedName("amount")
            val amount: String?,
            @SerializedName("amount_in_user_currency")
            val amountInUserCurrency: String?,
            @SerializedName("coin")
            val coin: Any?,
            @SerializedName("created_at")
            val createdAt: String?,
            @SerializedName("description")
            val description: String?,
            @SerializedName("discount_percentage")
            val discountPercentage: Any?,
            @SerializedName("display_amount")
            val displayAmount: String?,
            @SerializedName("display_currency")
            val displayCurrency: String?,
            @SerializedName("display_currency_symbol")
            val displayCurrencySymbol: String?,
            @SerializedName("extra_coin")
            val extraCoin: Any?,
            @SerializedName("formatted_price")
            val formattedPrice: String?,
            @SerializedName("google_play_id")
            val googlePlayId: String?,
            @SerializedName("id")
            val id: Int?,
            @SerializedName("is_active")
            val isActive: Int?,
            @SerializedName("is_deleted")
            val isDeleted: Int?,
            @SerializedName("is_limited_time")
            val isLimitedTime: Int?,
            @SerializedName("is_unlimited")
            val isUnlimited: Int?,
            @SerializedName("is_weekly")
            val isWeekly: Int?,
            @SerializedName("is_yearly")
            val isYearly: Int?,
            @SerializedName("name")
            val name: String?,
            @SerializedName("original_amount")
            val originalAmount: String?,
            @SerializedName("original_currency")
            val originalCurrency: String?,
            @SerializedName("updated_at")
            val updatedAt: String?,
            @SerializedName("user_currency")
            val userCurrency: String?,
            @SerializedName("user_currency_symbol")
            val userCurrencySymbol: String?,
            var googleAmountFormated: String = "",
            var googleCurrency: String = "",
        )

        @Keep
        data class UserLocation(
            @SerializedName("country")
            val country: String?,
            @SerializedName("countryCode")
            val countryCode: String?,
            @SerializedName("currency")
            val currency: String?,
            @SerializedName("currencyName")
            val currencyName: String?,
            @SerializedName("currencySymbol")
            val currencySymbol: String?
        )
    }
}
//@Keep
//data class PlanListResponse(
//    @SerializedName("responseCode")
//    val responseCode: String?,
//    @SerializedName("responseDetails")
//    val responseDetails: ResponseDetails?,
//    @SerializedName("responseMessage")
//    val responseMessage: String?,
//) {
//    @Keep
//    data class ResponseDetails(
//        @SerializedName("limited")
//        val limited: List<Limited?>?,
//        @SerializedName("paymentGateway")
//        val paymentGateway: String?,
//        @SerializedName("unlimited")
//        val unlimited: List<Unlimited?>?,
//    ) {
//        @Keep
//        data class Limited(
//            var currency: String? = null,
//
//
//            @SerializedName("google_play_id")
//            var googlePlayId: String? = null,
//
//            var amountFormated: String?,
//            @SerializedName("amount")
//            var amount: String?,
//            @SerializedName("coin")
//            val coin: String?,
//            @SerializedName("created_at")
//            val createdAt: String?,
//            @SerializedName("description")
//            val description: Any?,
//            @SerializedName("discount_percentage")
//            val discountPercentage: String?,
//            @SerializedName("extra_coin")
//            val extraCoin: String?,
//            @SerializedName("id")
//            val id: Int?,
//            @SerializedName("is_deleted")
//            val isDeleted: Int?,
//            @SerializedName("is_limited_time")
//            val isLimitedTime: Int?,
//            @SerializedName("is_unlimited")
//            val isUnlimited: Int?,
//            @SerializedName("is_weekly")
//            val isWeekly: Int?,
//            @SerializedName("is_yearly")
//            val isYearly: Int?,
//            @SerializedName("name")
//            val name: Any?,
//            @SerializedName("updated_at")
//            val updatedAt: String?,
//        )
//
//        @Keep
//        data class Unlimited(
//            @SerializedName("google_play_id")
//            var googlePlayId: String? = null,
//
//            var amountFormated: String?,
//            var currency: String? = null,
//
//
//            @SerializedName("amount")
//            var amount: String?,
//            @SerializedName("coin")
//            val coin: Any?,
//            @SerializedName("created_at")
//            val createdAt: String?,
//            @SerializedName("description")
//            val description: String?,
//            @SerializedName("discount_percentage")
//            val discountPercentage: Any?,
//            @SerializedName("extra_coin")
//            val extraCoin: Any?,
//            @SerializedName("id")
//            val id: Int?,
//            @SerializedName("is_deleted")
//            val isDeleted: Int?,
//            @SerializedName("is_limited_time")
//            val isLimitedTime: Int?,
//            @SerializedName("is_unlimited")
//            val isUnlimited: Int?,
//            @SerializedName("is_weekly")
//            val isWeekly: Int?,
//            @SerializedName("is_yearly")
//            val isYearly: Int?,
//            @SerializedName("name")
//            val name: String?,
//            @SerializedName("updated_at")
//            val updatedAt: String?,
//
//            )
//    }
//}
//
//
