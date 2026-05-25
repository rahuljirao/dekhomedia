package com.app.dramashort.Model


import com.google.gson.annotations.SerializedName
import androidx.annotation.Keep

@Keep
data class SocialLinksResponse(
    @SerializedName("responseCode")
    val responseCode: String?,
    @SerializedName("responseDetails")
    val responseDetails: ResponseDetails?,
    @SerializedName("responseMessage")
    val responseMessage: String?,
) {
    @Keep
    data class ResponseDetails(
        @SerializedName("created_at")
        val createdAt: String?,
        @SerializedName("email")
        val email: String?,
        @SerializedName("follow_us_in_facebook")
        val followUsInFacebook: String?,
        @SerializedName("follow_us_on_instagram")
        val followUsOnInstagram: String?,


        @SerializedName("follow_us_on_youtube")
        val followUsOnYoutube: String?,


        @SerializedName("highlight")
        val highlight: String?,
        @SerializedName("id")
        val id: Int?,
        @SerializedName("mobile_number")
        val mobileNumber: String?,


        @SerializedName("official_website")
        val officialWebsite: String?,


        @SerializedName("follow_us_in_youtube")
        val followUsInYoutube: String?,


        @SerializedName("follow_us_in_whatsapp_channel")
        val followUsInWhatsappChannel: String?,


        @SerializedName("updated_at")
        val updatedAt: String?,
    )
}