package com.app.dramashort.UI.Fragment

import android.annotation.SuppressLint
import android.content.Intent
import android.graphics.Color
import android.graphics.drawable.ColorDrawable
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.Toast
import androidx.coordinatorlayout.widget.CoordinatorLayout
import androidx.core.content.ContextCompat
import androidx.fragment.app.activityViewModels
import com.app.dramashort.Model.CategorySection
import com.app.dramashort.Model.HomeListResponse
import com.app.dramashort.R
import com.app.dramashort.UI.Activity.ReelsActivity
import dagger.hilt.android.AndroidEntryPoint
import test.app.gallery.UI1.Base.BaseFragment
import com.app.dramashort.UI.Activity.SearchActivity
import com.app.dramashort.UI.Adapter.CategoryPagerAdapter
import com.app.dramashort.Utils.CommonsKt
import com.app.dramashort.Utils.CommonsKt.capitalizeFirstLetter
import com.app.dramashort.Utils.gone
import com.app.dramashort.Utils.visible
import com.app.dramashort.ViewModel.ApiResult
import com.app.dramashort.ViewModel.UserViewModel
import com.app.dramashort.databinding.FragmentHomeBinding
import com.google.android.material.appbar.AppBarLayout
import com.google.android.material.tabs.TabLayout
import com.google.android.material.tabs.TabLayoutMediator
import com.app.dramashort.View.Carousel.listener.CarouselListener
import com.app.dramashort.View.Carousel.model.CarouselGravity
import com.app.dramashort.View.Carousel.model.CarouselItem
import com.app.dramashort.View.Carousel.model.CarouselType
import com.app.dramashort.View.Carousel.utils.dpToPx
import com.app.dramashort.View.Carousel.utils.spToPx

@AndroidEntryPoint
class HomeFragment : BaseFragment() {
    val viewModel: UserViewModel by activityViewModels()

