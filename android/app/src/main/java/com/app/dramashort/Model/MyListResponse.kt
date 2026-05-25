package com.app.dramashort.Model


import com.google.gson.annotations.SerializedName
import androidx.annotation.Keep

@Keep
data class MyListResponse(
    @SerializedName("responseCode")
    val responseCode: String?,
    @SerializedName("responseDetails")
    val responseDetails: ResponseDetails?,
    @SerializedName("responseMessage")
    val responseMessage: String?,
) {
    @Keep
    data class ResponseDetails(
        @SerializedName("history")
        val history: List<History?>?,
        @SerializedName("mylist")
        val mylist: List<Mylist?>?,
    ) {
        @Keep
        data class History(
            @SerializedName("category_id")
            val categoryId: Int?,
            @SerializedName("category_name")
            val categoryName: String?,
            @SerializedName("cover_video")
            val coverVideo: String?,
            @SerializedName("created_at")
            val createdAt: String?,
            @SerializedName("description")
            val description: String?,
            @SerializedName("favourites")
            val favourites: Int?,
            @SerializedName("free_episodes")
            val freeEpisodes: Int?,
            @SerializedName("id")
            val id: Int?,
            @SerializedName("is_active")
            val isActive: Int?,
            @SerializedName("is_added_list")
            val isAddedList: Int?,
            @SerializedName("is_auto_unlocked")
            val isAutoUnlocked: Int?,
            @SerializedName("is_deleted")
            val isDeleted: Int?,
            @SerializedName("is_free")
            val isFree: Int?,
            @SerializedName("is_liked")
            val isLiked: Int?,
            @SerializedName("is_recommended")
            val isRecommended: Int?,
            @SerializedName("last_unlocked_episode")
            val lastUnlockedEpisode: Int?,
            @SerializedName("last_viewed_episode")
            val lastViewedEpisode: Int?,
            @SerializedName("last_watched_ads_date")
            val lastWatchedAdsDate: String?,
            @SerializedName("likes")
            val likes: Int?,
            @SerializedName("poster")
            val poster: String?,
            @SerializedName("series_id")
            val seriesId: Int?,
            @SerializedName("tag_id")
            val tagId: String?,
            @SerializedName("tags_name")
            val tagsName: String?,
            @SerializedName("thumbnail")
            val thumbnail: String?,
            @SerializedName("title")
            val title: String?,
            @SerializedName("total_episode")
            val totalEpisode: Int?,
            @SerializedName("type_id")
            val typeId: Int?,
            @SerializedName("updated_at")
            val updatedAt: String?,
            @SerializedName("user_id")
            val userId: Int?,
            @SerializedName("views")
            val views: Int?,
            @SerializedName("watched_ads_for_episode")
            val watchedAdsForEpisode: Int?,
        )

        @Keep
        data class Mylist(
            @SerializedName("category_id")
            val categoryId: Int?,
            @SerializedName("category_name")
            val categoryName: String?,
            @SerializedName("cover_video")
            val coverVideo: String?,
            @SerializedName("created_at")
            val createdAt: String?,
            @SerializedName("description")
            val description: String?,
            @SerializedName("episode_id")
            val episodeId: Int?,
            @SerializedName("favourites")
            val favourites: Int?,
            @SerializedName("free_episodes")
            val freeEpisodes: Int?,
            @SerializedName("id")
            val id: Int?,
            @SerializedName("is_active")
            val isActive: Int?,
            @SerializedName("is_deleted")
            val isDeleted: Int?,
            @SerializedName("is_free")
            val isFree: Int?,
            @SerializedName("is_liked")
            val isLiked: Int?,
            @SerializedName("is_recommended")
            val isRecommended: Int?,
            @SerializedName("likes")
            val likes: Int?,
            @SerializedName("poster")
            val poster: String?,
            @SerializedName("series_id")
            val seriesId: Int?,
            @SerializedName("tag_id")
            val tagId: String?,
            @SerializedName("tags_name")
            val tagsName: String?,
            @SerializedName("thumbnail")
            val thumbnail: String?,
            @SerializedName("title")
            val title: String?,
            @SerializedName("total_episode")
            val totalEpisode: Int?,
            @SerializedName("type_id")
            val typeId: Int?,
            @SerializedName("updated_at")
            val updatedAt: String?,
            @SerializedName("user_id")
            val userId: Int?,
            @SerializedName("views")
            val views: Int?,
        )
    }
}

//
//@Keep
//data class MyListResponse(
//    @SerializedName("responseCode")
//    val responseCode: String?,
//    @SerializedName("responseDetails")
//    val responseDetails: ResponseDetails?,
//    @SerializedName("responseMessage")
//    val responseMessage: String?
//) {
//    @Keep
//    data class ResponseDetails(
//        @SerializedName("history")
//        val history: List<Any?>?,
//        @SerializedName("mylist")
//        val mylist: List<Mylist?>?
//    ) {
//        @Keep
//        data class Mylist(
//            @SerializedName("category_id")
//            val categoryId: Int?,
//            @SerializedName("cover_video")
//            val coverVideo: String?,
//            @SerializedName("created_at")
//            val createdAt: String?,
//            @SerializedName("description")
//            val description: String?,
//            @SerializedName("free_episodes")
//            val freeEpisodes: Int?,
//            @SerializedName("id")
//            val id: Int?,
//            @SerializedName("is_active")
//            val isActive: Int?,
//            @SerializedName("is_deleted")
//            val isDeleted: Int?,
//            @SerializedName("is_free")
//            val isFree: Int?,
//            @SerializedName("is_recommended")
//            val isRecommended: Int?,
//            @SerializedName("likes")
//            val likes: Int?,
//            @SerializedName("poster")
//            val poster: String?,
//            @SerializedName("tag_id")
//            val tagId: String?,
//            @SerializedName("thumbnail")
//            val thumbnail: String?,
//            @SerializedName("title")
//            val title: String?,
//            @SerializedName("total_episode")
//            val totalEpisode: Int?,
//            @SerializedName("type_id")
//            val typeId: Int?,
//            @SerializedName("updated_at")
//            val updatedAt: String?,
//            @SerializedName("views")
//            val views: Int?
//        )
//    }
//}