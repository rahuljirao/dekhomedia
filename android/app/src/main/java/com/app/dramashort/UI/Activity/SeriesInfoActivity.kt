package com.app.dramashort.UI.Activity

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.activity.viewModels
import androidx.lifecycle.viewModelScope
import com.app.dramashort.Dialogs.TagWiseListBottomSheet
import com.app.dramashort.Model.CommonInfoReel
import com.app.dramashort.Model.EpisodeListResponse
import com.app.dramashort.R
import com.app.dramashort.UI.Adapter.CommonInfoAdapter
import com.app.dramashort.UI.Adapter.EpisodeListAdapter
import com.app.dramashort.UI.Adapter.TagsAdapter
import com.app.dramashort.Utils.CommonsKt
import com.app.dramashort.Utils.CommonsKt.EPISODE_SPLIT_SIZE
import com.app.dramashort.Utils.CommonsKt.formatNumber
import com.app.dramashort.Utils.CommonsKt.getCommonInfo
import com.app.dramashort.Utils.gone
import com.app.dramashort.Utils.visible
import com.app.dramashort.ViewModel.ApiResult
import com.app.dramashort.ViewModel.UserViewModel
import com.app.dramashort.databinding.ActivitySeriesInfoBinding
import com.bumptech.glide.Glide
import com.google.android.material.tabs.TabLayout
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.launch
import test.app.gallery.UI1.Base.BaseActivity

@AndroidEntryPoint
class SeriesInfoActivity : BaseActivity() {
    private var reels = mutableListOf<CommonInfoReel>()


    val viewModel: UserViewModel by viewModels()
    lateinit var binding: ActivitySeriesInfoBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySeriesInfoBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.nestedScrollView.setOnScrollChangeListener { _, _, scrollY, _, _ ->
            if (scrollY > binding.banner.height - binding.toolbar.height) {

                binding.btnBack.visibility = View.VISIBLE
            } else {

                binding.btnBack.visibility = View.GONE
            }
        }

