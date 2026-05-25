package com.app.dramashort.Model


import com.google.gson.annotations.SerializedName
import androidx.annotation.Keep

@Keep
data class HomeListResponse(
    @SerializedName("responseCode")
    val responseCode: String?,
    @SerializedName("responseDetails")
    val responseDetails: ResponseDetails?,
    @SerializedName("responseMessage")
    val responseMessage: String?,
) {
    @Keep
    data class ResponseDetails(
        @SerializedName("categories")
        val categories: List<Category?>?,
        @SerializedName("findoutmore")
        val findoutmore: List<Findoutmore?>?,
        @SerializedName("history")
        val history: List<Any?>?,
        @SerializedName("new_relese")
        val newRelese: List<NewRelese?>?,
        @SerializedName("populer")
        val populer: List<Populer?>?,
        @SerializedName("ranking")
        val ranking: List<Ranking?>?,
        @SerializedName("recommended")
        val recommended: List<Recommended?>?,
    ) {
        @Keep
        data class Category(
            @SerializedName("created_at")
            val createdAt: String?,
            @SerializedName("id")
            val id: Int?,
            @SerializedName("is_deleted")
            val isDeleted: Int?,
            @SerializedName("name")
            val name: String?,
            @SerializedName("series")
            val series: List<Sery?>?,
            @SerializedName("updated_at")
            val updatedAt: String?,
        ) {
            @Keep
            data class Sery(
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
                @SerializedName("is_deleted")
                val isDeleted: Int?,
                @SerializedName("is_free")
                override val isFree: Int?,
                @SerializedName("is_liked")
                override val isLiked: Int,
                @SerializedName("is_recommended")
                val isRecommended: Int?,
                @SerializedName("likes")
                val likes: Int?,
                @SerializedName("poster")
                override val poster: String?,
                @SerializedName("tag_id")
                val tagId: String?,
                @SerializedName("tags_id")
                val tagsId: Int?,
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
                @SerializedName("type_image")
                val typeImage: String?,
                @SerializedName("type_name")
                val typeName: String?,
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

        @Keep
        data class Findoutmore(
            @SerializedName("created_at")
            val createdAt: String?,
            @SerializedName("id")
            val id: Int?,
            @SerializedName("is_deleted")
            val isDeleted: Int?,
            @SerializedName("name")
            val name: String?,
        )

        @Keep
        data class NewRelese(
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
            @SerializedName("poster")
            override val poster: String?,
            @SerializedName("tag_id")
            val tagId: String?,
            @SerializedName("tags_id")
            val tagsId: Int?,
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
            @SerializedName("type_image")
            val typeImage: String?,
            @SerializedName("type_name")
            val typeName: String?,
            @SerializedName("updated_at")
            val updatedAt: String?,
            @SerializedName("views")
            override val views: Int?,
            override val videoUrl: String?,
            override val seriesId: Int?,
            override val episodeNumber: Int?,
            override val thumbnailUrl: String?,
            override val isFavourites: Int,
            override val isLocked: Int = 0,
        ) : CommonInfoBase

        @Keep
        data class Populer(
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
            @SerializedName("is_deleted")
            val isDeleted: Int?,
            @SerializedName("is_free")
            override val isFree: Int?,
            @SerializedName("is_liked")
            override val isLiked: Int,
            @SerializedName("is_recommended")
            val isRecommended: Int?,
            @SerializedName("likes")
            val likes: Int?,
            @SerializedName("poster")
            override val poster: String?,
            @SerializedName("tag_id")
            val tagId: String?,
            @SerializedName("tags_id")
            val tagsId: Int?,
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
            @SerializedName("type_image")
            val typeImage: String?,
            @SerializedName("type_name")
            val typeName: String?,
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

        @Keep
        data class Ranking(
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
            @SerializedName("poster")
            override val poster: String?,
            @SerializedName("tag_id")
            val tagId: String?,
            @SerializedName("tags_id")
            val tagsId: Int?,
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
            @SerializedName("type_image")
            val typeImage: String?,
            @SerializedName("type_name")
            val typeName: String?,
            @SerializedName("updated_at")
            val updatedAt: String?,
            @SerializedName("views")
            override val views: Int?,
            override val videoUrl: String?,


            override val seriesId: Int?,
            override val episodeNumber: Int?,
            override val thumbnailUrl: String?,
            override val isFavourites: Int,
            override val isLocked: Int = 0,
        ) : CommonInfoBase

        @Keep
        data class Recommended(
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
            @SerializedName("poster")
            override val poster: String?,
            @SerializedName("tag_id")
            val tagId: String?,
            @SerializedName("tags_id")
            val tagsId: Int?,
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
            @SerializedName("type_image")
            val typeImage: String?,
            @SerializedName("type_name")
            val typeName: String?,
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