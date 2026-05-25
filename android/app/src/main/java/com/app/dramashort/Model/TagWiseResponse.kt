package com.app.dramashort.Model


import com.google.gson.annotations.SerializedName
import androidx.annotation.Keep

@Keep
data class TagWiseResponse(
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
        @SerializedName("cover_video")
        override val coverVideo: String?,
        @SerializedName("created_at")
        val createdAt: String?,
        @SerializedName("description")
        override val description: String?,
        @SerializedName("favourites")
        val favourites: Int?,
        @SerializedName("free_episodes")
        override val freeEpisodes: Int?,
        @SerializedName("id")
        override val id: Int?,
        @SerializedName("is_active")
        val isActive: Int?,
        @SerializedName("is_deleted")
        val isDeleted: Int?,
        @SerializedName("is_free")
        override val isFree: Int?,
        @SerializedName("is_recommended")
        val isRecommended: Int?,
        @SerializedName("likes")
        val likes: Int?,
        @SerializedName("poster")
        override val poster: String?,
        @SerializedName("tag_id")
        val tagId: String?,
        @SerializedName("thumbnail")
        override val thumbnail: String?,
        @SerializedName("title")
        override val title: String?,
        @SerializedName("total_episode")
        val totalEpisode: Int?,
        @SerializedName("type_id")
        val typeId: Int?,
        @SerializedName("updated_at")
        val updatedAt: String?,
        @SerializedName("views")

        override val views: Int?,
        override val tagsName: String?,
        override val videoUrl: String?,
        override val isLiked: Int,
        override val isFavourites: Int,
        override val seriesId: Int?,
        override val episodeNumber: Int?,
        override val thumbnailUrl: String?,
        override val categoryName: String?,
        override val isLocked: Int,
    ) : CommonInfoBase
}