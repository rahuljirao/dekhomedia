package com.app.dramashort.Model


import com.google.gson.annotations.SerializedName
import androidx.annotation.Keep

@Keep
data class UnlockedEpisodeListResponse(
    @SerializedName("responseCode")
    val responseCode: String?,
    @SerializedName("responseDetails")
    val responseDetails: List<ResponseDetail?>?,
    @SerializedName("responseMessage")
    val responseMessage: String?,
) {
    @Keep
    data class ResponseDetail(
        @SerializedName("coin")
        val coin: Int?,
        @SerializedName("created_at")
        val createdAt: String?,
        @SerializedName("episode_id")
        val episodeId: Int?,
        @SerializedName("episode_number")
        val episodeNumber: Int?,
        @SerializedName("id")
        val id: Int?,
        @SerializedName("series_id")
        val seriesId: Int?,
        @SerializedName("title")
        val title: String?,
        @SerializedName("updated_at")
        val updatedAt: Any?,
        @SerializedName("user_id")
        val userId: Int?,
    )
}