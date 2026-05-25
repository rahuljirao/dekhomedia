package com.app.dramashort.UI.Activity

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.View
import androidx.activity.viewModels
import androidx.lifecycle.viewModelScope
import com.app.dramashort.R
import com.app.dramashort.Utils.CommonsKt
import com.app.dramashort.Utils.gone
import com.app.dramashort.Utils.showToast
import com.app.dramashort.Utils.visible
import com.app.dramashort.ViewModel.ApiResult
import com.app.dramashort.ViewModel.UserViewModel
import com.app.dramashort.databinding.ActivitySettingBinding
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.android.gms.auth.api.signin.GoogleSignInClient
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.launch
import test.app.gallery.UI1.Base.BaseActivity
import kotlin.jvm.java

@AndroidEntryPoint
class SettingActivity : BaseActivity() {

    lateinit var binding: ActivitySettingBinding

    val viewModel: UserViewModel by viewModels()


    private lateinit var googleSignInClient: GoogleSignInClient
    private val RC_SIGN_IN = 9001

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySettingBinding.inflate(layoutInflater)
        setContentView(binding.root)


        val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestIdToken(getString(R.string.default_web_client_id))
            .requestEmail()
            .build()

        googleSignInClient = GoogleSignIn.getClient(this, gso)


        val account = GoogleSignIn.getLastSignedInAccount(this)
        if (account != null) {
            updateUI(account)
        }

        binding.llDeleteAccount.setOnClickListener {
            CommonsKt.showConfirmationDialog(
                this@SettingActivity,
                "Are you sure want to remove account?"
            ) {
                callDeleteApi()
            }
        }

        binding.btnBack.setOnClickListener {
            onBackPressed()
        }
        binding.llSighOut.setOnClickListener {
            signOut()
        }


        if (pref.isLogin) {
            if (pref.loginType == "guest") {

                binding.llSighOut.visibility = View.GONE
            } else {

                binding.llSighOut.visibility = View.VISIBLE
            }
        }

    }


    private fun callDeleteApi() {
        showProgress()
        viewModel.viewModelScope.launch {
            val result = viewModel.repository.deleteAccount("", pref.authToken)
            if (result is ApiResult.Success) {

                result.data.responseMessage?.let { responseMessage ->
                    showToast(responseMessage)
                }
                binding.progressLayout.mainLayout.visibility = View.GONE
            } else if (result is ApiResult.Error) {
                showToast(result.message)
                binding.progressLayout.mainLayout.visibility = View.GONE
            }
        }
    }


    private fun signOut() {
        googleSignInClient.signOut().addOnCompleteListener(this) {
            updateUI(null)
        }
    }

    private fun updateUI(account: GoogleSignInAccount?) {
        if (account != null) {

        } else {
            logoutAndRestartApp(this)
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


    fun logoutAndRestartApp(context: Context) {
        pref.logoutClean()

        val intent = Intent(context, SplashActivity::class.java)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        context.startActivity(intent)
        if (context is Activity) {
            context.finish()
        }
    }
}