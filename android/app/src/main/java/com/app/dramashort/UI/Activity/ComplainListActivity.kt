package com.app.dramashort.UI.Activity

import android.content.Intent
import android.os.Bundle
import android.view.View
import androidx.activity.viewModels
import androidx.lifecycle.viewModelScope
import com.app.dramashort.UI.Adapter.ComplainAdapter
import com.app.dramashort.Utils.gone
import com.app.dramashort.Utils.visible
import com.app.dramashort.ViewModel.ApiResult
import com.app.dramashort.ViewModel.UserViewModel
import com.app.dramashort.databinding.ActivityRaiseComplainBinding
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.launch
import test.app.gallery.UI1.Base.BaseActivity


@AndroidEntryPoint
class ComplainListActivity : BaseActivity() {
    val viewModel: UserViewModel by viewModels()


    lateinit var binding: ActivityRaiseComplainBinding
    lateinit var adapter: ComplainAdapter


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityRaiseComplainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        adapter = ComplainAdapter(emptyList()) {}

        binding.recyclerView.adapter = adapter


        binding.btnCreate.setOnClickListener {
            startActivity(Intent(this@ComplainListActivity, CreateComplainActivity::class.java))

        }

        binding.btnBack.setOnClickListener {
            onBackPressed()
        }
    }

    override fun onResume() {
        super.onResume()
        callApi()
    }

    private fun callApi() {
        showProgress()
        viewModel.viewModelScope.launch {
            val result = viewModel.repository.getTicket(pref.email, pref.authToken)
            if (result is ApiResult.Success) {

                result.data.responseDetails?.let { responseDetails ->
                    adapter.items = responseDetails.filterNotNull()
                    adapter.notifyDataSetChanged()
                    if (adapter.items.isEmpty()) {
                        showEmpty()
                    } else {
                        binding.mainLayout.gone()
                    }
                } ?: {
                    showEmpty()
                }
            } else if (result is ApiResult.Error) {

                binding.mainLayout.visibility = View.GONE
            }
        }

    }

    private fun showEmpty() = with(binding) {
        mainLayout.visible()
        progressAnimation.gone()
        emptyLayout.visible()
    }

    private fun showProgress() = with(binding) {
        mainLayout.visible()
        progressAnimation.visible()
        emptyLayout.gone()
    }

    private fun showErrorEmpty(message: String) = with(binding) {
        binding.progressAnimation.gone()
        binding.emptyLayout.visible()
        binding.mainLayout.visible()
    }

}