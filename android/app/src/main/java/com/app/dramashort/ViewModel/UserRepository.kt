package com.app.dramashort.ViewModel

import android.util.Log
import androidx.annotation.Keep
import com.app.dramashort.Model.EpisodeRequest
import com.app.dramashort.APIs.ApiService
import com.app.dramashort.App.ReelShortApp
import com.app.dramashort.Model.ApiErrorResponse
import com.app.dramashort.Model.AutoUnlockSettingRequest
import com.app.dramashort.Model.BindEmailRequest
import com.app.dramashort.Model.CreatePaymentRequest
import com.app.dramashort.Model.CreateRazorPayCreateOrderRequest
import com.app.dramashort.Model.CreateTicketRequest
import com.app.dramashort.Model.DailyCheckedInRequest
import com.app.dramashort.Model.DeleteRequest
import com.app.dramashort.Model.FavouriteRequest
import com.app.dramashort.Model.HLSVideoUrlRequest
import com.app.dramashort.Model.IdRequest
import com.app.dramashort.Model.LikeRequest
import com.app.dramashort.Model.MobileLoginRequest
import com.app.dramashort.Model.PaymentOptionResponse
import com.app.dramashort.Model.PaymentUpdateRequest
import com.app.dramashort.Model.PlanListResponse
import com.app.dramashort.Model.SearchRequest
import com.app.dramashort.Model.SighInRequest
import com.app.dramashort.Model.StripePaymentIntentRequest
import com.app.dramashort.Model.UnlockEpisodeRequest
import com.app.dramashort.Model.UpdateRewardRequest
import com.app.dramashort.Model.VerifyGooglePlayPaymentRequest
import com.app.dramashort.Model.WatchEpisodeRequest
import com.app.dramashort.Utils.AdminPreference
import com.app.dramashort.Utils.NetworkManager
import com.google.gson.Gson
import kotlinx.coroutines.async
import kotlinx.coroutines.coroutineScope
import retrofit2.Response
import java.util.concurrent.CancellationException
import javax.inject.Inject
import kotlin.jvm.java
import kotlin.system.exitProcess

@Keep
class UserRepository @Inject constructor(val apiService: ApiService) {

    companion object { val TAG = "UserRepository" }

    @Keep
    enum class HttpCode(val code: Int, val message: String) {
        OK(200, "OK"), BAD_REQUEST(400, "Bad Request"), UNAUTHORIZED(401, "Unauthorized access"),
        FORBIDDEN(403, "Forbidden"), NOT_FOUND(404, "Not Found"), SERVER_ERROR(500, "Server Error"),
        UNKNOWN(-1, "Something went wrong");
        companion object {
            fun fromCode(code: Int): HttpCode = HttpCode.entries.find { it.code == code } ?: UNKNOWN
        }
    }

    val pref = AdminPreference(ReelShortApp.instance)
    private val token by lazy { pref.authToken }

    suspend inline fun <reified T> safeApiCall(
        crossinline call: suspend () -> Response<T>,
    ): ApiResult<T> {
        return try {
            val response = call()
            val body = response.body()
            if (response.isSuccessful && body != null) {
                ApiResult.Success(body)
            } else {
                val errorBody = response.errorBody()?.string()
                val message = try {
                    errorBody?.let { Gson().fromJson(it, ApiErrorResponse::class.java)?.responseMessage }
                } catch (e: Exception) { null }
                if (response.code() == 500) {
                    ReelShortApp.instance.networkManager.showServerErrorDialog({
                        ReelShortApp.instance.networkManager.currentActivity.finishAffinity()
                        exitProcess(0)
                    }, "Wait a moment")
                }
                ApiResult.Error(HttpCode.fromCode(response.code()), response.code(), message ?: response.message())
            }
        } catch (e: CancellationException) {
            Log.e(TAG, "safeApiCall: Cancelled", e); throw e
        } catch (e: Exception) {
            e.printStackTrace(); Log.e(TAG, "safeApiCall: $e")
            if (!NetworkManager.isConnected(ReelShortApp.instance)) {
                ReelShortApp.instance.networkManager.showNoInternetDialog(
                    NetworkManager.OnConnectedListener { _: Boolean -> })
            } else {
                ReelShortApp.instance.networkManager.showServerErrorDialog({
                    ReelShortApp.instance.networkManager.currentActivity.finishAffinity()
                    exitProcess(0)
                }, "Exit")
            }
            ApiResult.Error(HttpCode.UNKNOWN, message = e.message ?: "Unknown error")
        }
    }

