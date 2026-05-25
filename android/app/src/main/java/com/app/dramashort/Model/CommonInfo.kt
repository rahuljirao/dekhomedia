package com.app.dramashort.Model

import android.os.Parcelable
import androidx.annotation.Keep
import kotlinx.parcelize.Parcelize
@Keep
@Parcelize
data class CommonInfo(
    var id: Int? = null,
    var title: String? = null,
    var tagsName: String? = null,
    var username: String? = null,
    var views: Int? = null,
    var thumbnail: String? = null,
    var thumbnailUrl: String? = null,
    var description: String? = null,
    var likes: Int = 0,
    var comments: Int? = null,
    var isLiked: Int = 0,
    var isFavourites: Int = 0,
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
    var isFree: Int? = null,
) : Parcelable