package com.app.dramashort.Model


import com.google.gson.annotations.SerializedName
import androidx.annotation.Keep

@Keep
data class UnlockEpisodeResponse(
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
        @SerializedName("id")
        val id: Int?,
        @SerializedName("is_added_list")
        val isAddedList: Int?,
        @SerializedName("is_auto_unlocked")
        val isAutoUnlocked: Int?,
        @SerializedName("last_unlocked_episode")
        val lastUnlockedEpisode: Int?,
        @SerializedName("last_viewed_episode")
        val lastViewedEpisode: Int?,
        @SerializedName("last_watched_ads_date")
        val lastWatchedAdsDate: Any?,
        @SerializedName("series_id")
        val seriesId: Int?,
        @SerializedName("updated_at")
        val updatedAt: String?,
        @SerializedName("user_id")
        val userId: Int?,
        @SerializedName("watched_ads_for_episode")
        val watchedAdsForEpisode: Int?,
    )
}