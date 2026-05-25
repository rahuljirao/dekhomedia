package com.app.dramashort.Model


import com.google.gson.annotations.SerializedName
import androidx.annotation.Keep

//@Keep
//data class StripePaymentIntentResponse(
//    @SerializedName("responseCode")
//    val responseCode: String?,
//    @SerializedName("responseDetails")
//    val responseDetails: String?,
//    @SerializedName("responseMessage")
//    val responseMessage: String?,
//)
//

@Keep
data class StripePaymentIntentResponse(
    @SerializedName("responseCode")
    val responseCode: String?,
    @SerializedName("responseDetails")
    val responseDetails: ResponseDetails?,
    @SerializedName("responseMessage")
    val responseMessage: String?
) {
    @Keep
    data class ResponseDetails(
        @SerializedName("amount")
        val amount: String?,
        @SerializedName("clientSecret")
        val clientSecret: String?,
        @SerializedName("currency")
        val currency: String?,
        @SerializedName("currencySymbol")
        val currencySymbol: String?,
        @SerializedName("formattedAmount")
        val formattedAmount: String?,
        @SerializedName("paymentIntentId")
        val paymentIntentId: String?,
        @SerializedName("userLocation")
        val userLocation: UserLocation?
    ) {
        @Keep
        data class UserLocation(
            @SerializedName("country")
            val country: String?,
            @SerializedName("countryCode")
            val countryCode: String?
        )
    }
}