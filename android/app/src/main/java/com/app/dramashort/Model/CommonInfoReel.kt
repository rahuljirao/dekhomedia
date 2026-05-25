package com.app.dramashort.Model

import androidx.annotation.Keep

@Keep
open class CommonInfoReel(
    var id: Int? = null,
    var title: String? = null,
    var tagsName: String? = null,
    var username: String? = null,
    var thumbnail: String? = null,
    var thumbnailUrl: String? = null,
    var description: String? = null,
    var comments: Int? = null,
    var filter: String? = null,
    var location: String? = null,
    var videoUrl: String? = null,
    var seriesId: Int? = null,
    var episodeNumber: Int? = null,
    var isPlaying: Boolean = false,
    var freeEpisodes: Int? = null,
    var coverVideo: String? = null,
    var poster: String? = null,
    var categoryName: String? = null,
    var TypeName: String? = null,
    var isLocked: Boolean = false,
    var isTrailer: Boolean = false,
    var availableCoin: Int? = null,
    var availableWalletBalance: Int? = null,
    var requiredCoin: Int? = null,

    var views: Int? = null, // likedCount

    var isLiked: Int = 0,
    var likedCount: Int = 0,

    var isFavourites: Int = 0,
    var favouritesCount: Int = 0, //favourite Count


    var isAutoUnlocked: Int = 1,

    var previewVideo: String? = null,
    var videoQualityUrls: Map<String, String>? = null, // e.g., mapOf("480p" to "url_480p", "720p" to "url_720p", "1080p" to "url_1080p")
    var cachedStreamUrl: String? = null
    )