    lateinit var binding: FragmentHomeBinding
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?,
    ): View {
        binding = FragmentHomeBinding.inflate(inflater, container, false)
        return binding.root
    }

    @SuppressLint("ClickableViewAccessibility")
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        loadUserData()
        removeScrollingBehavior()
        callApi()
        binding.searchInput.setOnClickListener {
            startActivity(Intent(requireContext(), SearchActivity::class.java))
        }
        binding.tabLayout.addOnTabSelectedListener(object : TabLayout.OnTabSelectedListener {
            override fun onTabSelected(tab: TabLayout.Tab?) {


            }

            override fun onTabUnselected(tab: TabLayout.Tab?) {}
            override fun onTabReselected(tab: TabLayout.Tab?) {}
        })

        // Hide SearchView on scroll

        val padding = resources.getDimensionPixelSize(com.intuit.sdp.R.dimen._60sdp)

        binding.appBarLayout.addOnOffsetChangedListener(object :
            AppBarLayout.OnOffsetChangedListener {
            private var isExpanded = true

            override fun onOffsetChanged(appBarLayout: AppBarLayout, verticalOffset: Int) {
                val totalScrollRange = appBarLayout.totalScrollRange
                when {
                    verticalOffset == 0 -> {
                        // Fully expanded
                        if (!isExpanded) {
                            isExpanded = true
                            binding.tabLayout.setPadding(0, 0, 0, 0) // left, top, right, bottom
                            if (binding.viewPager.currentItem == 0) {
                                removeScrollingBehavior()
                            } else {
                                addScrollingBehavior()
                            }
                        }
                    }

                    Math.abs(verticalOffset) >= totalScrollRange -> {
                        // Fully collapsed
                        if (isExpanded) {
                            isExpanded = false
                            binding.tabLayout.setPadding(
                                0,
                                padding,
                                0,
                                0
                            ) // left, top, right, bottom
                            addScrollingBehavior()
                        }
                    }
                }
            }
        })

    }

    fun loadUserData() {
        showProgress()
        viewModel.homeList.observe(viewLifecycleOwner) { result ->
            if (result is ApiResult.Success) {

                result.data.responseDetails?.let { responseDetails ->


                    val sectionList = mutableListOf<CategorySection>()
                    responseDetails.populer?.filterNotNull()?.let { populer ->
                        sectionList.add(
                            CategorySection(
                                "Populer",
                                R.drawable.ic_populer,
                                CommonsKt.getCommonInfo(populer)
                            )
                        )
                    }
                    responseDetails.newRelese?.filterNotNull()?.let { newRelese ->
                        sectionList.add(
                            CategorySection(
                                "New Release",
                                R.drawable.ic_new_release,
                                CommonsKt.getCommonInfo(newRelese)
                            )
                        )
                    }
                    responseDetails.ranking?.filterNotNull()?.let { ranking ->
                        sectionList.add(
                            CategorySection(
                                "Ranking",
                                R.drawable.ic_ranking,
                                CommonsKt.getCommonInfo(ranking)
                            )
                        )
                    }
                    responseDetails.categories?.forEach { category ->
                        category?.series?.filterNotNull()?.let {
                            val title = category.name ?: ""
                            val series = category.series
                            if (!series.isNullOrEmpty()) {
                                sectionList.add(
                                    CategorySection(
                                        title,
                                        R.drawable.ic_favourite_fill,
                                        CommonsKt.getCommonInfo(series)
                                    )
                                )
                            }
                        }

                    }

                    val adapter = CategoryPagerAdapter(this@HomeFragment, sectionList)
                    binding.viewPager.adapter = adapter
                    TabLayoutMediator(binding.tabLayout, binding.viewPager) { tab, position ->
                        tab.text = adapter.getPageTitle(position)
                    }.attach()

                    if (sectionList.isEmpty()) {
                        showEmpty()
                    } else {
                        binding.progressLayout.mainLayout.visibility = View.GONE
                    }
                }
            } else if (result is ApiResult.Error) {

                showErrorEmpty(result.message)
            }
        }
    }


    fun addScrollingBehavior() {
        val layoutParams = binding.viewPager.layoutParams as CoordinatorLayout.LayoutParams
        layoutParams.behavior = AppBarLayout.ScrollingViewBehavior()
        binding.viewPager.layoutParams = layoutParams
//        binding.topBar.layoutParams = layoutParams
    }

    fun removeScrollingBehavior() {


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

    override fun onResume() {
        super.onResume()
        reelsAdapter2?.pauseAllPlayers()
    }

    fun callApi() {
        viewModel.homeList.observe(viewLifecycleOwner) { result ->
            if (result is ApiResult.Success) {
                result.data.responseDetails?.let { responseDetails ->
                    val top10Episodes = result.data.responseDetails.newRelese!!.take(CommonsKt.HOME_PAGE_SIZE)
                    loadData(top10Episodes)
                }
            } else if (result is ApiResult.Error) {
                showErrorEmpty(result.message)
            }
        }
    }

    private fun loadData(top10Episodes: List<HomeListResponse.ResponseDetails.NewRelese?>) {
        binding.carousel1.apply {
            registerLifecycle(lifecycle)

            previousButtonId = R.id.btn_previous
            nextButtonId = R.id.btn_next

            carouselListener = object : CarouselListener {
                override fun onClick(
                    position: Int,
                    carouselItem: CarouselItem,
                ) {
                    requireContext().startActivity(Intent(requireContext(), ReelsActivity::class.java).apply {
                        putExtra(CommonsKt.SERIES_ID_EXTRA, top10Episodes[position]?.id.toString())
                    })
                }

                override fun onLongClick(position: Int, carouselItem: CarouselItem) {}
            }
        }

        val listOne = mutableListOf<CarouselItem>()

        top10Episodes.forEachIndexed { index, item ->
            listOne.add(
                CarouselItem(
                    imageUrl = item?.thumbnail,
                    caption = "" + item?.tagsName?.capitalizeFirstLetter() + "   ⦁   " + item?.categoryName?.capitalizeFirstLetter(),
//                    headers = headers,
                ),
            )

        }
        binding.carousel1.setData(listOne)
    }
}