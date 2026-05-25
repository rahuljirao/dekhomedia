package com.app.dramashort.UI.Activity

import android.os.Bundle
import android.view.View
import android.widget.ArrayAdapter
import androidx.activity.viewModels
import androidx.lifecycle.viewModelScope
import com.app.dramashort.Model.CreateTicketRequest
import com.app.dramashort.R
import com.app.dramashort.Utils.gone
import com.app.dramashort.Utils.isValidEmail
import com.app.dramashort.Utils.showToast
import com.app.dramashort.Utils.visible
import com.app.dramashort.ViewModel.ApiResult
import com.app.dramashort.ViewModel.UserViewModel
import com.app.dramashort.databinding.ActivityCreateComplainBinding
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.launch
import test.app.gallery.UI1.Base.BaseActivity

@AndroidEntryPoint
class CreateComplainActivity : BaseActivity() {

    private val viewModel: UserViewModel by viewModels()
    private lateinit var binding: ActivityCreateComplainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityCreateComplainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        if (!pref.isLogin || pref.authToken.isNullOrEmpty()) {
            showToast("Please sign in to create a complaint")
            finish()
            return
        }

        binding.btnEmailInput.setText(pref.email.toString())
        binding.inputName.setText(pref.name.toString())
        binding.inputName.setText(pref.name.toString())
        binding.btnBack.setOnClickListener {
            onBackPressed()
        }

        binding.btnComplain.setOnClickListener {
            val email = binding.btnEmailInput.text.toString()
            val description = binding.description.text.toString()
            val name = binding.inputName.text.toString()
            val selectedPosition = binding.reason.selectedItemPosition

            val reasonId = binding.reason.selectedItemPosition + 1
            if (!email.isValidEmail()) {
                showToast("Please enter a valid email")
                return@setOnClickListener
            }
            if (description.isBlank()) {
                showToast("Please enter a description")
                return@setOnClickListener
            }
            if (email.isBlank()) {
                showToast("Please enter a email")
                return@setOnClickListener
            }
            if (name.isBlank()) {
                showToast("Please enter a name")
                return@setOnClickListener
            }
            val request = CreateTicketRequest(
                description = description,
                email = email,
                name = name,
                reasonId = reasonId
            )
            callApi(request)
        }

        reasonsListApi()
    }

    private fun callApi(request: CreateTicketRequest) {
        showProgress()
        viewModel.viewModelScope.launch {
            val result = viewModel.repository.createTicket(request, pref.authToken)
            if (result is ApiResult.Success) {

                result.data.responseDetails?.let {
                    binding.llInput.visibility = View.GONE
                }
                binding.progressLayout.mainLayout.visibility = View.GONE
                showToast("Complaint submitted successfully")
                finish()
            } else if (result is ApiResult.Error) {
                showToast(result.message)
                binding.progressLayout.mainLayout.visibility = View.GONE
            }
        }
    }

    private fun reasonsListApi() {
        showProgress()
        viewModel.viewModelScope.launch {
            val result = viewModel.repository.reasonsList(pref.authToken)
            if (result is ApiResult.Success) {

                result.data.responseDetails?.let { reasons ->
                    if (reasons.isEmpty()) {
                        showErrorEmpty("No reasons available")
                        return@launch
                    }
                    val list = reasons.mapNotNull { it.reason_title }
                    val adapter = ArrayAdapter(
                        this@CreateComplainActivity,
                        R.layout.simple_spinner_item,
                        list
                    )
                    adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
                    binding.reason.adapter = adapter
                    binding.progressLayout.mainLayout.visibility = View.GONE
                } ?: showErrorEmpty("Failed to load reasons")
            } else if (result is ApiResult.Error) {

                binding.progressLayout.mainLayout.visibility = View.GONE
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
        progressLayout.progressAnimation.gone()
        progressLayout.emptyLayout.visible()
        progressLayout.mainLayout.visible()
        progressLayout.emptyTitle.text = message
    }
}
