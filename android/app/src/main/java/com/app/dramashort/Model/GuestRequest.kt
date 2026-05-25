package com.app.dramashort.Model


import com.google.gson.annotations.SerializedName
import androidx.annotation.Keep


@Keep
data class LoginRequest(
    @SerializedName("email")
    val email: String?,
    @SerializedName("login_type")
    val loginType: String?,
    @SerializedName("login_type_id")
    val loginTypeId: String?,
    @SerializedName("name")
    val name: String?,
)

@Keep
data class SighInRequest(
    @SerializedName("id")
    val id: String? = null,

    @SerializedName("profile_picture")
    val profilePicture: String? = null,

    @SerializedName("email")
    val email: String? = null,

    @SerializedName("login_type")
    val loginType: String? = null,

    @SerializedName("login_type_id")
    val loginTypeId: String? = null,

    @SerializedName("name")
    val name: String? = null,

    @SerializedName("device_id")
    val deviceId: String? = null,
) {
    companion object {
        fun fromPartial(
            email: String?,
            loginType: String?,
            loginTypeId: String?,
            name: String?,
        ): SighInRequest {
            return SighInRequest(
                email = email,
                loginType = loginType,
                loginTypeId = loginTypeId,
                name = name
            )
        }
    }
}

//@Keep
//data class SighInRequest(
//
//    @SerializedName("id")
//    val id: String?,
//
//    @SerializedName("profile_picture")
//    val profilePicture: String?,
//
//    @SerializedName("email")
//    val email: String?,
//    @SerializedName("login_type")
//    val loginType: String?,
//    @SerializedName("login_type_id")
//    val loginTypeId: String?,
//    @SerializedName("name")
//    val name: String?,
//
//
//    @SerializedName("device_id")
//    val deviceId: String?,
//
//)


@Keep
data class EpisodeRequest(
    @SerializedName("series_id")
    val seriesId: Int? = null,
)

@Keep
data class LikeRequest(
    @SerializedName("episode_id")
    val episodeId: Int?,
    @SerializedName("is_liked")
    val isLiked: Int?,
    @SerializedName("series_id")
    val seriesId: Int?,
)

@Keep
data class WatchEpisodeRequest(
    @SerializedName("episode_id")
    val episodeNumber: Int?,
    @SerializedName("series_id")
    val seriesId: Int?,
)

@Keep
data class UnlockEpisodeRequest(
    @SerializedName("episode_id")
    val episodeId: Int?,
    @SerializedName("series_id")
    val seriesId: Int?,
    @SerializedName("is_ads")
    val isAds: Int?,
)


@Keep
data class SearchRequest(
    @SerializedName("search")
    val search: String?,
)


@Keep
data class FavouriteRequest(
    @SerializedName("episode_id")
    val episodeId: Int?,
    @SerializedName("is_favourite")
    val isFavourite: Int?,
    @SerializedName("series_id")
    val seriesId: Int?,
)

@Keep
data class UpdateRewardRequest(
    @SerializedName("reward_type")
    val rewardType: String?,
)

@Keep
data class BindEmailRequest(
    @SerializedName("email")
    val email: String?,
)

@Keep
data class DailyCheckedInRequest(
    @SerializedName("day")
    val day: Int?,
)

@Keep
data class AutoUnlockSettingRequest(
    @SerializedName("series_id")
    val seriesId: Int?,
    @SerializedName("is_auto_unlocked")
    val isAutoUnlocked: Int?,
)

@Keep
data class IdRequest(
    @SerializedName("id")
    val id: String?,
)

@Keep
data class StripePaymentIntentRequest(
//    @SerializedName("amount")
//    val amount: String?,
    @SerializedName("plan_id")
    val planId: Int?,
    @SerializedName("payment_getway_id")
    val paymentGetwayId: Int?,

    @SerializedName("transaction_id")
    val transactionId: String?,
)

@Keep
data class CreatePaymentRequest(
    @SerializedName("plan_id")
    val planId: Int?,
    @SerializedName("payment_getway_id")
    val paymentGetwayId: Int?,
    @SerializedName("currency")
    val currency: String?,
)


@Keep
data class PaymentUpdateRequest(
    @SerializedName("status")
    val status: Int?,
    @SerializedName("transaction_id")
    val transactionId: String?,
    @SerializedName("transaction_key")
    val transactionKey: String?,
)


@Keep
data class CreateRazorPayCreateOrderRequest(
    @SerializedName("plan_id")
    val planId: Int?,
//    @SerializedName("amount")
//    val amount: String?,
    @SerializedName("payment_getway_id")
    val paymentGetwayId: Int?,
)

@Keep
data class DeleteRequest(
    @SerializedName("series_id")
    val seriesId: List<Int>,
)


@Keep
data class CreateTicketRequest(
    @SerializedName("description")
    val description: String?,
    @SerializedName("email")
    val email: String?,
    @SerializedName("name")
    val name: String?,
    @SerializedName("reason_id")
    val reasonId: Int?,
)



@Keep
data class HLSVideoUrlRequest(
    @SerializedName("device_id")
    val deviceId: String?,
    @SerializedName("episode_id")
    val episodeId: String?,
    @SerializedName("series_id")
    val seriesId: String?
)