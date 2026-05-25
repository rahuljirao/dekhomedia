// File: app/src/main/java/com/app/reelshort/Utils/HistoryPrefs.kt
package com.app.dramashort.Utils

import android.content.Context
import com.app.dramashort.Model.CommonInfo
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken

object HistoryPrefs {
    private const val PREFS_NAME = "search_history_prefs"
    private const val KEY_SEARCH_HISTORY = "search_history"
    private const val KEY_CLICK_HISTORY = "click_history"

    fun saveSearch(context: Context, info: CommonInfo) {
        val history = getSearchHistory(context).toMutableList()
        history.removeAll { it.id == info.id }
        history.add(0, info)
        saveList(context, KEY_SEARCH_HISTORY, history)
    }

    fun getSearchHistory(context: Context): List<CommonInfo> {
        return getList(context, KEY_SEARCH_HISTORY)
    }

    fun saveClick(context: Context, info: CommonInfo) {
        val history = getClickHistory(context).toMutableList()
        history.removeAll { it.id == info.id }
        history.add(0, info)
        saveList(context, KEY_CLICK_HISTORY, history)
    }

    fun getClickHistory(context: Context): List<CommonInfo> {
        return getList(context, KEY_CLICK_HISTORY)
    }

    private fun saveList(context: Context, key: String, list: List<CommonInfo>) {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        prefs.edit().putString(key, Gson().toJson(list)).apply()
    }

    private fun getList(context: Context, key: String): List<CommonInfo> {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val json = prefs.getString(key, "[]")
        return Gson().fromJson(json, object : TypeToken<List<CommonInfo>>() {}.type)
    }
}