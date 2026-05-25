package com.app.dramashort.UI.Fragment

import android.content.Intent
import android.graphics.Color
import android.graphics.PorterDuff
import android.os.Bundle
import android.os.Handler
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.viewModels
import androidx.lifecycle.viewModelScope
import com.app.dramashort.Ads.AdManager
import com.app.dramashort.Model.CoinDataResponse
import com.app.dramashort.Model.SocialLinksResponse
import com.app.dramashort.UI.Activity.BindEmailActivity
import com.app.dramashort.UI.Activity.SighInActivity
import com.app.dramashort.Utils.CommonsKt
import com.app.dramashort.Utils.CommonsKt.startAdsCountdown
import com.app.dramashort.Utils.asBoolean
import com.app.dramashort.Utils.gone
import com.app.dramashort.Utils.isPermissionGranted
import com.app.dramashort.Utils.showToast
import com.app.dramashort.Utils.toBoolean
import com.app.dramashort.Utils.visible
import com.app.dramashort.ViewModel.ApiResult
import com.app.dramashort.ViewModel.UserViewModel
import com.app.dramashort.databinding.FragmentRewardsBinding
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import test.app.gallery.UI1.Base.BaseFragment

@AndroidEntryPoint
class RewardsFragment : BaseFragment() {
    val viewModel: UserViewModel by viewModels()
    var socialLinksResponse: SocialLinksResponse.ResponseDetails? = null

