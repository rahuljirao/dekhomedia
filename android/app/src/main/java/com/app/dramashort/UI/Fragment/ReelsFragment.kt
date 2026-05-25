package com.app.dramashort.UI.Fragment

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AlertDialog
import androidx.fragment.app.viewModels
import androidx.lifecycle.viewModelScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.PagerSnapHelper
import androidx.recyclerview.widget.RecyclerView
import com.app.dramashort.Model.CommonInfoReel
import com.app.dramashort.Model.FavouriteRequest
import com.app.dramashort.Model.LikeRequest
import com.app.dramashort.Model.SeriesListResponse.ResponseDetail
import com.app.dramashort.UI.Activity.ReelsActivity
import com.app.dramashort.UI.Adapter.SeriesReelsAdapter
import com.app.dramashort.Utils.CommonsKt
import com.app.dramashort.Utils.gone
import com.app.dramashort.Utils.visible
import com.app.dramashort.ViewModel.ApiResult
import com.app.dramashort.ViewModel.UserViewModel
import com.app.dramashort.databinding.FragmentReelsBinding
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.launch
import test.app.gallery.UI1.Base.BaseFragment
import kotlin.getValue

@AndroidEntryPoint
class ReelsFragment : BaseFragment() {
    private var infoLauncher = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
    }
    val viewModel: UserViewModel by viewModels()

    lateinit var seriesReelsAdapter: SeriesReelsAdapter


    private var reels = mutableListOf<ResponseDetail>()
    private var isMuted = false


    lateinit var binding: FragmentReelsBinding

    fun getReelsAdpIsInitialized(): Boolean = (::seriesReelsAdapter.isInitialized)

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?,
    ): View? {
        binding = FragmentReelsBinding.inflate(inflater, container, false)
        return binding.root
    }


    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.reelsRecyclerView.layoutManager = LinearLayoutManager(requireContext())
        PagerSnapHelper().attachToRecyclerView(binding.reelsRecyclerView)
        loadData()
        binding.reelsRecyclerView.addOnScrollListener(object : RecyclerView.OnScrollListener() {
            override fun onScrolled(recyclerView: RecyclerView, dx: Int, dy: Int) {
                super.onScrolled(recyclerView, dx, dy)
                val currentPosition = (recyclerView.layoutManager as LinearLayoutManager)
                    .findFirstCompletelyVisibleItemPosition()
                if (currentPosition != -1) {
                    seriesReelsAdapter.updatePlayback(currentPosition)
                }
            }

            override fun onScrollStateChanged(recyclerView: RecyclerView, newState: Int) {
                super.onScrollStateChanged(recyclerView, newState)
                if (newState == RecyclerView.SCROLL_STATE_DRAGGING || newState == RecyclerView.SCROLL_STATE_SETTLING) {
                    seriesReelsAdapter.pauseAllPlayers()
                }
            }
        })
        binding.reelsRecyclerView.addOnScrollListener(object : RecyclerView.OnScrollListener() {
            override fun onScrolled(recyclerView: RecyclerView, dx: Int, dy: Int) {
                super.onScrolled(recyclerView, dx, dy)
                val firstVisiblePosition = (recyclerView.layoutManager as LinearLayoutManager)
                    .findFirstVisibleItemPosition()
            }
        })

    }

    private fun callApi() {
        showProgress()
        viewModel.viewModelScope.launch {
            val result = viewModel.repository.getSeriesList(0, pref.authToken)
            if (result is ApiResult.Success) {
                result.data.responseDetails?.let { seriesList ->
                    reels = mutableListOf<ResponseDetail>()
                    reels.addAll(seriesList.filterNotNull())
                    loadData()
                }
                binding.progressLayout.mainLayout.visibility = View.GONE
                if (reels.isEmpty()) {
                    showEmpty()
                }
            } else if (result is ApiResult.Error) {
                binding.progressLayout.mainLayout.visibility = View.GONE
                showErrorEmpty(result.message)
            }
        }
    }


    private fun loadData() {
        var getReelsDataList = CommonsKt.getCommonInfoReel(reels)
        seriesReelsAdapter = SeriesReelsAdapter(
            context = requireContext(),
            reelsFragment = this@ReelsFragment,
            reels = getReelsDataList,
            isSeries = true,
            isMuted = isMuted,
            infoLauncher = infoLauncher,
            onLikeChangeListener = { index, model ->
                actionLike(model)
            },
            onMuteChangeListener = { isMuted = it },
            onSetFavouriteListener = { index, model ->
                setFavourite(model)
            },
            onClickMoreEpisodeListener = { index ->
                startActivity(
                    Intent(
                        requireContext(),
                        ReelsActivity::class.java
                    ).apply {

                        putExtra(CommonsKt.SERIES_ID_EXTRA, getReelsDataList[index].id.toString())
                    }
                )
            }, onShowPaymentDialog = { index ->
                AlertDialog.Builder(requireContext())
                    .setTitle("Premium Content")
                    .setMessage("Please subscribe to access this reel.")
                    .setPositiveButton("Subscribe") { _, _ ->

                    }
                    .setNegativeButton("Cancel", null)
                    .show()
            }, onPlay = { model ->

            }
        )
        reelsAdapter2 = seriesReelsAdapter
        binding.reelsRecyclerView.adapter = seriesReelsAdapter
    }

    override fun onPause() {
        super.onPause()
        seriesReelsAdapter.pauseAllPlayers()
    }

    override fun onStop() {
        super.onStop()
        seriesReelsAdapter.pauseAllPlayers()
    }


    override fun onResume() {
        super.onResume()
        if (this.isVisible) {
            if (reels.isEmpty()) {
                callApi()
            } else {
                seriesReelsAdapter.resumeCurrentPlayer()
            }
        }
    }


    override fun onDestroyView() {
        super.onDestroyView()
        seriesReelsAdapter.releaseAllPlayers()
    }

    override fun onDetach() {
        super.onDetach()
        seriesReelsAdapter.pauseAllPlayers()
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

    private fun showErrorEmpty(message: String) = with(binding) {
        binding.progressLayout.progressAnimation.gone()
        binding.progressLayout.emptyLayout.visible()
        binding.progressLayout.mainLayout.visible()
        binding.progressLayout.emptyTitle.text = message
    }

    private fun actionLike(model1: CommonInfoReel) {
        viewModel.viewModelScope.launch {
            val model = LikeRequest(0, model1.isLiked, model1.id)
            val result = viewModel.repository.setLikeEpisode(pref.authToken, model)
            if (result is ApiResult.Success) {


            } else if (result is ApiResult.Error) {

            }
        }
    }

    private fun setFavourite(model1: CommonInfoReel) {


        viewModel.viewModelScope.launch {
            val model = FavouriteRequest(0, model1.isFavourites, model1.id)
            val result = viewModel.repository.setFavourite(model, pref.authToken)
            if (result is ApiResult.Success) {


            } else if (result is ApiResult.Error) {

            }
        }
    }
}
