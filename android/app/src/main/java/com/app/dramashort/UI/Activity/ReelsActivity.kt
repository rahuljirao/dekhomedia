package com.app.dramashort.UI.Activity

import android.annotation.SuppressLint
import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.util.Log
import android.view.View
import android.view.WindowManager
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.viewModels
import androidx.lifecycle.viewModelScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.PagerSnapHelper
import androidx.recyclerview.widget.RecyclerView
import com.app.dramashort.App.ReelShortApp
import com.app.dramashort.Dialogs.EpisodesListBottomSheet
import com.app.dramashort.Dialogs.FullScreenAdDialog
import com.app.dramashort.Model.AdTimerResponse
import com.app.dramashort.Model.AutoUnlockSettingRequest
import com.app.dramashort.Model.CommonInfoReel
import com.app.dramashort.Model.EpisodeRequest
import com.app.dramashort.Model.FavouriteRequest
import com.app.dramashort.Model.LikeRequest
import com.app.dramashort.Model.UnlockEpisodeRequest
import com.app.dramashort.Model.WatchEpisodeRequest
import com.app.dramashort.UI.Adapter.EpisodeListAdapter
import com.app.dramashort.UI.Adapter.ReelsAdapter
import com.app.dramashort.Utils.CommonsKt
import com.app.dramashort.Utils.gone
import com.app.dramashort.Utils.showToast
import com.app.dramashort.Utils.toBoolean
import com.app.dramashort.Utils.toInt
import com.app.dramashort.Utils.visible
import com.app.dramashort.ViewModel.ApiResult
import com.app.dramashort.ViewModel.UserViewModel
import com.app.dramashort.databinding.ActivityReelsBinding
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.launch
import test.app.gallery.UI1.Base.BaseActivity
import kotlin.getValue

@AndroidEntryPoint
class ReelsActivity : BaseActivity() {


    val viewModel: UserViewModel by viewModels()
    var coins = ReelShortApp.instance.loginResponse?.walletBalance ?: 0


    lateinit var reelsAdapter: ReelsAdapter
    private var reels = mutableListOf<CommonInfoReel>()
    private var isMuted = false
    var index = 0

    var isStartPlanActivity = false
    var isOnCreateActivity = false
    lateinit var binding: ActivityReelsBinding

    var episodesListBottomSheet: EpisodesListBottomSheet? = null
    var fullScreenadDialog: FullScreenAdDialog? = null


    companion object {
        private var TAG = "ReelsActivity"
        private var instance: ReelsActivity? = null
        fun getInstance(): ReelsActivity? {
            return instance
        }
    }


