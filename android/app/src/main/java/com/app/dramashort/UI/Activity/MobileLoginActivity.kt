package com.app.dramashort.UI.Activity

import android.content.Intent
import android.os.Bundle
import android.provider.Settings
import android.view.View
import android.widget.Toast
import androidx.activity.viewModels
import androidx.lifecycle.lifecycleScope
import com.app.dramashort.Model.MobileLoginRequest
import com.app.dramashort.ViewModel.ApiResult
import com.app.dramashort.ViewModel.UserViewModel
import com.app.dramashort.databinding.ActivityMobileLoginBinding
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.launch
import test.app.gallery.UI1.Base.BaseActivity

@AndroidEntryPoint
class MobileLoginActivity : BaseActivity() {

    private val viewModel: UserViewModel by viewModels()
    private lateinit var binding: ActivityMobileLoginBinding

    private val deviceId: String by lazy {
        Settings.Secure.getString(contentResolver, Settings.Secure.ANDROID_ID)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMobileLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.btnLogin.setOnClickListener {
            val mobile = binding.etMobileNumber.text.toString().trim()
            if (mobile.length < 10) {
                binding.tvError.visibility = View.VISIBLE
                binding.tvError.text = "Please enter a valid 10-digit mobile number"
                return@setOnClickListener
            }
            binding.tvError.visibility = View.GONE
            performMobileLogin(mobile)
        }
    }

    private fun performMobileLogin(mobile: String) {
        setLoading(true)

        val request = MobileLoginRequest(
            mobileNumber   = mobile,
            deviceId       = deviceId,
            deviceToken    = pref.deviceToke.ifBlank { null },
            contentGroup   = pref.contentGroup,
            referredByLink = pref.referrerSlug.ifBlank { null },
            promoterId     = if (pref.promoterId > 0) pref.promoterId else null
        )

        lifecycleScope.launch {
            val result = viewModel.repository.mobileLogin(request)
            setLoading(false)

            when (result) {
                is ApiResult.Success -> {
                    val details = result.data.responseDetails ?: run {
                        showError("Login failed. Please try again.")
                        return@launch
                    }
                    pref.authToken        = details.token?.accessToken ?: ""
                    pref.uid              = details.uid ?: ""
                    pref.mobileNumber     = mobile
                    pref.isMobileLoggedIn = true
                    pref.isLogin          = true

                    startActivity(
                        Intent(this@MobileLoginActivity, MainActivity::class.java).apply {
                            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                        }
                    )
                    finish()
                }
                is ApiResult.Error -> showError(result.message)
            }
        }
    }

    private fun showError(msg: String) {
        binding.tvError.visibility = View.VISIBLE
        binding.tvError.text = msg
    }

    private fun setLoading(show: Boolean) {
        binding.loadingOverlay.visibility = if (show) View.VISIBLE else View.GONE
        binding.btnLogin.isEnabled = !show
    }
}
