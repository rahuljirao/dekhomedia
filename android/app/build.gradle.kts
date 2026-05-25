import java.util.Properties

plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    id("com.google.gms.google-services")
    id("com.google.firebase.crashlytics")
    id("dagger.hilt.android.plugin")
    id("kotlin-parcelize")
    id("com.google.devtools.ksp")
}
val localProperties = Properties().apply {
    val localPropsFile = rootProject.file("local.properties")
    if (localPropsFile.exists()) load(localPropsFile.inputStream())
}
android {
    signingConfigs {
        create("release") {
            storeFile = file("C:\\Users\\Mayur\\Desktop\\12345678.jks")
            storePassword = "12345678"
            keyAlias = "12345678"
            keyPassword = "12345678"
        }
    }
    namespace = "com.app.dramashort"
    compileSdk = 36
    defaultConfig {
        applicationId = "com.dekho.uncutvideos"
        minSdk = 24
        targetSdk = 36
        versionCode = 40
        versionName = "4.0"
        multiDexEnabled = true
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        buildConfigField("String", "APPLOVIN_KEY", "\"${localProperties["APPLOVIN_KEY"]}\"")
        buildConfigField("String", "BASE_URL", "\"${localProperties["BASE_URL"]}\"")
        buildConfigField("String", "SHA_256", "\"${localProperties["SHA_256"]}\"")
        buildConfigField("String", "HOST_EMAIL", "\"${localProperties["HOST_EMAIL"]}\"")
        buildConfigField("String", "HOST_DISPLAY_NAME", "\"${localProperties["HOST_DISPLAY_NAME"]}\"")
        buildConfigField("String", "HOST_LOGIN_TYPE_ID", "\"${localProperties["HOST_LOGIN_TYPE_ID"]}\"")
        buildConfigField("String", "HOST_PROFILE_URL", "\"${localProperties["HOST_PROFILE_URL"]}\"")
        buildConfigField("String", "HOST_LOGIN_TYPE_GUEST", "\"${localProperties["HOST_LOGIN_TYPE_GUEST"]}\"")
        buildConfigField("String", "HOST_LOGIN_TYPE_FB", "\"${localProperties["HOST_LOGIN_TYPE_FB"]}\"")
        buildConfigField("String", "HOST_LOGIN_TYPE_GOOGLE", "\"${localProperties["HOST_LOGIN_TYPE_GOOGLE"]}\"")
    }
    buildTypes {
        release {
            isMinifyEnabled = false
            isShrinkResources = false
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
            signingConfig = signingConfigs.getByName("release")
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
        isCoreLibraryDesugaringEnabled = true
    }
    kotlin {
        compilerOptions { jvmTarget.set(org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_17) }
    }
    bundle { language { enableSplit = false } }
    buildFeatures { viewBinding = true; dataBinding = true; buildConfig = true }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.appcompat)
    implementation(libs.material)
    implementation(libs.androidx.activity)
    implementation(libs.androidx.constraintlayout)
    implementation(libs.androidx.activity.ktx)
    implementation(libs.androidx.fragment.ktx)
    implementation(libs.androidx.lifecycle.viewmodel.ktx)

    implementation(libs.hilt.android)
    ksp(libs.hilt.compiler)

    implementation(libs.sdp.android)
    implementation(libs.ssp.android)
    implementation(libs.lottie)
    implementation(libs.glide)
    implementation(libs.android.advancedwebview)

    implementation(libs.converter.gson)
    implementation(libs.retrofit)
    implementation(libs.okhttp)
    implementation(libs.logging.interceptor)

    implementation(libs.ratingbar)
    implementation(libs.checkout)
    implementation(libs.stripe.java)
    implementation(libs.stripe.android)

    implementation(libs.play.services.ads)
    implementation(libs.applovin.sdk)
    implementation(libs.play.services.auth)

    implementation(platform("com.google.firebase:firebase-bom:33.1.0"))
    implementation("com.google.firebase:firebase-messaging")
    implementation("com.google.firebase:firebase-crashlytics")

    coreLibraryDesugaring("com.android.tools:desugar_jdk_libs:2.0.4")

    implementation("com.android.billingclient:billing-ktx:7.1.1")

    implementation("androidx.media3:media3-exoplayer:1.8.0")
    implementation("androidx.media3:media3-ui:1.8.0")
    implementation("androidx.media3:media3-extractor:1.8.0")
    implementation("androidx.media3:media3-exoplayer-hls:1.8.0")
    implementation("me.relex:circleindicator:2.1.6")

    // Play Install Referrer — reads slug from Play Store install URL
    implementation("com.android.installreferrer:installreferrer:2.2")
}