    var paymentLauncher = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
        isStartPlanActivity = false
        if (result.resultCode == Activity.RESULT_OK) {
            val isPaymentSuccess = result.data?.getBooleanExtra("isPaymentSuccess", false)!!
            Log.e("ReelsActivity", "isPaymentSuccess : $isPaymentSuccess")
            Log.e("ReelsActivity", "isPaymentSuccess index : $index")
            if (isPaymentSuccess) {
                val reelsModel = reels.get(index)
                unlockEpisodeFun(reelsModel, false) {
                    val episodeId = intent.getStringExtra(CommonsKt.SERIES_ID_EXTRA)!!
                    viewModel.loadEpisodes(episodeId.toInt(), pref.authToken)
                }
            } else {
                showToast("Payment Fail")
                showAds()
            }
        } else {
            showAds()
        }
    }

    private var infoLauncher =
        registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
            isStartPlanActivity = false
            if (result.resultCode == Activity.RESULT_OK) {
                index = result.data?.getIntExtra("isIndex", index) ?: index
                binding.reelsRecyclerView.scrollToPosition(index)
            }
        }


    private fun showAds() {
        val info = reels[index]
        try {
            Handler().postDelayed(Runnable {
                reelsAdapter.pauseAllPlayers()
            }, 200)

        } catch (e: Exception) {
            e.printStackTrace()
            Log.e(TAG, "showAds:$e ")
        }
        checkAdTimerApi(info.seriesId) { timerRes ->
            timerRes?.let { timer ->
                fullScreenadDialog = FullScreenAdDialog(this, timer, reels, index, onCloseButton = {
                    try {

                        var lastUnlockedIndex = reels.indexOfLast { !it.isLocked }
//                        lastUnlockedIndex = lastUnlockedIndex + 1
                        binding.reelsRecyclerView.scrollToPosition(lastUnlockedIndex)
//                        val viewHolder = binding.reelsRecyclerView?.findViewHolderForAdapterPosition(lastUnlockedIndex) as? ReelsAdapter.ReelViewHolder
//                        viewHolder?.binding?.playPauseIcon?.callOnClick()
//                        isShowFullScreenAdDialog = false
                    } catch (e: Exception) {
                        e.printStackTrace()
                        Log.e(TAG, "showAds Exception :${e.message} ")
                    }
                }) {
                    unlockEpisodeFun(info, true) {
                        val episodeId = intent.getStringExtra(CommonsKt.SERIES_ID_EXTRA)!!
                        viewModel.loadEpisodes(episodeId.toInt(), pref.authToken)
                    }
                }
                fullScreenadDialog!!.show(supportFragmentManager, "FullScreenDialog")
            }
        }


    }


    fun checkAdTimerApi(
        seriesId: Int?,
        callback: (AdTimerResponse.ResponseDetails?) -> Unit,
    ) {
        viewModel.viewModelScope.launch {
            val result = viewModel.repository.getAdTimer(EpisodeRequest(seriesId), pref.authToken)
            if (result is ApiResult.Success) {
                callback(result.data.responseDetails)
            } else if (result is ApiResult.Error) {
                callback(null)
            }
        }
    }

    private fun unlockEpisodeFun(info: CommonInfoReel, isAds: Boolean, callback: () -> Unit = {}) {
        val request = UnlockEpisodeRequest(
            seriesId = info.seriesId,
            episodeId = info.episodeNumber,
            isAds = isAds.toInt,
        )

        viewModel.viewModelScope.launch {
            val result = viewModel.repository.setUnlockEpisode(request, pref.authToken)
            if (result is ApiResult.Success) {
                Log.e(TAG, "unlockEpisodeFun Success: ${result.data.responseMessage}")
                callback()
            } else if (result is ApiResult.Error) {
                Log.e(TAG, "unlockEpisodeFun Error: ${result.message}")

            }
        }
    }

    fun unlockEpisodeNext(currentPosition: Int) {
        if (currentPosition + 1 < reelsAdapter.reels.size) {
            val nextReelsModel = reelsAdapter.reels[currentPosition + 1]
            if (nextReelsModel.isLocked) {


                val walletBalance = nextReelsModel.availableWalletBalance ?: 0
                val availableCoins = nextReelsModel.availableCoin ?: 0

                if (walletBalance <= 0 && availableCoins <= 0) {
                    unlockEpisodeFun(nextReelsModel, false) {
                        callApi()
                    }
                }
            }
        }
    }

    private fun watchEpisode(info: CommonInfoReel) {
        if (!info.isTrailer) {
            viewModel.viewModelScope.launch {
                val request = WatchEpisodeRequest(
                    seriesId = info.seriesId,
                    episodeNumber = info.episodeNumber,
                )
                val result = viewModel.repository.setWatchEpisode(request, pref.authToken)
                if (result is ApiResult.Success) {
                    result.data.responseDetails?.let {
                    }
                } else if (result is ApiResult.Error) {

                }
            }
        }
    }


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.setFlags(
            WindowManager.LayoutParams.FLAG_SECURE,
            WindowManager.LayoutParams.FLAG_SECURE
        )
        binding = ActivityReelsBinding.inflate(layoutInflater)
        window.decorView.systemUiVisibility =
            1280 or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION or View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY or View.STATUS_BAR_HIDDEN
        window.statusBarColor = 0

//        Log.e(TAG, "onCreate() authToken: ${pref.authToken}")

        setContentView(binding.root)
        instance = this
        isOnCreateActivity = true
        binding.reelsRecyclerView.layoutManager = LinearLayoutManager(this)
        PagerSnapHelper().attachToRecyclerView(binding.reelsRecyclerView)

        callApi()
        loadData()

