package com.app.dramashort.UI.Activity

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.activity.viewModels
import androidx.lifecycle.viewModelScope
import com.app.dramashort.App.ReelShortApp
import com.app.dramashort.Model.SighInRequest
import com.app.dramashort.ViewModel.ApiResult
import com.app.dramashort.R
import com.app.dramashort.Utils.showToast
import com.app.dramashort.ViewModel.UserViewModel
import com.app.dramashort.databinding.ActivitySighInBinding

import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.android.gms.auth.api.signin.GoogleSignInClient
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.android.gms.common.api.ApiException

import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.launch
import test.app.gallery.UI1.Base.BaseActivity

@AndroidEntryPoint
class SighInActivity : BaseActivity() {

    private val viewModel: UserViewModel by viewModels()
    private lateinit var binding: ActivitySighInBinding
    private lateinit var googleSignInClient: GoogleSignInClient
//    private lateinit var callbackManager: CallbackManager
    private val RC_SIGN_IN = 9001
//    private val firebaseAuth: FirebaseAuth = FirebaseAuth.getInstance()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySighInBinding.inflate(layoutInflater)
        setContentView(binding.root)


        val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestIdToken(getString(R.string.default_web_client_id))
            .requestEmail()
            .build()

        googleSignInClient = GoogleSignIn.getClient(this, gso)


//        callbackManager = CallbackManager.Factory.create()


        binding.googleSignInButton.setOnClickListener {
            signInWithGoogle()
        }


//        binding.fBSignInButton.setOnClickListener {
//            signInWithFacebook()
//        }

        binding.btnBack.setOnClickListener {
            onBackPressed()
        }
    }

    private fun signInWithGoogle() {
        val signInIntent = googleSignInClient.signInIntent
        startActivityForResult(signInIntent, RC_SIGN_IN)
    }

//    private fun signInWithFacebook() {
//        LoginManager.getInstance().logInWithReadPermissions(this, listOf("email", "public_profile"))
//        LoginManager.getInstance()
//            .registerCallback(callbackManager, object : FacebookCallback<LoginResult> {
//                override fun onSuccess(loginResult: LoginResult) {
//                    handleFacebookAccessToken(loginResult.accessToken)
//                }
//
//                override fun onCancel() {
//                    Log.d("FacebookSignIn", "Facebook Login Cancelled")
//                    Toast.makeText(
//                        this@SighInActivity,
//                        "Facebook login cancelled",
//                        Toast.LENGTH_SHORT
//                    ).show()
//                    updateUI(null, null)
//                }
//
//                override fun onError(error: FacebookException) {
//                    Log.w("FacebookSignIn", "Facebook Login Error: ${error.message}", error)
//                    Toast.makeText(
//                        this@SighInActivity,
//                        "Facebook login failed: ${error.message}",
//                        Toast.LENGTH_SHORT
//                    ).show()
//                    updateUI(null, null)
//                }
//            })
//    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)


//        callbackManager.onActivityResult(requestCode, resultCode, data)


        if (requestCode == RC_SIGN_IN) {
            val task = GoogleSignIn.getSignedInAccountFromIntent(data)
            try {
                val account = task.getResult(ApiException::class.java)
                updateUI(account)
            } catch (e: ApiException) {
//                Toast.makeText(
//                    ReelShortApp.instance,
//                    "Sign-in failed: ${e.statusCode}",
//                    Toast.LENGTH_SHORT
//                ).show()
                updateUI(null)
            }
        }
    }

//    private fun handleFacebookAccessToken(token: AccessToken) {
//        val credential = FacebookAuthProvider.getCredential(token.token)
//        firebaseAuth.signInWithCredential(credential)
//            .addOnCompleteListener(this) { task ->
//                if (task.isSuccessful) {
//                    val user = firebaseAuth.currentUser
//                    updateUI(null, user)
//                } else {
//                    Log.w("FacebookSignIn", "signInWithCredential:failure", task.exception)
//                    Toast.makeText(
//                        this@SighInActivity,
//                        "Facebook authentication failed: ${task.exception?.message}",
//                        Toast.LENGTH_SHORT
//                    ).show()
//                    updateUI(null, null)
//                }
//            }
//    }

    private fun updateUI(googleAccount: GoogleSignInAccount?) {
        when {
            googleAccount != null -> {
                val displayName = googleAccount.displayName ?: com.app.dramashort.BuildConfig.HOST_DISPLAY_NAME
                val email = googleAccount.email ?: com.app.dramashort.BuildConfig.HOST_EMAIL
                val id = googleAccount.id ?: com.app.dramashort.BuildConfig.HOST_LOGIN_TYPE_ID
                val photoUrl = googleAccount.photoUrl?.toString() ?: com.app.dramashort.BuildConfig.HOST_PROFILE_URL
                val loginType = com.app.dramashort.BuildConfig.HOST_LOGIN_TYPE_GOOGLE

                val signingRequest = SighInRequest(
                    id = pref.uid,
                    email = email,
                    loginType = loginType,
                    loginTypeId = id,
                    name = displayName,
                    profilePicture = photoUrl,
                    deviceId = viewModel.deviceId
                )

                performSignIn(signingRequest, displayName)
            }
            else -> {
                Toast.makeText(this, "Please sign in", Toast.LENGTH_SHORT).show()
            }
        }
    }

