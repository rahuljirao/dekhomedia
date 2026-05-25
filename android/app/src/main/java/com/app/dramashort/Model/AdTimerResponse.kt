package com.app.dramashort.Model


import com.google.gson.annotations.SerializedName
import androidx.annotation.Keep

@Keep
data class AdTimerResponse(
    @SerializedName("responseCode")
    val responseCode: String?,
    @SerializedName("responseDetails")
    val responseDetails: ResponseDetails?,
    @SerializedName("responseMessage")
    val responseMessage: String?,
) {
    @Keep
    data class ResponseDetails(
        @SerializedName("difference")
        val difference: String?,
        @SerializedName("is_locked")
        var isLocked: Int?,
        @SerializedName("last_watched_ads_date")
        val lastWatchedAdsDate: String?,
        @SerializedName("unlock_time")
        val unlockTime: String?,
        @SerializedName("watched_ads_for_episode")
        var watchedAdsForEpisode: Int?,

        @SerializedName("total_ads")
        var totalAds: Int?,
    )
}