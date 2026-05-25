package com.app.dramashort.Ads

import android.app.Activity
import android.app.AlertDialog
import android.content.Context
import android.graphics.Color
import android.graphics.drawable.ColorDrawable
import android.os.Handler
import android.os.Looper
import com.app.dramashort.APIs.ApiService
import com.app.dramashort.R
import com.app.dramashort.ViewModel.ApiResult
import com.app.dramashort.ViewModel.UserRepository
import com.applovin.mediation.MaxAd
import com.applovin.mediation.MaxError
import com.applovin.mediation.MaxReward
import com.applovin.mediation.MaxRewardedAdListener
import com.applovin.mediation.ads.MaxRewardedAd
import com.google.android.gms.ads.AdError
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.FullScreenContentCallback
import com.google.android.gms.ads.LoadAdError
import com.google.android.gms.ads.MobileAds
import com.google.android.gms.ads.rewarded.RewardedAd
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlin.math.min
import kotlin.math.pow

class AdManager(val apiService: ApiService, private val context: Context) {

    data class AdPlatformConfig(
        val name: String,
        val status: Int,
        val rewardIdList: List<String>,
    )


    companion object {
        private val TAG = "AdManager"
        lateinit var instance: AdManager

        const val ADMOB = "Admob"
        const val APPLOVIN = "AppLovins"

    }


    val dummyAdConfigs = listOf(
        AdPlatformConfig(
            name = "AppLovins",
            status = 1, // Enabled
            rewardIdList = listOf(
                "/6499/example/rewarded",
            )
        ),
        AdPlatformConfig(
            name = "AdMob",
            status = 1, // Disabled
            rewardIdList = listOf(
                "",
            )
        )
    )

    var adResponse: List<AdPlatformConfig> = emptyList()


    private var loadingDialog: AlertDialog? = null
    private var rewardedAd: RewardedAd? = null
    private var rewardedAppLovinAd: MaxRewardedAd? = null


    var counter = 0

    private var retryAttempt = 0


    init {
        loadApi(context)
        instance = this@AdManager
        MobileAds.initialize(context) {
        }
    }

    fun loadApi(context: Context) {
        CoroutineScope(Dispatchers.Main).launch {
            val result = UserRepository(apiService).getAdsIdData()
            if (result is ApiResult.Success) {
                result.data.responseDetails?.let {
                    adResponse = result.data.responseDetails.filterNotNull().map {
                        AdPlatformConfig(
                            name = it.adPlatformName ?: "",
                            status = it.status ?: 0,
                            rewardIdList = it.adRewardId?.filterNotNull() ?: emptyList()
                        )
                    }


                }
            } else if (result is ApiResult.Error) {
//                context.showToast("Error : " + result.message + " , code : " + result.code)
            }
        }
    }


    private fun initAppLovin(adUnitId1: String) {
        rewardedAppLovinAd = MaxRewardedAd.getInstance(adUnitId1, context as Activity)
        rewardedAppLovinAd?.setListener(object : MaxRewardedAdListener {
            override fun onAdLoaded(ad: MaxAd) {
                retryAttempt = 0
            }

            override fun onAdLoadFailed(adUnitId: String, error: MaxError) {
                retryAttempt++
                val delayMillis = (2.0.pow(min(6.0, retryAttempt.toDouble())) * 1000).toLong()
                Handler(Looper.getMainLooper()).postDelayed({
                    rewardedAppLovinAd?.loadAd()
                }, delayMillis)
            }

            override fun onAdDisplayFailed(ad: MaxAd, error: MaxError) {
                dismissLoadingDialog()
            }

            override fun onAdDisplayed(ad: MaxAd) {}
            override fun onAdClicked(ad: MaxAd) {}
            override fun onAdHidden(ad: MaxAd) {
                rewardedAppLovinAd?.loadAd() // Preload next
                dismissLoadingDialog()
            }

            override fun onUserRewarded(ad: MaxAd, reward: MaxReward) {
                // Reward user handled in `showRewardedAd()` callback
            }
        })
        rewardedAppLovinAd?.loadAd()
    }


    fun showLoadingDialog(activity: Activity) {

        if (loadingDialog?.isShowing == true) return
        val dialog = AlertDialog.Builder(activity)
            .setView(R.layout.loading_dialog_layout) // Create your custom loading layout
            .setCancelable(false)
            .create()

        dialog.window?.setBackgroundDrawable(ColorDrawable(Color.TRANSPARENT))
        dialog.show()
        loadingDialog = dialog
    }

    //
    fun dismissLoadingDialog() {
        loadingDialog?.dismiss()
        loadingDialog = null
    }

