package com.app.dramashort.Model


import androidx.annotation.Keep
import com.google.gson.annotations.SerializedName

@Keep
data class EpisodeListResponse(
    @SerializedName("responseCode")
    val responseCode: String? = null,
    @SerializedName("responseDetails")
    val responseDetails: ResponseDetails? = null,
    @SerializedName("responseMessage")
    val responseMessage: String? = null,
) {
    @Keep
    data class ResponseDetails(
        @SerializedName("all_episodes")
        val allEpisodes: List<AllEpisode?>? = null,
        @SerializedName("series")
        val series: Series? = null,
        @SerializedName("you_might_liked")
        val youMightLiked: List<YouMightLiked?>?,
    ) {
        @Keep
        data class AllEpisode(

            @SerializedName("created_at")
            val createdAt: String? = null,
            @SerializedName("description")
            override val description: String? = null,
            @SerializedName("episode_number")
            override val episodeNumber: Int? = null,

            @SerializedName("id")
            override val id: Int? = null,


            @SerializedName("is_deleted")
            val isDeleted: Int? = null,
            @SerializedName("is_liked")
            override var isLiked: Int = 0,
            @SerializedName("series_id")
            override val seriesId: Int? = null,
            @SerializedName("tags")
            val tags: Any? = null,
            @SerializedName("thumbnail_url")
            override val thumbnailUrl: String? = null,
            @SerializedName("title")
            override val title: String? = null,
            @SerializedName("updated_at")
            val updatedAt: String? = null,
            @SerializedName("video_url")
            override val videoUrl: String? = null,

            @SerializedName("is_locked")
            override val isLocked: Int = 0,

            @SerializedName("is_favourite")
            override var isFavourites: Int,

            @SerializedName("poster")
            override var poster: String?,

            @SerializedName("coin")
            override val coin: Int? = null,


            override val tagsName: String?,
            override val views: Int?,
            override val thumbnail: String?,
            override val freeEpisodes: Int?,
            override var categoryName: String?,
            override val coverVideo: String?,

            override var likedCount: Int,
            override var favouritesCount: Int,
            override var isAutoUnlocked: Int,
        ) : CommonInfoReelBase

        @Keep
        data class Series(
            @SerializedName("category_id")
            val categoryId: Int? = null,
            @SerializedName("category_name")
            val categoryName: String? = null,
            @SerializedName("cover_video")
            val coverVideo: String? = null,
            @SerializedName("created_at")
            val createdAt: String? = null,
            @SerializedName("description")
            val description: String? = null,
            @SerializedName("free_episodes")
            val freeEpisodes: Int? = null,
            @SerializedName("id")
            val id: Int? = null,
            @SerializedName("is_active")
            val isActive: Int? = null,
            @SerializedName("is_added_list")
            val isAddedList: Int? = null,
            @SerializedName("is_auto_unlocked")
            val isAutoUnlocked: Int? = null,
            @SerializedName("is_deleted")
            val isDeleted: Int? = null,
            @SerializedName("is_free")
            val isFree: Int? = null,
            @SerializedName("is_recommended")
            val isRecommended: Int? = null,
            @SerializedName("last_unlocked_episode")
            val lastUnlockedEpisode: Int? = null,
            @SerializedName("last_viewed_episode")
            val lastViewedEpisode: Int? = null,
            @SerializedName("last_watched_ads_date")
            val lastWatchedAdsDate: Any? = null,
            @SerializedName("tag_id")
            val tagId: String? = null,
            @SerializedName("tags")
            val tags: List<Tag?>? = null,

            @SerializedName("tags_name")
            val tagsName: List<Tag?>? = null,


            @SerializedName("thumbnail")
            val thumbnail: String? = null,
            @SerializedName("title")
            val title: String? = null,
            @SerializedName("total_episode")
            val totalEpisode: Int? = null,
            @SerializedName("type_id")
            val typeId: Int? = null,
            @SerializedName("type_image")
            val typeImage: String? = null,
            @SerializedName("type_name")
            val typeName: String? = null,
            @SerializedName("updated_at")
            val updatedAt: String? = null,
            @SerializedName("views")
            val views: Int? = null,
            @SerializedName("watched_ads_for_episode")
            val watchedAdsForEpisode: Int? = null,

            @SerializedName("favourites")
            val favourites: Int? = null,

            @SerializedName("is_favourite")
            val isFavourite: Int? = null,


            @SerializedName("is_liked")
            val isLiked: Int? = null,

            @SerializedName("likes")
            val likes: Int? = null,


            @SerializedName("poster")
            val poster: String? = null,

            @SerializedName("availableCoin")
            val availableCoin: Int?? = null,

            @SerializedName("availableWalletBalance")
            val availableWalletBalance: Int? = null,

            ) {
            @Keep
            data class Tag(
                @SerializedName("id")
                val id: Int? = null,
                @SerializedName("name")
                val name: String? = null,
            )
        }

        @Keep
        data class YouMightLiked(
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
            @SerializedName("is_liked")
            override val isLiked: Int = 0,
            @SerializedName("is_recommended")
            val isRecommended: Int?,
            @SerializedName("likes")
            val likes: Int?,
            @SerializedName("match_count")
            val matchCount: Int?,
            @SerializedName("poster")
            override val poster: String?,
            @SerializedName("tag_id")
            val tagId: String?,
            @SerializedName("tags_name")
            override val tagsName: String?,
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
            override val videoUrl: String?,
            override val isFavourites: Int,
            override val seriesId: Int?,
            override val episodeNumber: Int?,
            override val thumbnailUrl: String?,
            override val isLocked: Int,
        ) : CommonInfoBase
    }
}

