package com.app.dramashort.UI.Activity

import android.os.Bundle
import android.view.View
import androidx.activity.viewModels
import androidx.lifecycle.viewModelScope
import com.app.dramashort.Utils.gone
import com.app.dramashort.Utils.isValidEmail
import com.app.dramashort.Utils.showToast
import com.app.dramashort.Utils.visible
import com.app.dramashort.ViewModel.ApiResult
import com.app.dramashort.ViewModel.UserViewModel
import com.app.dramashort.databinding.ActivityBindEmailBinding
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.launch
import test.app.gallery.UI1.Base.BaseActivity
import kotlin.getValue

@AndroidEntryPoint
class BindEmailActivity : BaseActivity() {

    val viewModel: UserViewModel by viewModels()
    lateinit var binding: ActivityBindEmailBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityBindEmailBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.btnBack.setOnClickListener {
            onBackPressed()
        }
//        binding.btnOk.setOnClickListener {
//            onBackPressed()
//        }

        binding.btnVerify.setOnClickListener {
            val email = binding.btnEmailInput.text.toString()
            if (email.isEmpty()) {
                binding.btnEmailInput.error = ("Please Enter Email Address")
                return@setOnClickListener
            }
            if (email.isValidEmail()) {
                callApi(binding.btnEmailInput.text.toString())
            } else {
                binding.btnEmailInput.error = ("Invalid Email")
            }
        }
//        binding.btnChangeEmailAddress.setOnClickListener {
//            callApi2()
//        }
    }


//    private fun callApi2() {
//        binding.llInput.visibility = View.VISIBLE
//        binding.llConfirmButton.visibility = View.GONE
//
//    }

    private fun callApi(reward_type: String) {
        showProgress()
        viewModel.viewModelScope.launch {
            val result = viewModel.repository.setBindEmail(reward_type, pref.authToken)
            if (result is ApiResult.Success) {
                result.data.responseDetails?.let {
                    showToast(result.data.responseMessage.toString())
                    onBackPressedDispatcher.onBackPressed()

//                    binding.llInput.visibility = View.GONE
//                    binding.llConfirmButton.visibility = View.VISIBLE
                }
                binding.progressLayout.mainLayout.visibility = View.GONE

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
        binding.progressLayout.progressAnimation.gone()
        binding.progressLayout.emptyLayout.visible()
        binding.progressLayout.mainLayout.visible()
        binding.progressLayout.emptyTitle.text = message
    }
}