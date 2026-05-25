package com.app.dramashort.Model


import com.google.gson.annotations.SerializedName
import androidx.annotation.Keep

@Keep
data class DailyWatchAdsResponse(
    @SerializedName("responseCode")
    val responseCode: String?,
    @SerializedName("responseDetails")
    val responseDetails: ResponseDetails?,
    @SerializedName("responseMessage")
    val responseMessage: String?,
) {
    @Keep
    data class ResponseDetails(
        @SerializedName("bind_email")
        val bindEmail: Int?,
        @SerializedName("checked_in_day_1")
        val checkedInDay1: Any?,
        @SerializedName("checked_in_day_2")
        val checkedInDay2: String?,
        @SerializedName("checked_in_day_3")
        val checkedInDay3: Any?,
        @SerializedName("checked_in_day_4")
        val checkedInDay4: Any?,
        @SerializedName("checked_in_day_5")
        val checkedInDay5: Any?,
        @SerializedName("checked_in_day_6")
        val checkedInDay6: Any?,
        @SerializedName("checked_in_day_7")
        val checkedInDay7: Any?,
        @SerializedName("coin")
        val coin: Int?,
        @SerializedName("coin_balance")
        val coinBalance: Int?,
        @SerializedName("created_at")
        val createdAt: String?,
        @SerializedName("daily_watched_ads")
        val dailyWatchedAds: Int?,
        @SerializedName("device_token")
        val deviceToken: Any?,
        @SerializedName("email")
        val email: Any?,
        @SerializedName("extra_daily")
        val extraDaily: Int?,
        @SerializedName("follow_us_on_facebook")
        val followUsOnFacebook: Int?,
        @SerializedName("follow_us_on_instagram")
        val followUsOnInstagram: Int?,
        @SerializedName("follow_us_on_youtube")
        val followUsOnYoutube: Int?,
        @SerializedName("id")
        val id: Int?,
        @SerializedName("invited_id")
        val invitedId: Any?,
        @SerializedName("is_blocked")
        val isBlocked: Int?,
        @SerializedName("is_deleted")
        val isDeleted: Int?,
        @SerializedName("is_picture_and_picture")
        val isPictureAndPicture: Int?,
        @SerializedName("is_weekly_vip")
        val isWeeklyVip: Int?,
        @SerializedName("is_yearly_vip")
        val isYearlyVip: Int?,
        @SerializedName("language_id")
        val languageId: Int?,
        @SerializedName("link_whatsapp")
        val linkWhatsapp: Int?,
        @SerializedName("login_reward")
        val loginReward: Int?,
        @SerializedName("login_type")
        val loginType: String?,
        @SerializedName("login_type_id")
        val loginTypeId: Any?,
        @SerializedName("name")
        val name: Any?,
        @SerializedName("profile_picture")
        val profilePicture: Any?,
        @SerializedName("subscribed_email")
        val subscribedEmail: Any?,
        @SerializedName("uid")
        val uid: String?,
        @SerializedName("updated_at")
        val updatedAt: String?,
        @SerializedName("wallet_balance")
        val walletBalance: Int?,
        @SerializedName("weekly_vip_ended")
        val weeklyVipEnded: Any?,
        @SerializedName("yearly_vip_ended")
        val yearlyVipEnded: Any?,
    )
}