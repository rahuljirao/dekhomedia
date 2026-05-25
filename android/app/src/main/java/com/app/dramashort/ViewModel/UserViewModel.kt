package com.app.dramashort.ViewModel

import android.R.attr.data
import android.content.Context
import android.provider.Settings
import android.util.Log
import android.view.View
import android.widget.Toast
import androidx.annotation.Keep
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.app.dramashort.App.ReelShortApp
import com.app.dramashort.Model.CoinDataResponse
import com.app.dramashort.Model.EpisodeListResponse
import com.app.dramashort.Model.EpisodeRequest
import com.app.dramashort.Model.HLSVideoUrlRequest
import com.app.dramashort.Model.HomeListResponse
import com.app.dramashort.Model.MyListResponse
import com.app.dramashort.Model.PlanListResponse
import com.app.dramashort.Model.RewardHistoryResponse
import com.app.dramashort.Model.SeriesListResponse
import com.app.dramashort.Model.SighInRequest
import com.app.dramashort.Model.SignUpResponse
import com.app.dramashort.Utils.AdminPreference
import com.app.dramashort.Utils.showToast
import com.app.dramashort.ViewModel.ApiResult
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import javax.inject.Inject

@Keep
@HiltViewModel
class UserViewModel @Inject constructor(
    val repository: UserRepository,
) : ViewModel() {
    val isLoggedIn = MutableLiveData<Boolean>()

    val pref: AdminPreference get() = AdminPreference(ReelShortApp.instance)

    private val _homeList = MutableLiveData<ApiResult<HomeListResponse>>()
    val homeList: LiveData<ApiResult<HomeListResponse>> = _homeList


    private val _allEpisodes = MutableLiveData<ApiResult<EpisodeListResponse>>()
    val allEpisodes: LiveData<ApiResult<EpisodeListResponse>> = _allEpisodes


    private val _myList = MutableLiveData<ApiResult<MyListResponse>>()
    val myList: LiveData<ApiResult<MyListResponse>> = _myList

    private val _planList = MutableLiveData<ApiResult<PlanListResponse>>()
    val planList: LiveData<ApiResult<PlanListResponse>> = _planList


    private val _seriesList = MutableLiveData<ApiResult<SeriesListResponse>>()
    val seriesList: LiveData<ApiResult<SeriesListResponse>> = _seriesList

    private val _coinData = MutableLiveData<ApiResult<CoinDataResponse>>()
    val coinData: LiveData<ApiResult<CoinDataResponse>> = _coinData

    private val _rewardHistory = MutableLiveData<ApiResult<RewardHistoryResponse>>()
    val rewardHistory: LiveData<ApiResult<RewardHistoryResponse>> = _rewardHistory

    private val _signUp = MutableLiveData<SignUpResponse.ResponseDetails>()
    val signUp: LiveData<SignUpResponse.ResponseDetails> = _signUp

    val deviceId = Settings.Secure.getString(ReelShortApp.instance.contentResolver, Settings.Secure.ANDROID_ID)

    val random = (10000..99999).random().toString()

    val loginRequest = SighInRequest(
        email = pref.email.ifBlank { com.app.dramashort.BuildConfig.HOST_EMAIL },
        loginType = pref.loginType.ifBlank { com.app.dramashort.BuildConfig.HOST_LOGIN_TYPE_GUEST },
        loginTypeId = pref.loginTypeId.ifBlank { random },
        name = pref.name.ifBlank { com.app.dramashort.BuildConfig.HOST_DISPLAY_NAME },
        deviceId = deviceId
    )

    init {
        getHomeList(pref.authToken)
        fetchUsers(pref.authToken)
        getMyList(pref.authToken)
        getPlanList(pref.authToken)
        getPlanList(pref.authToken)
//        getSeriesList(1, pref.authToken)
        getCoinData(pref.authToken)
        getRewardHistory(pref.authToken)
//        login(loginRequest, pref.authToken)
    }

    fun loadEpisodes(episodeId: Int, authToken: String) {
        viewModelScope.launch(Dispatchers.Main) {
            _allEpisodes.value = repository.getAllEpisodeList(EpisodeRequest(episodeId), authToken)
        }
    }


    fun fetchUsers(authToken: String) {
        viewModelScope.launch(Dispatchers.Main) {
            _homeList.value = repository.getHomeList(authToken)
        }
    }

    fun getMyList(authToken: String) {
        viewModelScope.launch(Dispatchers.Main) {
            _myList.value = repository.getMyList(authToken)
        }
    }


    fun getHomeList(authToken: String) {
        viewModelScope.launch(Dispatchers.Main) {
            _homeList.value = repository.getHomeList(authToken)
        }
    }

    fun getPlanList(authToken: String) {
        viewModelScope.launch(Dispatchers.Main) {
            _planList.value = repository.getPlanList(authToken)
        }
    }


    fun getSeriesList(random: Int = 1, authToken: String) {
        viewModelScope.launch(Dispatchers.Main) {
            _seriesList.value = repository.getSeriesList(random, authToken)
        }
    }

    fun getCoinData(authToken: String) {
        viewModelScope.launch(Dispatchers.Main) {
            _coinData.value = repository.getCoinData(authToken)
        }
    }

    fun getCoinData(authToken: String, callback: (first: CoinDataResponse.ResponseDetail) -> Unit) {
        viewModelScope.launch(Dispatchers.Main) {
            val result = repository.getCoinData(authToken)
            if (result is ApiResult.Success) {
                result.data.responseDetails?.let { coinData ->
                    callback(coinData.filterNotNull().first())
                }
            } else if (result is ApiResult.Error) {
            }
        }
    }


    fun getRewardHistory(authToken: String) {
        viewModelScope.launch(Dispatchers.Main) {
            _rewardHistory.value = repository.getRewardHistory(authToken)
        }
    }


    var counter = 0
    fun login(loginRequest: SighInRequest, authToken: String) {
        viewModelScope.launch(Dispatchers.Main) {
            val result = repository.signUp(loginRequest, authToken)
            if (result is ApiResult.Success) {

                counter = 0

                result.data.responseDetails?.let { responseDetails ->
                    pref.email = result.data.responseDetails.email.toString()
                    pref.isLogin = true
                    pref.authToken = result.data.responseDetails.token?.accessToken.toString()
                    pref.uid = result.data.responseDetails.uid.toString()
                    pref.loginType = result.data.responseDetails.loginType.toString()
//                    pref.profilePicture = result.data.responseDetails.profilePicture.toString()
                }
                _signUp.value = result.data.responseDetails!!
            } else if (result is ApiResult.Error) {
                val random = (10000..99999).random().toString()

                Toast.makeText(ReelShortApp.instance, result.code.message, Toast.LENGTH_LONG).show()
                val guestRequest2 = SighInRequest(
                    email = com.app.dramashort.BuildConfig.HOST_EMAIL,
                    loginType = com.app.dramashort.BuildConfig.HOST_LOGIN_TYPE_GUEST,
                    loginTypeId = random,
                    name = com.app.dramashort.BuildConfig.HOST_DISPLAY_NAME,
                    deviceId = deviceId
                )
                if (counter == 4) {
                    return@launch
                }
                counter++
                login(guestRequest2, authToken)
            }
        }
    }

    enum class VideoType {
        EXTERNAL,
        INTERNAL
    }


    suspend fun getStreamingUrl(
        context: Context,
        request: HLSVideoUrlRequest
    ): Pair<String?, VideoType> {

        var url: String? = null
        var videoType = VideoType.EXTERNAL

        return try {
            val result = repository.HLSVideoUrl(request, pref.authToken)

            if (result is ApiResult.Success) {
                result.data.responseData?.videoUrl?.let {
                    url = it
                    videoType = if (result.data.responseData.videoType == "internal"){
                        VideoType.INTERNAL
                    }else{
                        VideoType.EXTERNAL
                    }
                }
            } else if (result is ApiResult.Error) {
                Log.e(
                    "TAG",
                    "getStreamingUrl Error 1 : ${result.message}, request:$request"
                )
            }
            Pair(url, videoType)
        } catch (e: Exception) {
            Log.e(
                "TAG",
                "getStreamingUrl Error 2 : ${e.message}, request:$request"
            )
            Pair(null, VideoType.EXTERNAL)
        }
    }

//    suspend fun getStreamingUrl(context : Context, request: HLSVideoUrlRequest): String? {
//        var url: String? = ""
//        return try {
//            val result = repository.HLSVideoUrl(request,pref.authToken)
//            if (result is ApiResult.Success) {
//                result.data.responseMessage?.let { responseMessage ->
//                    result.data.responseData?.videoUrl?.let {
//                        url = result.data.responseData.videoUrl
//                    }
////                    context.showToast(result.data.responseMessage)
//                }
//            } else if (result is ApiResult.Error) {
//                Log.e("TAG", "getStreamingUrl Error 1 : ${result.message}, request:${request.toString()} ")
////                context.showToast(result.message)
//            }
//            url
//        } catch (e: Exception) {
//            Log.e("TAG", "getStreamingUrl Error 2 : ${e.message} , request:${request.toString()}")
//            url
//        }
//    }


}
