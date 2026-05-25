package com.app.dramashort.Model

import androidx.annotation.Keep
import com.google.gson.annotations.SerializedName

// ── Request ──────────────────────────────────────────────────────────────────

@Keep
data class MobileLoginRequest(
    @SerializedName("mobile_number") val mobileNumber: String,
    @SerializedName("device_id") val deviceId: String,
    @SerializedName("device_token") val deviceToken: String? = null,
    @SerializedName("content_group") val contentGroup: String = "normal",
    @SerializedName("referred_by_link") val referredByLink: String? = null,
    @SerializedName("promoter_id") val promoterId: Int? = null
)

// ── Promoter Verify Response ──────────────────────────────────────────────────

@Keep
data class PromoterVerifyResponse(
    @SerializedName("responseCode") val responseCode: String?,
    @SerializedName("responseMessage") val responseMessage: String?,
    @SerializedName("responseDetails") val responseDetails: Details?
) {
    @Keep
    data class Details(
        @SerializedName("promoter_id") val promoterId: Int?,
        @SerializedName("promoter_name") val promoterName: String?,
        @SerializedName("slug") val slug: String?,
        /** "normal" or "premium" */
        @SerializedName("content_group") val contentGroup: String?
    )
}

// ── Mobile Login Response (reuses SignUpResponse structure) ───────────────────

@Keep
data class MobileLoginResponse(
    @SerializedName("responseCode") val responseCode: String?,
    @SerializedName("responseMessage") val responseMessage: String?,
    @SerializedName("responseDetails") val responseDetails: SignUpResponse.ResponseDetails?
)
