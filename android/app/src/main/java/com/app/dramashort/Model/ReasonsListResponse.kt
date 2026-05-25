package com.app.dramashort.Model

import androidx.annotation.Keep

@Keep
data class ReasonsListResponse(
    val responseCode: String,
    val responseDetails: List<ResponseDetail>,
    val responseMessage: String,
)