    lateinit var binding: FragmentRewardsBinding

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?,
    ): View? {
        binding = FragmentRewardsBinding.inflate(inflater, container, false)
        return binding.root
    }


    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        getSocialLinksApi()
        callApi(false)
    }

    override fun onResume() {
        super.onResume()
        dailyCheckedInSetData()
        reelsAdapter2?.pauseAllPlayers()
    }

    private fun callApi(isShowTimer: Boolean) {
        showProgress()
        viewModel.getCoinData(pref.authToken)
        viewModel.coinData.observe(viewLifecycleOwner) { result ->
            if (result is ApiResult.Success) {
                result.data.responseDetails?.let { coinData ->
                    loadData(coinData.filterNotNull().first(), isShowTimer)
                    dailyCheckedInSetData()
                }
                binding.progressLayout.mainLayout.visibility = View.GONE
            } else if (result is ApiResult.Error) {


                showErrorEmpty(result.message)
            }
        }
    }

    private fun loadData(coinData: CoinDataResponse.ResponseDetail, isShowTimer: Boolean) {


        binding.followUsOnFacebookCoin.text = (coinData.followUsOnFacebookCoin ?: "0").toString()
        binding.followUsOnYoutubeCoin.text = (coinData.followUsOnYoutubeCoin ?: "0").toString()
        binding.followUsOnInstagramCoin.text = (coinData.followUsOnInstagramCoin ?: "0").toString()
        binding.bindEmailCoin.text = (coinData.bindEmailCoin ?: "0").toString()
        binding.loginRewardCoin.text = (coinData.loginRewardCoin ?: "0").toString()
        binding.whatsAppCoin.text = (coinData.linkWhatsappCoin ?: "0").toString()
        binding.allowNotificationCoin.text = (coinData.turnOnNotificationCoin ?: "0").toString()



        binding.watchAds.text =
            "Watch ads(${coinData.dailyWatchedAds} /${(coinData.dailyWatchMaximumAds ?: "0")})"
        binding.eachTime.text =
            "Get ${(coinData.dailyWatchAdsForMinimumCoin ?: "0")}-${(coinData.dailyWatchAdsForMaximumCoin ?: "0")} coins each time"
        binding.atMost.text = "${(coinData.extraDaily ?: "0")} at most"

        binding.day1Coin.text = "${(coinData.day1Coin ?: "0")}"
        binding.day2Coin.text = "${(coinData.day2Coin ?: "0")}"
        binding.day3Coin.text = "${(coinData.day3Coin ?: "0")}"
        binding.day4Coin.text = "${(coinData.day4Coin ?: "0")}"
        binding.day5Coin.text = "${(coinData.day5Coin ?: "0")}"
        binding.day6Coin.text = "${(coinData.day6Coin ?: "0")}"
        binding.day7Coin.text = "${(coinData.day7Coin ?: "0")}"


        binding.textDay1.tag = "${(coinData.day1Coin ?: "0")}"
        binding.textDay2.tag = "${(coinData.day2Coin ?: "0")}"
        binding.textDay3.tag = "${(coinData.day3Coin ?: "0")}"
        binding.textDay4.tag = "${(coinData.day4Coin ?: "0")}"
        binding.textDay5.tag = "${(coinData.day5Coin ?: "0")}"
        binding.textDay6.tag = "${(coinData.day6Coin ?: "0")}"
        binding.textDay7.tag = "${(coinData.day7Coin ?: "0")}"

        binding.btnLoginRewards.setOnClickListener {
            startActivity(Intent(requireContext(), SighInActivity::class.java))
        }
        binding.btnBindEmail.setOnClickListener {
            startActivity(Intent(requireContext(), BindEmailActivity::class.java))
        }
        binding.btnFollowInstagram.setOnClickListener {
            socialLinksResponse?.followUsOnInstagram?.let { url ->
                callApiUpdateReward("follow_us_on_instagram", url)
            }
        }






        binding.btnFollowYouTube.setOnClickListener {
            socialLinksResponse?.followUsInYoutube?.let { url ->
                callApiUpdateReward("follow_us_on_youtube", url)
            }
        }
        binding.btnFollowFb.setOnClickListener {
            socialLinksResponse?.followUsInFacebook?.let { url ->
                callApiUpdateReward("follow_us_on_facebook", url)
            }
        }

        binding.btnWhatsAppLink.setOnClickListener {
            socialLinksResponse?.followUsInWhatsappChannel?.let { url ->
                callApiUpdateReward("link_whatsapp", url)
            }
        }
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.TIRAMISU) {
            binding.llAllowNotification.visible()
            binding.lineWhatsApp.visible()

        } else {
            binding.llAllowNotification.gone()
            binding.lineWhatsApp.gone()
        }

        binding.btnAllowNotification.setOnClickListener {
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.TIRAMISU) {
                if (requireContext().isPermissionGranted()) {
                    Toast.makeText(
                        requireContext(),
                        "Notification permission already granted",
                        Toast.LENGTH_SHORT
                    ).show()
                } else {
                    requestPermissions(
                        arrayOf(android.Manifest.permission.POST_NOTIFICATIONS),
                        1001 // Request code
                    )
                }
            } else {
                Toast.makeText(
                    requireContext(),
                    "Notifications are allowed by default on this version",
                    Toast.LENGTH_SHORT
                ).show()
            }
        }


        binding.btnWatchAds.setOnClickListener {
            showAds(coinData)
        }





        if (isWatchAdsEnabled(coinData)) {
            if (isShowTimer) {
                CommonsKt.startAdsCountdown3(
                    duration = CommonsKt.timeToMillis(coinData.timeBetweenDailyAds),
                    onTick = { timeLeft ->
                        binding.btnWatchAds.isEnabled = false
                        binding.btnWatchAds.text = "Watch ads in $timeLeft"
                    },
                    onFinish = {
                        if (isWatchAdsEnabled(coinData)) {
                            binding.btnWatchAds.isEnabled = true
                            binding.btnWatchAds.text = "Watch"
                        }
                    }
                )
            } else {
                binding.btnWatchAds.isEnabled = true
                binding.btnWatchAds.text = "Watch"
            }
        } else {
            binding.btnWatchAds.isEnabled = false
            startAdsCountdown(
                CommonsKt.timeToMillis(coinData.resetAdsTime!!),
                onTick = { timeLeft ->
                    binding.btnWatchAds.text = "Watch ads in $timeLeft"
                },
                onFinish = {
                    if (isWatchAdsEnabled(coinData)) {
                        binding.btnWatchAds.isEnabled = true
                        binding.btnWatchAds.text = "Watch"
                    }
                })
        }
    }

    private fun showAds(coinData1: CoinDataResponse.ResponseDetail) {
        var isRewardEarned = false
        coinData1.dailyWatchMaximumAds?.let { dailyWatchMaximumAds ->
            if (isWatchAdsEnabled(coinData1)) {
                if (AdManager.instance.adResponse.isNotEmpty()) {
                    AdManager.instance.loadShowRewardedAd(
                        requireActivity(),
                        AdManager.instance.adResponse,
                        onRewardEarned = {
                            isRewardEarned = true
                            requireContext().showToast("Reward Earned..")
                            callAPIEarnCoin {

                                viewModel.getCoinData(pref.authToken) { coinData1 ->
                                    if (isRewardEarned) {
                                        isRewardEarned = false
                                        loadData(coinData1, true)
                                    }
                                }
                            }
                        }, onAdDismissed = {
                            if (!isRewardEarned) {
                                requireContext().showToast("Please watch full ad..")
                            }
                        }, onAdFailed = {
                            requireContext().showToast("Please try again..")
                        })
                } else {
                    requireContext().showToast("Ad List is Empty Please try again..")
                }
            }
        }

    }

    fun isWatchAdsEnabled(coinData: CoinDataResponse.ResponseDetail): Boolean {
        return coinData.dailyWatchedAds!! < coinData.dailyWatchMaximumAds!!
//        return true
    }

    private fun callAPIEarnCoin(function: () -> Unit) {
        viewModel.viewModelScope.launch {
            val result = viewModel.repository.setDailyWatchAds(pref.authToken)
            if (result is ApiResult.Success) {

                result.data.responseDetails?.let { responseMessage ->
                    requireContext().showToast(result.data.responseMessage.toString())
                    CommonsKt.showCongratulationsDialog(requireActivity(), responseMessage.coin!!)
                }
                function()
            } else if (result is ApiResult.Error) {
//                requireContext().showToast(result.message)
            }
        }
    }

    private fun getSocialLinksApi() {
        viewModel.viewModelScope.launch {
            val result = viewModel.repository.getSocialLinks(pref.authToken)
            if (result is ApiResult.Success) {
                result.data.responseDetails?.let { responseDetails ->
                    socialLinksResponse = responseDetails
                }
            } else if (result is ApiResult.Error) {
//                requireContext().showToast(result.message)
            }
        }
    }

    private fun setDailyCheckedIn(day: Int, coin: Int = 0) {
        showProgress()
        viewModel.viewModelScope.launch(Dispatchers.Main) {
            val result = viewModel.repository.setDailyCheckedIn(day)
            if (result is ApiResult.Success) {
                result.data.responseDetails?.let {
//                    dailyCheckedInSetData(result.data.responseDetails.filterNotNull().first())

//                    val mainActivity = requireActivity() as MainActivity
                    dailyCheckedInSetData()
                    CommonsKt.showCongratulationsDialog(requireActivity(), coin)
//                    viewModel.login(viewModel.loginRequest)
                    binding.progressLayout.mainLayout.visibility = View.GONE
                }
            } else if (result is ApiResult.Error) {
//                requireContext().showToast(result.message)
                binding.progressLayout.mainLayout.visibility = View.GONE
            }
        }

    }

    private fun dailyCheckedInSetData() {
        viewModel.login(viewModel.loginRequest, pref.authToken)
        viewModel.signUp.observe(viewLifecycleOwner) { loginResponse ->


            data class PairModel(
                val linear: LinearLayout,
                val string: String?,
                val textView: TextView,
            )


            val dayViews = listOf<PairModel>(
                PairModel(binding.llDay1, loginResponse.checkedInDay1, binding.textDay1),
                PairModel(binding.llDay2, loginResponse.checkedInDay2, binding.textDay2),
                PairModel(binding.llDay3, loginResponse.checkedInDay3, binding.textDay3),
                PairModel(binding.llDay4, loginResponse.checkedInDay4, binding.textDay4),
                PairModel(binding.llDay5, loginResponse.checkedInDay5, binding.textDay5),
                PairModel(binding.llDay6, loginResponse.checkedInDay6, binding.textDay6),
                PairModel(binding.llDay7, loginResponse.checkedInDay7, binding.textDay7)
            )


            val allNull = dayViews.all { it.string == null }

            if (allNull) {
                dayViews[0].textView.text = "Today"
                binding.llDay1.setOnClickListener {
                    setDailyCheckedIn(1, dayViews[0].textView.tag.toString().toInt())
                    Toast.makeText(requireContext(), "${1}", Toast.LENGTH_SHORT).show()
                }
            } else {
                var isAddedFirstOnClickListener = false
                var lastDate = ""
                dayViews.forEachIndexed { index, (view, checkedInDay, textView) ->
                    if (checkedInDay != null) {
                        if (CommonsKt.isTodayDate(checkedInDay)) {
                            textView.text = "Today"
                            binding.checkedDays.text = "Check in Streak : ${index + 1} Day"

                            view.setOnClickListener {
                                requireContext().showToast("Already claimed")
                            }
                        }
                        lastDate = checkedInDay
                        if (CommonsKt.isDatePassed(checkedInDay)) {
//                            view.setBackgroundResource(R.drawable.ai_editor_background)
                            disableViewGroup(view)
                            view.isEnabled = false
                        } else {
                            view.isEnabled = true
                        }
                    } else {
//                        if (lastDate.isNotEmpty() && isDatePassedCountToday(lastDate)) {
                        if (lastDate.isNotEmpty() && !CommonsKt.isTodayDate(lastDate)) {
                            if (!isAddedFirstOnClickListener) {
                                textView.text = "Today"
                                binding.checkedDays.text = "Check in Streak : ${index + 1} Day"
                                view.setOnClickListener {
                                    setDailyCheckedIn(
                                        index + 1,
                                        dayViews[index].textView.tag.toString().toInt()
                                    )
                                    requireContext().showToast("${index + 1}")
                                }
                                isAddedFirstOnClickListener = true
                            }
                        } else {
                            view.setOnClickListener {
                                requireContext().showToast("Try next Day")
                            }
                        }
                    }
                }
            }

            binding.rewardsCoins.text = ((loginResponse.walletBalance ?: 0) + (loginResponse.coinBalance ?: 0)).toString()

            binding.btnFollowYouTube.isEnabled = !loginResponse.followUsOnYoutube!!.asBoolean
            binding.btnFollowYouTube.text = if (!loginResponse.followUsOnYoutube.asBoolean) "Claim" else "Claimed"

            binding.btnFollowFb.isEnabled = !loginResponse.followUsOnFacebook!!.asBoolean
            binding.btnFollowFb.text = if (!loginResponse.followUsOnFacebook.asBoolean) "Claim" else "Claimed"


            binding.btnFollowInstagram.isEnabled = !loginResponse.followUsOnInstagram!!.asBoolean
            binding.btnFollowInstagram.text = if (!loginResponse.followUsOnInstagram.asBoolean) "Claim" else "Claimed"

            binding.btnBindEmail.isEnabled = !loginResponse.bindEmail!!.asBoolean
            binding.btnBindEmail.text = if (!loginResponse.bindEmail.asBoolean) "Claim" else "Claimed"

            binding.btnLoginRewards.isEnabled = !loginResponse.loginReward!!.asBoolean
            binding.btnLoginRewards.text = if (!loginResponse.loginReward.asBoolean) "Claim" else "Claimed"

            binding.btnWhatsAppLink.isEnabled = !loginResponse.linkWhatsapp!!.asBoolean
            binding.btnWhatsAppLink.text = if (!loginResponse.linkWhatsapp.asBoolean) "Claim" else "Claimed"



            if (!loginResponse.turnOnNotification!!.asBoolean && !requireContext().isPermissionGranted()) {
                binding.btnAllowNotification.isEnabled = true
                binding.btnAllowNotification.text = "Allow"

            } else {
                binding.btnAllowNotification.isEnabled = false
                binding.btnAllowNotification.text = "Allowed"
            }
//            binding.btnAllowNotification.isEnabled = !loginResponse.turnOnNotification!!.asBoolean
//            binding.btnAllowNotification.text = if(!loginResponse.turnOnNotification.asBoolean) "Allow" else "Allowed"


            if (loginResponse.isWeeklyVip?.toBoolean == true || loginResponse.isYearlyVip?.toBoolean == true) {
                binding.llAds.visibility = View.GONE
            } else {
                binding.llAds.visibility = View.VISIBLE
            }

        }
    }

    private fun callLogin() {
        viewModel.login(
            viewModel.loginRequest,
            pref.authToken
        )
    }

    fun disableViewGroup(viewGroup: ViewGroup) {
        viewGroup.alpha = 0.4f // Dim the whole layout

        for (i in 0 until viewGroup.childCount) {
            val child = viewGroup.getChildAt(i)
            child.isEnabled = false

            when (child) {
                is TextView -> child.setTextColor(Color.GRAY)
                is ImageView -> child.setColorFilter(Color.GRAY, PorterDuff.Mode.SRC_IN)
                is ViewGroup -> disableViewGroup(child) // recursive
            }
        }
    }


    private fun callApiUpdateReward(reward_type: String, url: String = "") {
        showProgress()
        viewModel.viewModelScope.launch {
            val result = viewModel.repository.setUpdateReward(reward_type)
            if (result is ApiResult.Success) {

                result.data.responseDetails?.let {

                    Handler().postDelayed(Runnable {
                        when (reward_type) {
                            "follow_us_on_instagram" -> {
                                binding.btnFollowInstagram.isEnabled = false
                                binding.btnFollowInstagram.text = "Claimed"
                            }

                            "official_website" -> {
                                binding.btnFollowYouTube.isEnabled = false
                                binding.btnFollowYouTube.text = "Claimed"
                            }

                            "follow_us_on_facebook" -> {
                                binding.btnFollowFb.isEnabled = false
                                binding.btnFollowFb.text = "Claimed"
                            }

                            "link_whatsapp" -> {
                                binding.btnWhatsAppLink.isEnabled = false
                                binding.btnWhatsAppLink.text = "Claimed"
                            }

                            "turn_on_notification" -> {
                                binding.btnAllowNotification.isEnabled = false
                                binding.btnAllowNotification.text = "Allowed"
                            }
                        }
                    }, 2000)

                    if (reward_type != "turn_on_notification") {
                        CommonsKt.openBrowser(requireContext(), url)
                    }
                }
                binding.progressLayout.mainLayout.visibility = View.GONE

            } else if (result is ApiResult.Error) {
//                requireContext().showToast(result.message)
                binding.progressLayout.mainLayout.visibility = View.GONE
            }
        }

    }

    private fun showProgress() = with(binding) {
        progressLayout.mainLayout.visible()
        progressLayout.progressAnimation.visible()
        progressLayout.emptyLayout.gone()
    }

    private fun showErrorEmpty(message: String) = with(binding) {
        binding.progressLayout.progressAnimation.gone()
        binding.progressLayout.emptyLayout.visible()
        binding.progressLayout.mainLayout.visible()
        binding.progressLayout.emptyTitle.text = message
    }


    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray,
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == 1001) {
            if (grantResults.isNotEmpty() && grantResults[0] == android.content.pm.PackageManager.PERMISSION_GRANTED) {
                callApiUpdateReward("turn_on_notification")
                Toast.makeText(
                    requireContext(),
                    "Notification permission granted",
                    Toast.LENGTH_SHORT
                ).show()
            } else {
                Toast.makeText(
                    requireContext(),
                    "Notification permission denied",
                    Toast.LENGTH_SHORT
                ).show()
            }
        }
    }

}