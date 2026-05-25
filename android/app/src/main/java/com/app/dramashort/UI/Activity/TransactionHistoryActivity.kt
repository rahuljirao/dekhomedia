package com.app.dramashort.UI.Activity

import android.os.Bundle
import android.view.View
import androidx.activity.viewModels
import androidx.lifecycle.viewModelScope
import com.app.dramashort.UI.Adapter.TransactionListAdapter
import com.app.dramashort.Utils.gone
import com.app.dramashort.Utils.visible
import com.app.dramashort.ViewModel.ApiResult
import com.app.dramashort.ViewModel.UserViewModel
import com.app.dramashort.databinding.ActivityRewardHistoryBinding
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.launch
import test.app.gallery.UI1.Base.BaseActivity
import java.text.SimpleDateFormat
import java.util.Locale
import kotlin.getValue

@AndroidEntryPoint
class TransactionHistoryActivity : BaseActivity() {

    val viewModel: UserViewModel by viewModels()
    lateinit var binding: ActivityRewardHistoryBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityRewardHistoryBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.title.text = "Transaction History"
        binding.btnBack.setOnClickListener {
            onBackPressed()
        }
        callApi()
    }


    private fun callApi() {
        showProgress()
        viewModel.viewModelScope.launch {
            val result = viewModel.repository.getTransactionList(pref.authToken)
            if (result is ApiResult.Success) {
                result.data.responseDetails?.let { responseDetails ->
                    // Sort transactions by created_at (descending - newest first)
                    val sortedTransactions = responseDetails.sortedByDescending {
                        SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault()).parse(
                            it?.createdAt
                        )?.time
                    }
                    val adapter = TransactionListAdapter(sortedTransactions.filterNotNull()) { url ->
                    }
                    binding.recyclerView.adapter = adapter
                    if (responseDetails.isEmpty()) {
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