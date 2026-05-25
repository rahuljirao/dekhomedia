package com.app.dramashort.Model


import com.google.gson.annotations.SerializedName
import androidx.annotation.Keep

@Keep
data class RewardHistoryResponse(
    @SerializedName("responseCode")
    val responseCode: String?,
    @SerializedName("responseDetails")
    val responseDetails: List<ResponseDetail?>?,
    @SerializedName("responseMessage")
    val responseMessage: String?,
) {
    @Keep
    data class ResponseDetail(
        @SerializedName("coin")
        val coin: Int?,
        @SerializedName("created_at")
        val createdAt: String?,
        @SerializedName("expired")
        val expired: String?,
        @SerializedName("id")
        val id: Int?,
        @SerializedName("is_expired")
        val isExpired: Int?,
        @SerializedName("title")
        val title: String?,
        @SerializedName("updated_at")
        val updatedAt: Any?,
        @SerializedName("user_id")
        val userId: Int?,
    )
}