package com.app.dramashort.Dialogs

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.activity.OnBackPressedCallback
import androidx.fragment.app.DialogFragment
import com.app.dramashort.Ads.AdManager
import com.app.dramashort.Model.AdTimerResponse
import com.app.dramashort.Model.AdTimerResponse.ResponseDetails
import com.app.dramashort.Model.CommonInfoReel
import com.app.dramashort.R
import com.app.dramashort.UI.Activity.ReelsActivity
import com.app.dramashort.Utils.CommonsKt
import com.app.dramashort.Utils.showToast
import com.app.dramashort.databinding.DialogFullscreenBinding
import com.bumptech.glide.Glide
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

class FullScreenAdDialog(
    val activity: ReelsActivity,
    val adTimer2: AdTimerResponse.ResponseDetails,
    val reels: MutableList<CommonInfoReel>,
    val index: Int,
    private val onCloseButton: () -> Unit = {},
    private val onDismissAdListener: () -> Unit,
) : DialogFragment() {

    lateinit var binding: DialogFullscreenBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // Apply the custom style
        setStyle(STYLE_NO_TITLE, R.style.FullScreenDialog)
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?,
    ): View {
        binding = DialogFullscreenBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        requireActivity().onBackPressedDispatcher.addCallback(
            viewLifecycleOwner,
            object : OnBackPressedCallback(true) {
                override fun handleOnBackPressed() {
                    dismiss()
                }
            })
        binding.closeButton.setOnClickListener {
            this.dismiss()
            onCloseButton.invoke()
            CommonsKt.currentCountdownTimer2?.cancel()
        }


        loadData(adTimer2)
        Glide.with(binding.imagePoster.context)
            .load(reels[index].poster)
            .into(binding.imagePoster)
    }

    private fun loadData(adTimer: ResponseDetails) {
        if (adTimer.isLocked == 0) {
            binding.llBtnWatchAd.isEnabled = true
            binding.todayText.text = "Watched today(${adTimer.watchedAdsForEpisode ?: 0} /${(adTimer.totalAds ?: "0")})"
            // Set up close button
            binding.llBtnWatchAd.setOnClickListener {
                var isRewardEarned = false
                if (AdManager.instance.adResponse.isNotEmpty()) {
                    AdManager.instance.loadShowRewardedAd(
                        requireActivity(),
                        AdManager.instance.adResponse,
                        onRewardEarned = {
                            isRewardEarned = true
                            requireContext().showToast("Reward Earned..")
                            onDismissAdListener.invoke()
                            this.dismiss()
                        }, onAdDismissed = {
                            if (!isRewardEarned) {
                                requireContext().showToast("Please watch full ad..")
                            }
                        }, onAdFailed = {
                            requireContext().showToast("Please try again..")
                        })
                } else {
                    requireContext().showToast("Ad List is Empty Please try again..")
                    AdManager.instance.loadApi(activity)
                }
            }
        } else {
            binding.llBtnWatchAd.isEnabled = false
            showTimer(this.adTimer2)
        }
    }

    override fun onStart() {
        super.onStart()
        // Ensure dialog is full-screen
        dialog?.window?.setLayout(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT
        )
    }


    override fun onPrimaryNavigationFragmentChanged(isPrimaryNavigationFragment: Boolean) {
        super.onPrimaryNavigationFragmentChanged(isPrimaryNavigationFragment)
    }


    private fun showTimer(adTimer: ResponseDetails) {
        CommonsKt.startAdsCountdown2(
            CommonsKt.timeToMillis(adTimer.difference!!),
            onTick = { timeLeft ->
                binding.todayText.text = "Watch ads in $timeLeft"
            },
            onFinish = {
                CoroutineScope(Dispatchers.Main).launch {
                    delay(2000) // non-blocking delay
                    activity.checkAdTimerApi(reels[index].seriesId) { coinData1 ->
                        coinData1?.let {
                            loadData(coinData1)
                        }
                    }
                }
            })
    }
}