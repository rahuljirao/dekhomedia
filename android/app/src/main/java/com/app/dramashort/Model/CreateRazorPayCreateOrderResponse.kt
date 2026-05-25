package com.app.dramashort.Model

import androidx.annotation.Keep
import com.google.gson.annotations.SerializedName

@Keep
data class CreateRazorPayCreateOrderResponse(
    @SerializedName("responseCode")
    val responseCode: String?,
    @SerializedName("responseDetails")
    val responseDetails: ResponseDetails?,
    @SerializedName("responseMessage")
    val responseMessage: String?,
) {
    @Keep
    data class ResponseDetails(
        @SerializedName("amount")
        val amount: Int?,
        @SerializedName("amount_due")
        val amountDue: Int?,
        @SerializedName("amount_paid")
        val amountPaid: Int?,
        @SerializedName("attempts")
        val attempts: Int?,
        @SerializedName("created_at")
        val createdAt: Int?,
        @SerializedName("currency")
        val currency: String?,
        @SerializedName("entity")
        val entity: String?,
        @SerializedName("id")
        val id: String?,
        @SerializedName("notes")
        val notes: List<Any?>?,
        @SerializedName("offer_id")
        val offerId: Any?,
        @SerializedName("receipt")
        val receipt: String?,
        @SerializedName("status")
        val status: String?,
    )
}
