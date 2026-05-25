package com.app.dramashort.UI.Activity

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.provider.Settings
import android.util.Log
import androidx.activity.viewModels
import androidx.lifecycle.lifecycleScope
import com.android.installreferrer.api.InstallReferrerClient
import com.android.installreferrer.api.InstallReferrerStateListener
import com.app.dramashort.Model.MobileLoginRequest
import com.app.dramashort.ViewModel.ApiResult
import com.app.dramashort.ViewModel.UserViewModel
import com.app.dramashort.databinding.ActivitySplashBinding
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.launch
import test.app.gallery.UI1.Base.BaseActivity

@AndroidEntryPoint
class SplashActivity : BaseActivity() {

    private val viewModel: UserViewModel by viewModels()
    private lateinit var binding: ActivitySplashBinding

    private val deviceId: String by lazy {
        Settings.Secure.getString(contentResolver, Settings.Secure.ANDROID_ID)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySplashBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // ── If mobile login already done, go straight to MainActivity ─────────
        if (pref.isMobileLoggedIn && pref.authToken.isNotBlank()) {
            goToMain()
            return
        }

        // ── First launch: read install referrer then decide flow ───────────────
        readInstallReferrer { slug ->
            when {
                // Slug captured → verify with backend first
                slug.isNotBlank() -> {
                    pref.referrerSlug = slug
                    verifyPromoterAndProceed(slug)
                }
                // No slug but promoter was already verified before
                pref.isPromoterVerified -> {
                    showMobileLogin()
                }
                // Completely fresh, no slug → normal guest flow
                else -> {
                    doGuestLogin()
                }
            }
        }
    }

    // ── 1. Read Play Store install referrer ──────────────────────────────────
    private fun readInstallReferrer(onResult: (slug: String) -> Unit) {
        try {
            val referrerClient = InstallReferrerClient.newBuilder(this).build()
            referrerClient.startConnection(object : InstallReferrerStateListener {

                override fun onInstallReferrerSetupFinished(responseCode: Int) {
                    when (responseCode) {
                        InstallReferrerClient.InstallReferrerResponse.OK -> {
                            val referrerUrl = referrerClient.installReferrer.installReferrer
                            // Expected format from Play Store: "slug=RiyaQueen"
                            val slug = parseSlugFromReferrer(referrerUrl)
                            referrerClient.endConnection()
                            runOnUiThread { onResult(slug) }
                        }
                        else -> {
                            referrerClient.endConnection()
                            // Also check deep link intent as fallback
                            val deepLinkSlug = parseSlugFromDeepLink(intent)
                            runOnUiThread { onResult(deepLinkSlug) }
                        }
                    }
                }

                override fun onInstallReferrerServiceDisconnected() {
                    val deepLinkSlug = parseSlugFromDeepLink(intent)
                    runOnUiThread { onResult(deepLinkSlug) }
                }
            })
        } catch (e: Exception) {
            Log.e("SplashActivity", "readInstallReferrer: ${e.message}")
            val deepLinkSlug = parseSlugFromDeepLink(intent)
            onResult(deepLinkSlug)
        }
    }

    /** Parse "slug=RiyaQueen&utm_source=..." → "RiyaQueen" */
    private fun parseSlugFromReferrer(referrerUrl: String?): String {
        if (referrerUrl.isNullOrBlank()) return ""
        return try {
            val params = referrerUrl.split("&").associate { part ->
                val kv = part.split("=")
                (kv.getOrNull(0) ?: "") to (kv.getOrNull(1) ?: "")
            }
            params["slug"] ?: ""
        } catch (e: Exception) { "" }
    }

    /** Fallback: deep link intent data — e.g. dekho://invite/RiyaQueen */
    private fun parseSlugFromDeepLink(intent: Intent?): String {
        return try {
            val data = intent?.data ?: return ""
            // Handles: dekho://invite/RiyaQueen  OR  https://dekho.app/invite/RiyaQueen
            val pathSegments = data.pathSegments
            if (pathSegments.size >= 2 && pathSegments[0] == "invite") {
                pathSegments[1]
            } else {
                ""
            }
        } catch (e: Exception) { "" }
    }

    // ── 2. Call /promoter/verify API, save result, then show mobile login ─────
    private fun verifyPromoterAndProceed(slug: String) {
        lifecycleScope.launch {
            val result = viewModel.repository.verifyPromoterSlug(slug)
            when (result) {
                is ApiResult.Success -> {
                    val data = result.data.responseDetails
                    // Save permanently in prefs
                    pref.contentGroup    = data?.contentGroup ?: "normal"
                    pref.promoterId      = data?.promoterId ?: 0
                    pref.referrerSlug    = data?.slug ?: slug
                    pref.isPromoterVerified = true
                    showMobileLogin()
                }
                is ApiResult.Error -> {
                    // Invalid slug or network error → default normal flow
                    pref.contentGroup = "normal"
                    pref.isPromoterVerified = true
                    showMobileLogin()
                }
            }
        }
    }

    // ── 3. Guest login (no referrer slug case) ────────────────────────────────
    private fun doGuestLogin() {
        viewModel.login(viewModel.loginRequest, pref.authToken)
        viewModel.signUp.observe(this) {
            goToMain()
        }
    }

    private fun showMobileLogin() {
        startActivity(Intent(this, MobileLoginActivity::class.java))
        finish()
    }

    private fun goToMain() {
        startActivity(Intent(this, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        })
        finish()
    }

    companion object {
        fun loginAndRestartApp(context: Context) {
            try {
                val intent = Intent(context, MainActivity::class.java).apply {
                    flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                }
                context.startActivity(intent)
                if (context is Activity) context.finishAffinity()
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }
}
