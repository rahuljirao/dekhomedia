package com.app.dramashort.Model

import androidx.annotation.Keep
import com.google.gson.annotations.SerializedName

@Keep
data class VerifyGooglePlayPaymentRequest(
    @SerializedName("order_id")
    val orderId: String?,
    @SerializedName("product_id")
    val productId: String?,
    @SerializedName("purchase_token")
    val purchaseToken: String?,
    @SerializedName("status")
    val status: Int?,
    @SerializedName("transaction_id")
    val transactionId: String?
)