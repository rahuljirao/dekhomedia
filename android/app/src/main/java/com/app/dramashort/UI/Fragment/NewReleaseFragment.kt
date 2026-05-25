package com.app.dramashort.UI.Fragment

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import com.app.dramashort.ViewModel.ApiResult
import com.app.dramashort.UI.Activity.ReelsActivity
import com.app.dramashort.UI.Adapter.CommonInfoAdapter
import com.app.dramashort.Utils.CommonsKt
import com.app.dramashort.Utils.CommonsKt.getCommonInfo
import com.app.dramashort.Utils.gone
import com.app.dramashort.Utils.visible
import com.app.dramashort.ViewModel.UserViewModel
import com.app.dramashort.databinding.FragmentRankingBinding
import dagger.hilt.android.AndroidEntryPoint
import kotlin.getValue

@AndroidEntryPoint
class NewReleaseFragment() : Fragment() {
    val viewModel: UserViewModel by activityViewModels()

    var homeFragment: HomeFragment? = null

    constructor(homeFragment: HomeFragment) : this() {
        this.homeFragment = homeFragment
    }

    lateinit var binding: FragmentRankingBinding

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?,
    ): View {
        binding = FragmentRankingBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        callApi()
    }

    private fun callApi() {
        showProgress()
        viewModel.homeList.observe(viewLifecycleOwner) { result ->
            if (result is ApiResult.Success) {
                result.data.responseDetails?.let { responseDetails ->
                    val adapter =
                        CommonInfoAdapter(getCommonInfo(responseDetails.newRelese!!)) { seriesId ->
                            startActivity(
                                Intent(
                                    requireContext(),
                                    ReelsActivity::class.java
                                ).apply {
                                    putExtra(CommonsKt.SERIES_ID_EXTRA, seriesId)
                                })
                        }
                    binding.recyclerView.adapter = adapter
                    if (responseDetails.newRelese!!.isEmpty()) {
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

}