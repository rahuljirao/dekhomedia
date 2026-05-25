package com.app.dramashort.Model


import com.google.gson.annotations.SerializedName
import androidx.annotation.Keep

@Keep
data class createPaymentResponse(
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
        val amount: String?,
        @SerializedName("created_at")
        val createdAt: String?,
        @SerializedName("expire_date")
        val expireDate: Any?,
        @SerializedName("id")
        val id: Int?,
        @SerializedName("payment_getway_id")
        val paymentGetwayId: Int?,
        @SerializedName("plan_id")
        val planId: Int?,
        @SerializedName("status")
        val status: Int?,
        @SerializedName("transaction_id")
        val transactionId: String?,
        @SerializedName("transaction_key")
        val transactionKey: Any?,
        @SerializedName("updated_at")
        val updatedAt: String?,
        @SerializedName("user_id")
        val userId: Int?,
    )
}


