package com.app.dramashort.Utils

import android.content.Context

class AdminPreference(context: Context) {

    private val prefsHelper = SecurePrefsHelper(context)
    private val plainPrefs = context.getSharedPreferences(context.packageName, Context.MODE_PRIVATE)
    private val editor = plainPrefs.edit()

    var isLogin: Boolean
        get() = plainPrefs.getBoolean("IS_LOGIN", false)
        set(value) { editor.putBoolean("IS_LOGIN", value).apply() }

    var authToken: String
        get() = prefsHelper.getDecrypted("AUTHTOKEN")?.let { "Bearer $it" } ?: "Bearer "
        set(value) { prefsHelper.saveEncrypted("AUTHTOKEN", value.replace("Bearer ", "")) }

    var email: String
        get() = prefsHelper.getDecrypted("EMAIL") ?: ""
        set(value) { prefsHelper.saveEncrypted("EMAIL", value) }

    var uid: String
        get() = prefsHelper.getDecrypted("UID") ?: ""
        set(value) { prefsHelper.saveEncrypted("UID", value) }

    var loginType: String
        get() = prefsHelper.getDecrypted("LOGIN_TYPE") ?: ""
        set(value) { prefsHelper.saveEncrypted("LOGIN_TYPE", value) }

    var profilePicture: String
        get() = prefsHelper.getDecrypted("LOGIN_PROFILE_URL") ?: ""
        set(value) { prefsHelper.saveEncrypted("LOGIN_PROFILE_URL", value) }

    var loginTypeId: String
        get() = prefsHelper.getDecrypted("LOGIN_TYPE_ID") ?: ""
        set(value) { prefsHelper.saveEncrypted("LOGIN_TYPE_ID", value) }

    var name: String
        get() = prefsHelper.getDecrypted("LOGIN_NAME") ?: ""
        set(value) { prefsHelper.saveEncrypted("LOGIN_NAME", value) }

    var deviceToke: String
        get() = prefsHelper.getDecrypted("DEVICE_TOKEN") ?: ""
        set(value) { prefsHelper.saveEncrypted("DEVICE_TOKEN", value) }

    // ─── NEW fields for promoter / content group flow ─────────────────────────

    /** The slug captured from install referrer or deep link e.g. "RiyaQueen" */
    var referrerSlug: String
        get() = prefsHelper.getDecrypted("REFERRER_SLUG") ?: ""
        set(value) { prefsHelper.saveEncrypted("REFERRER_SLUG", value) }

    /** 'normal' or 'premium' — returned from /promoter/verify API */
    var contentGroup: String
        get() = prefsHelper.getDecrypted("CONTENT_GROUP") ?: "normal"
        set(value) { prefsHelper.saveEncrypted("CONTENT_GROUP", value) }

    /** promoter_id from /promoter/verify */
    var promoterId: Int
        get() = plainPrefs.getInt("PROMOTER_ID", 0)
        set(value) { editor.putInt("PROMOTER_ID", value).apply() }

    /** true once /promoter/verify call is done */
    var isPromoterVerified: Boolean
        get() = plainPrefs.getBoolean("IS_PROMOTER_VERIFIED", false)
        set(value) { editor.putBoolean("IS_PROMOTER_VERIFIED", value).apply() }

    /** true once mobile login is complete */
    var isMobileLoggedIn: Boolean
        get() = plainPrefs.getBoolean("IS_MOBILE_LOGGED_IN", false)
        set(value) { editor.putBoolean("IS_MOBILE_LOGGED_IN", value).apply() }

    /** user's saved mobile number */
    var mobileNumber: String
        get() = prefsHelper.getDecrypted("MOBILE_NUMBER") ?: ""
        set(value) { prefsHelper.saveEncrypted("MOBILE_NUMBER", value) }

    // ─────────────────────────────────────────────────────────────────────────

    fun logoutClean() {
        isLogin = false
        isMobileLoggedIn = false
        authToken = ""
        email = ""
        uid = ""
        loginType = ""
        profilePicture = ""
        name = ""
        loginTypeId = ""
        deviceToke = ""
        mobileNumber = ""
        // NOTE: keep referrerSlug, contentGroup, promoterId — they are permanent device-level data
    }
}
