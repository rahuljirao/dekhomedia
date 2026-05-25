package com.app.dramashort.Model


import com.google.gson.annotations.SerializedName
import androidx.annotation.Keep

@Keep
data class TransactionListResponse(
    @SerializedName("responseCode")
    val responseCode: String?,
    @SerializedName("responseDetails")
    val responseDetails: List<ResponseDetail?>?,
    @SerializedName("responseMessage")
    val responseMessage: String?,
) {
    @Keep
    data class ResponseDetail(
        @SerializedName("currency")
        val currency: String = "$",

        @SerializedName("amount")
        val amount: String?,
        @SerializedName("coin")
        val coin: String?,
        @SerializedName("created_at")
        val createdAt: String?,
        @SerializedName("description")
        val description: Any?,
        @SerializedName("discount_percentage")
        val discountPercentage: String?,
        @SerializedName("expire_date")
        val expireDate: Any?,
        @SerializedName("extra_coin")
        val extraCoin: String?,
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