        callApi()
        callApiAllEpisodes()
        binding.btnBack.setOnClickListener {
            onBackPressed()
        }
        binding.btnBack2.setOnClickListener {
            onBackPressed()
        }
    }


    private fun callApi() {
        showProgress()
        val episodeId = intent.getStringExtra(CommonsKt.SERIES_ID_EXTRA)
        episodeId?.let {
            viewModel.loadEpisodes(episodeId.toInt(), pref.authToken)
            viewModel.allEpisodes.observe(this) { result ->
                if (result is ApiResult.Success) {

                    result.data.responseDetails?.let { responseDetails ->
                        loadData(responseDetails)
                    }
                    binding.progressLayout.mainLayout.visibility = View.GONE
                } else if (result is ApiResult.Error) {
                    showErrorEmpty(result.message)
                }
            }
        }
    }

    private fun loadData(details: EpisodeListResponse.ResponseDetails) {


        details.series?.let { series ->
            binding.totalViews.text = series.views?.formatNumber() + " Views"
            binding.description.text = series.description
            binding.title.text = series.title
            binding.totalEpisode.text = "${series.totalEpisode} Episodes in total"

            series.thumbnail?.let {
                Glide.with(this)
                    .load(series.thumbnail)
                    .placeholder(R.drawable.background_image)
                    .into(binding.thumbnail)
            }

            binding.btnWatchNow.setOnClickListener {
                onBackPressed()


            }
            series.tagsName?.let {
                val adapter = TagsAdapter(series.tagsName.filterNotNull()) { id, name ->
                    callTagWiseApi(id, name)
                }
                binding.recyclerTags.adapter = adapter
            }

        }

    }

    private fun callTagWiseApi(id: String, name: String) {
        val bottomSheet = TagWiseListBottomSheet(name)
        bottomSheet.show(supportFragmentManager, TagWiseListBottomSheet.TAG)
        viewModel.viewModelScope.launch {
            val result = viewModel.repository.getTagWiseList(id, pref.authToken)
            if (result is ApiResult.Success) {
                result.data.responseDetails?.let { responseDetails ->
                    bottomSheet.setList(getCommonInfo(responseDetails))
                    if (responseDetails.isEmpty()) {
                        bottomSheet.showEmpty()
                    } else {
                        bottomSheet.binding.progressLayout.mainLayout.visibility = View.GONE
                    }
                }
            } else if (result is ApiResult.Error) {
                bottomSheet.showErrorEmpty(result.message)
            }
        }
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
        Toast.makeText(this@SeriesInfoActivity, message, Toast.LENGTH_LONG).show()

    }


    private fun callApiAllEpisodes() {
        val episodeId = intent.getStringExtra(CommonsKt.SERIES_ID_EXTRA)
        episodeId?.let {
            viewModel.loadEpisodes(episodeId.toInt(), pref.authToken)
            viewModel.allEpisodes.observe(this) { result ->
                if (result is ApiResult.Success) {
                    result.data.responseDetails?.youMightLiked?.let { youMightLiked ->
                        val adapter =
                            CommonInfoAdapter(CommonsKt.getCommonInfo(youMightLiked)) { seriesId ->
                                ReelsActivity.getInstance()?.finish()
                                startActivity(
                                    Intent(
                                        this@SeriesInfoActivity,
                                        ReelsActivity::class.java
                                    ).apply {
                                        putExtra(CommonsKt.SERIES_ID_EXTRA, seriesId)
                                    })
                                finish()
                            }
                        binding.recyclerMore.adapter = adapter
                    }


                    result.data.responseDetails?.allEpisodes?.let { allEpisodes ->


                        allEpisodes.forEach {
                            it?.categoryName = result.data.responseDetails.series?.categoryName
                            it?.poster = result.data.responseDetails.series?.poster
                                ?: result.data.responseDetails.series?.thumbnail
                            it?.likedCount = result.data.responseDetails.series?.likes ?: 0
                            it?.favouritesCount =
                                result.data.responseDetails.series?.favourites ?: 0
                            it?.isAutoUnlocked =
                                result.data.responseDetails.series?.isAutoUnlocked ?: 0
                        }

                        reels = ArrayList()
                        if (result.data.responseDetails.series?.coverVideo != null) {
                            val trailerItem = CommonInfoReel(
                                id = result.data.responseDetails.allEpisodes.first()?.id,
                                title = result.data.responseDetails.series.title,
                                description = result.data.responseDetails.series.description,
                                videoUrl = result.data.responseDetails.series.coverVideo,
                                categoryName = result.data.responseDetails.series.categoryName,
                                isFavourites = result.data.responseDetails.series.isFavourite ?: 0,
                                isLiked = result.data.responseDetails.series.isLiked ?: 0,
                                poster = result.data.responseDetails.series.poster
                                    ?: result.data.responseDetails.series.thumbnail,
                                TypeName = result.data.responseDetails.series.typeName,
                                seriesId = result.data.responseDetails.series.id,
                                isTrailer = true,
                                availableWalletBalance = result.data.responseDetails.series.availableWalletBalance,
                                availableCoin = result.data.responseDetails.series.availableCoin,
                                likedCount = result.data.responseDetails.series.likes ?: 0,
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
                            val position = intent.getIntExtra(CommonsKt.POSITION_EXTRA, 0)
                            reels[position].isPlaying = true
                        }
                        setupViews()
                    }
                } else if (result is ApiResult.Error) {
                    showErrorEmpty(result.message)
                }
            }
        }
    }

    lateinit var reelsAdapter: EpisodeListAdapter

    fun setupViews() {


        if (reels.size > EPISODE_SPLIT_SIZE) {


            val chunks: List<List<CommonInfoReel>> = reels.chunked(EPISODE_SPLIT_SIZE)

            reelsAdapter = EpisodeListAdapter(ArrayList()) { position ->
                val index = reels.indexOfFirst { it == reelsAdapter.items[position] }
                setResultOk(index)


            }
            binding.recyclerView.adapter = reelsAdapter


            var selected = 0


            chunks.forEachIndexed { tabIndex, mylist ->
                mylist.forEachIndexed { mModelIndex, mModel ->
                    if (mModel.isPlaying) {
                        selected = tabIndex
                    }
                }

            }

            binding.tabLayout.removeAllTabs()

            chunks.forEach { list ->
                if (list.isNotEmpty()) {
                    val first = if (list.first().isTrailer) 0 else list.first().episodeNumber
                    binding.tabLayout.addTab(
                        binding.tabLayout.newTab().setText("${first}-${list.last().episodeNumber}")
                    )
                }
            }

            binding.tabLayout.addOnTabSelectedListener(object : TabLayout.OnTabSelectedListener {
                override fun onTabSelected(tab: TabLayout.Tab?) {
                    val position = tab?.position ?: 0
                    reelsAdapter.submitList(chunks[position], reels)
                }

                override fun onTabUnselected(tab: TabLayout.Tab?) {}
                override fun onTabReselected(tab: TabLayout.Tab?) {}
            })
            reelsAdapter.submitList(chunks[selected], reels)
            binding.tabLayout.getTabAt(selected)?.select()
        } else {
            reelsAdapter = EpisodeListAdapter(reels) { position ->


            }
            binding.recyclerView.adapter = reelsAdapter
            binding.tabLayout.visibility = View.GONE
        }

    }

    fun setResultOk(index: Int) {
        val resultIntent = Intent().apply {
            putExtra("isIndex", index)
        }
        setResult(RESULT_OK, resultIntent)
        super.onBackPressed()
    }

    override fun onBackPressed() {
        setResult(RESULT_CANCELED)
        super.onBackPressed()
    }


}