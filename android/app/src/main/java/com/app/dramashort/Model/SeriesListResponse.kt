package com.app.dramashort.Model


import com.google.gson.annotations.SerializedName
import androidx.annotation.Keep

@Keep
data class SeriesListResponse(
    @SerializedName("responseCode")
    val responseCode: String?,
    @SerializedName("responseDetails")
    val responseDetails: List<ResponseDetail?>?,
    @SerializedName("responseMessage")
    val responseMessage: String?,
) {
    @Keep
    data class ResponseDetail(
        @SerializedName("category_id")
        val categoryId: Int?,
        @SerializedName("category_name")
        override val categoryName: String?,
        @SerializedName("cover_video")
        override val coverVideo: String?,
        @SerializedName("created_at")
        val createdAt: String?,
        @SerializedName("description")
        override val description: String?,

        @SerializedName("free_episodes")
        override val freeEpisodes: Int?,
        @SerializedName("id")
        override val id: Int?,
        @SerializedName("is_active")
        val isActive: Int?,
        @SerializedName("is_added_list")
        val isAddedList: Any?,
        @SerializedName("is_auto_unlocked")
        override var isAutoUnlocked: Int = 0,
        @SerializedName("is_deleted")
        val isDeleted: Int?,
        @SerializedName("is_free")
        val isFree: Int?,
        @SerializedName("is_recommended")
        val isRecommended: Int?,
        @SerializedName("last_unlocked_episode")
        val lastUnlockedEpisode: Any?,
        @SerializedName("last_viewed_episode")
        val lastViewedEpisode: Any?,
        @SerializedName("last_watched_ads_date")
        val lastWatchedAdsDate: Any?,

        @SerializedName("poster")
        override val poster: String?,
        @SerializedName("tag_id")
        val tagId: String?,
        @SerializedName("tags")
        val tags: List<Tag?>?,
        @SerializedName("thumbnail")
        override val thumbnail: String?,
        @SerializedName("title")
        override val title: String?,
        @SerializedName("total_episode")
        val totalEpisode: Int?,
        @SerializedName("type_id")
        val typeId: Int?,
        @SerializedName("type_image")
        val typeImage: String?,
        @SerializedName("type_name")
        val typeName: String?,
        @SerializedName("updated_at")
        val updatedAt: String?,
        @SerializedName("views")
        override val views: Int?,
        @SerializedName("watched_ads_for_episode")
        val watchedAdsForEpisode: Any?,

        override val tagsName: String?,
        override val videoUrl: String?,

        override val seriesId: Int? = id,

        override val episodeNumber: Int?,
        override val thumbnailUrl: String?,
        override val isLocked: Int = 0,
        override val coin: Int?,

        @SerializedName("likes")
        override var likedCount: Int,

        @SerializedName("is_liked")
        override val isLiked: Int,


        @SerializedName("favourites")
        override var favouritesCount: Int,

        @SerializedName("is_favourite")
        override val isFavourites: Int = 0,


        ) : CommonInfoReelBase {
        @Keep
        data class Tag(
            @SerializedName("id")
            val id: Int?,
            @SerializedName("name")
            val name: String?,
        )
    }
}