    fun loadShowRewardedAd(
        activity: Activity,
        adConfigs: List<AdPlatformConfig>,
        onRewardEarned: (Int) -> Unit,
        onAdDismissed: () -> Unit,
        onAdFailed: () -> Unit,
    ) {
        var isDisplayed = false
        loadShowRewardedAd(
            activity,
            adConfigs,
            onRewardEarned,
            onAdDismissed,
            onAdFailed,
            onShow = { AdType, adModel ->
                when (AdType) {
                    ADMOB -> {
//                        activity.showToast("onShow..ADMOB")
                        if (isDisplayed == false) {
                            isDisplayed = true
                            val ad = adModel as RewardedAd
                            ad.show(activity) { rewardItem ->
                                AdManager.instance.dismissLoadingDialog()
                                AdManager.instance.counter = 0
                                onRewardEarned.invoke(rewardItem.amount)
                            }
                        }
                    }

                    APPLOVIN -> {
//                        activity.showToast("onShow..APPLOVIN")
                        if (isDisplayed == false) {
                            isDisplayed = true
                            val ad = adModel as MaxRewardedAd
                            ad?.showAd()
                        }
                    }
                }
            }
        )
    }


    fun loadShowRewardedAd(
        activity: Activity,
        adConfigs: List<AdPlatformConfig>,
        onRewardEarned: (Int) -> Unit,
        onAdDismissed: () -> Unit,
        onAdFailed: () -> Unit,
        onShow: (String, Any) -> Unit,
    ) {
        adConfigs.forEachIndexed { index, model ->
            if (model.status == 1) {
                when (model.name) {
                    ADMOB -> {
                        loadAdMobRewarded(
                            activity,
                            model.rewardIdList.random(),
                            onRewardEarned,
                            onAdDismissed,
                            onAdFailed,
                            onShow,
                        )
                    }

                    APPLOVIN -> {
                        loadAppLovinRewarded(
                            activity,
                            model.rewardIdList.random(),
                            onRewardEarned,
                            onAdDismissed,
                            onAdFailed,
                            onShow
                        )
                    }
                }
            }
        }
    }

    fun loadAppLovinRewarded(
        activity: Activity,
        adUnitId: String,
        onRewardEarned: (Int) -> Unit,
        onAdDismissed: () -> Unit,
        onAdFailed: () -> Unit,
        onShow: (String, Any) -> Unit,

        ) {
        showLoadingDialog(activity)
        rewardedAppLovinAd = MaxRewardedAd.getInstance(adUnitId, context as Activity)
        rewardedAppLovinAd?.loadAd()
        rewardedAppLovinAd?.setListener(object : MaxRewardedAdListener {
            override fun onAdLoaded(ad: MaxAd) {
                retryAttempt = 0
                if (rewardedAppLovinAd?.isReady == true) {
                    onShow.invoke(APPLOVIN, rewardedAppLovinAd!!)
                } else {
                    dismissLoadingDialog()
                    onAdFailed()
                    rewardedAppLovinAd?.loadAd()
                }
            }

            override fun onAdDisplayFailed(ad: MaxAd, error: MaxError) {
                retryAttempt = 0
                dismissLoadingDialog()
                onAdFailed.invoke()

            }

            override fun onAdDisplayed(ad: MaxAd) {
                retryAttempt = 0
            }

            override fun onAdClicked(ad: MaxAd) {
            }


            override fun onAdHidden(ad: MaxAd) {
                rewardedAppLovinAd?.loadAd() // Preload next
                dismissLoadingDialog()
                onAdDismissed()
            }

            override fun onUserRewarded(ad: MaxAd, reward: MaxReward) {
                // Reward user handled in `showRewardedAd()` callback
                onRewardEarned(1)
            }

            override fun onAdLoadFailed(adUnitId: String, error: MaxError) {
                rewardedAppLovinAd = null
                if (retryAttempt == 4) {
                    dismissLoadingDialog()
                    onAdFailed()
                    return
                }
                retryAttempt++
                loadAppLovinRewarded(activity, adUnitId, onRewardEarned, onAdDismissed, onAdFailed, onShow)
            }
        })
    }


    fun loadAdMobRewarded(
        activity: Activity,
        adUnitId: String,
        onRewardEarned: (Int) -> Unit,
        onAdDismissed: () -> Unit,
        onAdFailed: () -> Unit,
        onShow: (String, Any) -> Unit,
    ) {
        val adRequest = AdRequest.Builder().build()
        showLoadingDialog(activity)
        RewardedAd.load(
            activity,
            adUnitId,
            adRequest,
            object : RewardedAdLoadCallback() {
                override fun onAdLoaded(ad: RewardedAd) {
                    ad.let { ad ->
                        ad.fullScreenContentCallback = object : FullScreenContentCallback() {
                            override fun onAdDismissedFullScreenContent() {
                                rewardedAd = null
                                counter = 0
                                onAdDismissed.invoke()
                                dismissLoadingDialog()
                            }

                            override fun onAdFailedToShowFullScreenContent(adError: AdError) {
                                rewardedAd = null
                                counter = 0
//                                dismissLoadingDialog()
                            }
                        }
                        onShow.invoke(ADMOB, ad)
                    }
                }

                override fun onAdFailedToLoad(adError: LoadAdError) {
                    rewardedAd = null
                    if (counter == 4) {
                        dismissLoadingDialog()
                        onAdFailed()
                        return
                    }
                    counter++
                    loadAdMobRewarded(
                        activity,
                        adUnitId,
                        onRewardEarned,
                        onAdDismissed,
                        onAdFailed,
                        onShow
                    )
                }
            }
        )
    }

}