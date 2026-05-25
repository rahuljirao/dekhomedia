package com.app.dramashort.Model


import com.google.gson.annotations.SerializedName
import androidx.annotation.Keep

@Keep
data class PaymentOptionResponse(
    @SerializedName("responseCode")
    val responseCode: String?,
    @SerializedName("responseDetails")
    val responseDetails: List<ResponseDetail?>?,
    @SerializedName("responseMessage")
    val responseMessage: String?,
) {
    @Keep
    data class ResponseDetail(
        @SerializedName("api_id")
        val apiId: String?,
        @SerializedName("api_key")
        val apiKey: String?,
        @SerializedName("created_at")
        val createdAt: String?,
        @SerializedName("id")
        val id: Int?,
        @SerializedName("is_active")
        val isActive: Int?,
        @SerializedName("is_deleted")
        val isDeleted: Int?,
        @SerializedName("name")
        val name: String?,
        @SerializedName("updated_at")
        val updatedAt: String?,
        var isSelected: Boolean = false,
    )
}