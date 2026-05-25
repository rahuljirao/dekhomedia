package com.app.dramashort.Model


import com.google.gson.annotations.SerializedName
import androidx.annotation.Keep

@Keep
data class AdResponse(
    @SerializedName("responseCode")
    val responseCode: String?,
    @SerializedName("responseDetails")
    val responseDetails: List<AdPlatform?>?,
    @SerializedName("responseMessage")
    val responseMessage: String?,
) {
    @Keep
    data class AdPlatform(
        @SerializedName("ad_banner_id")
        val adBannerId: List<String?>?,
        @SerializedName("ad_banner_remarks")
        val adBannerRemarks: String?,
        @SerializedName("ad_banner_status")
        val adBannerStatus: Int?,
        @SerializedName("ad_interstitial_clicks")
        val adInterstitialClicks: Int?,
        @SerializedName("ad_interstitial_id")
        val adInterstitialId: List<String?>?,
        @SerializedName("ad_interstitial_remarks")
        val adInterstitialRemarks: String?,
        @SerializedName("ad_interstitial_status")
        val adInterstitialStatus: Int?,
        @SerializedName("ad_native_id")
        val adNativeId: List<String?>?,
        @SerializedName("ad_native_remarks")
        val adNativeRemarks: String?,
        @SerializedName("ad_native_status")
        val adNativeStatus: Int?,
        @SerializedName("ad_platform_name")
        val adPlatformName: String?,
        @SerializedName("ad_publisher_id")
        val adPublisherId: String?,
        @SerializedName("ad_reward_id")
        val adRewardId: List<String?>?,
        @SerializedName("ad_reward_remarks")
        val adRewardRemarks: String?,
        @SerializedName("ad_reward_status")
        val adRewardStatus: Int?,
        @SerializedName("created_at")
        val createdAt: String?,
        @SerializedName("id")
        val id: Int?,
        @SerializedName("status")
        val status: Int?,
        @SerializedName("updated_at")
        val updatedAt: String?,
    )
}