    suspend fun signIn(request: SighInRequest, authToken: String = pref.authToken) =
        safeApiCall { apiService.signIn(request, authToken) }

    suspend fun signUp(request: SighInRequest, authToken: String = pref.authToken) =
        safeApiCall { apiService.signUp(request, authToken) }

    suspend fun getHomeList(authToken: String = pref.authToken) =
        safeApiCall { apiService.getHomeList(authToken) }

    suspend fun getAllEpisodeList(request: EpisodeRequest, authToken: String = pref.authToken) =
        safeApiCall { apiService.getAllEpisodeList(request, authToken) }

    suspend fun getMyList(authToken: String = pref.authToken) =
        safeApiCall { apiService.getMyList(authToken) }

    suspend fun setLikeEpisode(authToken: String = pref.authToken, likeRequest: LikeRequest) =
        safeApiCall { apiService.setLikeEpisode(authToken, likeRequest) }

    suspend fun getPlanList(authToken: String = pref.authToken) =
        safeApiCall { apiService.getPlanList(authToken) }

    suspend fun setDailyWatchAds(authToken: String = token) =
        safeApiCall { apiService.setDailyWatchAds(authToken) }

    suspend fun getSeriesList(random: Int = 1, authToken: String = pref.authToken) =
        safeApiCall { apiService.getSeriesList(random, authToken) }

    suspend fun setFavourite(favouriteRequest: FavouriteRequest, authToken: String = pref.authToken) =
        safeApiCall { apiService.setFavourite(favouriteRequest, authToken) }

    suspend fun getCoinData(authToken: String = pref.authToken) =
        safeApiCall { apiService.getCoinData(authToken) }

    suspend fun getRewardHistory(authToken: String = pref.authToken) =
        safeApiCall { apiService.getRewardHistory(authToken) }

    suspend fun setBindEmail(request: String, authToken: String = pref.authToken) =
        safeApiCall { apiService.setBindEmail(BindEmailRequest(request), authToken) }

    suspend fun getSearch(request: String, authToken: String = pref.authToken) =
        safeApiCall { apiService.getSearch(SearchRequest(request), authToken) }

    suspend fun setDailyCheckedIn(request: Int, authToken: String = pref.authToken) =
        safeApiCall { apiService.setDailyCheckedIn(DailyCheckedInRequest(request), authToken) }

    suspend fun setUpdateReward(request: String, authToken: String = pref.authToken) =
        safeApiCall { apiService.setUpdateReward(UpdateRewardRequest(request), authToken) }

    suspend fun setWatchEpisode(request: WatchEpisodeRequest, authToken: String = pref.authToken) =
        safeApiCall { apiService.setWatchEpisode(request, authToken) }

    suspend fun setUnlockEpisode(request: UnlockEpisodeRequest, authToken: String = pref.authToken) =
        safeApiCall { apiService.setUnlockEpisode(request, authToken) }

    suspend fun getFaq(authToken: String = pref.authToken) =
        safeApiCall { apiService.getFaq(authToken) }

    suspend fun setAutoUnlockSetting(request: AutoUnlockSettingRequest, authToken: String = pref.authToken) =
        safeApiCall { apiService.setAutoUnlockSetting(request, authToken) }

    suspend fun getTagWiseList(id: String, authToken: String = pref.authToken) =
        safeApiCall { apiService.getTagWiseList(IdRequest(id), authToken) }