//    private fun updateUI(googleAccount: GoogleSignInAccount?, firebaseUser: FirebaseUser?) {
//        when {
//            googleAccount != null -> {
//                val displayName = googleAccount.displayName ?: com.app.reelshort.BuildConfig.HOST_DISPLAY_NAME
//                val email = googleAccount.email ?: com.app.reelshort.BuildConfig.HOST_EMAIL
//                val id = googleAccount.id ?: com.app.reelshort.BuildConfig.HOST_LOGIN_TYPE_ID
//                val photoUrl = googleAccount.photoUrl?.toString() ?: com.app.reelshort.BuildConfig.HOST_PROFILE_URL
//                val loginType = com.app.reelshort.BuildConfig.HOST_LOGIN_TYPE_GOOGLE
//
//                val signingRequest = SighInRequest(
//                    id = pref.uid,
//                    email = email,
//                    loginType = loginType,
//                    loginTypeId = id,
//                    name = displayName,
//                    profilePicture = photoUrl,
//                    deviceId = viewModel.deviceId
//                )
//
//                performSignIn(signingRequest, displayName)
//            }
//
//            firebaseUser != null -> {
//                val displayName = firebaseUser.displayName ?: com.app.reelshort.BuildConfig.HOST_DISPLAY_NAME
//                val email = firebaseUser.email ?: com.app.reelshort.BuildConfig.HOST_EMAIL
//                val id = firebaseUser.uid ?: com.app.reelshort.BuildConfig.HOST_LOGIN_TYPE_ID
//                val photoUrl = firebaseUser.photoUrl?.toString() ?: com.app.reelshort.BuildConfig.HOST_PROFILE_URL
//                val loginType = com.app.reelshort.BuildConfig.HOST_LOGIN_TYPE_FB
//
//                val signingRequest = SighInRequest(
//                    id = pref.uid,
//                    email = email,
//                    loginType = loginType,
//                    loginTypeId = id,
//                    name = displayName,
//                    profilePicture = photoUrl,
//                    deviceId = viewModel.deviceId
//                )
//
//
//
//
//
//
//
//                performSignIn(signingRequest, displayName)
//            }
//
//            else -> {
//                Toast.makeText(this, "Please sign in", Toast.LENGTH_SHORT).show()
//            }
//        }
//    }

    private fun performSignIn(signingRequest: SighInRequest, displayName: String) {
        viewModel.viewModelScope.launch {
            val result = viewModel.repository.signIn(signingRequest, pref.authToken)
            if (result is ApiResult.Success) {

                result.data.responseDetails?.let {
                    pref.email = result.data.responseDetails.email.toString()
                    pref.isLogin = true
                    pref.authToken = result.data.responseDetails.token?.accessToken.toString()
                    pref.uid = result.data.responseDetails.uid.toString()
                    pref.loginType = result.data.responseDetails.loginType.toString()
                    pref.loginTypeId = result.data.responseDetails.loginTypeId.toString()
                    pref.profilePicture = signingRequest.profilePicture.toString()
                    pref.name = result.data.responseDetails.name.toString()


                }
                loginAndRestartApp(this@SighInActivity)
                Toast.makeText(ReelShortApp.instance, "Welcome, $displayName!", Toast.LENGTH_SHORT)
                    .show()
            } else if (result is ApiResult.Error) {
                showToast(result.message)
            }
        }
    }

    fun loginAndRestartApp(context: Context) {
        val intent = Intent(context, MainActivity::class.java)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        context.startActivity(intent)
        if (context is Activity) {
            context.finish()
        }
    }
}