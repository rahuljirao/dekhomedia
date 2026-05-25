package com.app.dramashort.Model


import com.google.gson.annotations.SerializedName
import androidx.annotation.Keep

@Keep
data class CoinDataResponse(
    @SerializedName("responseCode")
    val responseCode: String?,
    @SerializedName("responseDetails")
    val responseDetails: List<ResponseDetail?>?,
    @SerializedName("responseMessage")
    val responseMessage: String?,
) {
    @Keep
    data class ResponseDetail(
        @SerializedName("bind_email_coin")
        val bindEmailCoin: Int?,
        @SerializedName("created_at")
        val createdAt: String?,
        @SerializedName("daily_watch_ads_for_maximum_coin")
        val dailyWatchAdsForMaximumCoin: Int?,
        @SerializedName("daily_watch_ads_for_minimum_coin")
        val dailyWatchAdsForMinimumCoin: Int?,
        @SerializedName("daily_watch_maximum_ads")
        val dailyWatchMaximumAds: Int?,
        @SerializedName("day_1_coin")
        val day1Coin: Int?,
        @SerializedName("day_2_coin")
        val day2Coin: Int?,
        @SerializedName("day_3_coin")
        val day3Coin: Int?,
        @SerializedName("day_4_coin")
        val day4Coin: Int?,
        @SerializedName("day_5_coin")
        val day5Coin: Int?,
        @SerializedName("day_6_coin")
        val day6Coin: Int?,
        @SerializedName("day_7_coin")
        val day7Coin: Int?,
        @SerializedName("extra_daily")
        val extraDaily: Int?,
        @SerializedName("follow_us_on_facebook_coin")
        val followUsOnFacebookCoin: Int?,
        @SerializedName("follow_us_on_instagram_coin")
        val followUsOnInstagramCoin: Int?,
        @SerializedName("follow_us_on_youtube_coin")
        val followUsOnYoutubeCoin: Int?,
        @SerializedName("how_many_episode_watch_after_ads")
        val howManyEpisodeWatchAfterAds: Int?,
        @SerializedName("id")
        val id: Int?,
        @SerializedName("link_whatsapp_coin")
        val linkWhatsappCoin: Int?,
        @SerializedName("login_reward_coin")
        val loginRewardCoin: Int?,
        @SerializedName("per_episode_coin")
        val perEpisodeCoin: Int?,
        @SerializedName("time_after_watch_ads")
        val timeAfterWatchAds: String?,
        @SerializedName("turn_on_notification_coin")
        val turnOnNotificationCoin: Int?,
        @SerializedName("updated_at")
        val updatedAt: String?,
        @SerializedName("watch_ads_for_episode")
        val watchAdsForEpisode: Int?,

        @SerializedName("reset_ads_time")
        val resetAdsTime: String?,

        @SerializedName("daily_watched_ads")
        val dailyWatchedAds: Int?,

        @SerializedName("time_between_daily_ads")
        val timeBetweenDailyAds: String = "00:00:30",

        )
}