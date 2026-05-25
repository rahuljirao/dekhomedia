package com.app.dramashort.Model

import androidx.annotation.Keep
import com.google.gson.annotations.SerializedName

@Keep
data class CommonsResponse(
    @SerializedName("responseCode")
    val responseCode: String?,
    @SerializedName("responseDetails")
    val responseDetails: ResponseDetails?,
    @SerializedName("responseMessage")
    val responseMessage: String?,
) {
    @Keep
    class ResponseDetails
}