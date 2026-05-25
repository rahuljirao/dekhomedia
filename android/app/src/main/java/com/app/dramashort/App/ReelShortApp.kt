package com.app.dramashort.App

import android.app.Activity
import android.app.Application
import android.net.ConnectivityManager
import android.os.Bundle
import com.app.dramashort.Model.CommonInfo
import com.app.dramashort.Model.SignUpResponse
import com.app.dramashort.Utils.NetworkManager
import com.applovin.sdk.AppLovinMediationProvider
import com.applovin.sdk.AppLovinSdk
import com.applovin.sdk.AppLovinSdkInitializationConfiguration
import com.google.android.gms.tasks.Task
import com.google.firebase.FirebaseApp
import com.google.firebase.messaging.FirebaseMessaging
import dagger.hilt.android.HiltAndroidApp

@HiltAndroidApp
class ReelShortApp : Application() {
    private lateinit var connectivityManager: ConnectivityManager
    lateinit var networkManager: NetworkManager
    var loginResponse: SignUpResponse.ResponseDetails? = null
    var recommended: List<CommonInfo> = emptyList()

    companion object {
        lateinit var instance: ReelShortApp
            private set
    }

    override fun onCreate() {
        super.onCreate()
//        FacebookSdk.setClientToken(com.app.reelshort.BuildConfig.FACEBOOK_APP_ID);
//        FacebookSdk.sdkInitialize(applicationContext)

        try {
            //todo change key if needed
            val initConfig = AppLovinSdkInitializationConfiguration.builder(
                com.app.dramashort.BuildConfig.APPLOVIN_KEY,
                this
            ).setMediationProvider(AppLovinMediationProvider.MAX).build()

            // Initialize the SDK with the configuration
            AppLovinSdk.getInstance(applicationContext).initialize(initConfig) { sdkConfig ->
            }
        } catch (e: Exception) {
        }

        instance = this
        FirebaseApp.initializeApp(this)

        try {
            FirebaseMessaging.getInstance().subscribeToTopic("all_users")
                .addOnCompleteListener { task: Task<Void?> ->
                    if (task.isSuccessful) {
                    }
                }
        } catch (e: Exception) {
        }

        networkManager = NetworkManager.getInstance(this)
        registerActivityLifecycleCallbacks(object : ActivityLifecycleCallbacks {
            override fun onActivityCreated(activity: Activity, savedInstanceState: Bundle?) {}

            override fun onActivityStarted(activity: Activity) {

            }

            override fun onActivityResumed(activity: Activity) {
                networkManager.setCurrentActivity(activity)
            }

            override fun onActivityPaused(activity: Activity) {
                networkManager.setCurrentActivity(null)
            }

            override fun onActivityStopped(activity: Activity) {}

            override fun onActivitySaveInstanceState(activity: Activity, outState: Bundle) {}

            override fun onActivityDestroyed(activity: Activity) {}
        })

    }


}