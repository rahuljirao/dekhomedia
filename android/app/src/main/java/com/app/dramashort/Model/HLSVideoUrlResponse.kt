package com.app.dramashort.Model


import com.google.gson.annotations.SerializedName
import androidx.annotation.Keep

@Keep
data class HLSVideoUrlResponse(
    @SerializedName("responseCode")
    val responseCode: String?,
    @SerializedName("responseData")
    val responseData: ResponseData?,
    @SerializedName("responseMessage")
    val responseMessage: String?
) {
    @Keep
    data class ResponseData(
        @SerializedName("expiresAt")
        val expiresAt: String?,
        @SerializedName("expiresIn")
        val expiresIn: Int?,
        @SerializedName("playbackType")
        val playbackType: String?,
        @SerializedName("token")
        val token: String?,
        @SerializedName("videoType")
        val videoType: String?,
        @SerializedName("videoUrl")
        val videoUrl: String?
    )
}