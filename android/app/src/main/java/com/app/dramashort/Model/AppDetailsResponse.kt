package com.app.dramashort.Model


import com.google.gson.annotations.SerializedName
import androidx.annotation.Keep

@Keep
data class AppDetailsResponse(
    @SerializedName("responseCode")
    val responseCode: String?,
    @SerializedName("responseDetails")
    val responseDetails: ResponseDetails?,
    @SerializedName("responseMessage")
    val responseMessage: String?,
) {
    @Keep
    data class ResponseDetails(
        @SerializedName("copyright_text")
        val copyrightText: String?,
        @SerializedName("created_at")
        val createdAt: String?,
        @SerializedName("favicon")
        val favicon: String?,
        @SerializedName("id")
        val id: Int?,
        @SerializedName("is_admin_maintenance")
        val isAdminMaintenance: Int?,
        @SerializedName("is_website_maintenance")
        val isWebsiteMaintenance: Int?,
        @SerializedName("logo")
        val logo: String?,
        @SerializedName("social_media")
        val socialMedia: SocialMedia?,
        @SerializedName("title")
        val title: String?,
        @SerializedName("updated_at")
        val updatedAt: String?,
    ) {
        @Keep
        data class SocialMedia(
            @SerializedName("created_at")
            val createdAt: String?,
            @SerializedName("email")
            val email: String?,
            @SerializedName("follow_us_in_facebook")
            val followUsInFacebook: String?,
            @SerializedName("follow_us_in_youtube")
            val followUsInYoutube: String?,
            @SerializedName("follow_us_on_instagram")
            val followUsOnInstagram: String?,
            @SerializedName("highlight")
            val highlight: String?,
            @SerializedName("id")
            val id: Int?,
            @SerializedName("mobile_number")
            val mobileNumber: String?,
            @SerializedName("official_website")
            val officialWebsite: String?,
            @SerializedName("updated_at")
            val updatedAt: String?,
        )
    }
}