    suspend fun loadPlanData(authToken: String = pref.authToken): ApiResult<Pair<PlanListResponse, PaymentOptionResponse>> = coroutineScope {
        val plan = async { safeApiCall { apiService.getPlanList(authToken) } }
        val paymentOption = async { safeApiCall { apiService.getPaymentOption(authToken) } }
        val r1 = plan.await(); val r2 = paymentOption.await()
        if (r1 is ApiResult.Error) return@coroutineScope r1
        if (r2 is ApiResult.Error) return@coroutineScope r2
        ApiResult.Success((r1 as ApiResult.Success).data to (r2 as ApiResult.Success).data)
    }

    suspend fun getPaymentOption(authToken: String = pref.authToken) =
        safeApiCall { apiService.getPaymentOption(authToken) }

    suspend fun createPayment(request: CreatePaymentRequest, authToken: String = pref.authToken) =
        safeApiCall { apiService.createPayment(request, authToken) }

    suspend fun setPaymentUpdate(request: PaymentUpdateRequest, authToken: String = pref.authToken) =
        safeApiCall { apiService.setPaymentUpdate(request, authToken) }

    suspend fun createStripePaymentIntent(request: StripePaymentIntentRequest, authToken: String = pref.authToken) =
        safeApiCall { apiService.createStripePaymentIntent(request, authToken) }

    suspend fun createRazorPayCreateOrder(request: CreateRazorPayCreateOrderRequest, authToken: String = pref.authToken) =
        safeApiCall { apiService.createRazorPayCreateOrder(request, authToken) }

    suspend fun verifyGooglePlayPayment(request: VerifyGooglePlayPaymentRequest, authToken: String = pref.authToken) =
        safeApiCall { apiService.verifyGooglePlayPayment(request, authToken) }

    suspend fun getTransactionList(authToken: String = pref.authToken) =
        safeApiCall { apiService.getTransactionList(authToken) }

    suspend fun getUnlockedEpisodeList(authToken: String = pref.authToken) =
        safeApiCall { apiService.getUnlockedEpisodeList(authToken) }

    suspend fun getUserWatchedSeriesList(authToken: String = pref.authToken) =
        safeApiCall { apiService.getUserWatchedSeriesList(authToken) }

    suspend fun getSocialLinks(authToken: String = pref.authToken) =
        safeApiCall { apiService.getSocialLinks(authToken) }

    suspend fun deleteWatchHistory(request: DeleteRequest, authToken: String = pref.authToken) =
        safeApiCall { apiService.deleteWatchHistory(request, authToken) }

    suspend fun deleteFavouriteSeries(request: DeleteRequest, authToken: String = pref.authToken) =
        safeApiCall { apiService.deleteFavouriteSeries(request, authToken) }

    suspend fun getAdTimer(request: EpisodeRequest, authToken: String = pref.authToken) =
        safeApiCall { apiService.getAdTimer(request, authToken) }

    suspend fun getAdsIdData(authToken: String = pref.authToken) =
        safeApiCall { apiService.getAdsIdData(authToken) }

    suspend fun getTicket(email: String, authToken: String = pref.authToken) =
        safeApiCall { apiService.getTicket(BindEmailRequest(email), authToken) }

    suspend fun createTicket(request: CreateTicketRequest, authToken: String = pref.authToken) =
        safeApiCall { apiService.createTicket(request, authToken) }

    suspend fun reasonsList(authToken: String = pref.authToken) =
        safeApiCall { apiService.reasonsList(authToken) }

    suspend fun getAppDetails(authToken: String = pref.authToken) =
        safeApiCall { apiService.getAppDetails(authToken) }

    suspend fun deleteAccount(request: String, authToken: String = pref.authToken) =
        safeApiCall { apiService.deleteAccount(authToken) }

    suspend fun HLSVideoUrl(request: HLSVideoUrlRequest, authToken: String = pref.authToken) =
        safeApiCall { apiService.HLSVideoUrl(request, authToken) }

    // ─── NEW ──────────────────────────────────────────────────────────────────

    /** Verify promoter slug — no auth token needed */
    suspend fun verifyPromoterSlug(slug: String) =
        safeApiCall { apiService.verifyPromoterSlug(slug) }

    /** Mobile number login — no auth token needed */
    suspend fun mobileLogin(request: MobileLoginRequest) =
        safeApiCall { apiService.mobileLogin(request) }

}
