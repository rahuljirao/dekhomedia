package com.app.dramashort.Model

import androidx.annotation.Keep

@Keep
data class ResponseDetail(
    val created_at: String,
    val id: Int,
    val is_active: Int,
    val is_deleted: Int,
    val reason_title: String,
    val updated_at: String,
)