//        val snapHelper = CustomPagerSnapHelper { reelsAdapter.reels }
//        snapHelper.attachToRecyclerView(binding.reelsRecyclerView)

        binding.reelsRecyclerView.addOnScrollListener(object : RecyclerView.OnScrollListener() {
            override fun onScrolled(recyclerView: RecyclerView, dx: Int, dy: Int) {
                super.onScrolled(recyclerView, dx, dy)
                scrolled(recyclerView)
            }
        })
    }

    fun scrolled(recyclerView: RecyclerView) {
        val currentPosition = (recyclerView.layoutManager as LinearLayoutManager).findFirstVisibleItemPosition()
        val reelsModel = reelsAdapter.reels[currentPosition]
        this@ReelsActivity.index = currentPosition


        if (reelsModel.isLocked) {

            val walletBalance = reelsAdapter.reels[0].availableWalletBalance ?: 0
            val availableCoins = reelsAdapter.reels[0].availableCoin ?: 0
            val total = walletBalance + availableCoins
            val requiredCoin = reelsModel.requiredCoin ?: 0

            if (requiredCoin <= total) {
                unlockEpisodeFun(reelsModel, false) {
                    callApi {
                        // API callback code
                    }
                }
            } else if (!isStartPlanActivity) {
                isStartPlanActivity = true
                paymentLauncher.launch(Intent(this@ReelsActivity, PlanActivity::class.java))

            }
            reelsAdapter.pauseAllPlayers()
        } else {
            reelsAdapter.updatePlayback(currentPosition)
            if (reelsModel.isAutoUnlocked.toBoolean) {
                unlockEpisodeNext(currentPosition)
            }
        }
    }


    private fun callApi(callback: () -> Unit = {}) {
        showProgress()

        val episodeId = intent.getStringExtra(CommonsKt.SERIES_ID_EXTRA)
        Log.e("ReelsActivity", "SERIES_ID_EXTRA   : ${episodeId}")

        episodeId?.let {
            viewModel.loadEpisodes(episodeId.toInt(), pref.authToken)
            viewModel.allEpisodes.observe(this) { result ->
                if (result is ApiResult.Success) {
                    result.data.responseDetails?.allEpisodes?.let { allEpisodes ->
                        if (result.data.responseDetails.allEpisodes.isNotEmpty()) {

                            allEpisodes.forEach {
                                it?.categoryName = result.data.responseDetails.series?.categoryName
                                it?.poster = result.data.responseDetails.series?.poster
                                    ?: result.data.responseDetails.series?.thumbnail

                                it?.isLiked = result.data.responseDetails.series?.isLiked ?: 0
                                it?.likedCount = result.data.responseDetails.series?.likes ?: 0

                                it?.isFavourites = result.data.responseDetails.series?.isFavourite ?: 0
                                it?.favouritesCount =
                                    result.data.responseDetails.series?.favourites ?: 0

                                it?.isAutoUnlocked = result.data.responseDetails.series?.isAutoUnlocked ?: 0

                            }

                            reels = ArrayList()
                            if (result.data.responseDetails.series?.coverVideo != null) {
                                val trailerItem = CommonInfoReel(
                                    id = result.data.responseDetails.allEpisodes.first()?.id,
                                    title = result.data.responseDetails.series.title,
                                    description = result.data.responseDetails.series.description,
                                    videoUrl = result.data.responseDetails.series.coverVideo,
                                    categoryName = result.data.responseDetails.series.categoryName,
                                    poster = result.data.responseDetails.series.poster
                                        ?: result.data.responseDetails.series.thumbnail,
                                    TypeName = result.data.responseDetails.series.typeName,
                                    seriesId = result.data.responseDetails.series.id,
                                    isTrailer = true,
                                    availableWalletBalance = result.data.responseDetails.series.availableWalletBalance,
                                    availableCoin = result.data.responseDetails.series.availableCoin,

                                    isLiked = result.data.responseDetails.series.isLiked ?: 0,
                                    likedCount = result.data.responseDetails.series.likes ?: 0,

                                    isFavourites = result.data.responseDetails.series.isFavourite ?: 0,
                                    favouritesCount = result.data.responseDetails.series.favourites
                                        ?: 0,

                                    isAutoUnlocked = result.data.responseDetails.series.isAutoUnlocked
                                        ?: 0
                                )
                                reels.add(trailerItem)
                            }

                            reels.addAll(CommonsKt.getCommonInfoReel(allEpisodes.filterNotNull()))

                            if (reels.isEmpty()) {
                                showEmpty()
                            } else {
                                binding.progressLayout.mainLayout.visibility = View.GONE
                            }

                            if (isOnCreateActivity) {
                                index = result.data.responseDetails.series?.lastViewedEpisode ?: index
                                isOnCreateActivity = false
                            }

                            CommonsKt.LAST_INDEX?.let {
                                index = CommonsKt.LAST_INDEX!!
                                CommonsKt.LAST_INDEX = null
                                Log.e("ReelsActivity", "isPaymentSuccess  index 2 : $index")

                            }
                            reels.forEach {
                                Log.e(TAG, "callApi episodeNumber  ${it.episodeNumber} , isLocked: " + it.isLocked)
                            }
                            loadData()
                            callback.invoke()
                        } else {
                            showErrorEmpty("Episodes Not Found")
                        }
                    }
                } else if (result is ApiResult.Error) {
                    Log.e("ReelsActivity", "allEpisodes  ApiResult.Error : ${result.message}")
                    showErrorEmpty(result.message)
                }
            }
        }
    }

    @SuppressLint("NotifyDataSetChanged")
    fun onNext(currentPosition: Int, episodeAdapter: EpisodeListAdapter) {
        binding.reelsRecyclerView.post {
            binding.reelsRecyclerView.scrollToPosition(currentPosition)
            reelsAdapter.updatePlayback(currentPosition)
            episodesListBottomSheet?.reels = reels.map {
                it.isPlaying = (it == reels[currentPosition])
                it
            }
            episodeAdapter.notifyDataSetChanged()


        }
    }

    private fun loadData() {
        episodesListBottomSheet = EpisodesListBottomSheet(
            this,
            reels.toList(),
            setOnCheckedChangeListener = { seriesId, isChecked ->
                calliAutoUnlockAPI(seriesId, isChecked)
            }, setOnClickListener = { currentPosition, episodeAdapter ->
                binding.reelsRecyclerView.post {
                    binding.reelsRecyclerView.scrollToPosition(currentPosition)
                    reelsAdapter.updatePlayback(currentPosition)
                    episodesListBottomSheet?.reels = reelsAdapter.reels
                    episodeAdapter.notifyDataSetChanged()
                }
            }
        )




        reelsAdapter = ReelsAdapter(
            reelsActivity = this,
            reels = reels,
            isSeries = false,
            isMuted = isMuted,
            infoLauncher = infoLauncher,
            onLikeChangeListener = { index, model ->
                actionLike(model)
            },
            onSetFavouriteListener = { index, model ->
                setFavourite(model)
            },
            onMuteChangeListener = {
                isMuted = it
            },
            onClickMoreEpisodeListener = { index ->
                episodesListBottomSheet?.reels = reelsAdapter.reels
                episodesListBottomSheet?.show(supportFragmentManager, EpisodesListBottomSheet.TAG)
            }, onShowPaymentDialog = { index ->
                this.index = index
                if (!isStartPlanActivity) {
                    isStartPlanActivity = true
                    paymentLauncher.launch(Intent(this@ReelsActivity, PlanActivity::class.java))
                }
            }, onPlay = { model ->
                watchEpisode(model)
            }
        )
        binding.reelsRecyclerView.adapter = reelsAdapter




        binding.reelsRecyclerView.scrollToPosition(index)


    }

    private fun calliAutoUnlockAPI(seriesId: Int, callback: () -> Unit = {}) {
        showProgress()
        viewModel.viewModelScope.launch {
            val request = AutoUnlockSettingRequest(seriesId, true.toInt)
            val result = viewModel.repository.setAutoUnlockSetting(request, pref.authToken)
            if (result is ApiResult.Success) {
                Log.e("ReelsActivity", "calliAutoUnlockAPI  Success : ${result.data.responseMessage}")
                callback()
            } else if (result is ApiResult.Error) {
                Log.e("ReelsActivity", "calliAutoUnlockAPI  ApiResult.Error : ${result.message}")

            }
        }
    }

    private fun calliAutoUnlockAPI(seriesId: Int, isChecked: Boolean, callback: () -> Unit = {}) {
        showProgress()
        viewModel.viewModelScope.launch {
            val request = AutoUnlockSettingRequest(seriesId, isChecked.toInt)
            val result = viewModel.repository.setAutoUnlockSetting(request, pref.authToken)
            if (result is ApiResult.Success) {
                binding.progressLayout.mainLayout.visibility = View.GONE
                if (isChecked) {

                    Toast.makeText(
                        this@ReelsActivity,
                        result.data.responseMessage,
                        Toast.LENGTH_SHORT
                    ).show()
                    callback.invoke()
                } else {
                    Toast.makeText(
                        this@ReelsActivity,
                        result.data.responseMessage,
                        Toast.LENGTH_SHORT
                    ).show()
                }
                callApi()
            } else if (result is ApiResult.Error) {
                binding.progressLayout.mainLayout.visibility = View.GONE
            }
        }
    }

    private fun actionLike(model1: CommonInfoReel) {

        viewModel.viewModelScope.launch {
            val model = LikeRequest(model1.id, model1.isLiked, model1.seriesId)
            val result = viewModel.repository.setLikeEpisode(pref.authToken, model)
            if (result is ApiResult.Success) {
                reelsAdapter.reels.forEachIndexed { i, reel ->
                    if (reel != reelsAdapter.reels[index]) {
                        reelsAdapter.reels[i].isLiked = model1.isLiked
                        reel.likedCount = if (model1.isLiked == 1) {
                            reel.likedCount + 1
                        } else {
                            reel.likedCount - 1
                        }
                        reelsAdapter.notifyItemChanged(i)
                    }
                }


            } else if (result is ApiResult.Error) {
                binding.progressLayout.mainLayout.visibility = View.GONE
                showErrorEmpty(result.message)
            }
        }
    }

    private fun setFavourite(model1: CommonInfoReel) {

        viewModel.viewModelScope.launch {
            val model = FavouriteRequest(model1.id, model1.isFavourites, model1.seriesId)
            val result = viewModel.repository.setFavourite(model, pref.authToken)
            if (result is ApiResult.Success) {
                reelsAdapter.reels.forEachIndexed { i, reel ->
                    if (reel != reelsAdapter.reels[index]) {
                        reelsAdapter.reels[i].isFavourites = model1.isFavourites

                        reel.favouritesCount = if (model1.isFavourites == 1) {
                            reel.favouritesCount + 1
                        } else {
                            reel.favouritesCount - 1
                        }
                        reelsAdapter.notifyItemChanged(i)
                    }
                }


            } else if (result is ApiResult.Error) {
                binding.progressLayout.mainLayout.visibility = View.GONE
                showToast(result.message)
            }
        }
    }


    override fun onPause() {
        super.onPause()
        reelsAdapter.pauseAllPlayers()
    }

    override fun onResume() {
        super.onResume()
        reelsAdapter.resumeCurrentPlayer()
    }

    override fun onDestroy() {
        super.onDestroy()
        reelsAdapter.releaseAllPlayers()
    }


    private fun showEmpty() = with(binding) {
        progressLayout.mainLayout.visible()
        progressLayout.progressAnimation.gone()
        progressLayout.emptyLayout.visible()
    }

    private fun showProgress() = with(binding) {
        progressLayout.mainLayout.visible()
        progressLayout.progressAnimation.visible()
        progressLayout.emptyLayout.gone()
    }

    private fun showErrorEmpty(message: String) {
        binding.progressLayout.progressAnimation.gone()
        binding.progressLayout.emptyLayout.visible()
        binding.progressLayout.mainLayout.visible()
        binding.progressLayout.emptyTitle.text = message
        Toast.makeText(this@ReelsActivity, message, Toast.LENGTH_LONG).show()

    }

    override fun onBackPressed() {
        super.onBackPressed()

    }

    fun smoothScrollToPosition(position: Int) {
        binding.reelsRecyclerView.smoothScrollToPosition(position)
    }

}