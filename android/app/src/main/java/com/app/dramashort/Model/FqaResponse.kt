package com.app.dramashort.Model

import androidx.annotation.Keep

@Keep
data class FqaResponse(
    val responseCode: String,
    val responseDetails: List<ResponseDetailX>,
    val responseMessage: String,
)