//
//@Keep
//data class EpisodeListResponse(
//    @SerializedName("responseCode")
//    val responseCode: String?,
//    @SerializedName("responseDetails")
//    val responseDetails: ResponseDetails?,
//    @SerializedName("responseMessage")
//    val responseMessage: String?
//) {
//    @Keep
//    data class ResponseDetails(
//        @SerializedName("all_episodes")
//        val allEpisodes: List<AllEpisode?>?,
//        @SerializedName("series")
//        val series: Series?,
//        @SerializedName("you_might_liked")
//        val youMightLiked: List<YouMightLiked?>?
//    ) {
//        @Keep
//        data class AllEpisode(
//            @SerializedName("coin")
//            val coin: Int?,
//            @SerializedName("created_at")
//            val createdAt: String?,
//            @SerializedName("description")
//            val description: String?,
//            @SerializedName("episode_number")
//            val episodeNumber: Int?,
//            @SerializedName("id")
//            val id: Int?,
//            @SerializedName("is_deleted")
//            val isDeleted: Int?,
//            @SerializedName("is_favourite")
//            val isFavourite: Int?,
//            @SerializedName("is_liked")
//            val isLiked: Int?,
//            @SerializedName("is_locked")
//            val isLocked: Int?,
//            @SerializedName("is_viewed")
//            val isViewed: Int?,
//            @SerializedName("series_id")
//            val seriesId: Int?,
//            @SerializedName("tags")
//            val tags: Any?,
//            @SerializedName("tags_name")
//            val tagsName: List<Any?>?,
//            @SerializedName("thumbnail_url")
//            val thumbnailUrl: String?,
//            @SerializedName("title")
//            val title: String?,
//            @SerializedName("updated_at")
//            val updatedAt: String?,
//            @SerializedName("video_url")
//            val videoUrl: String?
//        )
//
//        @Keep
//        data class Series(
//            @SerializedName("availableCoin")
//            val availableCoin: Int?,
//            @SerializedName("availableWalletBalance")
//            val availableWalletBalance: Int?,
//            @SerializedName("category_id")
//            val categoryId: Int?,
//            @SerializedName("category_name")
//            val categoryName: String?,
//            @SerializedName("cover_video")
//            val coverVideo: String?,
//            @SerializedName("created_at")
//            val createdAt: String?,
//            @SerializedName("description")
//            val description: String?,
//            @SerializedName("favourites")
//            val favourites: Int?,
//            @SerializedName("free_episodes")
//            val freeEpisodes: Int?,
//            @SerializedName("id")
//            val id: Int?,
//            @SerializedName("is_active")
//            val isActive: Int?,
//            @SerializedName("is_added_list")
//            val isAddedList: Any?,
//            @SerializedName("is_auto_unlocked")
//            val isAutoUnlocked: Any?,
//            @SerializedName("is_deleted")
//            val isDeleted: Int?,
//            @SerializedName("is_favourite")
//            val isFavourite: Int?,
//            @SerializedName("is_free")
//            val isFree: Int?,
//            @SerializedName("is_liked")
//            val isLiked: Int?,
//            @SerializedName("is_recommended")
//            val isRecommended: Int?,
//            @SerializedName("last_unlocked_episode")
//            val lastUnlockedEpisode: Any?,
//            @SerializedName("last_viewed_episode")
//            val lastViewedEpisode: Any?,
//            @SerializedName("last_watched_ads_date")
//            val lastWatchedAdsDate: Any?,
//            @SerializedName("likes")
//            val likes: Int?,
//            @SerializedName("poster")
//            val poster: String?,
//            @SerializedName("tag_id")
//            val tagId: String?,
//            @SerializedName("tags_name")
//            val tagsName: List<TagsName?>?,
//            @SerializedName("thumbnail")
//            val thumbnail: String?,
//            @SerializedName("title")
//            val title: String?,
//            @SerializedName("total_episode")
//            val totalEpisode: Int?,
//            @SerializedName("type_id")
//            val typeId: Int?,
//            @SerializedName("type_image")
//            val typeImage: String?,
//            @SerializedName("type_name")
//            val typeName: String?,
//            @SerializedName("updated_at")
//            val updatedAt: String?,
//            @SerializedName("views")
//            val views: Int?,
//            @SerializedName("watched_ads_for_episode")
//            val watchedAdsForEpisode: Any?
//        ) {
//            @Keep
//            data class TagsName(
//                @SerializedName("id")
//                val id: Int?,
//                @SerializedName("name")
//                val name: String?
//            )
//        }
//
//        @Keep
//        data class YouMightLiked(
//            @SerializedName("category_id")
//            val categoryId: Int?,
//            @SerializedName("category_name")
//            val categoryName: String?,
//            @SerializedName("cover_video")
//            val coverVideo: String?,
//            @SerializedName("created_at")
//            val createdAt: String?,
//            @SerializedName("description")
//            val description: String?,
//            @SerializedName("favourites")
//            val favourites: Int?,
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
//            @SerializedName("is_liked")
//            val isLiked: Int?,
//            @SerializedName("is_recommended")
//            val isRecommended: Int?,
//            @SerializedName("likes")
//            val likes: Int?,
//            @SerializedName("match_count")
//            val matchCount: Int?,
//            @SerializedName("poster")
//            val poster: String?,
//            @SerializedName("tag_id")
//            val tagId: String?,
//            @SerializedName("tags_name")
//            val tagsName: String?,
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